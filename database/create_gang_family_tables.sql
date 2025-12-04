-- ===================================
-- Rank1 City - Gang & Family System Schema
-- สร้างตาราง gangs และ families พร้อม columns ครบถ้วน
-- ===================================

-- ลบตารางเก่าถ้ามี (ระวัง: จะลบข้อมูลทั้งหมด!)
DROP TABLE IF EXISTS gangs;
DROP TABLE IF EXISTS families;

-- ===================================
-- ตาราง gangs (แก๊ง)
-- ===================================
CREATE TABLE gangs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gang_code VARCHAR(20) UNIQUE NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    leader_discord_id VARCHAR(50) NOT NULL,
    member_count INT DEFAULT 1,
    max_members INT DEFAULT 25,
    level INT DEFAULT 1,
    logo_url TEXT,
    motd TEXT COMMENT 'Message of the Day - ประกาศของแก๊ง',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_gang_code (gang_code),
    INDEX idx_invite_code (invite_code),
    INDEX idx_leader (leader_discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- ตาราง families (ครอบครัว)
-- ===================================
CREATE TABLE families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    family_code VARCHAR(20) UNIQUE NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    leader_discord_id VARCHAR(50) NOT NULL,
    member_count INT DEFAULT 1,
    max_members INT DEFAULT 25,
    level INT DEFAULT 1,
    logo_url TEXT,
    motd TEXT COMMENT 'Message of the Day - ประกาศของครอบครัว',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_family_code (family_code),
    INDEX idx_invite_code (invite_code),
    INDEX idx_leader (leader_discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- เพิ่ม/แก้ไข column ในตาราง preregistrations
-- (ถ้ายังไม่มี gang_id และ family_id)
-- ===================================
-- ตรวจสอบและเพิ่ม gang_id ถ้ายังไม่มี
SET @column_exists_gang = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'preregistrations' 
    AND COLUMN_NAME = 'gang_id'
);

SET @sql_gang = IF(
    @column_exists_gang = 0,
    'ALTER TABLE preregistrations ADD COLUMN gang_id INT NULL, ADD FOREIGN KEY (gang_id) REFERENCES gangs(id) ON DELETE SET NULL',
    'SELECT "Column gang_id already exists" AS message'
);

PREPARE stmt FROM @sql_gang;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ตรวจสอบและเพิ่ม family_id ถ้ายังไม่มี
SET @column_exists_family = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'preregistrations' 
    AND COLUMN_NAME = 'family_id'
);

SET @sql_family = IF(
    @column_exists_family = 0,
    'ALTER TABLE preregistrations ADD COLUMN family_id INT NULL, ADD FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL',
    'SELECT "Column family_id already exists" AS message'
);

PREPARE stmt FROM @sql_family;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ===================================
-- แสดงผลลัพธ์
-- ===================================
SELECT 'Gang & Family tables created successfully!' AS Status;

-- แสดง structure ของตาราง
DESCRIBE gangs;
DESCRIBE families;
