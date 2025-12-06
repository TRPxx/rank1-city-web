# 🎮 Rank1 City - Pre-Registration Website

> เว็บไซต์ลงทะเบียนล่วงหน้าสำหรับ Rank1 City FiveM Server

---

## 📋 สารบัญ

1. [ภาพรวมระบบ](#-ภาพรวมระบบ)
2. [การติดตั้ง](#-การติดตั้ง)
3. [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
4. [Database Schema](#-database-schema)
5. [API Reference](#-api-reference)
6. [Security](#-security)

---

## 🌐 ภาพรวมระบบ

### เทคโนโลยี
| เทคโนโลยี | รายละเอียด |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | MySQL |
| **Authentication** | NextAuth.js (Discord OAuth) |
| **Animation** | Framer Motion |

### โครงสร้างโปรเจค
```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication
│   │   ├── gang/          # Gang System
│   │   ├── family/        # Family System
│   │   └── preregister/   # Pre-registration
│   ├── profile/           # User Profile
│   └── admin/             # Admin Dashboard
├── components/            # React Components
│   ├── ui/               # shadcn/ui Components
│   ├── GangManager.js    # Gang Management
│   ├── FamilyManager.js  # Family Management
│   └── LuckyDraw.js      # Lucky Draw System
├── lib/                  # Utilities & Database
└── public/               # Static Assets
```

---

## 🚀 การติดตั้ง

### 1. Clone และติดตั้ง Dependencies
```bash
git clone https://github.com/TRPxx/rank1-city-web.git
cd rank1-city-web
npm install
```

### 2. สร้างไฟล์ .env
```env
# Database
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=rank1city_web

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Discord OAuth
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret

# Discord Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 3. Setup Database
```sql
-- สร้าง Database
CREATE DATABASE rank1city_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ตาราง preregistrations
CREATE TABLE preregistrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(50) NOT NULL UNIQUE,
    discord_name VARCHAR(100),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    gang_id INT,
    family_id INT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง gangs
CREATE TABLE gangs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gang_code VARCHAR(20) UNIQUE NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    leader_discord_id VARCHAR(50) NOT NULL,
    member_count INT DEFAULT 1,
    max_members INT DEFAULT 25,
    logo_url TEXT,
    motd TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง families
CREATE TABLE families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    family_code VARCHAR(20) UNIQUE NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    leader_discord_id VARCHAR(50) NOT NULL,
    member_count INT DEFAULT 1,
    max_members INT DEFAULT 25,
    logo_url TEXT,
    motd TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง gang_requests
CREATE TABLE gang_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gang_id INT NOT NULL,
    discord_id VARCHAR(255) NOT NULL,
    message TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (gang_id, discord_id),
    FOREIGN KEY (gang_id) REFERENCES gangs(id) ON DELETE CASCADE
);

-- ตาราง family_requests
CREATE TABLE family_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    discord_id VARCHAR(255) NOT NULL,
    message TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (family_id, discord_id),
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);
```

### 4. รันโปรเจค
```bash
npm run dev
```

---

## ✨ ฟีเจอร์หลัก

### 🔐 Authentication
- Discord OAuth Login
- Session Management ด้วย NextAuth.js

### 📝 Pre-Registration
- ลงทะเบียนตัวละครล่วงหน้า
- เก็บข้อมูล Discord ID, ชื่อ-นามสกุลตัวละคร

### ⚔️ ระบบแก๊ง (Gang System)
| ฟีเจอร์ | รายละเอียด |
|--------|-----------|
| สร้างแก๊ง | ชื่อ 3-20 ตัวอักษร, โลโก้, รหัสเชิญอัตโนมัติ |
| เข้าร่วม | ใช้รหัสเชิญ, สูงสุด 25 คน |
| จัดการสมาชิก | เตะสมาชิก, ดูรายชื่อ (หัวหน้าเท่านั้น) |
| ตั้งค่า | เปลี่ยนชื่อ, โลโก้, MOTD, ยุบแก๊ง |

### 👨‍👩‍👧‍👦 ระบบครอบครัว (Family System)
- โครงสร้างเหมือนแก๊ง แต่ใช้ธีมครอบครัว
- รหัสเชิญ: `FAM-XXXXXX`

### 🎨 ระบบ Tier
| สมาชิก | ชื่อ Tier | สี |
|--------|----------|-----|
| 1-9 | เริ่มต้น | 🔵 น้ำเงิน |
| 10-14 | ก่อร่าง | 🟢 เขียว |
| 15-19 | เติบโต | 🟣 ม่วง |
| 20-24 | อิทธิพล | 🟠 ส้ม |
| 25+ | ตำนาน | 🔴 แดง |

### 👤 หน้าโปรไฟล์
- ดูข้อมูลตัวละคร (เงิน, อาชีพ, ข้อมูลส่วนตัว)
- Inventory, อาวุธ, ตู้เซฟ, ของขวัญ
- รองรับทั้ง Desktop และ Mobile

---

## 📊 Database Schema

### ตารางหลัก
1. **preregistrations** - ข้อมูลผู้ลงทะเบียน
2. **gangs** - ข้อมูลแก๊ง
3. **families** - ข้อมูลครอบครัว
4. **gang_requests** - คำขอเข้าแก๊ง
5. **family_requests** - คำขอเข้าครอบครัว
6. **activity_logs** - Log กิจกรรม (Optional)

### Views
- `v_gangs_with_members` - แก๊งพร้อมจำนวนคำขอ pending
- `v_families_with_members` - ครอบครัวพร้อมจำนวนคำขอ pending
- `v_user_status` - สถานะผู้ใช้พร้อมแก๊ง/ครอบครัว

### Stored Procedures
- `sp_update_gang_member_count` - อัพเดทจำนวนสมาชิกแก๊ง
- `sp_update_family_member_count` - อัพเดทจำนวนสมาชิกครอบครัว
- `sp_clean_expired_sessions` - ลบ sessions หมดอายุ

---

## 📡 API Reference

### Gang API
| Method | Endpoint | Action |
|--------|----------|--------|
| GET | `/api/gang` | ดึงข้อมูลแก๊ง |
| POST | `/api/gang` | สร้าง/จัดการแก๊ง |
| GET | `/api/gang/members` | ดึงรายชื่อสมาชิก |

**Actions:**
```javascript
{ action: 'create', name: 'ชื่อแก๊ง', logoUrl: 'URL' }
{ action: 'join', inviteCode: 'GANG-XXXXXX' }
{ action: 'update_settings', name: 'ชื่อใหม่', motd: 'ประกาศ' }
{ action: 'kick_member', targetDiscordId: 'Discord ID' }
{ action: 'leave' }
{ action: 'dissolve' }
```

### Family API
| Method | Endpoint | Action |
|--------|----------|--------|
| GET | `/api/family` | ดึงข้อมูลครอบครัว |
| POST | `/api/family` | สร้าง/จัดการครอบครัว |
| GET | `/api/family/members` | ดึงรายชื่อสมาชิก |

---

## 🔒 Security

### ✅ Security Features ที่ใช้งาน
1. **Atomic UPDATE** - ป้องกัน race condition ใน join gang/family
2. **Unique Code Generation** - retry loop ป้องกันรหัสซ้ำ
3. **Rate Limiting** - 10 requests ต่อนาที สำหรับ gang/family APIs
4. **URL Whitelist** - อนุญาตเฉพาะ pic.in.th, imgur, imgbb, discord
5. **Input Validation** - ชื่อ 3-20 ตัว, เฉพาะตัวอักษร/เลข/ไทย
6. **Smart Rate Limit Cleanup** - ลบเฉพาะ entries หมดอายุ

### Image Domains ที่รองรับ
- `cdn.discordapp.com`
- `*.pic.in.th`
- `i.imgur.com`
- `*.imgbb.com`
- `raw.githubusercontent.com`

---

## 📝 หมายเหตุ

### การอัพเดทในอนาคต
- [ ] ระบบ Leaderboard สำหรับแก๊ง/ครอบครัว
- [ ] ระบบ Achievement
- [ ] ระบบ Chat ภายในแก๊ง/ครอบครัว
- [ ] ระบบ War ระหว่างแก๊ง

### Contact
- **Discord Server**: Rank1 City
- **GitHub**: TRPxx/rank1-city-web

---

> 📅 อัพเดทล่าสุด: 6 ธันวาคม 2567
