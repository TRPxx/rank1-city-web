# 🛡️ สรุประบบแก๊ง (Gang System) - Rank1 City Web

## 📋 ภาพรวมระบบ

ระบบแก๊งเป็นฟีเจอร์ที่ให้ผู้เล่นสามารถ:
- ✅ สร้างแก๊งของตัวเอง
- ✅ เข้าร่วมแก๊งผ่านรหัสแก๊ง
- ✅ ดูข้อมูลแก๊งของตัวเอง
- ✅ จำกัดจำนวนสมาชิกสูงสุด (max_members)

---

## 🗄️ โครงสร้างฐานข้อมูล

### 📊 ตาราง `gangs`

```sql
CREATE TABLE IF NOT EXISTS `gangs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'ชื่อแก๊ง',
  `gang_code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'รหัสแก๊ง (เช่น GANG-A1B2)',
  `leader_discord_id` VARCHAR(255) NOT NULL COMMENT 'Discord ID ของหัวหน้าแก๊ง',
  `member_count` INT(11) NOT NULL DEFAULT 0 COMMENT 'จำนวนสมาชิกปัจจุบัน',
  `max_members` INT(11) NOT NULL DEFAULT 50 COMMENT 'จำนวนสมาชิกสูงสุด',
  `description` TEXT NULL COMMENT 'คำอธิบายแก๊ง (อนาคต)',
  `level` INT(11) NOT NULL DEFAULT 1 COMMENT 'ระดับแก๊ง (อนาคต)',
  `experience` INT(11) NOT NULL DEFAULT 0 COMMENT 'ประสบการณ์แก๊ง (อนาคต)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_gang_code` (`gang_code`),
  KEY `idx_leader` (`leader_discord_id`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 📊 ตาราง `preregistrations` (เพิ่ม column gang_id)

```sql
-- เพิ่ม column gang_id ในตาราง preregistrations
ALTER TABLE `preregistrations` 
ADD COLUMN `gang_id` INT(11) NULL DEFAULT NULL COMMENT 'ID ของแก๊งที่สมาชิกอยู่' AFTER `referral_code`,
ADD KEY `idx_gang_id` (`gang_id`),
ADD CONSTRAINT `fk_gang_id` 
  FOREIGN KEY (`gang_id`) 
  REFERENCES `gangs`(`id`) 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;
```

### 📊 ตาราง `families` (สำหรับอนาคต)

```sql
CREATE TABLE IF NOT EXISTS `families` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'ชื่อครอบครัว',
  `family_code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'รหัสครอบครัว',
  `leader_discord_id` VARCHAR(255) NOT NULL,
  `member_count` INT(11) NOT NULL DEFAULT 0,
  `max_members` INT(11) NOT NULL DEFAULT 20,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_family_code` (`family_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔄 API Endpoints

### 1️⃣ **POST /api/gang** - สร้างหรือเข้าร่วมแก๊ง

#### **สร้างแก๊งใหม่:**
```javascript
// Request
POST /api/gang
{
  "action": "create",
  "name": "Rank1 Warriors"
}

// Response Success
{
  "success": true,
  "message": "Gang created",
  "gangCode": "GANG-A1B2"
}

// Response Error
{
  "error": "You are already in a gang"
}
```

#### **เข้าร่วมแก๊ง:**
```javascript
// Request
POST /api/gang
{
  "action": "join",
  "gangCode": "GANG-A1B2"
}

// Response Success
{
  "success": true,
  "message": "Joined gang successfully"
}

// Response Error
{
  "error": "Gang is full"
}
{
  "error": "Gang not found"
}
```

### 2️⃣ **GET /api/gang** - ดูข้อมูลแก๊งของตัวเอง

```javascript
// Response (มีแก๊ง)
{
  "hasGang": true,
  "gang": {
    "name": "Rank1 Warriors",
    "gang_code": "GANG-A1B2",
    "member_count": 15,
    "max_members": 50,
    "leader_discord_id": "123456789012345678"
  }
}

// Response (ไม่มีแก๊ง)
{
  "hasGang": false
}
```

---

## ⚙️ ฟีเจอร์หลัก

### ✅ **การสร้างแก๊ง**
1. ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้ว
2. ตรวจสอบว่ายังไม่อยู่ในแก๊งใด
3. สร้าง gang_code แบบสุ่ม (รูปแบบ: `GANG-XXXX`)
4. บันทึกข้อมูลแก๊งใหม่
5. กำหนด gang_id ให้กับผู้สร้าง
6. ตั้งค่า member_count = 1

### ✅ **การเข้าร่วมแก๊ง**
1. ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้ว
2. ตรวจสอบว่ายังไม่อยู่ในแก๊งใด
3. ค้นหาแก๊งด้วย gang_code
4. ตรวจสอบว่าแก๊งยังไม่เต็ม (member_count < max_members)
5. เพิ่ม member_count += 1
6. กำหนด gang_id ให้กับผู้เข้าร่วม

### ✅ **การดูข้อมูลแก๊ง**
1. JOIN ระหว่าง preregistrations กับ gangs
2. ดึงข้อมูล: ชื่อ, รหัส, จำนวนสมาชิก, หัวหน้า

---

## 🔧 การทำงานของโค้ด

### 📝 **Gang Code Generator**
```javascript
function generateGangCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'GANG-';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code; // เช่น: GANG-A1B2, GANG-XY7Z
}
```

### 🔒 **Transaction Safety**
- ใช้ `beginTransaction()` และ `commit()` เพื่อความปลอดภัยของข้อมูล
- หาก error เกิดขึ้นจะ `rollback()` ทันที
- ป้องกันการสร้างแก๊งซ้ำหรือเข้าแก๊งซ้ำ

---

## 📊 Admin Dashboard Integration

### ดูรายการแก๊งทั้งหมด (Social Tab)
```javascript
// API: GET /api/admin?type=gangs&page=1&limit=20&q=search

// Response
{
  "gangs": [
    {
      "id": 1,
      "name": "Rank1 Warriors",
      "gang_code": "GANG-A1B2",
      "leader_discord_id": "123456789012345678",
      "member_count": 15,
      "max_members": 50,
      "created_at": "2025-12-04T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### ดูข้อมูลผู้ใช้พร้อมแก๊ง
```javascript
// API: GET /api/admin?q=DISCORD_ID

// ข้อมูลจะรวม gang_name จาก JOIN
{
  "users": [
    {
      "discord_id": "123456789012345678",
      "discord_name": "Bear",
      "gang_id": 1,
      "gang_name": "Rank1 Warriors",
      // ... other fields
    }
  ]
}
```

---

## 🎯 Use Cases

### 1️⃣ **ผู้เล่นสร้างแก๊งใหม่**
```
1. ผู้เล่นคลิก "สร้างแก๊ง"
2. กรอกชื่อแก๊ง: "Rank1 Warriors"
3. System สร้าง gang_code: "GANG-A1B2"
4. ผู้เล่นกลายเป็นหัวหน้าแก๊ง
5. แชร์ gang_code ให้เพื่อน
```

### 2️⃣ **เพื่อนเข้าร่วมแก๊ง**
```
1. เพื่อนคลิก "เข้าร่วมแก๊ง"
2. กรอก gang_code: "GANG-A1B2"
3. System ตรวจสอบว่าไม่เต็ม
4. เพื่อนเข้าร่วมสำเร็จ
5. member_count เพิ่มขึ้น
```

### 3️⃣ **Admin ดูแก๊งทั้งหมด**
```
1. Admin เข้าหน้า Social Tab
2. เห็นรายการแก๊งทั้งหมด
3. ค้นหาแก๊งด้วยชื่อหรือรหัส
4. ดูจำนวนสมาชิกแต่ละแก๊ง
```

---

## ⚠️ ข้อจำกัดและกฎเกณฑ์

1. ✅ **1 User = 1 Gang**: ผู้ใช้สามารถอยู่ได้แค่ 1 แก๊งเท่านั้น
2. ✅ **Gang Name Validation**: ชื่อแก๊งต้องมีอย่างน้อย 3 ตัวอักษร
3. ✅ **Member Limit**: แต่ละแก๊งมีที่จำกัด (default: 50 คน)
4. ✅ **Unique Gang Code**: รหัสแก๊งไม่ซ้ำกัน
5. ✅ **Leader Tracking**: เก็บข้อมูลหัวหน้าแก๊งไว้
6. ⚠️ **No Leave Function Yet**: ยังไม่มีระบบออกจากแก๊ง (ต้องเพิ่มภายหลัง)

---

## 🔮 ฟีเจอร์ที่วางแผนไว้ (Future)

### 1️⃣ **Gang Levels & Experience**
- แก๊งมีระดับและประสบการณ์
- ปลดล็อกสิทธิพิเศษตามระดับ

### 2️⃣ **Gang Wars**
- สงครามระหว่างแก๊ง
- ระบบคะแนนและอันดับ

### 3️⃣ **Gang Bank**
- ธนาคารแก๊งสำหรับเก็บทรัพยากรร่วมกัน

### 4️⃣ **Gang Permissions**
- ระบบตำแหน่ง (Leader, Officer, Member)
- สิทธิ์การจัดการแตกต่างกัน

### 5️⃣ **Leave/Kick System**
- ผู้เล่นสามารถออกจากแก๊งได้
- หัวหน้าสามารถเตะสมาชิกออกได้

### 6️⃣ **Family System Integration**
- แก๊งหลายแก๊งรวมตัวกันเป็น Family
- ใช้ตาราง `families` ที่มีอยู่แล้ว

---

## 🛠️ SQL Queries สำหรับ Admin/Dev

### ดูแก๊งทั้งหมดพร้อมจำนวนสมาชิก
```sql
SELECT 
    g.id,
    g.name,
    g.gang_code,
    g.member_count,
    g.max_members,
    g.leader_discord_id,
    p.discord_name as leader_name,
    g.created_at
FROM gangs g
LEFT JOIN preregistrations p ON g.leader_discord_id = p.discord_id
ORDER BY g.member_count DESC;
```

### ดูสมาชิกทั้งหมดของแก๊งหนึ่ง
```sql
SELECT 
    p.discord_id,
    p.discord_name,
    p.avatar_url,
    p.created_at as joined_date
FROM preregistrations p
WHERE p.gang_id = ? -- gang ID
ORDER BY p.created_at ASC;
```

### แก๊งที่มีสมาชิกมากที่สุด Top 10
```sql
SELECT 
    g.name,
    g.gang_code,
    g.member_count,
    g.max_members,
    ROUND((g.member_count / g.max_members) * 100, 2) as fill_percentage
FROM gangs g
ORDER BY g.member_count DESC
LIMIT 10;
```

### แก๊งที่ใกล้เต็ม
```sql
SELECT 
    g.name,
    g.gang_code,
    g.member_count,
    g.max_members,
    (g.max_members - g.member_count) as slots_left
FROM gangs g
WHERE g.member_count >= (g.max_members - 5)
ORDER BY slots_left ASC;
```

### แก๊งที่ไม่มีสมาชิกเลย (เพื่อลบทิ้ง)
```sql
SELECT 
    g.id,
    g.name,
    g.gang_code,
    g.created_at
FROM gangs g
WHERE g.member_count = 0
ORDER BY g.created_at ASC;
```

### แก้ไข member_count ที่ผิดพลาด (Reconciliation)
```sql
-- ตรวจสอบความถูกต้อง
SELECT 
    g.id,
    g.name,
    g.member_count as stored_count,
    COUNT(p.discord_id) as actual_count,
    (g.member_count - COUNT(p.discord_id)) as difference
FROM gangs g
LEFT JOIN preregistrations p ON g.id = p.gang_id
GROUP BY g.id
HAVING difference != 0;

-- แก้ไขให้ถูกต้อง
UPDATE gangs g
SET g.member_count = (
    SELECT COUNT(*) 
    FROM preregistrations p 
    WHERE p.gang_id = g.id
);
```

---

## 📝 ตัวอย่างการใช้งานใน Frontend

### สร้างแก๊ง
```javascript
const createGang = async (gangName) => {
  const res = await fetch('/api/gang', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      name: gangName
    })
  });
  
  const data = await res.json();
  if (data.success) {
    alert(`แก๊งสร้างเรียบร้อย! รหัสแก๊ง: ${data.gangCode}`);
  } else {
    alert(`Error: ${data.error}`);
  }
};
```

### เข้าร่วมแก๊ง
```javascript
const joinGang = async (gangCode) => {
  const res = await fetch('/api/gang', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'join',
      gangCode: gangCode
    })
  });
  
  const data = await res.json();
  if (data.success) {
    alert('เข้าร่วมแก๊งสำเร็จ!');
  } else {
    alert(`Error: ${data.error}`);
  }
};
```

---

## 🎯 สรุป

ระบบแก๊งของ Rank1 City เป็นระบบที่:
- ✅ **Simple & Robust**: ใช้งานง่าย มีความปลอดภัยด้วย transactions
- ✅ **Scalable**: รองรับแก๊งได้หลายพันแก๊ง
- ✅ **Admin-Friendly**: มี Social Tab สำหรับดูข้อมูลแก๊งทั้งหมด
- ✅ **Future-Proof**: มี columns สำหรับ levels, experience, description ที่จะใช้ในอนาคต
- ⚠️ **Need Enhancement**: ควรเพิ่ม Leave/Kick system และ Gang Permissions

**Database Status:** ✅ Ready to deploy with provided SQL
**API Status:** ✅ Fully functional
**Admin Panel:** ✅ Integrated in Social Tab
**Mobile Support:** ✅ Responsive design

---

**Created by:** Bear (TeeGa)  
**Last Updated:** 2025-12-04  
**Version:** 1.0
