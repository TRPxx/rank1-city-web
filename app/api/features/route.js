import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from 'fs/promises';
import path from 'path';

const configPath = path.join(process.cwd(), 'lib', 'features.json');

// Helper to check admin
const isAdmin = (session) => {
    return session?.user?.isAdmin;
};

export async function GET() {
    try {
        const data = await fs.readFile(configPath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load features' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!isAdmin(session)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        await fs.writeFile(configPath, JSON.stringify(body, null, 4), 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save features' }, { status: 500 });
    }
}
