-- 1. สร้าง Database (ถ้ายังไม่มี)
CREATE DATABASE IF NOT EXISTS rank1city_web;
USE rank1city_web;

-- 2. สร้างตาราง preregistrations (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS preregistrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(255) NOT NULL UNIQUE,
  discord_name VARCHAR(255) NOT NULL,
  discord_avatar VARCHAR(255),
  citizen_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ให้สิทธิ์ User (แก้ 'root' เป็น User ที่คุณใช้ใน .env ถ้าไม่ใช่ root)
-- หมายเหตุ: ถ้าใช้ root อยู่แล้ว ข้ามข้อนี้ได้ แต่ต้องมั่นใจว่ารหัสผ่านถูก
GRANT ALL PRIVILEGES ON rank1city_web.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
