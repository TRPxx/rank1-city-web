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
        const { action, name, gangCode } = body; // action: 'create' | 'join'

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Check if user is already in a gang
            const [userCheck] = await connection.query(
                'SELECT gang_id FROM preregistrations WHERE discord_id = ?',
                [discordId]
            );

            if (userCheck.length === 0) {
                throw new Error('Please register first');
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
                    'INSERT INTO gangs (name, gang_code, leader_discord_id, member_count) VALUES (?, ?, ?, 1)',
                    [name, newGangCode, discordId]
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
            SELECT g.name, g.gang_code, g.member_count, g.max_members, g.leader_discord_id
            FROM preregistrations p
            JOIN gangs g ON p.gang_id = g.id
            WHERE p.discord_id = ?
        `, [discordId]);

        if (rows.length === 0) {
            return NextResponse.json({ hasGang: false });
        }

        return NextResponse.json({ hasGang: true, gang: rows[0] });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
