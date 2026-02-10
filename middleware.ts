import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/login', '/admin/:path*'],
};
