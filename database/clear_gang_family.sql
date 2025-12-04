-- ===================================
-- ลบข้อมูล Gang & Family ทั้งหมด
-- ===================================

-- อัปเดต preregistrations ให้ออกจาก gang/family ทั้งหมด
UPDATE preregistrations 
SET gang_id = NULL, family_id = NULL;

-- ลบข้อมูล gang ทั้งหมด
DELETE FROM gangs;

-- ลบข้อมูล family ทั้งหมด
DELETE FROM families;

-- รีเซ็ต Auto Increment (ถ้าต้องการ)
ALTER TABLE gangs AUTO_INCREMENT = 1;
ALTER TABLE families AUTO_INCREMENT = 1;

-- แสดงผลลัพธ์
SELECT 'Gang & Family data cleared successfully!' AS Status;
SELECT COUNT(*) as remaining_gangs FROM gangs;
SELECT COUNT(*) as remaining_families FROM families;
