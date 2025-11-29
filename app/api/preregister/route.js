import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';

// Helper to generate random code
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'R1-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function POST(request) {
    try {
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

            if (referralCodeInput) {
                const [referrer] = await connection.query(
                    'SELECT discord_id FROM preregistrations WHERE referral_code = ?',
                    [referralCodeInput]
                );

                if (referrer.length > 0 && referrer[0].discord_id !== discordId) {
                    validReferredBy = referralCodeInput;

                    await connection.query(
                        'UPDATE preregistrations SET invite_count = invite_count + 1, ticket_count = ticket_count + 1 WHERE referral_code = ?',
                        [validReferredBy]
                    );
                }
            }

            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
            const discordName = session.user.name || 'Unknown';

            await connection.query(
                `INSERT INTO preregistrations (discord_id, discord_name, referral_code, referred_by, ip_address, ticket_count) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [discordId, discordName, myReferralCode, validReferredBy, ipAddress, 0]
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
