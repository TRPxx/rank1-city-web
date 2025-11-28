import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load .env
try {
    const envPath = path.resolve(__dirname, '../.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log('Could not load .env file', e);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // 1. Create 'gangs' table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gangs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                gang_code VARCHAR(20) NOT NULL UNIQUE,
                leader_id VARCHAR(255) NOT NULL,
                member_count INT DEFAULT 1,
                max_members INT DEFAULT 20,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Checked/Created 'gangs' table.");

        // 2. Add 'gang_id' column to 'preregistrations' if not exists
        const [columns] = await connection.query(`SHOW COLUMNS FROM preregistrations LIKE 'gang_id'`);
        if (columns.length === 0) {
            await connection.query(`ALTER TABLE preregistrations ADD COLUMN gang_id INT DEFAULT NULL`);
            console.log("Added 'gang_id' column to 'preregistrations'.");
        } else {
            console.log("'gang_id' column already exists.");
        }

        connection.release();
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
