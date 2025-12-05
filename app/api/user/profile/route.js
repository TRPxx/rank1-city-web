import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';
import { webDb } from '@/lib/db';

import { rateLimit } from '@/lib/rate-limit';

export async function GET(request) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimit(ip, 60, 60000)) { // 60 requests per minute
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Discord ID จาก Session (format: 123456789)
        const rawDiscordId = session.user.id;
        // แปลงเป็น format ที่เก็บใน DB (discord:123456789)
        const dbDiscordId = `discord:${rawDiscordId}`;



        // Query ข้อมูลจากตาราง users โดยใช้ discord_id
        const [rows] = await pool.query(
            `SELECT identifier, firstname, lastname, accounts, phone_number, sex, dateofbirth, job, job_grade, inventory, loadout 
       FROM users 
       WHERE discord_id = ? 
       LIMIT 1`,
            [dbDiscordId]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'User not found in game database' }, { status: 404 });
        }

        const user = rows[0];

        // [AUTO SYNC] ซิงค์ firstname/lastname ไปยัง preregistrations (ถ้ามีชื่อใน Game DB)
        if (user.firstname && user.lastname) {
            try {
                // เช็คว่า preregistrations มีชื่อหรือยัง (ถ้าไม่มีค่อย sync)
                const [preregCheck] = await webDb.query(
                    'SELECT firstname FROM preregistrations WHERE discord_id = ?',
                    [rawDiscordId]
                );

                if (preregCheck.length > 0 && !preregCheck[0].firstname) {
                    await webDb.query(
                        'UPDATE preregistrations SET firstname = ?, lastname = ? WHERE discord_id = ?',
                        [user.firstname, user.lastname, rawDiscordId]
                    );
                }
            } catch (syncErr) {
                // Silent fail - ไม่ต้อง error ถ้า sync ไม่ได้
            }
        }

        // Fetch Job Label separately (Safe Mode)
        let jobLabel = user.job;
        try {
            const [jobRows] = await pool.query(
                `SELECT label FROM job_grades WHERE job_name = ? AND grade = ? LIMIT 1`,
                [user.job, user.job_grade]
            );
            if (jobRows.length > 0) {
                jobLabel = jobRows[0].label;
            }
        } catch (err) {
            // Silent fail
        }



        // Parse JSON Data
        // Parse JSON Data with Fault Tolerance
        let accounts = {};
        try {
            accounts = JSON.parse(user.accounts || '{}');
        } catch (e) {

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
            job_label: jobLabel,
            inventory: inventory,
            loadout: loadout
        };

        return NextResponse.json(userData, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
            },
        });

    } catch (error) {

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
