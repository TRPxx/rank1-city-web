import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// Helper to generate gang code
function generateGangCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'GANG-';
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
            return NextResponse.json({ error: 'Gang system is disabled' }, { status: 403 });
        }

        const discordId = session.user.id;
        const body = await request.json();
        const { action, name, gangCode, logoUrl } = body; // action: 'create' | 'join' | 'update_logo'

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
            if (userCheck[0].family_id) {
                throw new Error('คุณอยู่ในครอบครัวแล้ว ไม่สามารถเข้าร่วมแก๊งได้');
            }

            if (action === 'update_logo') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update the logo');
                }

                await connection.query('UPDATE gangs SET logo_url = ? WHERE id = ?', [logoUrl, userCheck[0].gang_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'Logo updated' });
            }

            if (userCheck[0].gang_id) {
                throw new Error('You are already in a gang');
            }

            if (action === 'create') {
                if (!name || name.length < 3) throw new Error('Gang name too short');

                // Generate unique code
                let newGangCode = generateGangCode();

                // Insert Gang
                const [result] = await connection.query(
                    'INSERT INTO gangs (name, gang_code, leader_discord_id, member_count, logo_url) VALUES (?, ?, ?, 1, ?)',
                    [name, newGangCode, discordId, logoUrl || null]
                );
                const gangId = result.insertId;

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET gang_id = ? WHERE discord_id = ?',
                    [gangId, discordId]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Gang created', gangCode: newGangCode });

            } else if (action === 'join') {
                if (!gangCode) throw new Error('Gang code required');

                // Find Gang
                const [gang] = await connection.query(
                    'SELECT id, member_count, max_members FROM gangs WHERE gang_code = ?',
                    [gangCode]
                );

                if (gang.length === 0) throw new Error('Gang not found');
                if (gang[0].member_count >= gang[0].max_members) throw new Error('Gang is full');

                // Update Gang Count
                await connection.query(
                    'UPDATE gangs SET member_count = member_count + 1 WHERE id = ?',
                    [gang[0].id]
                );

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET gang_id = ? WHERE discord_id = ?',
                    [gang[0].id, discordId]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Joined gang successfully' });

            } else if (action === 'leave') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                // Check if leader
                const [gang] = await connection.query('SELECT id, leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id === discordId) {
                    throw new Error('Leader cannot leave. You must dissolve the gang.');
                }

                // Update User
                await connection.query('UPDATE preregistrations SET gang_id = NULL WHERE discord_id = ?', [discordId]);

                // Update Gang Count
                await connection.query('UPDATE gangs SET member_count = member_count - 1 WHERE id = ?', [userCheck[0].gang_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Left gang successfully' });

            } else if (action === 'update_settings') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                const { name, motd } = body;

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update settings');
                }

                await connection.query('UPDATE gangs SET name = ?, motd = ? WHERE id = ?', [name, motd, userCheck[0].gang_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'Settings updated' });

            } else if (action === 'dissolve') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can dissolve the gang');
                }

                // Remove all members
                await connection.query('UPDATE preregistrations SET gang_id = NULL WHERE gang_id = ?', [userCheck[0].gang_id]);

                // Delete Gang
                await connection.query('DELETE FROM gangs WHERE id = ?', [userCheck[0].gang_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Gang dissolved' });

            } else if (action === 'kick_member') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                const { targetDiscordId } = body;
                if (!targetDiscordId) throw new Error('Target member ID required');

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can kick members');
                }

                // Prevent leader from kicking themselves
                if (targetDiscordId === discordId) {
                    throw new Error('Leader cannot kick themselves');
                }

                // Check if target is in the same gang
                const [targetUser] = await connection.query(
                    'SELECT gang_id FROM preregistrations WHERE discord_id = ?',
                    [targetDiscordId]
                );

                if (targetUser.length === 0 || targetUser[0].gang_id !== userCheck[0].gang_id) {
                    throw new Error('Member not found in your gang');
                }

                // Remove member from gang
                await connection.query('UPDATE preregistrations SET gang_id = NULL WHERE discord_id = ?', [targetDiscordId]);

                // Update Gang Count
                await connection.query('UPDATE gangs SET member_count = member_count - 1 WHERE id = ?', [userCheck[0].gang_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Member kicked successfully' });
            }

            throw new Error('Invalid action');

        } catch (err) {
            await connection.rollback();
            return NextResponse.json({ error: err.message }, { status: 400 });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Gang API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Get User's Gang Info
        const [rows] = await pool.query(`
            SELECT g.id, g.name, g.gang_code AS invite_code, g.member_count, g.max_members, g.leader_discord_id, g.logo_url, g.motd, g.level
            FROM preregistrations p
            JOIN gangs g ON p.gang_id = g.id
            WHERE p.discord_id = ?
        `, [discordId]);

        if (rows.length === 0) {
            return NextResponse.json({ hasGang: false });
        }

        const gang = rows[0];

        // Get Gang Members
        const [members] = await pool.query(`
            SELECT 
                p.discord_id,
                p.discord_name,
                p.avatar_url,
                p.created_at as joined_at,
                g.leader_discord_id,
                (p.discord_id = g.leader_discord_id) as is_leader
            FROM preregistrations p
            JOIN gangs g ON p.gang_id = g.id
            WHERE p.gang_id = ?
            ORDER BY is_leader DESC, p.created_at ASC
        `, [gang.id]);

        // Convert is_leader from 0/1 to proper boolean
        const membersWithBoolean = members.map(m => ({
            ...m,
            is_leader: Boolean(m.is_leader)
        }));

        console.log('Gang members with is_leader:', membersWithBoolean);

        return NextResponse.json({
            hasGang: true,
            gang: gang,
            members: membersWithBoolean
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
