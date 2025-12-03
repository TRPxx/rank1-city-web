const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

const GANG_NAMES = [
    'Red Dragons', 'Blue Sharks', 'Night Owls', 'Street Kings', 'Cyber Punks',
    'Neon Riders', 'Shadow Syndicate', 'Golden Vipers', 'Iron Fists', 'Urban Legends',
    'Midnight Runners', 'Solar Flares', 'Toxic Avengers', 'Silent Assassins', 'Crimson Tide'
];

const USER_NAMES = [
    'Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Jamie', 'Riley', 'Avery',
    'Quinn', 'Skyler', 'Charlie', 'Sam', 'Peyton', 'Reese', 'Dakota', 'Cameron',
    'Sage', 'Rowan', 'Sawyer', 'Hayden', 'Kai', 'Elara', 'Nova', 'Orion', 'Luna'
];

function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function randomDate(daysBack) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    return date;
}

async function simulateDashboard() {
    console.log('🚀 Starting Full Dashboard Simulation...');

    const connection = await mysql.createConnection({
        host: process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.WEB_DB_PORT || '3307'),
        user: process.env.WEB_DB_USER || process.env.DB_USER || 'root',
        password: process.env.WEB_DB_PASSWORD !== undefined ? process.env.WEB_DB_PASSWORD : (process.env.DB_PASSWORD || ''),
        database: process.env.WEB_DB_NAME || 'rank1city_web'
    });

    try {
        // 1. Simulate Gangs
        console.log('🏢 Simulating Gangs...');
        const gangIds = [];
        for (const name of GANG_NAMES) {
            const code = randomString(6);
            const leaderId = `User_${Math.floor(Math.random() * 1000000)}`;

            // Check if gang exists (by name) to avoid duplicates if re-run
            const [existing] = await connection.query('SELECT id FROM gangs WHERE name = ?', [name]);

            if (existing.length > 0) {
                gangIds.push(existing[0].id);
            } else {
                const [result] = await connection.query(
                    'INSERT INTO gangs (name, gang_code, leader_discord_id, member_count, max_members) VALUES (?, ?, ?, 0, 50)',
                    [name, code, leaderId]
                );
                gangIds.push(result.insertId);
            }
        }
        console.log(`✅ ${gangIds.length} Gangs ready.`);

        // 2. Simulate Users
        console.log('👥 Simulating 1,000 Users...');
        const users = [];
        const referralCodes = []; // Keep track to use for 'referred_by'

        for (let i = 0; i < 1000; i++) {
            const discordId = `User_${Math.floor(Math.random() * 1000000000)}`; // Unique-ish ID
            const name = `${USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)]}_${Math.floor(Math.random() * 999)}`;
            const referralCode = randomString(8);
            referralCodes.push(referralCode);

            // 30% chance to be in a gang
            const gangId = Math.random() < 0.3 ? gangIds[Math.floor(Math.random() * gangIds.length)] : null;

            // 20% chance to be referred by someone (if there are existing codes)
            const referredBy = (Math.random() < 0.2 && referralCodes.length > 10)
                ? referralCodes[Math.floor(Math.random() * (referralCodes.length - 1))]
                : null;

            // Date distribution: 50% in last 7 days, 50% in last 30 days
            const daysBack = Math.random() < 0.5 ? 7 : 30;
            const createdAt = randomDate(daysBack);

            users.push([
                discordId,
                name,
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Placeholder Avatar
                referralCode,
                referredBy,
                gangId,
                Math.floor(Math.random() * 10), // invite_count (initial random, will update later)
                Math.floor(Math.random() * 50), // ticket_count
                '127.0.0.1',
                createdAt
            ]);
        }

        // Batch Insert Users
        const chunkSize = 100;
        for (let i = 0; i < users.length; i += chunkSize) {
            const chunk = users.slice(i, i + chunkSize);
            // Use INSERT IGNORE to skip duplicates if re-run
            await connection.query(
                `INSERT IGNORE INTO preregistrations 
                (discord_id, discord_name, avatar_url, referral_code, referred_by, gang_id, invite_count, ticket_count, ip_address, created_at) 
                VALUES ?`,
                [chunk]
            );
            process.stdout.write(`.`);
        }
        console.log('\n✅ Users inserted.');

        // 3. Update Gang Member Counts
        console.log('🔄 Updating Gang Member Counts...');
        await connection.query(`
            UPDATE gangs g
            SET member_count = (SELECT COUNT(*) FROM preregistrations p WHERE p.gang_id = g.id)
        `);

        // 4. Update Invite Counts (Real calculation based on referred_by)
        console.log('🔄 Updating Invite Counts...');
        await connection.query(`
            UPDATE preregistrations p
            JOIN (
                SELECT referred_by, COUNT(*) as count 
                FROM preregistrations 
                WHERE referred_by IS NOT NULL 
                GROUP BY referred_by
            ) r ON p.referral_code = r.referred_by
            SET p.invite_count = r.count
        `);

        // 5. Simulate Extra Spins (Recent Activity)
        console.log('🎰 Simulating Recent Lucky Draw Spins...');
        const items = ['Gold Bar', 'Sports Car', 'Mansion', 'Diamond Ring', 'Cash $10,000', 'Rare Weapon', 'Helicopter', 'Yacht'];
        const spins = [];
        for (let i = 0; i < 500; i++) {
            const discordId = `User_${Math.floor(Math.random() * 100000)}`;
            const itemId = `item_${Math.floor(Math.random() * 100)}`;
            const itemName = items[Math.floor(Math.random() * items.length)];
            // Very recent: last 24-48 hours
            const date = randomDate(2);
            spins.push([discordId, itemId, itemName, date]);
        }

        for (let i = 0; i < spins.length; i += chunkSize) {
            const chunk = spins.slice(i, i + chunkSize);
            await connection.query(
                'INSERT INTO lucky_draw_history (discord_id, item_id, item_name, created_at) VALUES ?',
                [chunk]
            );
        }
        console.log('✅ Recent spins inserted.');

        console.log('🎉 Simulation Complete! Dashboard should now be populated.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await connection.end();
    }
}

simulateDashboard();
