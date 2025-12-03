const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });
const fs = require('fs');

async function runSchemaUpdate() {
    console.log('Running schema update...');
    const connection = await mysql.createConnection({
        host: process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.WEB_DB_PORT || '3307'),
        user: process.env.WEB_DB_USER || process.env.DB_USER || 'root',
        password: process.env.WEB_DB_PASSWORD !== undefined ? process.env.WEB_DB_PASSWORD : (process.env.DB_PASSWORD || ''),
        database: process.env.WEB_DB_NAME || 'rank1city_web',
        multipleStatements: true
    });

    try {
        const sql = fs.readFileSync('update_schema_v2.sql', 'utf8');
        await connection.query(sql);
        console.log('Schema updated successfully!');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await connection.end();
    }
}

runSchemaUpdate();
