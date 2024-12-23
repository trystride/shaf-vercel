import { withAuth } from 'next-auth/middleware';

export default withAuth({
	callbacks: {
		authorized: ({ token, req }) => {
			const path = req.nextUrl.pathname;

			// Allow registration endpoint
			if (path === '/api/user/register') {
				return true;
			}

			if (!token) {
				return false;
			}

			// Protect admin routes
			if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
				return token.role === 'ADMIN';
			}

			// Protect user routes
			if (path.startsWith('/user') || path.startsWith('/api/user')) {
				return token.role === 'USER' || token.role === 'ADMIN';
			}

			return true;
		},
	},
});

export const config = {
	matcher: [
		'/user/:path*',
		'/admin/:path*',
		'/api/user/:path*',
		'/api/admin/:path*',
	],
};
