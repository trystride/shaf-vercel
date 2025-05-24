import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

// Function to handle locale redirects
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

// Main middleware function
export default async function middleware(req: NextRequest) {
  // First, run the locale middleware
  const localeResponse = localeMiddleware(req);
  if (localeResponse.status !== 200) {
    return localeResponse;
  }
  
  // Get the path from the request
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
    return NextResponse.next();
  }
  
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if the path requires authentication
  if (
    path.includes('/user/') ||
    path.includes('/admin') ||
    path.startsWith('/api/user/') ||
    path.startsWith('/api/admin/')
  ) {
    // If no token, redirect to sign in
    if (!token) {
      // Determine the language prefix for the redirect
      const langPrefix = path.startsWith('/ar') ? '/ar' : '/en';
      const url = new URL(`${langPrefix}/auth/signin`, req.url);
      url.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(url);
    }
    
    // Protect admin routes - including base /admin route and its localized versions
    if (
      path.includes('/admin')
    ) {
      if (token.role !== 'ADMIN') {
        // Redirect to sign in with error if not admin
        const langPrefix = path.startsWith('/ar') ? '/ar' : '/en';
        const url = new URL(`${langPrefix}/auth/signin`, req.url);
        url.searchParams.set('callbackUrl', req.url);
        url.searchParams.set('error', 'AccessDenied');
        return NextResponse.redirect(url);
      }
    }
    
    // For user routes, both USER and ADMIN roles are allowed
    // No additional checks needed here as we've already verified token exists
  }
  
  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static assets and API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
