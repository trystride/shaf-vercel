import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
	function middleware(_req: NextRequestWithAuth) {
		const pathname = _req.nextUrl?.pathname;
		const isAdmin = _req.nextauth.token?.role === 'ADMIN';
		const isUser = _req.nextauth.token?.role === 'USER';

		// Redirect /user to /user/dashboard/keywords
		if (pathname === '/user') {
			return NextResponse.redirect(
				new URL('/user/dashboard/keywords', _req.url)
			);
		}

		if (pathname.includes('/admin') && !isAdmin) {
			return NextResponse.redirect(new URL('/user', _req.url));
		}

		if (pathname.includes('/user') && !isUser) {
			return NextResponse.redirect(new URL('/admin', _req.url));
		}

		// if logged in redirect to admin
		return NextResponse.next();
	},
	{
		secret: process.env.SECRET,
		callbacks: {
			authorized({ _req, token }) {
				if (!token) return false;
				return true;
			},
		},
	}
);

export const config = {
	matcher: ['/user/:path*', '/admin/:path*'],
};
