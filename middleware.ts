import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/criteria'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check for Supabase session cookie
  const token = req.cookies.get('sb-oogvxhzzdoqucxalohzw-auth-token')?.value
    || req.cookies.get('supabase-auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/paywall', req.url));
  }

  // Note: paid status check happens client-side on dashboard load
  // (middleware can't easily call Supabase DB without edge runtime setup)
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/criteria/:path*'],
};
