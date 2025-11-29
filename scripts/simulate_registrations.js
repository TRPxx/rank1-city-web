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

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomName() {
    const prefixes = ['Super', 'Mega', 'Ultra', 'Hyper', 'Cyber', 'Neon', 'Dark', 'Light', 'Pro', 'Noob'];
    const suffixes = ['Gamer', 'Player', 'Slayer', 'King', 'Queen', 'Ninja', 'Warrior', 'Rider', 'Driver', 'Pilot'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${prefix}${suffix}${num}`;
}

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
        connectionLimit: 50, // High limit for simulation
        queueLimit: 0
    });

    console.log('Starting simulation: 50 registrations/sec for 10 seconds...');

    const TOTAL_SECONDS = 10;
    const BATCH_SIZE = 50;
    let totalInserted = 0;

    for (let i = 0; i < TOTAL_SECONDS; i++) {
        const batchPromises = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
            const discordId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const discordName = generateRandomName();
            const referralCode = `SIM-${generateRandomString(6)}`;
            const ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            const query = `
                INSERT INTO preregistrations (discord_id, discord_name, referral_code, ip_address, ticket_count, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())
            `;

            batchPromises.push(pool.execute(query, [discordId, discordName, referralCode, ipAddress, 0]));
        }

        try {
            await Promise.all(batchPromises);
            totalInserted += BATCH_SIZE;
            console.log(`[${i + 1}/${TOTAL_SECONDS}] Inserted ${BATCH_SIZE} users... (Total: ${totalInserted})`);
        } catch (err) {
            console.error('Batch insert error:', err.message);
        }

        // Wait 1 second roughly
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Simulation complete.');
    await pool.end();
}

main();
