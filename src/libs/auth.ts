import { prisma } from '@/libs/prismaDb';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { getServerSession } from 'next-auth';
import bcryptjs from 'bcryptjs';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: User &
			DefaultSession['user'] & {
				accessToken?: string;
			};
	}

	interface User {
		id: string;
		role?: string;
		priceId?: string;
		currentPeriodEnd?: Date;
		subscriptionId?: string;
		customerId?: string;
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: '/auth/signin',
	},
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},

	providers: [
		CredentialsProvider({
			name: 'credentials',
			id: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'text', placeholder: 'Jhondoe' },
				password: { label: 'Password', type: 'password' },
				username: { label: 'Username', type: 'text', placeholder: 'Jhon Doe' },
			},

			async authorize(credentials) {
				// check to see if email and password is there
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Please enter an email or password');
				}

				// check to see if user already exist
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// if user was not found
				if (!user || !user?.password) {
					throw new Error('No user found');
				}

				// check to see if passwords match
				const passwordMatch = await bcryptjs.compare(
					credentials.password,
					user.password
				);

				if (!passwordMatch) {
					throw new Error('Incorrect password');
				}

				// Convert null values to undefined for NextAuth compatibility
				return {
					id: user.id,
					name: user.name ?? undefined,
					email: user.email ?? undefined,
					image: user.image ?? undefined,
					role: user.role ?? undefined,
					priceId: user.priceId ?? undefined,
					currentPeriodEnd: user.currentPeriodEnd ?? undefined,
					subscriptionId: user.subscriptionId ?? undefined,
					customerId: user.customerId ?? undefined,
				};
			},
		}),

		CredentialsProvider({
			name: 'impersonate',
			id: 'impersonate',
			credentials: {
				adminEmail: {
					label: 'Admin Email',
					type: 'text',
					placeholder: 'Jhondoe@gmail.com',
				},
				userEmail: {
					label: 'User Email',
					type: 'text',
					placeholder: 'Jhondoe@gmail.com',
				},
			},

			async authorize(credentials) {
				// check to see if adminEmail and userEmail are there
				if (!credentials?.adminEmail || !credentials?.userEmail) {
					throw new Error('Please enter admin and user emails');
				}

				// check if admin exists and has admin role
				const admin = await prisma.user.findUnique({
					where: {
						email: credentials.adminEmail,
					},
				});

				if (!admin || admin.role !== 'ADMIN') {
					throw new Error('Not authorized');
				}

				// check if user exists
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.userEmail,
					},
				});

				if (!user) {
					throw new Error('User not found');
				}

				return {
					id: user.id,
					name: user.name ?? undefined,
					email: user.email ?? undefined,
					image: user.image ?? undefined,
					role: user.role ?? undefined,
					priceId: user.priceId ?? undefined,
					currentPeriodEnd: user.currentPeriodEnd ?? undefined,
					subscriptionId: user.subscriptionId ?? undefined,
					customerId: user.customerId ?? undefined,
				};
			},
		}),
		CredentialsProvider({
			name: 'fetchSession',
			id: 'fetchSession',
			credentials: {
				email: {
					label: 'User Email',
					type: 'text',
					placeholder: 'Jhondoe@gmail.com',
				},
			},

			async authorize(credentials) {
				if (!credentials?.email) {
					throw new Error('Email is required');
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user) {
					throw new Error('No user found');
				}

				return {
					id: user.id,
					name: user.name ?? undefined,
					email: user.email ?? undefined,
					image: user.image ?? undefined,
					role: user.role ?? undefined,
					priceId: user.priceId ?? undefined,
					currentPeriodEnd: user.currentPeriodEnd ?? undefined,
					subscriptionId: user.subscriptionId ?? undefined,
					customerId: user.customerId ?? undefined,
				};
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
			clientId: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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
				token.image = user.image;
				token.accessToken = user.id; // Using user.id as the access token
			}
			return token;
		},

		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string | undefined;
				session.user.role = token.role as string | undefined;
				session.user.priceId = token.priceId as string | undefined;
				session.user.currentPeriodEnd = token.currentPeriodEnd as
					| Date
					| undefined;
				session.user.subscriptionId = token.subscriptionId as
					| string
					| undefined;
				session.user.image = token.image as string | undefined;
				session.user.accessToken = token.accessToken as string;
			}
			return session;
		},
	},

	// debug: process.env.NODE_ENV === "developement",
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
