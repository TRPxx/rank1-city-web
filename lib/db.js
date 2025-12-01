import mysql from 'mysql2/promise';

// Configuration for Master (Write) - Default
const masterConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Keep write connections low to prioritize game server
    queueLimit: 0
};

// Configuration for Slave (Read) - Optional
const slaveConfig = {
    host: process.env.DB_HOST_SLAVE || process.env.DB_HOST, // Fallback to Master if Slave not set
    port: process.env.DB_PORT_SLAVE || 3306,
    user: process.env.DB_USER_SLAVE || process.env.DB_USER,
    password: process.env.DB_PASSWORD_SLAVE || process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 50, // High limit for reading (web traffic)
    queueLimit: 0
};

// Create Pools
const masterPool = mysql.createPool(masterConfig);
const slavePool = process.env.DB_HOST_SLAVE ? mysql.createPool(slaveConfig) : masterPool;

// Intelligent Pool Wrapper
const pool = {
    // Standard query method
    query: async (sql, params) => {
        // Route SELECT queries to Slave, everything else to Master
        const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
        const targetPool = isSelect ? slavePool : masterPool;

        try {
            return await targetPool.query(sql, params);
        } catch (error) {
            console.error(`Database Error (${isSelect ? 'SLAVE' : 'MASTER'}):`, error.message);
            throw error;
        }
    },

    // Execute method (usually for prepared statements)
    execute: async (sql, params) => {
        const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
        const targetPool = isSelect ? slavePool : masterPool;

        try {
            return await targetPool.execute(sql, params);
        } catch (error) {
            console.error(`Database Error (${isSelect ? 'SLAVE' : 'MASTER'}):`, error.message);
            throw error;
        }
    },

    // Expose original pools if needed
    master: masterPool,
    slave: slavePool,

    // Helper to close connections (for shutdown)
    end: async () => {
        await masterPool.end();
        if (slavePool !== masterPool) {
            await slavePool.end();
        }
    }
};

// Connection Error Handling
masterPool.on('connection', (connection) => {
    // console.log('New connection established with Master DB');
});

if (slavePool !== masterPool) {
    slavePool.on('connection', (connection) => {
        // console.log('New connection established with Slave DB');
    });
}

export default pool;
