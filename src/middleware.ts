import { withAuth } from 'next-auth/middleware';

export default withAuth({
	callbacks: {
		authorized: ({ token, req }) => {
			// Allow registration endpoint
			if (req.nextUrl.pathname === '/api/user/register') {
				return true;
			}
			return !!token;
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
