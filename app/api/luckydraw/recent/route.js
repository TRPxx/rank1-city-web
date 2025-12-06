import { NextResponse } from 'next/server';
import { webDb } from '@/lib/db';

// GET recent winners from lucky_draw_history
export async function GET() {
    try {
        // Only show records older than 15 seconds (to not spoil the spin animation)
        const [rows] = await webDb.query(
            `SELECT 
                ldh.discord_id,
                ldh.item_name,
                ldh.created_at,
                p.discord_name,
                p.avatar_url
            FROM lucky_draw_history ldh
            LEFT JOIN preregistrations p ON ldh.discord_id = p.discord_id
            WHERE ldh.created_at < DATE_SUB(NOW(), INTERVAL 15 SECOND)
            ORDER BY ldh.created_at DESC
            LIMIT 5`
        );

        return NextResponse.json({ winners: rows });
    } catch (error) {
        console.error('Failed to fetch recent winners:', error);
        return NextResponse.json({ winners: [] });
    }
}
