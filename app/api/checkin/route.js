import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
    try {
        // Rate Limit: 5 requests per minute (ป้องกัน spam check-in)
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimit(ip, 5, 60000)) {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Check last checkin
            const [rows] = await connection.query(
                'SELECT last_checkin FROM preregistrations WHERE discord_id = ? FOR UPDATE',
                [discordId]
            );

            if (rows.length === 0) throw new Error('User not found');

            const lastCheckin = rows[0].last_checkin ? new Date(rows[0].last_checkin).toISOString().split('T')[0] : null;

            if (lastCheckin === today) {
                throw new Error('Already checked in today');
            }

            // Update Checkin & Give 1 Ticket
            await connection.query(
                'UPDATE preregistrations SET last_checkin = NOW(), ticket_count = ticket_count + 1 WHERE discord_id = ?',
                [discordId]
            );

            await connection.commit();
            return NextResponse.json({ success: true, message: 'Check-in successful! Received 1 Ticket.' });

        } catch (err) {
            await connection.rollback();
            return NextResponse.json({ error: err.message }, { status: 400 });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Checkin Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;
        const today = new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            'SELECT last_checkin FROM preregistrations WHERE discord_id = ?',
            [discordId]
        );

        if (rows.length === 0) return NextResponse.json({ canCheckIn: false });

        const lastCheckin = rows[0].last_checkin ? new Date(rows[0].last_checkin).toISOString().split('T')[0] : null;

        return NextResponse.json({ canCheckIn: lastCheckin !== today });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
