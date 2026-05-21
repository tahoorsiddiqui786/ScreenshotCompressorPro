import { NextResponse } from 'next/server';

function firstHeaderValue(value) {
  return value?.split(',')[0]?.trim() || 'unknown';
}

function decodeHeader(value) {
  if (!value) return 'unknown';

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function maskIp(ip) {
  if (!ip || ip === 'unknown') return 'unknown';

  if (ip.includes('.')) {
    const parts = ip.split('.');
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.xxx` : ip;
  }

  if (ip.includes(':')) {
    return `${ip.split(':').slice(0, 3).join(':')}:xxxx`;
  }

  return ip;
}

function isInternalRequest(userAgent) {
  const agent = userAgent.toLowerCase();

  return agent.startsWith('vercel-') || agent.includes('vercel-favicon');
}

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || 'unknown';

  if (isInternalRequest(userAgent)) {
    return NextResponse.next();
  }

  const ip = firstHeaderValue(request.headers.get('x-forwarded-for'));
  const city = decodeHeader(request.headers.get('x-vercel-ip-city'));
  const region = decodeHeader(request.headers.get('x-vercel-ip-country-region'));
  const country = decodeHeader(request.headers.get('x-vercel-ip-country'));

  console.log('VISITOR_LOCATION', {
    city,
    region,
    country,
    ip: maskIp(ip),
    path: request.nextUrl.pathname,
    userAgent,
    vercelRequestId: request.headers.get('x-vercel-id') || 'unknown',
    time: new Date().toISOString(),
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json)$).*)',
  ],
};
