const mysql = require('mysql2/promise');

// Hardcode ค่า Config ชั่วคราว (เพื่อความชัวร์)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // ถ้ามีรหัสผ่านให้ใส่ตรงนี้
    database: 'esxlegacy_17b6de'
};

async function checkDatabase() {
    console.log("Connecting to Database...");
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log("✅ Connected!");

        // 1. ดูชื่อ Column ทั้งหมดในตาราง users
        console.log("\n--- Table Structure (users) ---");
        const [columns] = await connection.execute(`SHOW COLUMNS FROM users`);
        console.log(columns.map(c => c.Field).join(', '));

        // 2. สุ่มดึงข้อมูล identifier มาดู
        console.log("\n--- Sample Identifiers ---");
        const [rows] = await connection.execute(`SELECT identifier, firstname, lastname FROM users LIMIT 5`);
        rows.forEach(row => {
            console.log(`[${row.identifier}] ${row.firstname} ${row.lastname}`);
        });

        // 3. ลองหาว่ามี Column ไหนเก็บ Discord ID ไหม
        const discordCols = columns.filter(c => c.Field.toLowerCase().includes('discord'));
        if (discordCols.length > 0) {
            console.log("\n✅ Found Discord Columns:", discordCols.map(c => c.Field).join(', '));
        } else {
            console.log("\n❌ No explicit 'discord' column found in users table.");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await connection.end();
    }
}

checkDatabase();
