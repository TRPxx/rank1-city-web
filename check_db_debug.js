const mysql = require('mysql2/promise');

async function checkDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'rank1city_web'
        });

        console.log('Connected to database.');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));

        const [columns] = await connection.query('SHOW COLUMNS FROM claim_queue');
        console.log('claim_queue columns:', columns.map(c => c.Field));

        const [rows] = await connection.query('SELECT * FROM claim_queue');
        console.log('claim_queue rows:', rows);

        const [history] = await connection.query('SELECT * FROM lucky_draw_history ORDER BY created_at DESC LIMIT 5');
        console.log('lucky_draw_history rows:', history);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDb();
