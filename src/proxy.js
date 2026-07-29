import { NextResponse } from 'next/server';

const allowedOrigins = [
  'https://creativerafa.com',
  'https://shops.creativerafa.com',
  'http://localhost:3000',
];

export default function proxy(req) {
  const origin = req.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    return response;
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    '/api/:path*',
  ],
};
