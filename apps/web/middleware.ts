import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect investor relations page
  if (request.nextUrl.pathname.startsWith('/investor-relations')) {
    // Check for authentication token or other authorization
    const authToken = request.cookies.get('auth-token');
    const investorAccess = request.cookies.get('investor-access');
    
    // For now, we'll allow access but this should be properly secured
    // In production, implement proper investor verification
    if (!authToken && !investorAccess) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/investor-relations/:path*',
    '/dashboard/:path*'
  ]
}; 