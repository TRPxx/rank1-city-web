-- ลบข้อมูลแก๊งทั้งหมด
-- Clear all gang data from the database

-- 1. อัปเดต preregistrations - ลบ gang_id ออกจาก users ทั้งหมด
UPDATE preregistrations 
SET gang_id = NULL 
WHERE gang_id IS NOT NULL;

-- 2. ลบข้อมูลแก๊งทั้งหมด
DELETE FROM gangs;

-- 3. รีเซ็ต AUTO_INCREMENT (optional)
ALTER TABLE gangs AUTO_INCREMENT = 1;

-- แสดงผลลัพธ์
SELECT 'Gang data cleared successfully!' AS Status;
SELECT COUNT(*) AS 'Remaining Gangs' FROM gangs;
SELECT COUNT(*) AS 'Users with Gang' FROM preregistrations WHERE gang_id IS NOT NULL;
