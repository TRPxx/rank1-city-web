import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { firstname, lastname, dateofbirth, sex, height } = data;

        // Validation เบื้องต้น
        if (!firstname || !lastname || !dateofbirth || !sex || !height) {
            return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
        }

        const rawDiscordId = session.user.id;
        const dbDiscordId = `discord:${rawDiscordId}`;

        // ตรวจสอบอีกครั้งว่ามี User อยู่แล้วหรือไม่
        const [existing] = await pool.query(
            `SELECT identifier FROM users WHERE discord_id = ? LIMIT 1`,
            [dbDiscordId]
        );

        if (existing.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // เตรียมข้อมูล Default
        const defaultAccounts = JSON.stringify({ money: 0, bank: 5000 }); // ให้เงินติดตัว 0, ธนาคาร 5000
        const defaultPosition = JSON.stringify({ x: -269.4, y: -955.3, z: 31.2, heading: 205.8 }); // จุดเกิดเริ่มต้น (เปลี่ยนได้)
        const defaultInventory = '[]';
        const defaultJob = 'unemployed';
        const defaultJobGrade = 0;
        const defaultGroup = 'user';

        // Generate SSN ตามมาตรฐาน ESX Legacy (XXX-XX-XXXX)
        let ssn = '';
        let isSsnUnique = false;

        while (!isSsnUnique) {
            // 1. Area (001-899, skip 666)
            let area = Math.floor(Math.random() * 899) + 1;
            while (area === 666) {
                area = Math.floor(Math.random() * 899) + 1;
            }

            // 2. Group (01-99)
            let group = Math.floor(Math.random() * 99) + 1;

            // 3. Serial (0001-9999)
            let serial = Math.floor(Math.random() * 9999) + 1;

            // Format: XXX-XX-XXXX
            const candidate = `${area.toString().padStart(3, '0')}-${group.toString().padStart(2, '0')}-${serial.toString().padStart(4, '0')}`;

            // Check Reserved
            const reservedSSNs = ["078-05-1120", "219-09-9999", "123-45-6789"];
            if (reservedSSNs.includes(candidate)) continue;

            // Check Range Exception (987-65-4320..4329)
            if (area === 987 && group === 65 && serial >= 4320 && serial <= 4329) continue;

            // Check Database Uniqueness
            const [checkSsn] = await pool.query('SELECT 1 FROM users WHERE ssn = ?', [candidate]);
            if (checkSsn.length === 0) {
                ssn = candidate;
                isSsnUnique = true;
            }
        }

        // Identifier ใช้ค่า web_pending เพื่อรอการ Update จากเกม
        const identifier = `web_pending:${dbDiscordId}`;

        // Insert ข้อมูลลง Database
        const sql = `
            INSERT INTO users (
                identifier, discord_id, firstname, lastname, dateofbirth, sex, height, 
                accounts, job, job_grade, \`group\`, position, inventory, ssn
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(sql, [
            identifier, dbDiscordId, firstname, lastname, dateofbirth, sex, parseInt(height),
            defaultAccounts, defaultJob, defaultJobGrade, defaultGroup, defaultPosition, defaultInventory, ssn
        ]);

        return NextResponse.json({ success: true, message: 'ลงทะเบียนสำเร็จ' });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message }, { status: 500 });
    }
}
