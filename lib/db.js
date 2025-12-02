import mysql from 'mysql2/promise';

// 1. Game Database Configuration (Port 3306)
const gameConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'freshtown',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 2. Web Database Configuration (Port 3307)
const webConfig = {
    host: process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.WEB_DB_PORT || '3307'),
    user: process.env.WEB_DB_USER || process.env.DB_USER || 'root',
    password: process.env.WEB_DB_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.WEB_DB_NAME || 'rank1city_web',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
};

// Create Pools
const gamePool = mysql.createPool(gameConfig);
const webPool = mysql.createPool(webConfig);

// Helper function to wrap pool with error logging
const wrapPool = (pool, name) => {
    return {
        query: async (sql, params) => {
            try {
                return await pool.query(sql, params);
            } catch (error) {
                console.error(`Database Error (${name}):`, error.message);
                throw error;
            }
        },
        execute: async (sql, params) => {
            try {
                return await pool.execute(sql, params);
            } catch (error) {
                console.error(`Database Error (${name}):`, error.message);
                throw error;
            }
        },
        end: () => pool.end()
    };
};

export const gameDb = wrapPool(gamePool, 'GAME_DB');
export const webDb = wrapPool(webPool, 'WEB_DB');

// Default export is Game DB (for backward compatibility)
export default gameDb;
