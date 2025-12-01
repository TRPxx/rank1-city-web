import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

export function rateLimit(ip, limit = 10, windowMs = 60 * 1000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    const requestTimestamps = rateLimitMap.get(ip) || [];

    // Filter out timestamps outside the window
    const requestsInWindow = requestTimestamps.filter(timestamp => timestamp > windowStart);

    if (requestsInWindow.length >= limit) {
        return false; // Rate limit exceeded
    }

    requestsInWindow.push(now);
    rateLimitMap.set(ip, requestsInWindow);

    // Cleanup old entries periodically (optional optimization)
    if (rateLimitMap.size > 10000) {
        rateLimitMap.clear(); // Simple cleanup strategy
    }

    return true; // Allowed
}
