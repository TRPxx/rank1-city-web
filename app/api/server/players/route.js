import { NextResponse } from 'next/server';
import siteConfig from '@/lib/config.json';

export async function GET() {
    try {
        const apiUrl = siteConfig.serverApiUrl;

        if (!apiUrl) {
            return NextResponse.json({ error: 'Server API URL not configured' }, { status: 500 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch(apiUrl, {
            signal: controller.signal,
            next: { revalidate: 10 } // Cache for 10 seconds
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch server data: ${response.status}`);
        }

        const players = await response.json();

        // Basic validation to ensure it's an array
        if (!Array.isArray(players)) {
            // Some server artifacts return an object with a players array
            if (players.players && Array.isArray(players.players)) {
                return NextResponse.json(players.players);
            }
            throw new Error('Invalid data format received from server');
        }

        return NextResponse.json(players);

    } catch (error) {
        console.error('Error fetching server players:', error);
        // Return empty array instead of error to prevent UI breaking, 
        // but with a status code indicating issue if needed, or just empty list.
        return NextResponse.json([], { status: 200 });
    }
}
