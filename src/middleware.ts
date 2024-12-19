import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const pathname = req.nextUrl?.pathname;
		const isAdmin = req.nextauth.token?.role === "ADMIN";
		const isUser = req.nextauth.token?.role === "USER";

		// Redirect /user to /user/dashboard/keywords
		if (pathname === "/user") {
			return NextResponse.redirect(new URL("/user/dashboard/keywords", req.url));
		}

		if (pathname.includes("/admin") && !isAdmin) {
			return NextResponse.redirect(new URL("/user", req.url));
		}

		if (pathname.includes("/user") && !isUser) {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		// if logged in redirect to admin
		return NextResponse.next();
	},
	{
		secret: process.env.SECRET,
		callbacks: {
			authorized({ req, token }) {
				if (!token) return false;
				return true;
			},
		},
	}
);

export const config = {
	matcher: ["/user/:path*", "/admin/:path*"],
};
