import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
 
const locales = ['en', 'ar']
 
async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
 
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Get user auth token
  const token = await getToken({ req: request })
 
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 
                  request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 
                  'en'

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }

  // Get the pathname locale
  const currentLocale = pathname.split('/')[1]

  // Check if it's a protected route
  if (pathname.includes('/user/') || pathname.includes('/admin/')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/auth/signin`, request.url)
      )
    }

    // Check admin routes
    if (pathname.includes('/admin/') && token.role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/`, request.url)
      )
    }

    // Check user routes
    if (pathname.includes('/user/') && !['USER', 'ADMIN'].includes(token.role as string)) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/`, request.url)
      )
    }
  }
 
  return NextResponse.next()
}
