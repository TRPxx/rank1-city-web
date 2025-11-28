const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

// Mock Config (Copy from lib/preregister-config.js)
const ITEMS = [
    { id: 'starter_pack', name: 'Starter Pack (Money $5000)', chance: 60, rarity: 'COMMON' },
    { id: 'vip_3d', name: 'VIP 3 Days', chance: 30, rarity: 'RARE' },
    { id: 'car_gtr', name: 'Nissan GTR R35', chance: 9, rarity: 'EPIC' },
    { id: 'limited_pet', name: 'Limited Pet: Cyber Dog', chance: 1, rarity: 'LEGENDARY' },
];

async function testLuckyDraw() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('🔌 Connected to DB');

        // 1. Get a user
        const [users] = await connection.query('SELECT discord_id, ticket_count FROM preregistrations LIMIT 1');
        if (users.length === 0) throw new Error('No users found');

        const user = users[0];
        console.log(`👤 Testing with User: ${user.discord_id} (Tickets: ${user.ticket_count})`);

        if (user.ticket_count < 1) {
            console.log('⚠️ Not enough tickets. Adding 1 ticket for test...');
            await connection.query('UPDATE preregistrations SET ticket_count = ticket_count + 1 WHERE discord_id = ?', [user.discord_id]);
        }

        // 2. Simulate Draw Logic
        await connection.beginTransaction();
        console.log('🔄 Transaction Started');

        // Randomize
        const totalChance = ITEMS.reduce((sum, item) => sum + item.chance, 0);
        let random = Math.random() * totalChance;
        let selectedItem = ITEMS[ITEMS.length - 1];
        for (const item of ITEMS) {
            if (random < item.chance) {
                selectedItem = item;
                break;
            }
            random -= item.chance;
        }
        console.log(`🎁 Selected Item: ${selectedItem.name}`);

        // Deduct Ticket
        await connection.query(
            'UPDATE preregistrations SET ticket_count = ticket_count - 1 WHERE discord_id = ?',
            [user.discord_id]
        );
        console.log('✅ Ticket Deducted');

        // Insert History
        await connection.query(
            'INSERT INTO lucky_draw_history (discord_id, item_id, item_name, created_at) VALUES (?, ?, ?, NOW())',
            [user.discord_id, selectedItem.id, selectedItem.name]
        );
        console.log('✅ History Inserted');

        await connection.commit();
        console.log('🎉 Transaction Committed! Test SUCCESS.');

    } catch (err) {
        await connection.rollback();
        console.error('❌ Test FAILED:', err);
    } finally {
        await connection.end();
    }
}

testLuckyDraw();
