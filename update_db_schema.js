const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envConfig = {};
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envConfig[key.trim()] = value.trim();
            }
        });
        return envConfig;
    } catch (e) {
        console.error('Could not load .env file', e);
        return {};
    }
}

const env = loadEnv();

// Mimic lib/db.js logic
const webConfig = {
    host: env.WEB_DB_HOST || env.DB_HOST || 'localhost',
    port: parseInt(env.WEB_DB_PORT || '3307'),
    user: env.WEB_DB_USER || env.DB_USER || 'root',
    password: env.WEB_DB_PASSWORD !== undefined ? env.WEB_DB_PASSWORD : (env.DB_PASSWORD || ''),
    database: env.WEB_DB_NAME || 'rank1city_web'
};

async function updateSchema() {
    console.log('Connecting to database with config:', { ...webConfig, password: '****' });

    let connection;
    try {
        connection = await mysql.createConnection(webConfig);
        console.log('Connected successfully!');

        console.log('Adding avatar_url column to preregistrations table...');
        await connection.query(`
            ALTER TABLE preregistrations 
            ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL AFTER discord_name;
        `);
        console.log('Schema updated successfully!');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column avatar_url already exists. Skipping.');
        } else {
            console.error('Error updating schema:', error.message);
        }
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
