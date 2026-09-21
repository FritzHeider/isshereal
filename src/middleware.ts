import { NextRequest, NextResponse } from 'next/server';

// ── Rate limiter (sliding window per IP) ──────────────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;        // requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ── Security headers applied to every response ───────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://ui-avatars.com https://*.cdninstagram.com https://*.ytimg.com https://*.tiktokcdn.com blob:",
    "font-src 'self'",
    "connect-src 'self' https://www.instagram.com https://www.tiktok.com https://www.youtube.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate-limit API routes ──────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...SECURITY_HEADERS,
          },
        },
      );
    }

    // Block excessively long query strings (DoS / injection)
    if (request.url.length > 2048) {
      return new NextResponse(
        JSON.stringify({ error: 'Request URI too long' }),
        { status: 414, headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS } },
      );
    }
  }

  // ── Apply security headers to all responses ────────────────────────────
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // ── CORS: restrict API to same-origin only ─────────────────────────────
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = ['https://isshereal.com', 'https://www.isshereal.com'];

    if (origin && !allowedOrigins.includes(origin)) {
      // In development, also allow localhost
      if (!origin.startsWith('http://localhost:')) {
        response.headers.set('Access-Control-Allow-Origin', 'https://isshereal.com');
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and _next internals
    '/((?!_next/static|_next/image|images/|favicon.ico).*)',
  ],
};
