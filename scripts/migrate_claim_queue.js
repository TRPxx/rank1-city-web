const mysql = require('mysql2/promise');

async function migrate() {
    console.log('🚀 Starting migration: claim_queue table...');

    const config = {
        host: process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.WEB_DB_PORT || '3307'),
        user: process.env.WEB_DB_USER || process.env.DB_USER || 'root',
        password: process.env.WEB_DB_PASSWORD !== undefined ? process.env.WEB_DB_PASSWORD : (process.env.DB_PASSWORD || ''),
        database: process.env.WEB_DB_NAME || 'rank1city_web',
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connected to database');

        const sql = `
            CREATE TABLE IF NOT EXISTS claim_queue (
              id int(11) NOT NULL AUTO_INCREMENT,
              discord_id varchar(50) NOT NULL,
              item_id varchar(50) NOT NULL,
              item_name varchar(255) NOT NULL,
              amount int(11) DEFAULT 1,
              status enum('pending','claimed') DEFAULT 'pending',
              created_at timestamp NULL DEFAULT current_timestamp(),
              claimed_at datetime DEFAULT NULL,
              PRIMARY KEY (id),
              KEY discord_id (discord_id),
              KEY status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await connection.execute(sql);
        console.log('✅ Table "claim_queue" created or already exists.');

        await connection.end();
        console.log('🎉 Migration completed successfully.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
