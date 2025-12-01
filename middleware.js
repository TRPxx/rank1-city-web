import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow access to admin routes regardless of maintenance mode
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        return NextResponse.next();
    }

    // Allow access to auth routes
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Allow access to API routes for checking config
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Allow access to static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('/favicon') ||
        pathname.includes('.') // Files with extensions
    ) {
        return NextResponse.next();
    }

    // Check maintenance mode via cookie or header (will be set by the app)
    const maintenanceMode = request.cookies.get('maintenance-mode')?.value === 'true';

    if (maintenanceMode && pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
