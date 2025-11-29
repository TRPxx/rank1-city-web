import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20, // Increased from 10 for better concurrency
    queueLimit: 0
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('Database connection lost. Waiting for reconnect...');
    } else {
        process.exit(-1);
    }
});

export async function query(sql, values) {
    const [results] = await pool.execute(sql, values);
    return results;
}

export default pool;
