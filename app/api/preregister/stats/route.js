import { NextResponse } from 'next/server';
import { webDb as pool } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Disable caching to get real-time data

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM preregistrations');
        const total = rows[0].total;

        return NextResponse.json({ total }, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
            }
        });
    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ total: 0 }, { status: 500 });
    }
}
