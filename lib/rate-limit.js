import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

// [SECURITY FIX #10] เก็บ timestamp ของการ cleanup ล่าสุด
let lastCleanup = Date.now();

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

    // [SECURITY FIX #10] Smart cleanup - ทุก 5 นาที ลบ entries ที่หมดอายุแล้ว
    if (now - lastCleanup > 300000) { // 5 นาที
        cleanupExpiredEntries(windowMs);
        lastCleanup = now;
    }

    return true; // Allowed
}

// [SECURITY FIX #10] ฟังก์ชันลบ entries ที่หมดอายุ
function cleanupExpiredEntries(windowMs) {
    const cutoff = Date.now() - windowMs;
    let deleted = 0;

    for (const [ip, timestamps] of rateLimitMap.entries()) {
        const valid = timestamps.filter(t => t > cutoff);
        if (valid.length === 0) {
            rateLimitMap.delete(ip);
            deleted++;
        } else {
            rateLimitMap.set(ip, valid);
        }
    }

    if (deleted > 0) {
        console.log(`[RateLimit] Cleanup: removed ${deleted} expired entries, ${rateLimitMap.size} remaining`);
    }
}
