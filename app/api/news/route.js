import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'lib', 'news.json');

// Helper to check admin
const isAdmin = (session) => {
    return session?.user?.isAdmin;
};

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const fileContent = await fs.readFile(dataPath, 'utf-8');
        let news = JSON.parse(fileContent);

        // 1. Filter by Category
        if (category && category !== 'all') {
            news = news.filter(item => item.category === category);
        }

        // 2. Filter by Search
        if (search) {
            const query = search.toLowerCase();
            news = news.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.excerpt.toLowerCase().includes(query)
            );
        }

        // Sort by date (newest first) - Assuming date format DD/MM/YYYY or YYYY-MM-DD
        // We try to handle both or standard JS Date parsing
        news.sort((a, b) => {
            // Helper to parse date
            const parseDate = (dateStr) => {
                if (!dateStr) return new Date(0);
                if (dateStr.includes('/')) {
                    const [d, m, y] = dateStr.split('/');
                    return new Date(`${y}-${m}-${d}`);
                }
                return new Date(dateStr);
            };
            return parseDate(b.date) - parseDate(a.date);
        });

        // 3. Pagination
        if (page && limit) {
            const p = parseInt(page);
            const l = parseInt(limit);
            const start = (p - 1) * l;
            const end = start + l;

            const total = news.length;
            const items = news.slice(start, end);

            return NextResponse.json({
                items,
                metadata: {
                    total,
                    page: p,
                    totalPages: Math.ceil(total / l),
                    hasNextPage: end < total
                }
            });
        }

        // Default: Return all (for Admin or simple lists)
        return NextResponse.json(news);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to load news' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!isAdmin(session)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        await fs.writeFile(dataPath, JSON.stringify(body, null, 4), 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save news' }, { status: 500 });
    }
}
