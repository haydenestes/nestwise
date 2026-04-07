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

  // Check trial status from cookie (set by client after profile load)
  // Full DB check happens client-side; middleware handles the trial-expired case
  // via a cookie set by the dashboard on load.
  const trialStatus = req.cookies.get('nestwise-trial-status')?.value;
  const trialEndsAt = req.cookies.get('nestwise-trial-ends-at')?.value;

  if (trialStatus === 'trial' && trialEndsAt) {
    const trialEnd = new Date(trialEndsAt);
    if (trialEnd < new Date()) {
      // Trial has expired — redirect to paywall with message
      const paywallUrl = new URL('/paywall', req.url);
      paywallUrl.searchParams.set('reason', 'trial_ended');
      return NextResponse.redirect(paywallUrl);
    }
    // Trial is active — let them through
    return NextResponse.next();
  }

  // Note: paid status check happens client-side on dashboard load
  // (middleware can't easily call Supabase DB without edge runtime setup)
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/criteria/:path*'],
};
