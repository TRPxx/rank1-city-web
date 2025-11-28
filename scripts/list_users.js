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

// Create pool manually to avoid import issues with lib/db.js if it has other dependencies
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function listUsers() {
    try {
        const [rows] = await pool.query('SELECT discord_id, invite_count, ticket_count FROM preregistrations');
        console.log('--- User List ---');
        rows.forEach((row, index) => {
            console.log(`${index + 1}. Discord ID: ${row.discord_id} | Tickets: ${row.ticket_count} | Invites: ${row.invite_count}`);
        });
        console.log('-----------------');
        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
}

listUsers();
