import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'lib', 'config.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const config = JSON.parse(fileContent);

        // Return only necessary public info
        return NextResponse.json({
            serverStatus: config.serverStatus || 'preregister',
            version: Date.now() // Simple cache buster
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load config' }, { status: 500 });
    }
}
