import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Check Admin Permission
        if (!PREREGISTER_CONFIG.discord.admin_ids.includes(discordId)) {
            return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        const connection = await pool.getConnection();
        try {
            if (query) {
                // Search Mode
                const [users] = await connection.query(`
                    SELECT p.*, g.name as gang_name 
                    FROM preregistrations p 
                    LEFT JOIN gangs g ON p.gang_id = g.id
                    WHERE p.discord_id LIKE ? OR p.referral_code LIKE ?
                    LIMIT 20
                `, [`%${query}%`, `%${query}%`]);

                return NextResponse.json({ users });
            } else {
                // Dashboard Stats Mode
                const [stats] = await connection.query(`
                    SELECT 
                        (SELECT COUNT(*) FROM preregistrations) as total_users,
                        (SELECT COUNT(*) FROM gangs) as total_gangs,
                        (SELECT SUM(ticket_count) FROM preregistrations) as total_tickets_held,
                        (SELECT COUNT(*) FROM lucky_draw_history) as total_spins
                `);

                // Recent Registrations
                const [recentUsers] = await connection.query(`
                    SELECT discord_id, referral_code, created_at 
                    FROM preregistrations 
                    ORDER BY created_at DESC LIMIT 5
                `);

                // Recent Lucky Draws (Rare items only)
                const [recentWins] = await connection.query(`
                    SELECT discord_id, item_name, created_at 
                    FROM lucky_draw_history 
                    ORDER BY created_at DESC LIMIT 5
                `);

                return NextResponse.json({
                    stats: stats[0],
                    recentUsers,
                    recentWins
                });
            }
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
