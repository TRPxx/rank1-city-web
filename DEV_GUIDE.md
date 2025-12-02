# Development Guide - Rank1 City Website

## 🚀 การรัน Development Server

### วิธีที่ 1: รันบน Port 3000 (Default)
```bash
npm run dev
```
เว็บไซต์จะเปิดที่: http://localhost:3000

### วิธีที่ 2: รันบน Port 3001
```bash
npm run dev:3001
```
เว็บไซต์จะเปิดที่: http://localhost:3001

---

## 🔧 แก้ปัญหา Port ที่ถูกใช้งานอยู่

หากพบข้อความ "Port is already in use" ให้ใช้คำสั่งเหล่านี้:

### Kill Port 3000
```bash
npm run kill:3000
```

### Kill Port 3001
```bash
npm run kill:3001
```

### หรือใช้ PowerShell โดยตรง
```powershell
# Kill port 3000
powershell -ExecutionPolicy Bypass -Command "npx kill-port 3000"

# Kill port 3001
powershell -ExecutionPolicy Bypass -Command "npx kill-port 3001"
```

---

## 📦 Production Build

### Build โปรเจกต์
```bash
npm run build
```

### รัน Production Server บน Port 3000
```bash
npm run start
```

### รัน Production Server บน Port 3001
```bash
npm run start:3001
```

---

## 🛠️ คำสั่งอื่นๆ

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
npm run test:watch  # Watch mode
```

---

## ⚠️ หมายเหตุสำหรับ Windows

หาก npm command ไม่ทำงานเนื่องจาก PowerShell Execution Policy ให้ใช้:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

หรือเปิด PowerShell as Administrator และรัน:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🌐 URLs ที่สำคัญ

- **หน้าแรก**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Settings**: http://localhost:3000/admin/settings
- **API Documentation**: http://localhost:3000/api/*

---

## 🗄️ Database Configuration

ตรวจสอบไฟล์ `.env` สำหรับการตั้งค่า Database:
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Base URL

---

## 📝 Tips

1. **Hot Reload**: Next.js รองรับ hot reload อัตโนมัติ เมื่อแก้ไขไฟล์
2. **Clear Cache**: ถ้ามีปัญหา ให้ลบโฟลเดอร์ `.next` แล้ว build ใหม่
3. **Database Issues**: ตรวจสอบ MySQL connection และ permissions
4. **Port Conflicts**: ใช้ `kill:3000` หรือ `kill:3001` commands

---

เมื่อเจอปัญหาใดๆ สามารถตรวจสอบ logs ใน terminal ที่รัน dev server อยู่
