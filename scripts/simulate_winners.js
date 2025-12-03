const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function simulateWinners() {
    console.log('Starting simulation of 1,000 lucky draw winners...');

    const connection = await mysql.createConnection({
        host: process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.WEB_DB_PORT || '3307'),
        user: process.env.WEB_DB_USER || process.env.DB_USER || 'root',
        password: process.env.WEB_DB_PASSWORD !== undefined ? process.env.WEB_DB_PASSWORD : (process.env.DB_PASSWORD || ''),
        database: process.env.WEB_DB_NAME || 'rank1city_web'
    });

    try {
        const items = ['Gold Bar', 'Sports Car', 'Mansion', 'Diamond Ring', 'Cash $10,000', 'Rare Weapon', 'Helicopter', 'Yacht'];
        const values = [];

        for (let i = 0; i < 1000; i++) {
            const discordId = `User_${Math.floor(Math.random() * 100000)}`;
            const itemId = `item_${Math.floor(Math.random() * 100)}`;
            const itemName = items[Math.floor(Math.random() * items.length)];
            // Random date within last 7 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 7));
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            values.push([discordId, itemId, itemName, date]);
        }

        // Batch insert
        const chunkSize = 100;
        for (let i = 0; i < values.length; i += chunkSize) {
            const chunk = values.slice(i, i + chunkSize);
            await connection.query(
                'INSERT INTO lucky_draw_history (discord_id, item_id, item_name, created_at) VALUES ?',
                [chunk]
            );
            console.log(`Inserted ${Math.min(i + chunkSize, values.length)} / 1000 records`);
        }

        console.log('Simulation complete!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

simulateWinners();
