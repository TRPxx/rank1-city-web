import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Helper to generate gang code
function generateGangCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'GANG-';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// [SECURITY FIX #8] ฟังก์ชันตรวจสอบ URL ของโลโก้
function isValidImageUrl(url) {
    if (!url) return true; // ว่างได้
    try {
        const parsed = new URL(url);
        const allowedDomains = [
            'pic.in.th', 'www.pic.in.th',
            'i.imgur.com', 'imgur.com',
            'i.ibb.co', 'ibb.co',
            'cdn.discordapp.com',
            'media.discordapp.net',
            'raw.githubusercontent.com'
        ];
        // ตรวจสอบว่า hostname ตรงหรือลงท้ายด้วย domain ที่อนุญาต
        return allowedDomains.some(domain =>
            parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
        );
    } catch {
        return false; // URL ไม่ถูกต้อง
    }
}

export async function POST(request) {
    try {
        // [SECURITY FIX #6] Rate Limiting - 10 requests ต่อนาที
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimit(ip, 20, 60000)) { // 20 requests per minute
            return NextResponse.json({ error: 'คำขอมากเกินไป กรุณารอสักครู่' }, { status: 429 });
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!PREREGISTER_CONFIG.features.enableGang) {
            return NextResponse.json({ error: 'Gang system is disabled' }, { status: 403 });
        }

        const discordId = session.user.id;
        const body = await request.json();
        const { action, name, logoUrl } = body; // action: 'create' | 'join' | 'update_logo'

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Check if user is already in a gang or family
            const [userCheck] = await connection.query(
                'SELECT gang_id, family_id FROM preregistrations WHERE discord_id = ?',
                [discordId]
            );

            if (userCheck.length === 0) {
                throw new Error('Please register first');
            }

            // ⚠️ เงื่อนไข: ห้ามมีทั้งแก๊งและครอบครัว
            if (userCheck[0].family_id) {
                throw new Error('คุณอยู่ในครอบครัวแล้ว ไม่สามารถเข้าร่วมแก๊งได้');
            }

            if (action === 'update_logo') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                // [SECURITY FIX #8] ตรวจสอบ URL ของโลโก้
                if (!isValidImageUrl(logoUrl)) {
                    throw new Error('URL โลโก้ไม่ถูกต้อง กรุณาใช้ pic.in.th, imgur.com หรือ imgbb.com');
                }

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update the logo');
                }

                await connection.query('UPDATE gangs SET logo_url = ? WHERE id = ?', [logoUrl, userCheck[0].gang_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'อัพเดทโลโก้สำเร็จ' });
            }

            // For create and join, user must NOT be in a gang
            if (['create', 'join'].includes(action)) {
                if (userCheck[0].gang_id) {
                    throw new Error('You are already in a gang');
                }
            }

            if (action === 'create') {
                // [SECURITY FIX #9] ตรวจสอบชื่อแก๊งอย่างละเอียด
                const trimmedName = name?.trim();
                if (!trimmedName) throw new Error('กรุณาใส่ชื่อแก๊ง');
                if (trimmedName.length < 3) throw new Error('ชื่อแก๊งต้องมีอย่างน้อย 3 ตัวอักษร');
                if (trimmedName.length > 20) throw new Error('ชื่อแก๊งต้องไม่เกิน 20 ตัวอักษร');
                if (!/^[a-zA-Z0-9\s\u0E00-\u0E7F]+$/.test(trimmedName)) {
                    throw new Error('ชื่อแก๊งใช้ได้เฉพาะตัวอักษร ตัวเลข และภาษาไทย');
                }

                // [SECURITY FIX #3] สร้างรหัสที่ไม่ซ้ำด้วย retry loop
                let newGangCode;
                let isUnique = false;
                let attempts = 0;

                while (!isUnique && attempts < 10) {
                    newGangCode = generateGangCode();
                    const [existing] = await connection.query(
                        'SELECT id FROM gangs WHERE gang_code = ?',
                        [newGangCode]
                    );
                    if (existing.length === 0) isUnique = true;
                    attempts++;
                }

                if (!isUnique) throw new Error('ไม่สามารถสร้างรหัสแก๊งได้ กรุณาลองใหม่');

                // Insert Gang
                const [result] = await connection.query(
                    'INSERT INTO gangs (name, gang_code, invite_code, leader_discord_id, member_count, logo_url) VALUES (?, ?, ?, ?, 1, ?)',
                    [trimmedName, newGangCode, newGangCode, discordId, logoUrl || null]
                );
                const gangId = result.insertId;

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET gang_id = ? WHERE discord_id = ?',
                    [gangId, discordId]
                );

                // Get user info for member list
                const [userInfo] = await connection.query(
                    'SELECT discord_id, discord_name, avatar_url, firstname, lastname FROM preregistrations WHERE discord_id = ?',
                    [discordId]
                );

                await connection.commit();

                // Return full gang data so frontend can display immediately
                const gangData = {
                    id: gangId,
                    name: name,
                    invite_code: newGangCode,
                    member_count: 1,
                    max_members: 25,
                    leader_discord_id: discordId,
                    logo_url: logoUrl || null,
                    motd: null,
                    level: 1
                };

                const membersData = userInfo.length > 0 ? [{
                    discord_id: String(userInfo[0].discord_id),
                    discord_name: userInfo[0].discord_name,
                    avatar_url: userInfo[0].avatar_url,
                    firstname: userInfo[0].firstname,
                    lastname: userInfo[0].lastname,
                    joined_at: new Date().toISOString(),
                    is_leader: true
                }] : [];

                return NextResponse.json({
                    success: true,
                    message: 'Gang created',
                    gangCode: newGangCode,
                    gang: gangData,
                    members: membersData
                });

            } else if (action === 'join') {
                const { inviteCode } = body;
                if (!inviteCode) throw new Error('กรุณากรอกรหัสแก๊ง');

                // หาแก๊งจากรหัส
                const [gangCheck] = await connection.query(
                    'SELECT id, name, member_count, max_members FROM gangs WHERE gang_code = ?',
                    [inviteCode]
                );

                if (gangCheck.length === 0) {
                    throw new Error('ไม่พบแก๊ง');
                }

                const gang = gangCheck[0];

                if (gang.member_count >= gang.max_members) {
                    throw new Error('แก๊งเต็มแล้ว');
                }

                // เช็คว่ามีคำขอที่รอดำเนินการอยู่หรือไม่
                const [existingRequest] = await connection.query(
                    'SELECT id FROM gang_join_requests WHERE gang_id = ? AND discord_id = ? AND status = "pending"',
                    [gang.id, discordId]
                );

                if (existingRequest.length > 0) {
                    throw new Error('คุณมีคำขอเข้าร่วมแก๊งนี้อยู่แล้ว กรุณารอหัวหน้าอนุมัติ');
                }

                // ดึงข้อมูลผู้ใช้
                const [userInfo] = await connection.query(
                    'SELECT discord_name, avatar_url FROM preregistrations WHERE discord_id = ?',
                    [discordId]
                );

                // สร้างคำขอเข้าร่วม (ไม่เข้าร่วมทันที)
                await connection.query(
                    `INSERT INTO gang_join_requests (gang_id, discord_id, discord_name, avatar_url, status) 
                     VALUES (?, ?, ?, ?, 'pending')`,
                    [gang.id, discordId, userInfo[0]?.discord_name || 'Unknown', userInfo[0]?.avatar_url || null]
                );

                await connection.commit();
                return NextResponse.json({
                    success: true,
                    message: `ส่งคำขอเข้าร่วมแก๊ง "${gang.name}" สำเร็จ! กรุณารอหัวหน้าอนุมัติ`,
                    pending: true
                });

            } else if (action === 'approve_join') {
                // หัวหน้าอนุมัติคำขอ
                if (!userCheck[0].gang_id) throw new Error('คุณไม่ได้อยู่ในแก๊ง');

                const { requestId } = body;
                if (!requestId) throw new Error('ไม่พบรหัสคำขอ');

                // เช็คว่าเป็นหัวหน้าหรือไม่
                const [gang] = await connection.query(
                    'SELECT id, leader_discord_id, member_count, max_members FROM gangs WHERE id = ?',
                    [userCheck[0].gang_id]
                );

                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('เฉพาะหัวหน้าเท่านั้นที่สามารถอนุมัติได้');
                }

                // เช็คคำขอ
                const [request] = await connection.query(
                    'SELECT id, discord_id FROM gang_join_requests WHERE id = ? AND gang_id = ? AND status = "pending"',
                    [requestId, userCheck[0].gang_id]
                );

                if (request.length === 0) {
                    throw new Error('ไม่พบคำขอหรือคำขอถูกดำเนินการแล้ว');
                }

                // [SECURITY FIX #1] ใช้ Atomic UPDATE ป้องกัน Race Condition
                // อัพเดทจำนวนสมาชิกแบบ atomic พร้อมเช็คว่าไม่เกิน max
                const [updateResult] = await connection.query(
                    `UPDATE gangs 
                     SET member_count = member_count + 1 
                     WHERE id = ? AND member_count < max_members`,
                    [userCheck[0].gang_id]
                );

                if (updateResult.affectedRows === 0) {
                    throw new Error('แก๊งเต็มแล้ว ไม่สามารถอนุมัติได้');
                }

                const requesterDiscordId = request[0].discord_id;

                // ลบ record เก่าที่ approved/rejected ก่อน (ป้องกัน duplicate key)
                await connection.query(
                    'DELETE FROM gang_join_requests WHERE gang_id = ? AND discord_id = ? AND status IN ("approved", "rejected")',
                    [userCheck[0].gang_id, requesterDiscordId]
                );

                // อัพเดทคำขอเป็น approved
                await connection.query(
                    'UPDATE gang_join_requests SET status = "approved", processed_at = NOW(), processed_by = ? WHERE id = ?',
                    [discordId, requestId]
                );

                // เพิ่มสมาชิกเข้าแก๊ง
                await connection.query(
                    'UPDATE preregistrations SET gang_id = ? WHERE discord_id = ?',
                    [userCheck[0].gang_id, requesterDiscordId]
                );

                // [SYNC] Sync member_count จากข้อมูลจริง
                await connection.query(
                    'CALL sp_update_gang_member_count(?)',
                    [userCheck[0].gang_id]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'อนุมัติคำขอเข้าร่วมสำเร็จ' });

            } else if (action === 'reject_join') {
                // หัวหน้าปฏิเสธคำขอ
                if (!userCheck[0].gang_id) throw new Error('คุณไม่ได้อยู่ในแก๊ง');

                const { requestId } = body;
                if (!requestId) throw new Error('ไม่พบรหัสคำขอ');

                // เช็คว่าเป็นหัวหน้าหรือไม่
                const [gang] = await connection.query(
                    'SELECT leader_discord_id FROM gangs WHERE id = ?',
                    [userCheck[0].gang_id]
                );

                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('เฉพาะหัวหน้าเท่านั้นที่สามารถปฏิเสธได้');
                }

                // อัพเดทคำขอเป็น rejected
                const [result] = await connection.query(
                    'UPDATE gang_join_requests SET status = "rejected", processed_at = NOW(), processed_by = ? WHERE id = ? AND gang_id = ? AND status = "pending"',
                    [discordId, requestId, userCheck[0].gang_id]
                );

                if (result.affectedRows === 0) {
                    throw new Error('ไม่พบคำขอหรือคำขอถูกดำเนินการแล้ว');
                }

                await connection.commit();
                return NextResponse.json({ success: true, message: 'ปฏิเสธคำขอเข้าร่วมแล้ว' });

            } else if (action === 'cancel_request') {
                // ผู้ใช้ยกเลิกคำขอของตัวเอง
                const { gangId } = body;

                const [result] = await connection.query(
                    'DELETE FROM gang_join_requests WHERE discord_id = ? AND gang_id = ? AND status = "pending"',
                    [discordId, gangId]
                );

                if (result.affectedRows === 0) {
                    throw new Error('ไม่พบคำขอที่รอดำเนินการ');
                }

                await connection.commit();
                return NextResponse.json({ success: true, message: 'ยกเลิกคำขอแล้ว' });

            } else if (action === 'leave') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                // Check if leader
                const [gang] = await connection.query('SELECT id, leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id === discordId) {
                    throw new Error('Leader cannot leave. You must dissolve the gang.');
                }

                // Update User
                await connection.query('UPDATE preregistrations SET gang_id = NULL WHERE discord_id = ?', [discordId]);

                // [SYNC] Sync member_count จากข้อมูลจริง
                await connection.query(
                    'CALL sp_update_gang_member_count(?)',
                    [userCheck[0].gang_id]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Left gang successfully' });

            } else if (action === 'update_settings') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                const { name, motd } = body;

                // [SECURITY] Validate name
                const trimmedName = name?.trim();
                if (!trimmedName) throw new Error('กรุณาใส่ชื่อแก๊ง');
                if (trimmedName.length < 3) throw new Error('ชื่อแก๊งต้องมีอย่างน้อย 3 ตัวอักษร');
                if (trimmedName.length > 20) throw new Error('ชื่อแก๊งต้องไม่เกิน 20 ตัวอักษร');
                if (!/^[a-zA-Z0-9\s\u0E00-\u0E7F]+$/.test(trimmedName)) {
                    throw new Error('ชื่อแก๊งใช้ได้เฉพาะตัวอักษร ตัวเลข และภาษาไทย');
                }

                // [SECURITY] Validate and sanitize MOTD (max 200 chars, strip HTML)
                const sanitizedMotd = motd ? String(motd).slice(0, 200).replace(/<[^>]*>/g, '') : null;

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update settings');
                }

                await connection.query('UPDATE gangs SET name = ?, motd = ? WHERE id = ?', [trimmedName, sanitizedMotd, userCheck[0].gang_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'อัพเดทการตั้งค่าสำเร็จ' });

            } else if (action === 'dissolve') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can dissolve the gang');
                }

                // Remove all members
                await connection.query('UPDATE preregistrations SET gang_id = NULL WHERE gang_id = ?', [userCheck[0].gang_id]);

                // Delete Gang
                await connection.query('DELETE FROM gangs WHERE id = ?', [userCheck[0].gang_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Gang dissolved' });

            } else if (action === 'kick_member') {
                if (!userCheck[0].gang_id) throw new Error('You are not in a gang');

                let { targetDiscordId } = body;
                if (!targetDiscordId) throw new Error('Target member ID required');

                // Ensure string
                targetDiscordId = String(targetDiscordId);



                // Verify Leader
                const [gang] = await connection.query('SELECT leader_discord_id FROM gangs WHERE id = ?', [userCheck[0].gang_id]);
                if (gang[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can kick members');
                }

                // Prevent leader from kicking themselves
                if (targetDiscordId === discordId) {
                    throw new Error('Leader cannot kick themselves');
                }

                // Check if target is in the same gang
                const [targetUser] = await connection.query(
                    'SELECT gang_id FROM preregistrations WHERE discord_id = ?',
                    [targetDiscordId]
                );

                if (targetUser.length === 0) {

                    throw new Error('Member not found in database');
                }

                if (targetUser[0].gang_id !== userCheck[0].gang_id) {

                    throw new Error('Member not found in your gang');
                }

                // Remove member from gang
                const [result] = await connection.query('UPDATE preregistrations SET gang_id = NULL WHERE discord_id = ?', [targetDiscordId]);



                if (result.affectedRows === 0) {
                    throw new Error('Failed to kick member (User not found or already kicked)');
                }

                // [SYNC] Sync member_count จากข้อมูลจริง
                await connection.query(
                    'CALL sp_update_gang_member_count(?)',
                    [userCheck[0].gang_id]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Member kicked successfully' });
            }

            throw new Error('Invalid action');

        } catch (err) {
            await connection.rollback();
            return NextResponse.json({ error: err.message }, { status: 400 });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Gang API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Get User's Gang Info
        const [rows] = await pool.query(`
            SELECT g.id, g.name, g.gang_code AS invite_code, g.member_count, g.max_members, g.leader_discord_id, g.logo_url, g.motd, g.level
            FROM preregistrations p
            JOIN gangs g ON p.gang_id = g.id
            WHERE p.discord_id = ?
        `, [discordId]);

        if (rows.length === 0) {
            // ดึงคำขอที่ผู้ใช้ส่งไป (ถ้ามี)
            const [myRequests] = await pool.query(`
                SELECT jr.id, jr.gang_id, jr.status, jr.created_at, g.name as gang_name
                FROM gang_join_requests jr
                JOIN gangs g ON jr.gang_id = g.id
                WHERE jr.discord_id = ? AND jr.status = 'pending'
            `, [discordId]);

            return NextResponse.json({
                hasGang: false,
                myPendingRequests: myRequests
            });
        }

        const gang = rows[0];

        // Get Gang Members (firstname/lastname from preregistrations)
        const [members] = await pool.query(`
            SELECT 
                CAST(p.discord_id AS CHAR) as discord_id,
                p.discord_name,
                p.avatar_url,
                p.firstname,
                p.lastname,
                NOW() as joined_at,
                g.leader_discord_id,
                (p.discord_id = g.leader_discord_id) as is_leader
            FROM preregistrations p
            JOIN gangs g ON p.gang_id = g.id
            WHERE p.gang_id = ?
            ORDER BY is_leader DESC, p.discord_name ASC
        `, [gang.id]);

        // Convert is_leader from 0/1 to proper boolean
        const membersWithBoolean = members.map(m => ({
            ...m,
            is_leader: Boolean(m.is_leader)
        }));

        // ถ้าเป็นหัวหน้า ดึงคำขอที่รอดำเนินการ
        let pendingRequests = [];
        if (gang.leader_discord_id === discordId) {
            const [requests] = await pool.query(`
                SELECT id, discord_id, discord_name, avatar_url, created_at
                FROM gang_join_requests
                WHERE gang_id = ? AND status = 'pending'
                ORDER BY created_at ASC
            `, [gang.id]);
            pendingRequests = requests;
        }

        return NextResponse.json({
            hasGang: true,
            gang: gang,
            members: membersWithBoolean,
            pendingRequests: pendingRequests
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
