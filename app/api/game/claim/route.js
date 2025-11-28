import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Security: In production, check for a specific Header or API Key!
// const API_SECRET = process.env.GAME_API_SECRET;

export async function GET(request) {
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
