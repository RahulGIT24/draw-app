import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    const publicPaths = ['/signin', '/signup', '/', '/forgot-password', 'recover-account', 'verify'];

    if (!token && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/home',
        '/myrooms/:path*',
        '/canvas/:path*',
        '/',
        '/signin',
        '/signup',
        '/forgot-password',
        '/recover-account',
        '/recover-account/:path*',
        '/verify',
        '/verify/:path*',
    ],
};