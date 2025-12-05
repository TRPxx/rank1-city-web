import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const gangCode = searchParams.get('gangCode');

        if (!gangCode) {
            return NextResponse.json({ error: 'Gang code required' }, { status: 400 });
        }

        // ดึงข้อมูลสมาชิกทั้งหมดในแก๊งจาก gang_code
        const [members] = await pool.query(`
            SELECT 
                p.discord_id,
                p.discord_name,
                p.avatar_url,
                NOW() as joined_at,
                g.leader_discord_id
            FROM preregistrations p
            INNER JOIN gangs g ON p.gang_id = g.id
            WHERE g.gang_code = ?
            ORDER BY 
                CASE WHEN p.discord_id = g.leader_discord_id THEN 0 ELSE 1 END,
                p.discord_name ASC
        `, [gangCode]);

        return NextResponse.json({
            members: members.map(m => ({
                discord_id: m.discord_id,
                discord_name: m.discord_name,
                avatar_url: m.avatar_url,
                joined_at: m.joined_at,
                is_leader: m.discord_id === m.leader_discord_id
            }))
        });

    } catch (error) {
        console.error('Gang Members Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
