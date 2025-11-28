const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(__dirname, '../.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

async function addTickets() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const [result] = await connection.execute(
            'UPDATE preregistrations SET ticket_count = ticket_count + 10'
        );
        console.log(`✅ Added 10 tickets to ${result.affectedRows} users!`);
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await connection.end();
    }
}

addTickets();
