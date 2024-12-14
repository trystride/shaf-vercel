import { prisma } from "@/libs/prismaDb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User & DefaultSession["user"];
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/auth/signin",
	},
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},

	providers: [
		CredentialsProvider({
			name: "credentials",
			id: "credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "Jhondoe" },
				password: { label: "Password", type: "password" },
				username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
			},

			async authorize(credentials) {
				// check to see if eamil and password is there
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email or password");
				}

				// check to see if user already exist
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// if user was not found
				if (!user || !user?.password) {
					throw new Error("No user found");
				}

				// check to see if passwords match
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				return user;
			},
		}),

		CredentialsProvider({
			name: "impersonate",
			id: "impersonate",
			credentials: {
				adminEmail: {
					label: "Admin Email",
					type: "text",
					placeholder: "Jhondoe@gmail.com",
				},
				userEmail: {
					label: "User Email",
					type: "text",
					placeholder: "Jhondoe@gmail.com",
				},
			},

			async authorize(credentials) {
				// check to see if eamil and password is there
				if (!credentials?.adminEmail || !credentials?.userEmail) {
					throw new Error("User email or Admin email is missing");
				}

				const admin = await prisma.user.findUnique({
					where: {
						email: credentials.adminEmail.toLocaleLowerCase(),
					},
				});

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.userEmail.toLocaleLowerCase(),
					},
				});

				if (!admin || admin.role !== "ADMIN") {
					throw new Error("Access denied");
				}

				// if user was not found
				if (!user) {
					throw new Error("No user found");
				}
				return user;
			},
		}),
		CredentialsProvider({
			name: "fetchSession",
			id: "fetchSession",
			credentials: {
				email: {
					label: "User Email",
					type: "text",
					placeholder: "Jhondoe@gmail.com",
				},
			},

			async authorize(credentials) {
				// check to see if eamil and password is there
				if (!credentials?.email) {
					throw new Error("User email is missing");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email.toLocaleLowerCase(),
					},
				});

				// if user was not found
				if (!user) {
					throw new Error("No user found");
				}
				return user;
			},
		}),

		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: Number(process.env.EMAIL_SERVER_PORT),
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
		}),

		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.role = user.role;
				token.priceId = user.priceId;
				token.currentPeriodEnd = user.currentPeriodEnd;
				token.subscriptionId = user.subscriptionId;
				token.picture = user.image;
				token.image = user.image;
			}
			return token;
		},

		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
				session.user.email = token.email;
				session.user.role = token.role;
				session.user.priceId = token.priceId;
				session.user.currentPeriodEnd = token.currentPeriodEnd;
				session.user.subscriptionId = token.subscriptionId;
				session.user.image = token.picture;
			}
			return session;
		},
	},

	// debug: process.env.NODE_ENV === "developement",
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
