import { NextResponse } from 'next/server';

function firstHeaderValue(value) {
  return value?.split(',')[0]?.trim() || null;
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

export async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || 'unknown';

  if (isInternalRequest(userAgent)) {
    return NextResponse.next();
  }

  const ip = firstHeaderValue(request.headers.get('x-forwarded-for'));
  const path = request.nextUrl.pathname;
  const vercelRequestId = request.headers.get('x-vercel-id') || 'unknown';
  const time = new Date().toISOString();

  let city = 'unknown';
  let region = 'unknown';
  let country = 'unknown';
  let isp = 'unknown';
  let timezone = 'unknown';
  let lat = 'unknown';
  let lon = 'unknown';

  if (ip) {
    try {
      // ipwho.is — free, HTTPS, no API key, works on Vercel Edge
      const geoRes = await fetch(
        `https://ipwho.is/${ip}`,
        { signal: AbortSignal.timeout(2000) }
      );

      if (geoRes.ok) {
        const geo = await geoRes.json();
        if (geo.success) {
          city = geo.city || 'unknown';
          region = geo.region || 'unknown';
          country = geo.country || 'unknown';
          isp = geo.connection?.isp || 'unknown';
          timezone = geo.timezone?.id || 'unknown';
          lat = geo.latitude || 'unknown';
          lon = geo.longitude || 'unknown';
        }
      }
    } catch {
      city = 'unknown (api timeout)';
    }
  }

  console.log('VISITOR_LOCATION', {
    city,
    region,
    country,
    isp,
    timezone,
    coordinates: `${lat}, ${lon}`,
    ip: maskIp(ip || 'unknown'),
    path,
    userAgent,
    vercelRequestId,
    time,
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json)$).*)',
  ],
};
