import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    const publicPaths = [
        '/',
        '/signin',
        '/signup',
        '/forgot-password',
        '/recover-account',
        '/verify'
    ];

    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (token && isPublicPath && pathname !== '/') {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|api|static).*)',
    ],
};
