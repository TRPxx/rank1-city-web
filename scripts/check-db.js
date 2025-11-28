require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabase() {
    console.log("Connecting to Database...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log("✅ Connected!");

        // 1. ดูชื่อ Column ทั้งหมดในตาราง users
        console.log("\n--- Table Structure (users) ---");
        const [columns] = await connection.execute(`SHOW COLUMNS FROM users`);
        console.log(columns.map(c => c.Field).join(', '));

        // 2. สุ่มดึงข้อมูล identifier มาดูสัก 5 คน
        console.log("\n--- Sample Identifiers ---");
        const [rows] = await connection.execute(`SELECT identifier FROM users LIMIT 5`);

        if (rows.length === 0) {
            console.log("⚠️ No users found in database.");
        } else {
            rows.forEach((row, index) => {
                console.log(`${index + 1}. ${row.identifier}`);
            });
        }

        // 3. เช็คว่ามี identifier ที่ขึ้นต้นด้วย 'discord:' หรือไม่
        const [discordRows] = await connection.execute(`
      SELECT identifier, firstname, lastname 
      FROM users 
      WHERE identifier LIKE 'discord:%' 
      LIMIT 1
    `);

        console.log("\n--- Discord Link Check ---");
        if (discordRows.length > 0) {
            console.log("✅ FOUND! พบข้อมูล Discord ID ในตาราง users");
            console.log(`Example: ${discordRows[0].firstname} ${discordRows[0].lastname} -> ${discordRows[0].identifier}`);
            console.log("สรุป: ระบบ Login ของเราน่าจะใช้งานได้เลยครับ!");
        } else {
            console.log("❌ NOT FOUND: ไม่พบ identifier ที่ขึ้นต้นด้วย 'discord:'");
            console.log("ข้อแนะนำ: คุณอาจต้องลง Script ใน FiveM เพื่อบันทึก Discord ID ของผู้เล่น");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await connection.end();
    }
}

checkDatabase();
