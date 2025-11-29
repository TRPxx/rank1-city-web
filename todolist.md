# To-Do List: ระบบลงทะเบียนผู้เล่นใหม่ผ่านหน้าเว็บ (Web-Based Registration & FiveM Integration)

เอกสารนี้รวบรวมขั้นตอนการพัฒนาระบบลงทะเบียนผ่านเว็บไซต์ และเชื่อมต่อกับเซิร์ฟเวอร์ FiveM (ESX Legacy) เพื่อให้ผู้เล่นต้องลงทะเบียนก่อนเข้าเกม

## Concept การทำงาน
1.  **Web**: ผู้เล่น Login Discord -> กรอกข้อมูล -> บันทึกลง DB (โดยใช้ `discord_id` เป็นหลัก, `identifier` เป็น `web_pending:...`)
2.  **FiveM**: ผู้เล่นเข้าเกม -> Server เช็ค `discord_id`
    -   **กรณีลงทะเบียนแล้ว**: ระบบจะ Update `identifier` (License) ของผู้เล่นลงใน DB ให้ตรงกับข้อมูลที่ลงทะเบียนไว้ -> เข้าเกมได้
    -   **กรณียังไม่ลงทะเบียน**: ระบบจะเตะออกจากเซิร์ฟเวอร์ (Kick) พร้อมแจ้งให้ไปลงทะเบียนที่เว็บ

---

## Phase 1: Web Development (Frontend & Backend)
### 1.1 ปรับปรุง API Register (`/app/api/user/register/route.js`)
- [x] **แก้ไข Logic การบันทึกข้อมูล**:
    -   ใช้ `web_pending:discord_id` เป็น identifier ชั่วคราว
    -   Generate `ssn` (Unique) ตามมาตรฐาน ESX Legacy (XXX-XX-XXXX)
    -   บันทึก `discord_id` ให้ถูกต้อง
    -   ตรวจสอบความซ้ำซ้อนก่อนบันทึก

### 1.2 ปรับปรุงหน้า Register (`/app/register/page.js`)
- [x] **เพิ่มคำอธิบาย**: แจ้งผู้เล่นว่า "เมื่อลงทะเบียนเสร็จแล้ว สามารถเข้าเกมได้ทันที"
- [x] **Validation**: ตรวจสอบข้อมูลให้ครบถ้วนก่อนส่ง

---

## Phase 2: FiveM Script Modification (`esx_identity`)
**File Target**: `e:\txData\ESXLegacy_17B6DE.base\resources\[core]\esx_identity\server\main.lua`

### 2.1 เพิ่มฟังก์ชัน Helper
- [x] **สร้างฟังก์ชัน `GetDiscordID(source)`**:
    -   วนลูปหา Identifier ที่ขึ้นต้นด้วย `discord:`
    -   Return ค่า Discord ID ออกมา

### 2.2 แก้ไข Event `playerConnecting`
- [x] **ปรับ Logic การตรวจสอบผู้เล่น**:
    1.  ดึง `license` (Identifier) และ `discord_id` ของผู้เล่น
    2.  **Query 1**: เช็คว่ามี `identifier` นี้ใน DB หรือยัง (ผู้เล่นเก่า) -> ถ้ามี ปล่อยผ่าน
    3.  **Query 2**: ถ้าไม่มี `identifier` -> เช็คว่ามี `discord_id` นี้ใน DB หรือไม่ (ผู้เล่นใหม่ที่ลงทะเบียนผ่านเว็บ)
        -   **ถ้ามี (Found)**: Update `identifier` เป็น License -> ปล่อยผ่าน
        -   **ถ้าไม่มี (Not Found)**: Kick Player พร้อมข้อความแจ้งเตือน

### 2.3 ปิดระบบ Register ในเกม
- [x] **Disable In-Game Register**:
    -   Comment Out `TriggerClientEvent("esx_identity:showRegisterIdentity", ...)` ใน `esx:playerLoaded`

---

## Phase 3: Testing & Validation
- [x] **Test Case 1: ผู้เล่นใหม่ (ยังไม่ลงเว็บ)**
    -   เข้าเกม -> ต้องโดน Kick พร้อมข้อความแจ้งเตือน
- [ ] **Test Case 2: ผู้เล่นใหม่ (ลงเว็บแล้ว)**
    -   ลงทะเบียนหน้าเว็บ -> ข้อมูลเข้า DB (Identifier เป็น `web_pending`)
    -   เข้าเกม -> เข้าได้ปกติ -> เช็ค DB ต้องเห็น Identifier ถูกอัปเดตเป็น License
- [ ] **Test Case 3: ผู้เล่นเก่า**
    -   เข้าเกม -> เข้าได้ปกติ ข้อมูลไม่หาย
