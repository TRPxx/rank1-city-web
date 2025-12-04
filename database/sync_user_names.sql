-- ===================================
-- Sync firstname/lastname to preregistrations
-- ===================================

-- 1. เพิ่มคอลัมน์ firstname และ lastname
ALTER TABLE preregistrations 
ADD COLUMN IF NOT EXISTS firstname VARCHAR(50) DEFAULT NULL AFTER discord_name,
ADD COLUMN IF NOT EXISTS lastname VARCHAR(50) DEFAULT NULL AFTER firstname;

-- 2. Sync ข้อมูลที่มีอยู่แล้วจาก freshtown.users
-- Note: users.discord_id มี prefix 'discord:' แต่ preregistrations.discord_id ไม่มี
UPDATE preregistrations p
LEFT JOIN freshtown.users u ON CONCAT('discord:', p.discord_id) = u.discord_id
SET 
    p.firstname = u.firstname,
    p.lastname = u.lastname
WHERE u.firstname IS NOT NULL;

-- 3. เพิ่ม Index เพื่อเพิ่ม performance
ALTER TABLE preregistrations 
ADD INDEX idx_fullname (firstname, lastname);

-- 4. แสดงผลลัพธ์
SELECT 'firstname/lastname synced successfully!' AS Status;
SELECT 
    COUNT(*) as total_users,
    COUNT(firstname) as users_with_name,
    COUNT(*) - COUNT(firstname) as users_without_name
FROM preregistrations;
