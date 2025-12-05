-- ===================================
-- Gang/Family Join Requests Table
-- ===================================
-- ตารางเก็บคำขอเข้าร่วมแก๊ง/ครอบครัว ที่รอการอนุมัติ

-- 1. สร้างตารางคำขอเข้าร่วมแก๊ง
CREATE TABLE IF NOT EXISTS gang_join_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gang_id INT NOT NULL,
    discord_id VARCHAR(32) NOT NULL,
    discord_name VARCHAR(100),
    avatar_url TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    processed_by VARCHAR(32) NULL,
    
    INDEX idx_gang_pending (gang_id, status),
    INDEX idx_user_pending (discord_id, status),
    UNIQUE KEY unique_pending_request (gang_id, discord_id, status)
);

-- 2. สร้างตารางคำขอเข้าร่วมครอบครัว
CREATE TABLE IF NOT EXISTS family_join_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    discord_id VARCHAR(32) NOT NULL,
    discord_name VARCHAR(100),
    avatar_url TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    processed_by VARCHAR(32) NULL,
    
    INDEX idx_family_pending (family_id, status),
    INDEX idx_user_pending (discord_id, status),
    UNIQUE KEY unique_pending_request (family_id, discord_id, status)
);

-- 3. แสดงผล
SELECT 'Join request tables created!' AS Status;
