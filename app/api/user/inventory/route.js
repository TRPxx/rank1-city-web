import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Rate Limit: 30 requests per minute
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimit(ip, 30, 60000)) {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Ensure table exists (safety check)
        const connection = await pool.getConnection();
        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS claim_queue (
                  id int(11) NOT NULL AUTO_INCREMENT,
                  discord_id varchar(50) NOT NULL,
                  item_id varchar(50) NOT NULL,
                  item_name varchar(255) NOT NULL,
                  amount int(11) DEFAULT 1,
                  status enum('pending','claimed') DEFAULT 'pending',
                  created_at timestamp NULL DEFAULT current_timestamp(),
                  claimed_at datetime DEFAULT NULL,
                  PRIMARY KEY (id),
                  KEY discord_id (discord_id),
                  KEY status (status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            const [items] = await connection.query(
                'SELECT * FROM claim_queue WHERE discord_id = ? ORDER BY created_at DESC',
                [discordId]
            );

            return NextResponse.json({ items });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Inventory API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
