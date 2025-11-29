# 🏙️ Rank1 City - Detailed Technical Documentation

เอกสารฉบับนี้รวบรวมรายละเอียดเชิงลึกของระบบ **Rank1 City** ทั้งหมด เหมาะสำหรับ Developer ที่ต้องการเข้าใจการทำงานทุกส่วนประกอบอย่างละเอียด

---

## 📚 สารบัญ (Table of Contents)
1. [System Overview (ภาพรวมระบบ)](#1-system-overview)
2. [Database Schema (โครงสร้างฐานข้อมูล)](#2-database-schema)
3. [API Endpoints (รายการ API)](#3-api-endpoints)
4. [Configuration (การตั้งค่าระบบ)](#4-configuration)
5. [Frontend Architecture (สถาปัตยกรรมหน้าบ้าน)](#5-frontend-architecture)
6. [Security Implementation (ระบบความปลอดภัย)](#6-security-implementation)
7. [Deployment & Environment (การติดตั้ง)](#7-deployment--environment)

---

## 1. System Overview

**Rank1 City Website** คือเว็บแอปพลิเคชันแบบ Single Page Application (SPA) ที่สร้างด้วย **Next.js 14** (App Router) โดยเน้นประสิทธิภาพ (Performance) และความสวยงาม (Aesthetics) สูงสุด

*   **Core Framework**: Next.js 14
*   **Language**: JavaScript (ES6+)
*   **Styling**: Tailwind CSS, Shadcn UI
*   **Animation**: Framer Motion (LazyMotion)
*   **Database**: MySQL (InnoDB Engine)
*   **Auth**: NextAuth.js (Discord Provider)

---

## 2. Database Schema

ระบบใช้ฐานข้อมูล MySQL โดยมีตารางหลักดังนี้:

### 2.1 Table: `preregistrations`
เก็บข้อมูลการลงทะเบียนของผู้เล่นทุกคน
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto Increment ID |
| `discord_id` | VARCHAR(255) | Discord ID (Unique) |
| `referral_code` | VARCHAR(10) | โค้ดแนะนำเพื่อน (เช่น `R1-ABC123`) |
| `referred_by` | VARCHAR(10) | โค้ดของคนที่แนะนำมา (Nullable) |
| `invite_count` | INT | จำนวนเพื่อนที่ชวนได้ (Default: 0) |
| `ticket_count` | INT | จำนวนตั๋วสุ่มกาชา (Default: 0) |
| `gang_id` | INT | FK เชื่อมไปยังตาราง `gangs` |
| `ip_address` | VARCHAR(45) | IP Address ล่าสุดที่ลงทะเบียน |
| `created_at` | TIMESTAMP | เวลาที่ลงทะเบียน |

### 2.2 Table: `gangs`
เก็บข้อมูลแก๊งที่ถูกสร้างขึ้น
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto Increment ID |
| `name` | VARCHAR(255) | ชื่อแก๊ง |
| `leader_id` | VARCHAR(255) | Discord ID ของหัวหน้าแก๊ง |
| `token` | VARCHAR(20) | รหัสสำหรับเข้าร่วมแก๊ง |
| `member_count` | INT | จำนวนสมาชิกปัจจุบัน |

### 2.3 Table: `lucky_draw_history`
เก็บประวัติการสุ่มรางวัล
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto Increment ID |
| `discord_id` | VARCHAR(255) | Discord ID ผู้สุ่ม |
| `reward_id` | VARCHAR(50) | ID ของรางวัล (ตาม Config) |
| `reward_name` | VARCHAR(255) | ชื่อรางวัล |
| `rarity` | ENUM | ระดับความหายาก ('COMMON', 'RARE', 'EPIC', 'LEGENDARY') |
| `created_at` | TIMESTAMP | เวลาที่สุ่ม |

---

## 3. API Endpoints

API ทั้งหมดอยู่ภายใต้ path `/api/` และมีการตรวจสอบ Session ก่อนทำงานเสมอ

### 3.1 Pre-registration
*   **POST** `/api/preregister`
    *   **Description**: ลงทะเบียนผู้เล่นใหม่
    *   **Body**: `{ "referralCode": "OPTIONAL_CODE" }`
    *   **Logic**:
        1. ตรวจสอบว่าเคยลงทะเบียนหรือยัง
        2. สร้าง Referral Code ใหม่ให้ผู้ใช้
        3. ถ้ามี `referralCode` ของเพื่อน -> เพิ่ม `invite_count` และ `ticket_count` ให้เพื่อน
        4. บันทึกข้อมูลลง DB
    *   **Response**: `{ success: true, myCode: "..." }`

*   **GET** `/api/preregister`
    *   **Description**: ดึงข้อมูลสถานะของผู้ใช้ปัจจุบัน
    *   **Response**: `{ isRegistered: true, inviteCount: 5, ticketCount: 2, ... }`

### 3.2 Lucky Draw
*   **POST** `/api/luckydraw`
    *   **Description**: สุ่มรางวัล 1 ครั้ง
    *   **Logic**:
        1. ตรวจสอบว่ามี `ticket_count` > 0 หรือไม่
        2. สุ่มรางวัลตาม Weight ที่กำหนดใน Config
        3. ลด `ticket_count` - 1
        4. บันทึกประวัติลง `lucky_draw_history`
    *   **Response**: `{ reward: { name: "Money", rarity: "COMMON", ... } }`

*   **GET** `/api/luckydraw`
    *   **Description**: ดึงประวัติการสุ่ม 20 รายการล่าสุดของผู้ใช้
    *   **Response**: `{ history: [...] }`

### 3.3 Global Stats
*   **GET** `/api/preregister/stats`
    *   **Description**: ดึงยอดผู้ลงทะเบียนรวมทั้งเซิร์ฟเวอร์
    *   **Response**: `{ total: 1234 }`

---

## 4. Configuration

การตั้งค่าระบบทั้งหมดรวมศูนย์อยู่ที่ `lib/preregister-config.json`

### **Rewards Configuration**
กำหนดรายการของรางวัลและโอกาสออก (Chance) เป็นเปอร์เซ็นต์:
```json
"luckyDraw": {
    "items": [
        {
            "id": "god_sword",
            "name": "God Slayer Sword",
            "chance": 0.4,
            "rarity": "LEGENDARY",
            "image": "/images/rewards/fantasy_sword.png"
        },
        // ... รายการอื่นๆ
    ]
}
```

### **System Limits**
*   `max_gang_members`: 20 คน
*   `max_ip_regis`: 3 ไอดีต่อ 1 IP (เพื่อป้องกันการปั๊ม)

---

## 5. Frontend Architecture

### **Component Structure**
*   `app/page.js`: Server Component หลัก ทำหน้าที่ Fetch Config เริ่มต้น
*   `components/HomeClient.js`: Client Component หลัก ควบคุม State ทั้งหมดของหน้าแรก
*   `components/LuckyDraw.js`: Component แสดงผลตู้กาชา (แยก Logic ไปที่ Hook)
*   `components/PreRegisterDashboard.js`: Dashboard รวม (Invite, Gang, LuckyDraw)

### **State Management**
*   **Global State**: ไม่ใช้ Redux/Zustand แต่ใช้ **React Context** (ผ่าน `SessionProvider` ของ NextAuth)
*   **Local State**: ใช้ `useState` ร่วมกับ Custom Hooks
    *   `usePreregisterStatus`: จัดการสถานะการลงทะเบียนและยอด Invite
    *   `useLuckyDraw`: จัดการ Animation และผลลัพธ์การสุ่ม

### **Animation Strategy**
*   ใช้ **Framer Motion** แบบ `LazyMotion` เพื่อลด Bundle Size
*   โหลดฟีเจอร์ Animation (`domAnimation`) เฉพาะเมื่อ Component ถูก Render

---

## 6. Security Implementation

1.  **Authentication**:
    *   ใช้ Discord OAuth2 เท่านั้น (ไม่มี Email/Password)
    *   Session ถูกเข้ารหัสและเก็บใน Cookie (HttpOnly)

2.  **Database Safety**:
    *   ใช้ **Connection Pooling** เพื่อรองรับ Load สูง
    *   ใช้ **Transaction** (`beginTransaction`, `commit`, `rollback`) ในการลงทะเบียนและสุ่มรางวัล เพื่อป้องกัน Data Inconsistency
    *   ใช้ **Parameterized Queries** (`?`) ป้องกัน SQL Injection

3.  **Rate Limiting & Anti-Cheat**:
    *   ตรวจสอบ IP Address (`x-forwarded-for`)
    *   ตรวจสอบอายุบัญชี Discord (ถ้า Config เปิดใช้งาน)

---

## 7. Deployment & Environment

### **Environment Variables (.env)**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=...
DB_NAME=es_extended

# Discord Auth
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

### **Build & Run**
```bash
# 1. Install
npm install

# 2. Build for Production
npm run build

# 3. Start Server
npm start
```

---
*เอกสารฉบับนี้เป็นลิขสิทธิ์ของ Rank1 Development ห้ามเผยแพร่ภายนอกโดยไม่ได้รับอนุญาต*
