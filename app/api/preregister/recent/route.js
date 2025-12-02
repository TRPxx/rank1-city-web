import { NextResponse } from 'next/server';
import { webDb as pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch recent 20 registrations
        const [rows] = await pool.query(`
            SELECT discord_name, created_at 
            FROM preregistrations 
            ORDER BY created_at DESC 
            LIMIT 20
        `);

        // Mask names for privacy if needed, or just show them. 
        // User asked for "คุณ xxxx ได้ลงทะเบียนไปแล้ว", so showing name is fine.
        // Maybe partial mask if it's a real name, but Discord names are usually public.
        // Let's return as is for now.

        return NextResponse.json({ recent: rows });
    } catch (error) {
        console.error('Fetch Recent Registrations Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
