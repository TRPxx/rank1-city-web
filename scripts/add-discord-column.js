const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'esxlegacy_17b6de'
};

async function addDiscordColumn() {
    console.log("Connecting to Database...");
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log("✅ Connected!");

        // เช็คก่อนว่ามี column นี้หรือยัง
        const [columns] = await connection.execute(`SHOW COLUMNS FROM users LIKE 'discord_id'`);

        if (columns.length > 0) {
            console.log("⚠️ Column 'discord_id' already exists.");
        } else {
            console.log("➕ Adding 'discord_id' column to users table...");
            await connection.execute(`
            ALTER TABLE users 
            ADD COLUMN discord_id VARCHAR(50) DEFAULT NULL AFTER identifier
        `);
            console.log("✅ Column 'discord_id' added successfully!");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await connection.end();
    }
}

addDiscordColumn();
