import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb, gameDb } from '@/lib/db';

// Simple In-Memory Cache for Stats
let statsCache = {
    data: null,
    lastUpdated: 0
};
const CACHE_DURATION = 60 * 1000; // 60 seconds

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

        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (type === 'winners') {
            // Winners Pagination Mode
            let sql = `SELECT discord_id, item_name, created_at FROM lucky_draw_history`;
            let countSql = `SELECT COUNT(*) as count FROM lucky_draw_history`;
            let params = [];
            let countParams = [];
            let whereClauses = [];

            if (query) {
                whereClauses.push(`(discord_id LIKE ? OR item_name LIKE ?)`);
                params.push(`%${query}%`, `%${query}%`);
                countParams.push(`%${query}%`, `%${query}%`);
            }

            if (startDate && endDate) {
                whereClauses.push(`created_at BETWEEN ? AND ?`);
                params.push(new Date(startDate), new Date(endDate));
                countParams.push(new Date(startDate), new Date(endDate));
            }

            if (whereClauses.length > 0) {
                const whereSql = ' WHERE ' + whereClauses.join(' AND ');
                sql += whereSql;
                countSql += whereSql;
            }

            sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const [winners] = await webDb.query(sql, params);
            const [total] = await webDb.query(countSql, countParams);

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
            let sql = `SELECT * FROM transaction_logs`;
            let countSql = `SELECT COUNT(*) as count FROM transaction_logs`;
            let params = [];
            let countParams = [];
            let whereClauses = [];

            if (query) {
                whereClauses.push(`(discord_id LIKE ? OR action LIKE ?)`);
                params.push(`%${query}%`, `%${query}%`);
                countParams.push(`%${query}%`, `%${query}%`);
            }

            if (startDate && endDate) {
                whereClauses.push(`created_at BETWEEN ? AND ?`);
                params.push(new Date(startDate), new Date(endDate));
                countParams.push(new Date(startDate), new Date(endDate));
            }

            if (whereClauses.length > 0) {
                const whereSql = ' WHERE ' + whereClauses.join(' AND ');
                sql += whereSql;
                countSql += whereSql;
            }

            sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const [transactions] = await webDb.query(sql, params);
            const [total] = await webDb.query(countSql, countParams);

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
            let sql = `SELECT * FROM gangs`;
            let countSql = `SELECT COUNT(*) as count FROM gangs`;
            let params = [];
            let countParams = [];

            if (query) {
                sql += ` WHERE name LIKE ? OR gang_code LIKE ?`;
                countSql += ` WHERE name LIKE ? OR gang_code LIKE ?`;
                params.push(`%${query}%`, `%${query}%`);
                countParams.push(`%${query}%`, `%${query}%`);
            }

            sql += ` ORDER BY member_count DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const [gangs] = await webDb.query(sql, params);
            const [total] = await webDb.query(countSql, countParams);

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
            // Search Mode (No Cache)
            const [users] = await webDb.query(`
                SELECT p.*, g.name as gang_name 
                FROM preregistrations p 
                LEFT JOIN gangs g ON p.gang_id = g.id
                WHERE p.discord_id LIKE ? OR p.referral_code LIKE ?
                LIMIT 20
            `, [`%${query}%`, `%${query}%`]);

            // If a single user is found, fetch their recent lucky draw history
            if (users.length === 1) {
                const [history] = await webDb.query(`
                    SELECT item_name, created_at 
                    FROM lucky_draw_history 
                    WHERE discord_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT 10
                `, [users[0].discord_id]);
                users[0].lucky_draw_history = history;
            }

            return NextResponse.json({ users });
        } else {
            // Dashboard Stats Mode (With Cache)
            const now = Date.now();
            if (statsCache.data && (now - statsCache.lastUpdated < CACHE_DURATION)) {
                return NextResponse.json(statsCache.data);
            }

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

            const responseData = {
                stats,
                recentUsers,
                recentWins,
                graphs: {
                    registrations: regGraph,
                    spins: spinGraph
                }
            };

            // Update Cache
            statsCache = {
                data: responseData,
                lastUpdated: now
            };

            return NextResponse.json(responseData);
        }

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
