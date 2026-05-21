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

  // Fallback data from Vercel headers
  let city = 'unknown';
  let region = 'unknown';
  let country = 'unknown';
  let isp = 'unknown';
  let timezone = 'unknown';
  let lat = 'unknown';
  let lon = 'unknown';

  if (ip) {
    try {
      const geoRes = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,city,regionName,country,isp,timezone,lat,lon`,
        { signal: AbortSignal.timeout(2000) } // 2 second timeout so page doesn't slow down
      );

      if (geoRes.ok) {
        const geo = await geoRes.json();
        if (geo.status === 'success') {
          city = geo.city || 'unknown';
          region = geo.regionName || 'unknown';
          country = geo.country || 'unknown';
          isp = geo.isp || 'unknown';
          timezone = geo.timezone || 'unknown';
          lat = geo.lat || 'unknown';
          lon = geo.lon || 'unknown';
        }
      }
    } catch {
      // Silently fall back to Vercel headers if API fails
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
