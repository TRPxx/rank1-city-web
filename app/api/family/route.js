import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// Helper to generate family code
function generateFamilyCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'FAM-';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!PREREGISTER_CONFIG.features.enableGang) {
            return NextResponse.json({ error: 'Family system is disabled' }, { status: 403 });
        }

        const discordId = session.user.id;
        const body = await request.json();
        const { action, name, familyCode, logoUrl } = body; // action: 'create' | 'join' | 'update_logo'

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Check if user is already in a gang or family
            const [userCheck] = await connection.query(
                'SELECT gang_id, family_id FROM preregistrations WHERE discord_id = ?',
                [discordId]
            );

            if (userCheck.length === 0) {
                throw new Error('Please register first');
            }

            // ⚠️ เงื่อนไข: ห้ามมีทั้งแก๊งและครอบครัว
            if (userCheck[0].gang_id) {
                throw new Error('คุณอยู่ในแก๊งแล้ว ไม่สามารถเข้าร่วมครอบครัวได้');
            }

            if (action === 'update_logo') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update the logo');
                }

                await connection.query('UPDATE families SET logo_url = ? WHERE id = ?', [logoUrl, userCheck[0].family_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'Logo updated' });
            }

            if (userCheck[0].family_id) {
                throw new Error('You are already in a family');
            }

            if (action === 'create') {
                if (!name || name.length < 3) throw new Error('Family name too short');

                // Generate unique code
                let newFamilyCode = generateFamilyCode();

                // Insert Family
                const [result] = await connection.query(
                    'INSERT INTO families (name, family_code, leader_discord_id, member_count, logo_url) VALUES (?, ?, ?, 1, ?)',
                    [name, newFamilyCode, discordId, logoUrl || null]
                );
                const familyId = result.insertId;

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET family_id = ? WHERE discord_id = ?',
                    [familyId, discordId]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Family created', familyCode: newFamilyCode });

            } else if (action === 'join') {
                if (!familyCode) throw new Error('Family code required');

                // Find Family
                const [family] = await connection.query(
                    'SELECT id, member_count, max_members FROM families WHERE family_code = ?',
                    [familyCode]
                );

                if (family.length === 0) throw new Error('Family not found');
                if (family[0].member_count >= family[0].max_members) throw new Error('Family is full');

                // Update Family Count
                await connection.query(
                    'UPDATE families SET member_count = member_count + 1 WHERE id = ?',
                    [family[0].id]
                );

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET family_id = ? WHERE discord_id = ?',
                    [family[0].id, discordId]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Joined family successfully' });

            } else if (action === 'leave') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                // Check if leader
                const [family] = await connection.query('SELECT id, leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id === discordId) {
                    throw new Error('Leader cannot leave. You must dissolve the family.');
                }

                // Update User
                await connection.query('UPDATE preregistrations SET family_id = NULL WHERE discord_id = ?', [discordId]);

                // Update Family Count
                await connection.query('UPDATE families SET member_count = member_count - 1 WHERE id = ?', [userCheck[0].family_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Left family successfully' });

            } else if (action === 'update_settings') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                const { name, motd } = body;

                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update settings');
                }

                await connection.query('UPDATE families SET name = ?, motd = ? WHERE id = ?', [name, motd, userCheck[0].family_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'Settings updated' });

            } else if (action === 'dissolve') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can dissolve the family');
                }

                // Remove all members
                await connection.query('UPDATE preregistrations SET family_id = NULL WHERE family_id = ?', [userCheck[0].family_id]);

                // Delete Family
                await connection.query('DELETE FROM families WHERE id = ?', [userCheck[0].family_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Family dissolved' });
            }

            throw new Error('Invalid action');

        } catch (err) {
            await connection.rollback();
            return NextResponse.json({ error: err.message }, { status: 400 });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Family API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Get User's Family Info
        const [rows] = await pool.query(`
            SELECT f.name, f.family_code, f.member_count, f.max_members, f.leader_discord_id, f.logo_url
            FROM preregistrations p
            JOIN families f ON p.family_id = f.id
            WHERE p.discord_id = ?
        `, [discordId]);

        if (rows.length === 0) {
            return NextResponse.json({ hasFamily: false });
        }

        return NextResponse.json({ hasFamily: true, family: rows[0] });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
