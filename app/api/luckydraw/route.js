import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Rate Limit by User ID (not IP) to support Internet Cafes
        if (!rateLimit(discordId, 20, 60000)) { // 20 spins per minute per user
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        if (!PREREGISTER_CONFIG.features.enableLuckyDraw) {
            return NextResponse.json({ error: 'Lucky draw is disabled' }, { status: 403 });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Check Ticket Balance
            const [userRows] = await connection.query(
                'SELECT ticket_count FROM preregistrations WHERE discord_id = ? FOR UPDATE',
                [discordId]
            );

            if (userRows.length === 0) throw new Error('User not found');
            const currentTickets = userRows[0].ticket_count;

            if (currentTickets < 1) {
                throw new Error('Not enough tickets');
            }

            // 2. Randomize Reward
            const items = PREREGISTER_CONFIG.luckyDraw.items;
            const totalChance = items.reduce((sum, item) => sum + item.chance, 0);
            let random = Math.random() * totalChance;
            let selectedItem = items[items.length - 1];

            for (const item of items) {
                if (random < item.chance) {
                    selectedItem = item;
                    break;
                }
                random -= item.chance;
            }

            // 3. Deduct Ticket & Log History
            await connection.query(
                'UPDATE preregistrations SET ticket_count = ticket_count - 1 WHERE discord_id = ?',
                [discordId]
            );

            // FIX: Use 'item_id' and 'item_name' to match DB schema
            await connection.query(
                'INSERT INTO lucky_draw_history (discord_id, item_id, item_name) VALUES (?, ?, ?)',
                [discordId, selectedItem.id, selectedItem.name]
            );

            // 4. Log Transaction
            await connection.query(
                'INSERT INTO transaction_logs (discord_id, action, amount, details) VALUES (?, ?, ?, ?)',
                [discordId, 'lucky_draw_spin', -1, `Won ${selectedItem.name}`]
            );

            // Add to Claim Queue (เพิ่มเข้าคิวรับของ)
            // Note: Table 'claim_queue' must be created via migration script

            await connection.query(
                'INSERT INTO claim_queue (discord_id, item_id, item_name, amount, status) VALUES (?, ?, ?, 1, "pending")',
                [discordId, selectedItem.id, selectedItem.name]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                reward: selectedItem,
                remainingTickets: currentTickets - 1
            });

        } catch (err) {
            await connection.rollback();
            return NextResponse.json({ error: err.message }, { status: 400 });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Lucky Draw Error:', error);

        // Handle Database Connection Issues
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ER_CON_COUNT_ERROR' || error.code === 'ETIMEDOUT') {
            return NextResponse.json({
                error: 'ระบบกำลังทำงานหนัก กรุณาลองใหม่อีกครั้งในภายหลัง'
            }, { status: 503 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Get History (Last 10 items)
        // FIX: Select 'item_name' as 'reward_name' for frontend compatibility
        const [history] = await pool.query(
            'SELECT item_name as reward_name, created_at FROM lucky_draw_history WHERE discord_id = ? ORDER BY created_at DESC LIMIT 10',
            [discordId]
        );

        return NextResponse.json({ history });

    } catch (error) {
        console.error('Lucky Draw GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
