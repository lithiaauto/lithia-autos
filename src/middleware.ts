import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(`[Middleware] Request path: ${pathname}`);

    // Check if we are in the admin dashboard area
    if (pathname.startsWith('/admin')) {
        // Allow access to login page
        if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
            return NextResponse.next();
        }

        // Check for session cookie
        const session = request.cookies.get('admin_session');

        if (!session || session.value !== 'authenticated') {
            // Redirect to login if not authenticated
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
