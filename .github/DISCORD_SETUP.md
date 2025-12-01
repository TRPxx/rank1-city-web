# GitHub Actions - Discord Notification Setup

## ขั้นตอนการตั้งค่า

### 1. เพิ่ม Discord Webhook URL ใน GitHub Secrets

1. ไปที่ Discord Server → เลือก channel ที่ต้องการรับการแจ้งเตือน
2. คลิกที่ไอคอน ⚙️ (Edit Channel) → Integrations → Webhooks
3. คลิก "New Webhook" หรือใช้ webhook ที่มีอยู่
4. คัดลอก **Webhook URL**

5. ไปที่ GitHub Repository:
   - Settings → Secrets and variables → Actions
   - คลิก "New repository secret"
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: วาง Webhook URL ที่คัดลอกมา
   - คลิก "Add secret"

### 2. Push โค้ดขึ้น GitHub

หลังจากตั้งค่า Secret แล้ว:

```bash
git add .
git commit -m "Add auto Discord notification"
git push origin main
```

### 3. ตรวจสอบการทำงาน

- ไปที่ GitHub Repository → Actions tab
- จะเห็น workflow "Discord Push Notification" กำลังรัน
- เมื่อเสร็จ ไปเช็คที่ Discord channel ควรจะเห็นการแจ้งเตือน

## การทำงาน

- ✅ แจ้งเตือนอัตโนมัติทุกครั้งที่ push ไป `main` หรือ `master` branch
- ✅ แสดงข้อมูล: ผู้ push, branch, commit hash (พร้อม link), เวลา, สถิติ, ไฟล์ที่แก้ไข
- ✅ รูปแบบเหมือนกับ workflow `/git_push_notify` เดิม

## หมายเหตุ

- Workflow จะรันผ่าน GitHub Actions (ฟรีสำหรับ public repo)
- ไม่ต้องรันคำสั่งเอง ระบบจะแจ้งเตือนอัตโนมัติ
- สามารถแก้ไข branch ที่ต้องการ monitor ได้ที่ไฟล์ `.github/workflows/discord-notify.yml`
