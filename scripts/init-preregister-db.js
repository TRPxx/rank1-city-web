const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8').split('\n');
    envConfig.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}
const mysql = require('mysql2/promise');

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('🔌 Connected to database...');

    try {
        // 1. Create 'gangs' table first (referenced by preregistrations)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS gangs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                gang_code VARCHAR(50) NOT NULL UNIQUE,
                leader_discord_id VARCHAR(50) NOT NULL,
                member_count INT DEFAULT 1,
                max_members INT DEFAULT 20,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_gang_code (gang_code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Table "gangs" created/verified.');

        // 2. Create 'preregistrations' table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS preregistrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                discord_id VARCHAR(50) NOT NULL UNIQUE,
                ip_address VARCHAR(45),
                referral_code VARCHAR(50) NOT NULL UNIQUE,
                referred_by VARCHAR(50),
                gang_id INT,
                ticket_count INT DEFAULT 0,
                invite_count INT DEFAULT 0,
                last_checkin DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (gang_id) REFERENCES gangs(id) ON DELETE SET NULL,
                INDEX idx_discord_id (discord_id),
                INDEX idx_referral_code (referral_code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Table "preregistrations" created/verified.');

        // 3. Create 'lucky_draw_history' table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lucky_draw_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                discord_id VARCHAR(50) NOT NULL,
                item_id VARCHAR(50) NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_discord_history (discord_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Table "lucky_draw_history" created/verified.');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        await connection.end();
        console.log('🔌 Disconnected.');
    }
}

initDB();
