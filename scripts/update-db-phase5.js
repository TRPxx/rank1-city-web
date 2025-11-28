const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

async function updateDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('🔌 Connected to database...');

        // Create 'claim_queue' table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS claim_queue (
                id INT AUTO_INCREMENT PRIMARY KEY,
                discord_id VARCHAR(50) NOT NULL,
                item_id VARCHAR(50) NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                amount INT DEFAULT 1,
                status ENUM('pending', 'claimed') DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                claimed_at DATETIME,
                INDEX idx_discord_claim (discord_id, status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Table "claim_queue" created.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await connection.end();
    }
}

updateDB();
