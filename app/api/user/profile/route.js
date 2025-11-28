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

        // Discord ID จาก Session (format: 123456789)
        const rawDiscordId = session.user.id;
        // แปลงเป็น format ที่เก็บใน DB (discord:123456789)
        const dbDiscordId = `discord:${rawDiscordId}`;

        console.log(`Searching for user with Discord ID: ${dbDiscordId}`);

        // Query ข้อมูลจากตาราง users โดยใช้ discord_id
        const [rows] = await pool.query(
            `SELECT identifier, firstname, lastname, accounts, phone_number, sex, dateofbirth, job, job_grade, inventory, loadout 
       FROM users 
       WHERE discord_id = ? 
       LIMIT 1`,
            [dbDiscordId]
        );

        if (rows.length === 0) {
            console.log("User not found in game database.");
            return NextResponse.json({ error: 'User not found in game database' }, { status: 404 });
        }

        const user = rows[0];

        // Parse JSON Data
        // Parse JSON Data with Fault Tolerance
        let accounts = {};
        try {
            accounts = JSON.parse(user.accounts || '{}');
        } catch (e) {
            console.error("Error parsing accounts:", e);
        }

        let inventory = [];
        try {
            if (user.inventory) {
                const invData = JSON.parse(user.inventory);
                if (!Array.isArray(invData)) {
                    inventory = Object.entries(invData).map(([name, count]) => ({ name, count }));
                } else {
                    inventory = invData;
                }
            }
        } catch (e) {
            console.error("Error parsing inventory:", e);
        }

        let loadout = [];
        try {
            if (user.loadout) {
                const loadData = JSON.parse(user.loadout);
                if (!Array.isArray(loadData)) {
                    loadout = Object.entries(loadData).map(([name, data]) => ({ name, ...data }));
                } else {
                    loadout = loadData;
                }
            }
        } catch (e) {
            console.error("Error parsing loadout:", e);
        }

        // จัดรูปแบบข้อมูลที่จะส่งกลับ
        const userData = {
            firstname: user.firstname,
            lastname: user.lastname,
            money: accounts.money || 0,
            bank: accounts.bank || 0,
            phone: user.phone_number || 'ไม่มีเบอร์โทรศัพท์',
            sex: user.sex === 'm' ? 'ชาย' : 'หญิง',
            dob: user.dateofbirth,
            job: user.job,
            job_grade: user.job_grade,
            inventory: inventory,
            loadout: loadout
        };

        return NextResponse.json(userData);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
