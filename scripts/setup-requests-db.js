const { webDb } = require('../lib/db');

async function setupTables() {
    try {
        const connection = await webDb.getConnection();
        console.log('Connected to database...');

        // Create gang_requests table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gang_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                gang_id INT NOT NULL,
                discord_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_request (gang_id, discord_id),
                FOREIGN KEY (gang_id) REFERENCES gangs(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('Created gang_requests table');

        // Create family_requests table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS family_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                family_id INT NOT NULL,
                discord_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_request (family_id, discord_id),
                FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('Created family_requests table');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

setupTables();
