import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'not set',
      NODE_ENV: process.env.NODE_ENV,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    },
    timestamp: new Date().toISOString()
  });
}

