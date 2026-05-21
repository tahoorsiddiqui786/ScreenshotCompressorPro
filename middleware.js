import { NextResponse } from 'next/server';

function firstHeaderValue(value) {
  return value?.split(',')[0]?.trim() || null;
}



function isInternalRequest(userAgent) {
  const agent = userAgent.toLowerCase();
  return agent.startsWith('vercel-') || agent.includes('vercel-favicon');
}

// Timeout-safe fetch using Promise.race (works on Edge Runtime)
async function fetchWithTimeout(url, ms = 3000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  );
  return Promise.race([fetch(url), timeout]);
}

async function getGeoData(ip) {
  // Try ipwho.is first
  try {
    const res = await fetchWithTimeout(`https://ipwho.is/${ip}`, 3000);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.city) {
        return {
          city: data.city,
          region: data.region,
          country: data.country,
          isp: data.connection?.isp || 'unknown',
          timezone: data.timezone?.id || 'unknown',
          lat: data.latitude,
          lon: data.longitude,
          source: 'ipwho.is',
        };
      }
    }
  } catch (e) {
    console.log('GEO_API_ERROR ipwho.is:', e.message);
  }

  // Fallback: try ipapi.co
  try {
    const res = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`, 3000);
    if (res.ok) {
      const data = await res.json();
      if (data.city) {
        return {
          city: data.city,
          region: data.region,
          country: data.country_name,
          isp: data.org || 'unknown',
          timezone: data.timezone || 'unknown',
          lat: data.latitude,
          lon: data.longitude,
          source: 'ipapi.co',
        };
      }
    }
  } catch (e) {
    console.log('GEO_API_ERROR ipapi.co:', e.message);
  }

  return null;
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

  // Vercel built-in headers as base fallback
  let city = request.headers.get('x-vercel-ip-city') ? decodeURIComponent(request.headers.get('x-vercel-ip-city')) : 'unknown';
  let region = request.headers.get('x-vercel-ip-country-region') || 'unknown';
  let country = request.headers.get('x-vercel-ip-country') || 'unknown';
  let isp = 'unknown';
  let timezone = 'unknown';
  let lat = 'unknown';
  let lon = 'unknown';
  let source = 'vercel-headers';

  // Try accurate API if IP is available
  if (ip) {
    const geo = await getGeoData(ip);
    if (geo) {
      city = geo.city;
      region = geo.region;
      country = geo.country;
      isp = geo.isp;
      timezone = geo.timezone;
      lat = geo.lat;
      lon = geo.lon;
      source = geo.source;
    }
  }

  console.log('VISITOR_LOCATION', {
    city,
    region,
    country,
    isp,
    timezone,
    coordinates: lat !== 'unknown' ? `${lat}, ${lon}` : 'unknown',
    ip: ip || 'unknown',
    path,
    userAgent,
    vercelRequestId,
    source,
    time,
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json)$).*)',
  ],
};
