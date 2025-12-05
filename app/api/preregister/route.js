import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// Helper to generate random code
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'R1-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimit(ip, 5, 60000)) { // 5 requests per minute
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const discordId = session.user.id;
        const body = await request.json();
        const referralCodeInput = body.referralCode ? body.referralCode.trim().toUpperCase() : null;

        const [existing] = await pool.query(
            'SELECT id FROM preregistrations WHERE discord_id = ?',
            [discordId]
        );

        if (existing.length > 0) {
            return NextResponse.json({ error: 'Already registered' }, { status: 400 });
        }

        let myReferralCode;
        let isUnique = false;
        while (!isUnique) {
            myReferralCode = generateReferralCode();
            const [check] = await pool.query('SELECT id FROM preregistrations WHERE referral_code = ?', [myReferralCode]);
            if (check.length === 0) isUnique = true;
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            let validReferredBy = null;
            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

            if (referralCodeInput) {
                const [referrer] = await connection.query(
                    'SELECT discord_id FROM preregistrations WHERE referral_code = ?',
                    [referralCodeInput]
                );

                if (referrer.length > 0 && referrer[0].discord_id !== discordId) {
                    // [SECURITY FIX #5] ป้องกัน Referral Abuse - จำกัด 3 referrals ต่อ IP
                    const [ipCheck] = await connection.query(
                        'SELECT COUNT(*) as count FROM preregistrations WHERE ip_address = ? AND referred_by IS NOT NULL',
                        [ipAddress]
                    );

                    if (ipCheck[0].count >= 3) {
                        // IP นี้มี referral มากเกินไป - ยังลงทะเบียนได้แต่ไม่นับ referral
                        console.log(`[Security] Referral abuse detected from IP: ${ipAddress.slice(-8)} (${ipCheck[0].count} referrals)`);
                        validReferredBy = null;
                    } else {
                        validReferredBy = referralCodeInput;

                        // 1. Update Referrer Stats
                        await connection.query(
                            'UPDATE preregistrations SET invite_count = invite_count + 1, ticket_count = ticket_count + 1 WHERE referral_code = ?',
                            [validReferredBy]
                        );

                        // 2. Check & Award Milestone Rewards
                        const [updatedReferrer] = await connection.query(
                            'SELECT invite_count FROM preregistrations WHERE referral_code = ?',
                            [validReferredBy]
                        );

                        const newInviteCount = updatedReferrer[0].invite_count;
                        const referrerDiscordId = referrer[0].discord_id;
                        const rewards = PREREGISTER_CONFIG.rewards.individual;

                        for (const reward of rewards) {
                            if (newInviteCount >= reward.count) {
                                // Unique ID for this specific milestone reward
                                const rewardItemId = `ref_reward_${reward.count}`;

                                // Check if already in queue (to avoid duplicates)
                                const [existingClaim] = await connection.query(
                                    'SELECT id FROM claim_queue WHERE discord_id = ? AND item_id = ?',
                                    [referrerDiscordId, rewardItemId]
                                );

                                if (existingClaim.length === 0) {
                                    // Insert into claim_queue
                                    await connection.query(
                                        'INSERT INTO claim_queue (discord_id, item_id, item_name, amount, status) VALUES (?, ?, ?, 1, "pending")',
                                        [referrerDiscordId, rewardItemId, `Referral Reward: ${reward.name}`]
                                    );
                                    console.log(`Awarded referral reward to ${referrerDiscordId}: ${reward.name}`);
                                }
                            }
                        }
                    }
                }
            }

            const discordName = session.user.name || 'Unknown';
            const avatarUrl = session.user.image || null;

            await connection.query(
                `INSERT INTO preregistrations (discord_id, discord_name, avatar_url, referral_code, referred_by, ip_address, ticket_count) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [discordId, discordName, avatarUrl, myReferralCode, validReferredBy, ipAddress, 0]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Registration successful',
                myCode: myReferralCode
            });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Preregister POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ isRegistered: false });
        }

        const discordId = session.user.id;

        // Try simple query first to isolate issue
        // const [rows] = await pool.query('SELECT * FROM preregistrations WHERE discord_id = ?', [discordId]);

        // Full query with JOIN
        const query = `
            SELECT p.referral_code, p.invite_count, p.ticket_count, p.gang_id, g.name as gang_name 
            FROM preregistrations p 
            LEFT JOIN gangs g ON p.gang_id = g.id 
            WHERE p.discord_id = ?
        `;

        const [rows] = await pool.query(query, [discordId]);

        if (rows.length === 0) {
            return NextResponse.json({ isRegistered: false });
        }

        const userData = rows[0];

        return NextResponse.json({
            isRegistered: true,
            name: session.user.name,
            avatar: session.user.image,
            discord_id: discordId,
            myCode: userData.referral_code,
            inviteCount: userData.invite_count,
            ticketCount: userData.ticket_count,
            gangId: userData.gang_id,
            gangName: userData.gang_name
        });

    } catch (error) {
        console.error('Fetch Status Error Detailed:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
