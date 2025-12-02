import { NextResponse } from 'next/server';
import { webDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Get connection from pool to check actual connected config
        const connection = await webDb.getConnection();
        const config = connection.config || {}; // Depending on mysql2 version, config might be here

        // If pool, we might need to check pool.config
        // But let's try to query variables

        const [rows] = await connection.query('SELECT @@port as port, @@hostname as hostname, DATABASE() as db_name');

        connection.release();

        return NextResponse.json({
            status: 'connected',
            env_vars: {
                WEB_DB_HOST: process.env.WEB_DB_HOST,
                WEB_DB_PORT: process.env.WEB_DB_PORT,
                WEB_DB_NAME: process.env.WEB_DB_NAME,
                WEB_DB_USER: process.env.WEB_DB_USER,
            },
            active_connection: rows[0]
        });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: error.message,
            env_vars: {
                WEB_DB_HOST: process.env.WEB_DB_HOST,
                WEB_DB_PORT: process.env.WEB_DB_PORT,
                WEB_DB_NAME: process.env.WEB_DB_NAME,
                WEB_DB_USER: process.env.WEB_DB_USER,
            }
        }, { status: 500 });
    }
}
