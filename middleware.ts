import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bytepass-fallback-secret-change-me'
);

// Routes that require authentication
const PROTECTED = ['/dashboard', '/passport', '/flights'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('bytepass_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid or expired → clear and redirect
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('bytepass_token');
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/passport/:path*', '/flights/:path*'],
};
