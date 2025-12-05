-- ===============================================
-- Rank1 City Web Database Schema
-- Database: rank1city_web (Port 3307)
-- สร้างโดย: Antigravity
-- วันที่: 2025-12-05
-- ===============================================

-- สร้าง Database
CREATE DATABASE IF NOT EXISTS rank1city_web
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE rank1city_web;

-- ===============================================
-- 1. ตาราง preregistrations (ลงทะเบียนล่วงหน้า)
-- ===============================================
CREATE TABLE IF NOT EXISTS preregistrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(50) NOT NULL UNIQUE COMMENT 'Discord User ID (เช่น 123456789012345678)',
    discord_name VARCHAR(100) COMMENT 'Discord Username',
    firstname VARCHAR(50) DEFAULT NULL COMMENT 'ชื่อจริงในเกม (sync จาก freshtown.users)',
    lastname VARCHAR(50) DEFAULT NULL COMMENT 'นามสกุลในเกม (sync จาก freshtown.users)',
    gang_id INT DEFAULT NULL COMMENT 'FK ไป gangs',
    family_id INT DEFAULT NULL COMMENT 'FK ไป families',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_discord_id (discord_id),
    INDEX idx_fullname (firstname, lastname),
    INDEX idx_gang_id (gang_id),
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 2. ตาราง gangs (แก๊ง)
-- ===============================================
CREATE TABLE IF NOT EXISTS gangs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'ชื่อแก๊ง',
    gang_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'รหัสแก๊ง (เช่น GROVE, BALLAS)',
    invite_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'รหัสเชิญเข้าแก๊ง',
    leader_discord_id VARCHAR(50) NOT NULL COMMENT 'Discord ID ของหัวหน้าแก๊ง',
    member_count INT DEFAULT 1 COMMENT 'จำนวนสมาชิกปัจจุบัน',
    max_members INT DEFAULT 25 COMMENT 'จำนวนสมาชิกสูงสุด',
    level INT DEFAULT 1 COMMENT 'ระดับแก๊ง',
    logo_url TEXT COMMENT 'URL โลโก้แก๊ง',
    motd TEXT COMMENT 'Message of the Day - ประกาศของแก๊ง',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_gang_code (gang_code),
    INDEX idx_invite_code (invite_code),
    INDEX idx_leader (leader_discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 3. ตาราง families (ครอบครัว)
-- ===============================================
CREATE TABLE IF NOT EXISTS families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'ชื่อครอบครัว',
    family_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'รหัสครอบครัว',
    invite_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'รหัสเชิญเข้าครอบครัว',
    leader_discord_id VARCHAR(50) NOT NULL COMMENT 'Discord ID ของหัวหน้าครอบครัว',
    member_count INT DEFAULT 1 COMMENT 'จำนวนสมาชิกปัจจุบัน',
    max_members INT DEFAULT 25 COMMENT 'จำนวนสมาชิกสูงสุด',
    level INT DEFAULT 1 COMMENT 'ระดับครอบครัว',
    logo_url TEXT COMMENT 'URL โลโก้ครอบครัว',
    motd TEXT COMMENT 'Message of the Day - ประกาศของครอบครัว',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_family_code (family_code),
    INDEX idx_invite_code (invite_code),
    INDEX idx_leader (leader_discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 4. ตาราง gang_requests (คำขอเข้าแก๊ง)
-- ===============================================
CREATE TABLE IF NOT EXISTS gang_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gang_id INT NOT NULL COMMENT 'FK ไป gangs',
    discord_id VARCHAR(255) NOT NULL COMMENT 'Discord ID ของผู้ขอ',
    message TEXT COMMENT 'ข้อความจากผู้ขอ',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT 'สถานะคำขอ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_request (gang_id, discord_id),
    FOREIGN KEY (gang_id) REFERENCES gangs(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_discord_id (discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 5. ตาราง family_requests (คำขอเข้าครอบครัว)
-- ===============================================
CREATE TABLE IF NOT EXISTS family_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL COMMENT 'FK ไป families',
    discord_id VARCHAR(255) NOT NULL COMMENT 'Discord ID ของผู้ขอ',
    message TEXT COMMENT 'ข้อความจากผู้ขอ',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT 'สถานะคำขอ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_request (family_id, discord_id),
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_discord_id (discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 6. เพิ่ม Foreign Keys ใน preregistrations
-- ===============================================
-- เพิ่ม FK หลังจากสร้างตาราง gangs และ families แล้ว
ALTER TABLE preregistrations
    ADD CONSTRAINT fk_preregistrations_gang
    FOREIGN KEY (gang_id) REFERENCES gangs(id) ON DELETE SET NULL;

ALTER TABLE preregistrations
    ADD CONSTRAINT fk_preregistrations_family
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL;

-- ===============================================
-- 7. ตาราง activity_logs (Log กิจกรรม) - Optional
-- ===============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(50) NOT NULL COMMENT 'Discord ID ของผู้กระทำ',
    action VARCHAR(50) NOT NULL COMMENT 'ประเภทกิจกรรม (create_gang, join_family, kick_member, etc.)',
    target_type ENUM('gang', 'family', 'user') COMMENT 'ประเภทเป้าหมาย',
    target_id INT COMMENT 'ID ของเป้าหมาย',
    details JSON COMMENT 'รายละเอียดเพิ่มเติมเป็น JSON',
    ip_address VARCHAR(45) COMMENT 'IP Address (รองรับ IPv6)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_discord_id (discord_id),
    INDEX idx_action (action),
    INDEX idx_target (target_type, target_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 8. ตาราง announcements (ประกาศ) - Optional
-- ===============================================
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'หัวข้อประกาศ',
    content TEXT NOT NULL COMMENT 'เนื้อหาประกาศ',
    type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info' COMMENT 'ประเภทประกาศ',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'แสดงผลหรือไม่',
    priority INT DEFAULT 0 COMMENT 'ลำดับความสำคัญ (สูง = แสดงก่อน)',
    starts_at TIMESTAMP NULL COMMENT 'เริ่มแสดงเมื่อ',
    ends_at TIMESTAMP NULL COMMENT 'หยุดแสดงเมื่อ',
    created_by VARCHAR(50) COMMENT 'Discord ID ผู้สร้าง',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active (is_active),
    INDEX idx_priority (priority),
    INDEX idx_dates (starts_at, ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 9. ตาราง user_sessions (Sessions) - Optional
-- ===============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(255) PRIMARY KEY COMMENT 'Session ID',
    discord_id VARCHAR(50) NOT NULL COMMENT 'Discord User ID',
    discord_name VARCHAR(100) COMMENT 'Discord Username',
    discord_avatar VARCHAR(255) COMMENT 'Discord Avatar Hash',
    access_token TEXT COMMENT 'Discord OAuth Access Token (encrypted)',
    refresh_token TEXT COMMENT 'Discord OAuth Refresh Token (encrypted)',
    ip_address VARCHAR(45) COMMENT 'IP Address',
    user_agent TEXT COMMENT 'Browser User Agent',
    expires_at TIMESTAMP NOT NULL COMMENT 'เวลาหมดอายุ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_discord_id (discord_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Stored Procedures
-- ===============================================

-- Procedure: Update gang member count
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_update_gang_member_count(IN p_gang_id INT)
BEGIN
    UPDATE gangs 
    SET member_count = (
        SELECT COUNT(*) FROM preregistrations WHERE gang_id = p_gang_id
    )
    WHERE id = p_gang_id;
END //
DELIMITER ;

-- Procedure: Update family member count
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_update_family_member_count(IN p_family_id INT)
BEGIN
    UPDATE families 
    SET member_count = (
        SELECT COUNT(*) FROM preregistrations WHERE family_id = p_family_id
    )
    WHERE id = p_family_id;
END //
DELIMITER ;

-- Procedure: Clean expired sessions
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_clean_expired_sessions()
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END //
DELIMITER ;

-- ===============================================
-- Views
-- ===============================================

-- View: Gang with member details
CREATE OR REPLACE VIEW v_gangs_with_members AS
SELECT 
    g.id,
    g.name,
    g.gang_code,
    g.invite_code,
    g.leader_discord_id,
    g.member_count,
    g.max_members,
    g.level,
    g.logo_url,
    g.motd,
    g.created_at,
    (SELECT COUNT(*) FROM gang_requests WHERE gang_id = g.id AND status = 'pending') AS pending_requests
FROM gangs g;

-- View: Family with member details
CREATE OR REPLACE VIEW v_families_with_members AS
SELECT 
    f.id,
    f.name,
    f.family_code,
    f.invite_code,
    f.leader_discord_id,
    f.member_count,
    f.max_members,
    f.level,
    f.logo_url,
    f.motd,
    f.created_at,
    (SELECT COUNT(*) FROM family_requests WHERE family_id = f.id AND status = 'pending') AS pending_requests
FROM families f;

-- View: User registration status
CREATE OR REPLACE VIEW v_user_status AS
SELECT 
    p.discord_id,
    p.discord_name,
    p.firstname,
    p.lastname,
    CONCAT(p.firstname, ' ', p.lastname) AS full_name,
    g.name AS gang_name,
    g.gang_code,
    f.name AS family_name,
    f.family_code,
    p.registered_at
FROM preregistrations p
LEFT JOIN gangs g ON p.gang_id = g.id
LEFT JOIN families f ON p.family_id = f.id;

-- ===============================================
-- Default Grants (ปรับตาม username ที่ใช้)
-- ===============================================
-- GRANT ALL PRIVILEGES ON rank1city_web.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;

-- ===============================================
-- แสดงผลลัพธ์
-- ===============================================
SELECT 'Rank1 City Web Database Schema created successfully!' AS Status;
SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH 
FROM information_schema.tables 
WHERE table_schema = 'rank1city_web';
