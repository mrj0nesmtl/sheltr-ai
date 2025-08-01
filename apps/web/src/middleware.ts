import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define role-based dashboard routes
const ROLE_DASHBOARD_MAP = {
  'super_admin': '/dashboard',
  'admin': '/dashboard/shelter-admin',
  'participant': '/dashboard/participant',
  'donor': '/dashboard/donor'
} as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // For now, we'll handle role-based routing on the client side
  // since Firebase Auth tokens need to be validated
  // This middleware could be enhanced to validate tokens server-side
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
}; 