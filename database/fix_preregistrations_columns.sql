-- ===============================================
-- Fix preregistrations table - Add missing columns
-- สำหรับแก้ไข Internal Server Error ตอนลงทะเบียน
-- วันที่: 2025-12-06
-- ===============================================

USE rank1city_web;

-- เพิ่มคอลัมน์ที่หายไป (ใช้ IF NOT EXISTS pattern)

-- 1. referral_code
SET @col_referral = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'rank1city_web' AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'referral_code');
SET @sql_referral = IF(@col_referral = 0, 'ALTER TABLE preregistrations ADD COLUMN referral_code VARCHAR(20) UNIQUE NULL COMMENT ''รหัสแนะนำของผู้ใช้''', 'SELECT ''referral_code already exists'' AS status');
PREPARE stmt FROM @sql_referral; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. referred_by
SET @col_referred = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'rank1city_web' AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'referred_by');
SET @sql_referred = IF(@col_referred = 0, 'ALTER TABLE preregistrations ADD COLUMN referred_by VARCHAR(20) NULL COMMENT ''รหัสแนะนำที่ใช้ลงทะเบียน''', 'SELECT ''referred_by already exists'' AS status');
PREPARE stmt FROM @sql_referred; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. invite_count
SET @col_invite = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'rank1city_web' AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'invite_count');
SET @sql_invite = IF(@col_invite = 0, 'ALTER TABLE preregistrations ADD COLUMN invite_count INT DEFAULT 0 COMMENT ''จำนวนคนที่เชิญได้''', 'SELECT ''invite_count already exists'' AS status');
PREPARE stmt FROM @sql_invite; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 4. ticket_count
SET @col_ticket = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'rank1city_web' AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'ticket_count');
SET @sql_ticket = IF(@col_ticket = 0, 'ALTER TABLE preregistrations ADD COLUMN ticket_count INT DEFAULT 0 COMMENT ''จำนวน ticket ที่มี''', 'SELECT ''ticket_count already exists'' AS status');
PREPARE stmt FROM @sql_ticket; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 5. avatar_url
SET @col_avatar = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'rank1city_web' AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'avatar_url');
SET @sql_avatar = IF(@col_avatar = 0, 'ALTER TABLE preregistrations ADD COLUMN avatar_url TEXT NULL COMMENT ''Discord Avatar URL''', 'SELECT ''avatar_url already exists'' AS status');
PREPARE stmt FROM @sql_avatar; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 6. ip_address
SET @col_ip = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'rank1city_web' AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'ip_address');
SET @sql_ip = IF(@col_ip = 0, 'ALTER TABLE preregistrations ADD COLUMN ip_address VARCHAR(45) NULL COMMENT ''IP Address ที่ลงทะเบียน''', 'SELECT ''ip_address already exists'' AS status');
PREPARE stmt FROM @sql_ip; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- เพิ่ม Index สำหรับ referral_code
-- (ถ้า UNIQUE ยังไม่ได้สร้างพร้อม column)
-- ALTER TABLE preregistrations ADD INDEX idx_referral_code (referral_code);

-- ===============================================
-- แสดงโครงสร้างตารางหลังแก้ไข
-- ===============================================
SELECT 'Preregistrations table columns fixed!' AS Status;
DESCRIBE preregistrations;
