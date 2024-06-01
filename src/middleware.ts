
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
    const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page

  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify'))
  ) {
    console.log('Redirecting to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    console.log('Redirecting to /sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}