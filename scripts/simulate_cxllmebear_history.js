require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.WEB_DB_PORT || '3307'),
    user: process.env.WEB_DB_USER || process.env.DB_USER || 'root',
    password: process.env.WEB_DB_PASSWORD !== undefined ? process.env.WEB_DB_PASSWORD : (process.env.DB_PASSWORD || ''),
    database: process.env.WEB_DB_NAME || 'rank1city_web'
};

const items = [
    '1000 Coins', 'VIP 3 Days', 'VIP 7 Days', 'Honda Civic', 'Toyota Supra',
    'Pistol Ammo', 'Rifle Ammo', 'Health Pack', 'Armor Plate', '5000 Coins',
    '10000 Coins', 'Rare Mask', 'Gold Chain', 'Katana', 'Mystery Box'
];

async function simulateCxllmebearHistory() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // 1. Find the user
        const [users] = await connection.execute(
            'SELECT discord_id, discord_name FROM preregistrations WHERE discord_name LIKE ? LIMIT 1',
            ['%cxllmebear%']
        );

        let discordId;
        let discordName = 'cxllmebear';

        if (users.length === 0) {
            console.log('User "cxllmebear" not found. Creating a dummy user...');
            discordId = '999999999999999999'; // Dummy ID
            await connection.execute(`
                INSERT INTO preregistrations (discord_id, discord_name, referral_code, ticket_count, created_at)
                VALUES (?, ?, 'BEAR01', 50, NOW())
            `, [discordId, discordName]);
        } else {
            discordId = users[0].discord_id;
            discordName = users[0].discord_name;
            console.log(`Found user: ${discordName} (${discordId})`);
        }

        // 2. Generate 200 history entries
        const values = [];
        const now = new Date();

        for (let i = 0; i < 200; i++) {
            const item = items[Math.floor(Math.random() * items.length)];
            const itemId = `item_${Math.floor(Math.random() * 1000)}`;
            // Random time within last 30 days
            const timeOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
            const createdAt = new Date(now.getTime() - timeOffset);

            values.push([discordId, itemId, item, createdAt]);
        }

        // 3. Insert into database
        // MySQL bulk insert
        const sql = 'INSERT INTO lucky_draw_history (discord_id, item_id, item_name, created_at) VALUES ?';
        await connection.query(sql, [values]);

        console.log(`Successfully added 200 lucky draw history entries for ${discordName}.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

simulateCxllmebearHistory();
