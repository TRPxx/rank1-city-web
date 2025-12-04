import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';
import { webDb } from '@/lib/db';

import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const discordId = session.user.id;

        // Rate Limit by User ID (not IP)
        if (!rateLimit(discordId, 5, 60000)) { // 5 requests per minute per user
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const data = await request.json();
        const { firstname, lastname, dateofbirth, sex, height } = data;

        // 1. Formatting: จัดรูปแบบชื่อ (Trim -> Title Case)
        const formatName = (name) => {
            if (!name) return '';
            const trimmed = name.trim();
            // แปลงตัวแรกเป็นพิมพ์ใหญ่ ตัวที่เหลือเป็นพิมพ์เล็ก
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        };

        const formattedFirstname = formatName(firstname);
        const formattedLastname = formatName(lastname);

        // 2. Validation: ตรวจสอบความครบถ้วน
        if (!formattedFirstname || !formattedLastname || !dateofbirth || !sex || !height) {
            return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
        }

        // 3. Validation: ตรวจสอบรูปแบบชื่อ
        // - เฉพาะ a-z, A-Z เท่านั้น
        // - ห้ามมีช่องว่าง (เพราะต้องเป็นคำเดียว)
        // - ห้ามมีตัวเลขหรืออักขระพิเศษ
        const nameRegex = /^[a-zA-Z]+$/;

        if (!nameRegex.test(formattedFirstname) || !nameRegex.test(formattedLastname)) {
            return NextResponse.json({ error: 'ชื่อและนามสกุลต้องเป็นภาษาอังกฤษเท่านั้น (A-Z, a-z) ห้ามมีตัวเลข, ช่องว่าง หรืออักขระพิเศษ' }, { status: 400 });
        }

        // 4. Validation: ตรวจสอบความยาว (2-20 ตัวอักษร)
        if (formattedFirstname.length < 2 || formattedFirstname.length > 20) {
            return NextResponse.json({ error: 'ชื่อต้องมีความยาวระหว่าง 2 ถึง 20 ตัวอักษร' }, { status: 400 });
        }
        if (formattedLastname.length < 2 || formattedLastname.length > 20) {
            return NextResponse.json({ error: 'นามสกุลต้องมีความยาวระหว่าง 2 ถึง 20 ตัวอักษร' }, { status: 400 });
        }

        // 5. Validation: ตรวจสอบส่วนสูง (ต้องเป็นตัวเลขและอยู่ในเกณฑ์)
        const heightInt = parseInt(height);
        if (isNaN(heightInt) || heightInt < 100 || heightInt > 250) {
            return NextResponse.json({ error: 'ส่วนสูงไม่ถูกต้อง (ต้องอยู่ระหว่าง 100-250 ซม.)' }, { status: 400 });
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
        const identifier = `web_pending:${dbDiscordId}`;

        // Optimistic Locking for SSN Generation
        // Try to generate and insert. If duplicate SSN, retry.
        let attempt = 0;
        const MAX_RETRIES = 5;
        let registered = false;

        while (!registered && attempt < MAX_RETRIES) {
            attempt++;

            // Generate SSN (Pure Random Logic - No DB Check)
            let area = Math.floor(Math.random() * 899) + 1;
            while (area === 666) area = Math.floor(Math.random() * 899) + 1;
            let group = Math.floor(Math.random() * 99) + 1;
            let serial = Math.floor(Math.random() * 9999) + 1;
            const ssn = `${area.toString().padStart(3, '0')}-${group.toString().padStart(2, '0')}-${serial.toString().padStart(4, '0')}`;

            // Check Reserved
            const reservedSSNs = ["078-05-1120", "219-09-9999", "123-45-6789"];
            if (reservedSSNs.includes(ssn)) continue;
            if (area === 987 && group === 65 && serial >= 4320 && serial <= 4329) continue;

            try {
                // Try Insert directly
                const sql = `
                    INSERT INTO users (
                        identifier, discord_id, firstname, lastname, dateofbirth, sex, height, 
                        accounts, job, job_grade, \`group\`, position, inventory, ssn
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                await pool.execute(sql, [
                    identifier, dbDiscordId, formattedFirstname, formattedLastname, dateofbirth, sex, parseInt(height),
                    defaultAccounts, defaultJob, defaultJobGrade, defaultGroup, defaultPosition, defaultInventory, ssn
                ]);

                registered = true; // Success!

            } catch (err) {
                // Check if error is Duplicate Entry for SSN
                if (err.code === 'ER_DUP_ENTRY' && err.message.includes('ssn')) {
                    console.warn(`SSN Collision detected (${ssn}). Retrying... attempt ${attempt}`);
                    continue; // Retry with new SSN
                } else {
                    throw err; // Other error, rethrow
                }
            }
        }

        if (!registered) {
            throw new Error('Server Busy: Unable to generate unique SSN after multiple attempts.');
        }

        // Sync firstname/lastname to preregistrations (webDb)
        try {
            await webDb.query(
                'UPDATE preregistrations SET firstname = ?, lastname = ? WHERE discord_id = ?',
                [formattedFirstname, formattedLastname, rawDiscordId]
            );
            console.log(`Synced name to preregistrations for ${rawDiscordId}`);
        } catch (syncError) {
            console.error('Failed to sync to preregistrations:', syncError);
            // ไม่ throw error เพราะการลงทะเบียนสำเร็จแล้ว แค่ sync ไม่ได้
        }

        return NextResponse.json({ success: true, message: 'ลงทะเบียนสำเร็จ' });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle Duplicate Entry (Race Condition)
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                error: 'คุณได้ลงทะเบียนไปแล้ว (ข้อมูลซ้ำในระบบ)'
            }, { status: 409 });
        }

        // Handle Database Connection Issues (Pool Exhaustion / Timeout)
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ER_CON_COUNT_ERROR' || error.code === 'ETIMEDOUT') {
            return NextResponse.json({
                error: 'ระบบกำลังทำงานหนัก กรุณาลองใหม่อีกครั้งในภายหลัง'
            }, { status: 503 });
        }

        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message }, { status: 500 });
    }
}
