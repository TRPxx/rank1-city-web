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
                if (!inviteCode) throw new Error('Family code required');

                // [SECURITY FIX #2] Atomic UPDATE เพื่อป้องกัน Race Condition
                // ใช้ UPDATE พร้อมเงื่อนไขใน SQL เดียว แทน SELECT แล้วเช็ค
                const [updateResult] = await connection.query(
                    `UPDATE families 
                     SET member_count = member_count + 1 
                     WHERE family_code = ? AND member_count < max_members`,
                    [inviteCode]
                );

                if (updateResult.affectedRows === 0) {
                    // เช็คว่าไม่พบครอบครัว หรือ ครอบครัวเต็ม
                    const [familyCheck] = await connection.query(
                        'SELECT id, member_count, max_members FROM families WHERE family_code = ?',
                        [inviteCode]
                    );
                    if (familyCheck.length === 0) {
                        throw new Error('ไม่พบครอบครัว');
                    }
                    throw new Error('ครอบครัวเต็มแล้ว');
                }

                // ดึง family_id สำหรับ update user
                const [family] = await connection.query(
                    'SELECT id FROM families WHERE family_code = ?',
                    [inviteCode]
                );

                // Update User
                await connection.query(
                    'UPDATE preregistrations SET family_id = ? WHERE discord_id = ?',
                    [family[0].id, discordId]
                );

                await connection.commit();
                return NextResponse.json({ success: true, message: 'เข้าร่วมครอบครัวสำเร็จ' });

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

                console.log(`[Family] Kicking member: Leader=${discordId}, Target=${targetDiscordId}`);

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
                    console.log(`[Family] Target user not found in DB: ${targetDiscordId}`);
                    throw new Error('Member not found in database');
                }

                if (targetUser[0].family_id !== userCheck[0].family_id) {
                    console.log(`[Family] Target user in different family/no family: ${targetUser[0].family_id} vs ${userCheck[0].family_id}`);
                    throw new Error('Member not found in your family');
                }

                // Remove member from family
                const [result] = await connection.query('UPDATE preregistrations SET family_id = NULL WHERE discord_id = ?', [targetDiscordId]);

                console.log(`[Family] Kick result: AffectedRows=${result.affectedRows}`);

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
            return NextResponse.json({ hasFamily: false });
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

        return NextResponse.json({
            hasFamily: true,
            family: family,
            members: membersWithBoolean
        });

    } catch (error) {
        console.error('Error in GET /api/family:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
