-- ===================================
-- แก้ไขปัญหา invite_code ใน Gang & Family
-- ===================================

-- ลบ column invite_code เดิม (ถ้ามี)
ALTER TABLE gangs DROP COLUMN IF EXISTS invite_code;
ALTER TABLE families DROP COLUMN IF EXISTS invite_code;

-- เพิ่ม column invite_code ใหม่ด้วย default value
ALTER TABLE gangs 
ADD COLUMN invite_code VARCHAR(20) DEFAULT NULL AFTER gang_code,
ADD UNIQUE INDEX idx_gang_invite_code (invite_code);

ALTER TABLE families 
ADD COLUMN invite_code VARCHAR(20) DEFAULT NULL AFTER family_code,
ADD UNIQUE INDEX idx_family_invite_code (invite_code);

-- อัปเดต invite_code ให้เท่ากับ gang_code/family_code สำหรับข้อมูลเดิม
UPDATE gangs SET invite_code = gang_code WHERE invite_code IS NULL;
UPDATE families SET invite_code = family_code WHERE invite_code IS NULL;

-- ตั้ง invite_code ให้เป็น NOT NULL หลังจากอัปเดตเสร็จ
ALTER TABLE gangs MODIFY invite_code VARCHAR(20) NOT NULL;
ALTER TABLE families MODIFY invite_code VARCHAR(20) NOT NULL;

-- แสดงผลลัพธ์
SELECT 'Gang & Family invite_code fixed successfully!' AS Status;
DESCRIBE gangs;
DESCRIBE families;
