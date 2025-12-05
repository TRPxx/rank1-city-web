import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const familyCode = searchParams.get('familyCode');

        if (!familyCode) {
            return NextResponse.json({ error: 'Family code required' }, { status: 400 });
        }

        // ดึงข้อมูลสมาชิกทั้งหมดในครอบครัวจาก family_code
        const [members] = await pool.query(`
            SELECT 
                p.discord_id,
                p.discord_name,
                p.avatar_url,
                NOW() as joined_at,
                f.leader_discord_id
            FROM preregistrations p
            INNER JOIN families f ON p.family_id = f.id
            WHERE f.family_code = ?
            ORDER BY 
                CASE WHEN p.discord_id = f.leader_discord_id THEN 0 ELSE 1 END,
                p.discord_name ASC
        `, [familyCode]);

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
        console.error('Family Members Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
