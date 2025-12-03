import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb, gameDb } from '@/lib/db';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check Admin Permission
        if (!session.user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        if (type === 'winners') {
            // Winners Pagination Mode
            const [winners] = await webDb.query(`
                SELECT discord_id, item_name, created_at 
                FROM lucky_draw_history 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            `, [limit, offset]);

            const [total] = await webDb.query('SELECT COUNT(*) as count FROM lucky_draw_history');

            return NextResponse.json({
                winners,
                pagination: {
                    page,
                    limit,
                    total: total[0].count,
                    totalPages: Math.ceil(total[0].count / limit)
                }
            });
        }

        if (type === 'transactions') {
            // Transactions Pagination Mode
            const [transactions] = await webDb.query(`
                SELECT * 
                FROM transaction_logs 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            `, [limit, offset]);

            const [total] = await webDb.query('SELECT COUNT(*) as count FROM transaction_logs');

            return NextResponse.json({
                transactions,
                pagination: {
                    page,
                    limit,
                    total: total[0].count,
                    totalPages: Math.ceil(total[0].count / limit)
                }
            });
        }

        if (type === 'gangs') {
            // Gangs Pagination Mode
            const [gangs] = await webDb.query(`
                SELECT * 
                FROM gangs 
                ORDER BY member_count DESC 
                LIMIT ? OFFSET ?
            `, [limit, offset]);

            const [total] = await webDb.query('SELECT COUNT(*) as count FROM gangs');

            return NextResponse.json({
                gangs,
                pagination: {
                    page,
                    limit,
                    total: total[0].count,
                    totalPages: Math.ceil(total[0].count / limit)
                }
            });
        }

        if (query) {
            // Search Mode
            const [users] = await webDb.query(`
                SELECT p.*, g.name as gang_name 
                FROM preregistrations p 
                LEFT JOIN gangs g ON p.gang_id = g.id
                WHERE p.discord_id LIKE ? OR p.referral_code LIKE ?
                LIMIT 20
            `, [`%${query}%`, `%${query}%`]);

            return NextResponse.json({ users });
        } else {
            // Dashboard Stats Mode
            // 1. Web DB Stats
            const [webStats] = await webDb.query(`
                SELECT 
                    (SELECT COUNT(*) FROM preregistrations) as total_users,
                    (SELECT COUNT(*) FROM preregistrations WHERE DATE(created_at) = CURDATE()) as users_today,
                    (SELECT COUNT(*) FROM gangs) as total_gangs,
                    (SELECT SUM(ticket_count) FROM preregistrations) as tickets_holding,
                    (SELECT COUNT(*) FROM lucky_draw_history) as total_spins,
                    (SELECT COUNT(*) FROM claim_queue WHERE status = 'pending') as pending_claims,
                    (SELECT COUNT(*) FROM claim_queue WHERE status = 'claimed') as claimed_items,
                    (SELECT COUNT(*) FROM preregistrations WHERE gang_id IS NOT NULL) as gang_members
            `);

            // 2. Game DB Stats (Characters)
            let total_characters = 0;
            try {
                const [charRows] = await gameDb.query('SELECT COUNT(*) as count FROM users');
                total_characters = charRows[0].count;
            } catch (e) {
                console.error("Failed to fetch game stats", e);
            }

            const stats = webStats[0];
            stats.total_characters = total_characters;

            // Calculated Stats
            stats.tickets_burned = stats.total_spins; // Assuming 1 ticket = 1 spin
            stats.tickets_distributed = (parseInt(stats.tickets_holding) || 0) + stats.tickets_burned;
            stats.solo_players = stats.total_users - stats.gang_members;

            // Family Stats (Placeholder)
            const [familyStats] = await webDb.query('SELECT COUNT(*) as total, SUM(member_count) as members FROM families');
            stats.total_families = familyStats[0].total || 0;
            stats.family_members = familyStats[0].members || 0;

            // Recent Registrations
            const [recentUsers] = await webDb.query(`
                SELECT discord_id, referral_code, created_at 
                FROM preregistrations 
                ORDER BY created_at DESC LIMIT 5
            `);

            // Recent Lucky Draws (Rare items only)
            const [recentWins] = await webDb.query(`
                SELECT discord_id, item_name, created_at 
                FROM lucky_draw_history 
                ORDER BY created_at DESC LIMIT 5
            `);

            // Graph Data: Registrations (Last 7 Days)
            const [regGraph] = await webDb.query(`
                SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count 
                FROM preregistrations 
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);

            // Graph Data: Spins (Last 7 Days)
            const [spinGraph] = await webDb.query(`
                SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count 
                FROM lucky_draw_history 
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);

            return NextResponse.json({
                stats,
                recentUsers,
                recentWins,
                graphs: {
                    registrations: regGraph,
                    spins: spinGraph
                }
            });
        }

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
