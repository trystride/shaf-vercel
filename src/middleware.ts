import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

function localeMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip locale handling for API routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is just a locale (e.g., /en or /ar)
  const isLocaleRoot = locales.some(locale => pathname === `/${locale}`);
  if (isLocaleRoot) {
    return NextResponse.next();
  }

  // Check if the pathname includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    // Determine locale from Accept-Language header, defaulting to 'en'
    const acceptLanguage = request.headers.get('accept-language');
    let locale = defaultLocale;
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if (locales.includes(preferredLocale)) {
        locale = preferredLocale;
      }
    }

    // If it's the root path (/), redirect to the locale root
    if (pathname === '/') {
      const newUrl = new URL(request.url);
      newUrl.pathname = `/${locale}`;
      return NextResponse.redirect(newUrl);
    }

    // For other paths, add the locale prefix
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(newUrl);
  }
  return NextResponse.next();
}

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      // Public routes that don't require authentication
      if (
        path.endsWith('/signin') ||
        path.endsWith('/register') ||
        path === `/${defaultLocale}` ||
        path === '/ar' ||
        path === '/en' ||
        path === '/'
      ) {
        return true;
      }

      // Only protect routes that require authentication
      if (
        path.includes('/user/') ||
        path.includes('/admin/') ||
        path.startsWith('/api/user/') ||
        path.startsWith('/api/admin/')
      ) {
        if (!token) return false;

        // Protect admin routes
        if (path.includes('/admin/')) {
          return token.role === 'ADMIN';
        }

        // Protect user routes
        return token.role === 'USER' || token.role === 'ADMIN';
      }

      // Allow access to all other routes
      return true;
    },
  },
});

export default function middleware(req: NextRequest) {
  // First, run the locale middleware
  const localeResponse = localeMiddleware(req);
  if (localeResponse.status !== 200) {
    return localeResponse;
  }
  // Then, run the auth middleware
  return authMiddleware(req);
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static assets and API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
