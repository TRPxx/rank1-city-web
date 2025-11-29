import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rawDiscordId = session.user.id;
        const dbDiscordId = `discord:${rawDiscordId}`;

        // เช็คว่ามี User นี้ในระบบหรือไม่
        const [rows] = await pool.query(
            `SELECT identifier FROM users WHERE discord_id = ? LIMIT 1`,
            [dbDiscordId]
        );

        if (rows.length > 0) {
            return NextResponse.json({ status: 'found' });
        } else {
            return NextResponse.json({ status: 'not_found' });
        }

    } catch (error) {
        console.error('Database check error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
