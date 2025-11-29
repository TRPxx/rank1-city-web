const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        });
        return envVars;
    } catch (e) {
        console.error('Could not load .env file', e);
        return {};
    }
}

const env = loadEnv();

async function main() {
    if (!env.DB_HOST) {
        console.error('DB_HOST not found in .env');
        return;
    }

    const pool = mysql.createPool({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log('Checking preregistrations table schema...');

        // Check if column exists
        const [columns] = await pool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'preregistrations' AND COLUMN_NAME = 'discord_name'
        `, [env.DB_NAME]);

        if (columns.length === 0) {
            console.log('Adding discord_name column...');
            await pool.query(`
                ALTER TABLE preregistrations
                ADD COLUMN discord_name VARCHAR(255) NULL AFTER discord_id
            `);
            console.log('Column discord_name added successfully.');
        } else {
            console.log('Column discord_name already exists.');
        }

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await pool.end();
    }
}

main();
