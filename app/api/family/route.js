import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { webDb as pool } from '@/lib/db';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Helper to generate family code
function generateFamilyCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'FAM-';
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
        return allowedDomains.some(domain =>
            parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}

export async function POST(request) {
    try {
        // [SECURITY FIX #7] Rate Limiting - 10 requests ต่อนาที
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimit(ip, 10, 60000)) {
            return NextResponse.json({ error: 'คำขอมากเกินไป กรุณารอสักครู่' }, { status: 429 });
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!PREREGISTER_CONFIG.features.enableGang) {
            return NextResponse.json({ error: 'Family system is disabled' }, { status: 403 });
        }

        const discordId = session.user.id;
        const body = await request.json();
        const { action, name, familyCode, logoUrl } = body; // action: 'create' | 'join' | 'update_logo'

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
            if (userCheck[0].gang_id) {
                throw new Error('คุณอยู่ในแก๊งแล้ว ไม่สามารถเข้าร่วมครอบครัวได้');
            }

            if (action === 'update_logo') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                // [SECURITY FIX #8] ตรวจสอบ URL ของโลโก้
                if (!isValidImageUrl(logoUrl)) {
                    throw new Error('URL โลโก้ไม่ถูกต้อง กรุณาใช้ pic.in.th, imgur.com หรือ imgbb.com');
                }

                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update the logo');
                }

                await connection.query('UPDATE families SET logo_url = ? WHERE id = ?', [logoUrl, userCheck[0].family_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'อัพเดทโลโก้สำเร็จ' });
            }

            if (userCheck[0].family_id) {
                throw new Error('You are already in a family');
            }

            if (action === 'create') {
                // [SECURITY FIX #9] ตรวจสอบชื่อครอบครัวอย่างละเอียด
                const trimmedName = name?.trim();
                if (!trimmedName) throw new Error('กรุณาใส่ชื่อครอบครัว');
                if (trimmedName.length < 3) throw new Error('ชื่อครอบครัวต้องมีอย่างน้อย 3 ตัวอักษร');
                if (trimmedName.length > 20) throw new Error('ชื่อครอบครัวต้องไม่เกิน 20 ตัวอักษร');
                if (!/^[a-zA-Z0-9\s\u0E00-\u0E7F]+$/.test(trimmedName)) {
                    throw new Error('ชื่อครอบครัวใช้ได้เฉพาะตัวอักษร ตัวเลข และภาษาไทย');
                }

                // [SECURITY FIX #4] สร้างรหัสที่ไม่ซ้ำด้วย retry loop
                let newFamilyCode;
                let isUnique = false;
                let attempts = 0;

                while (!isUnique && attempts < 10) {
                    newFamilyCode = generateFamilyCode();
                    const [existing] = await connection.query(
                        'SELECT id FROM families WHERE family_code = ?',
                        [newFamilyCode]
                    );
                    if (existing.length === 0) isUnique = true;
                    attempts++;
                }

                if (!isUnique) throw new Error('ไม่สามารถสร้างรหัสครอบครัวได้ กรุณาลองใหม่');

                // Insert Family
                const [result] = await connection.query(
                    'INSERT INTO families (name, family_code, invite_code, leader_discord_id, member_count, logo_url) VALUES (?, ?, ?, ?, 1, ?)',
                    [trimmedName, newFamilyCode, newFamilyCode, discordId, logoUrl || null]
                );
                const familyId = result.insertId;

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET family_id = ? WHERE discord_id = ?',
                    [familyId, discordId]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Family created', familyCode: newFamilyCode });

            } else if (action === 'join') {
                const { inviteCode } = body;
                if (!inviteCode) throw new Error('กรุณากรอกรหัสครอบครัว');

                // หาครอบครัวจากรหัส
                const [familyCheck] = await connection.query(
                    'SELECT id, name, member_count, max_members FROM families WHERE family_code = ?',
                    [inviteCode]
                );

                if (familyCheck.length === 0) {
                    throw new Error('ไม่พบครอบครัว');
                }

                const family = familyCheck[0];

                if (family.member_count >= family.max_members) {
                    throw new Error('ครอบครัวเต็มแล้ว');
                }

                // เช็คว่ามีคำขอที่รอดำเนินการอยู่หรือไม่
                const [existingRequest] = await connection.query(
                    'SELECT id FROM family_join_requests WHERE family_id = ? AND discord_id = ? AND status = "pending"',
                    [family.id, discordId]
                );

                if (existingRequest.length > 0) {
                    throw new Error('คุณมีคำขอเข้าร่วมครอบครัวนี้อยู่แล้ว กรุณารอหัวหน้าอนุมัติ');
                }

                // ดึงข้อมูลผู้ใช้
                const [userInfo] = await connection.query(
                    'SELECT discord_name, avatar_url FROM preregistrations WHERE discord_id = ?',
                    [discordId]
                );

                // สร้างคำขอเข้าร่วม (ไม่เข้าร่วมทันที)
                await connection.query(
                    `INSERT INTO family_join_requests (family_id, discord_id, discord_name, avatar_url, status) 
                     VALUES (?, ?, ?, ?, 'pending')`,
                    [family.id, discordId, userInfo[0]?.discord_name || 'Unknown', userInfo[0]?.avatar_url || null]
                );

                await connection.commit();
                return NextResponse.json({
                    success: true,
                    message: `ส่งคำขอเข้าร่วมครอบครัว "${family.name}" สำเร็จ! กรุณารอหัวหน้าอนุมัติ`,
                    pending: true
                });

            } else if (action === 'approve_join') {
                // หัวหน้าอนุมัติคำขอ
                if (!userCheck[0].family_id) throw new Error('คุณไม่ได้อยู่ในครอบครัว');

                const { requestId } = body;
                if (!requestId) throw new Error('ไม่พบรหัสคำขอ');

                // เช็คว่าเป็นหัวหน้าหรือไม่
                const [family] = await connection.query(
                    'SELECT id, leader_discord_id, member_count, max_members FROM families WHERE id = ?',
                    [userCheck[0].family_id]
                );

                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('เฉพาะหัวหน้าเท่านั้นที่สามารถอนุมัติได้');
                }

                // เช็คคำขอ
                const [request] = await connection.query(
                    'SELECT id, discord_id FROM family_join_requests WHERE id = ? AND family_id = ? AND status = "pending"',
                    [requestId, userCheck[0].family_id]
                );

                if (request.length === 0) {
                    throw new Error('ไม่พบคำขอหรือคำขอถูกดำเนินการแล้ว');
                }

                // เช็คว่าครอบครัวยังไม่เต็ม
                if (family[0].member_count >= family[0].max_members) {
                    throw new Error('ครอบครัวเต็มแล้ว ไม่สามารถอนุมัติได้');
                }

                const requesterDiscordId = request[0].discord_id;

                // ลบ record เก่าที่ approved/rejected ก่อน (ป้องกัน duplicate key)
                await connection.query(
                    'DELETE FROM family_join_requests WHERE family_id = ? AND discord_id = ? AND status IN ("approved", "rejected")',
                    [userCheck[0].family_id, requesterDiscordId]
                );

                // อัพเดทคำขอเป็น approved
                await connection.query(
                    'UPDATE family_join_requests SET status = "approved", processed_at = NOW(), processed_by = ? WHERE id = ?',
                    [discordId, requestId]
                );

                // เพิ่มสมาชิกเข้าครอบครัว
                await connection.query(
                    'UPDATE preregistrations SET family_id = ? WHERE discord_id = ?',
                    [userCheck[0].family_id, requesterDiscordId]
                );

                // อัพเดทจำนวนสมาชิก
                await connection.query(
                    'UPDATE families SET member_count = member_count + 1 WHERE id = ?',
                    [userCheck[0].family_id]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'อนุมัติคำขอเข้าร่วมสำเร็จ' });

            } else if (action === 'reject_join') {
                // หัวหน้าปฏิเสธคำขอ
                if (!userCheck[0].family_id) throw new Error('คุณไม่ได้อยู่ในครอบครัว');

                const { requestId } = body;
                if (!requestId) throw new Error('ไม่พบรหัสคำขอ');

                // เช็คว่าเป็นหัวหน้าหรือไม่
                const [family] = await connection.query(
                    'SELECT leader_discord_id FROM families WHERE id = ?',
                    [userCheck[0].family_id]
                );

                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('เฉพาะหัวหน้าเท่านั้นที่สามารถปฏิเสธได้');
                }

                // อัพเดทคำขอเป็น rejected
                const [result] = await connection.query(
                    'UPDATE family_join_requests SET status = "rejected", processed_at = NOW(), processed_by = ? WHERE id = ? AND family_id = ? AND status = "pending"',
                    [discordId, requestId, userCheck[0].family_id]
                );

                if (result.affectedRows === 0) {
                    throw new Error('ไม่พบคำขอหรือคำขอถูกดำเนินการแล้ว');
                }

                await connection.commit();
                return NextResponse.json({ success: true, message: 'ปฏิเสธคำขอเข้าร่วมแล้ว' });

            } else if (action === 'cancel_request') {
                // ผู้ใช้ยกเลิกคำขอของตัวเอง
                const { familyId } = body;

                const [result] = await connection.query(
                    'DELETE FROM family_join_requests WHERE discord_id = ? AND family_id = ? AND status = "pending"',
                    [discordId, familyId]
                );

                if (result.affectedRows === 0) {
                    throw new Error('ไม่พบคำขอที่รอดำเนินการ');
                }

                await connection.commit();
                return NextResponse.json({ success: true, message: 'ยกเลิกคำขอแล้ว' });

            } else if (action === 'leave') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                // Check if leader
                const [family] = await connection.query('SELECT id, leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id === discordId) {
                    throw new Error('Leader cannot leave. You must dissolve the family.');
                }

                // Update User
                await connection.query('UPDATE preregistrations SET family_id = NULL WHERE discord_id = ?', [discordId]);

                // Update Family Count
                await connection.query('UPDATE families SET member_count = member_count - 1 WHERE id = ?', [userCheck[0].family_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Left family successfully' });

            } else if (action === 'update_settings') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                const { name, motd } = body;

                // [SECURITY] Validate name
                const trimmedName = name?.trim();
                if (!trimmedName) throw new Error('กรุณาใส่ชื่อครอบครัว');
                if (trimmedName.length < 3) throw new Error('ชื่อครอบครัวต้องมีอย่างน้อย 3 ตัวอักษร');
                if (trimmedName.length > 20) throw new Error('ชื่อครอบครัวต้องไม่เกิน 20 ตัวอักษร');
                if (!/^[a-zA-Z0-9\s\u0E00-\u0E7F]+$/.test(trimmedName)) {
                    throw new Error('ชื่อครอบครัวใช้ได้เฉพาะตัวอักษร ตัวเลข และภาษาไทย');
                }

                // [SECURITY] Validate and sanitize MOTD (max 200 chars, strip HTML)
                const sanitizedMotd = motd ? String(motd).slice(0, 200).replace(/<[^>]*>/g, '') : null;

                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can update settings');
                }

                await connection.query('UPDATE families SET name = ?, motd = ? WHERE id = ?', [trimmedName, sanitizedMotd, userCheck[0].family_id]);
                await connection.commit();
                return NextResponse.json({ success: true, message: 'อัพเดทการตั้งค่าสำเร็จ' });

            } else if (action === 'dissolve') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can dissolve the family');
                }

                // Remove all members
                await connection.query('UPDATE preregistrations SET family_id = NULL WHERE family_id = ?', [userCheck[0].family_id]);

                // Delete Family
                await connection.query('DELETE FROM families WHERE id = ?', [userCheck[0].family_id]);

                await connection.commit();
                return NextResponse.json({ success: true, message: 'Family dissolved' });

            } else if (action === 'kick_member') {
                if (!userCheck[0].family_id) throw new Error('You are not in a family');

                let { targetDiscordId } = body;
                if (!targetDiscordId) throw new Error('Target member ID required');

                // Ensure string
                targetDiscordId = String(targetDiscordId);



                // Verify Leader
                const [family] = await connection.query('SELECT leader_discord_id FROM families WHERE id = ?', [userCheck[0].family_id]);
                if (family[0].leader_discord_id !== discordId) {
                    throw new Error('Only the leader can kick members');
                }

                // Prevent leader from kicking themselves
                if (targetDiscordId === discordId) {
                    throw new Error('Leader cannot kick themselves');
                }

                // Check if target is in the same family
                const [targetUser] = await connection.query(
                    'SELECT family_id FROM preregistrations WHERE discord_id = ?',
                    [targetDiscordId]
                );

                if (targetUser.length === 0) {
                    throw new Error('Member not found in database');
                }

                if (targetUser[0].family_id !== userCheck[0].family_id) {
                    throw new Error('Member not found in your family');
                }

                // Remove member from family
                const [result] = await connection.query('UPDATE preregistrations SET family_id = NULL WHERE discord_id = ?', [targetDiscordId]);



                if (result.affectedRows === 0) {
                    throw new Error('Failed to kick member (User not found or already kicked)');
                }

                // Update Family Count
                await connection.query('UPDATE families SET member_count = member_count - 1 WHERE id = ?', [userCheck[0].family_id]);

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
        console.error('Family API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const discordId = session.user.id;

        // Get User's Family Info
        const [rows] = await pool.query(`
            SELECT f.id, f.name, f.family_code AS invite_code, f.member_count, f.max_members, f.leader_discord_id, f.logo_url
            FROM preregistrations p
            JOIN families f ON p.family_id = f.id
            WHERE p.discord_id = ?
        `, [discordId]);

        if (rows.length === 0) {
            // ดึงคำขอที่ผู้ใช้ส่งไป (ถ้ามี)
            const [myRequests] = await pool.query(`
                SELECT jr.id, jr.family_id, jr.status, jr.created_at, f.name as family_name
                FROM family_join_requests jr
                JOIN families f ON jr.family_id = f.id
                WHERE jr.discord_id = ? AND jr.status = 'pending'
            `, [discordId]);

            return NextResponse.json({
                hasFamily: false,
                myPendingRequests: myRequests
            });
        }

        const family = rows[0];

        // Get Family Members (firstname/lastname from preregistrations)
        const [members] = await pool.query(`
            SELECT 
                CAST(p.discord_id AS CHAR) as discord_id,
                p.discord_name,
                p.avatar_url,
                p.firstname,
                p.lastname,
                NOW() as joined_at,
                f.leader_discord_id,
                (p.discord_id = f.leader_discord_id) as is_leader
            FROM preregistrations p
            JOIN families f ON p.family_id = f.id
            WHERE p.family_id = ?
            ORDER BY is_leader DESC, p.discord_name ASC
        `, [family.id]);

        // Convert is_leader from 0/1 to proper boolean
        const membersWithBoolean = members.map(m => ({
            ...m,
            is_leader: Boolean(m.is_leader)
        }));

        // ถ้าเป็นหัวหน้า ดึงคำขอที่รอดำเนินการ
        let pendingRequests = [];
        if (family.leader_discord_id === discordId) {
            const [requests] = await pool.query(`
                SELECT id, discord_id, discord_name, avatar_url, created_at
                FROM family_join_requests
                WHERE family_id = ? AND status = 'pending'
                ORDER BY created_at ASC
            `, [family.id]);
            pendingRequests = requests;
        }

        return NextResponse.json({
            hasFamily: true,
            family: family,
            members: membersWithBoolean,
            pendingRequests: pendingRequests
        });

    } catch (error) {
        console.error('Error in GET /api/family:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
