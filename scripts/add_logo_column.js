const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

const dbConfig = {
    host: process.env.WEB_DB_HOST || 'localhost',
    port: parseInt(process.env.WEB_DB_PORT || '3306'),
    user: process.env.WEB_DB_USER || 'root',
    password: process.env.WEB_DB_PASSWORD || '',
    database: process.env.WEB_DB_NAME || 'rank1city_web',
};

async function addLogoColumn() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Add logo_url to gangs
        try {
            await connection.query(`
                ALTER TABLE gangs
                ADD COLUMN logo_url VARCHAR(255) NULL AFTER name;
            `);
            console.log('✅ Added logo_url to gangs table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ logo_url already exists in gangs table.');
            } else {
                console.error('❌ Error adding logo_url to gangs:', err.message);
            }
        }

        // Add logo_url to families
        try {
            await connection.query(`
                ALTER TABLE families
                ADD COLUMN logo_url VARCHAR(255) NULL AFTER name;
            `);
            console.log('✅ Added logo_url to families table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ logo_url already exists in families table.');
            } else {
                console.error('❌ Error adding logo_url to families:', err.message);
            }
        }

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addLogoColumn();
