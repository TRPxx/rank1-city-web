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

async function addTickets() {
    try {
        // Update all users to have 10 tickets
        const [result] = await pool.query('UPDATE preregistrations SET ticket_count = ticket_count + 10');
        console.log(`Successfully added 10 tickets to ${result.affectedRows} users.`);
        process.exit(0);
    } catch (error) {
        console.error('Error adding tickets:', error);
        process.exit(1);
    }
}

addTickets();
