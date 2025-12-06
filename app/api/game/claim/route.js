import { NextResponse } from 'next/server';
import { webDb as pool } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

// Security: ตรวจสอบ API Secret จาก Game Server
const GAME_API_SECRET = process.env.GAME_API_SECRET;

function verifyGameApiAccess(request) {
    // ถ้าไม่ได้ตั้งค่า GAME_API_SECRET ใน .env จะอนุญาตให้เข้าถึงได้ (development mode)
    if (!GAME_API_SECRET) {
        return true; // Warning: ควรตั้งค่าใน production
    }

    const authHeader = request.headers.get('x-game-api-secret') || request.headers.get('authorization');
    return authHeader === GAME_API_SECRET || authHeader === `Bearer ${GAME_API_SECRET}`;
}

export async function GET(request) {
    // ตรวจสอบ API Secret
    if (!verifyGameApiAccess(request)) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Secret' }, { status: 401 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 60, 60000)) { // 60 requests per minute (Game Server might poll)
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const discordId = searchParams.get('discord_id');

    if (!discordId) return NextResponse.json({ error: 'Missing discord_id' }, { status: 400 });

    try {
        const [rows] = await pool.query(
            'SELECT id, item_id, item_name, amount FROM claim_queue WHERE discord_id = ? AND status = "pending"',
            [discordId]
        );

        return NextResponse.json({ items: rows });
    } catch (error) {
        console.error('Game API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    // ตรวจสอบ API Secret
    if (!verifyGameApiAccess(request)) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Secret' }, { status: 401 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 60, 60000)) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
    try {
        const body = await request.json();
        const { claim_ids } = body; // Array of IDs to mark as claimed

        if (!claim_ids || !Array.isArray(claim_ids)) {
            return NextResponse.json({ error: 'Invalid claim_ids' }, { status: 400 });
        }

        if (claim_ids.length === 0) return NextResponse.json({ success: true });

        await pool.query(
            'UPDATE claim_queue SET status = "claimed", claimed_at = NOW() WHERE id IN (?)',
            [claim_ids]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Game API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
