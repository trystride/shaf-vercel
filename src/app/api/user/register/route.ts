import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	try {
		if (req.method !== 'POST') {
			return NextResponse.json(
				{ success: false, error: 'Method not allowed' },
				{ status: 405 }
			);
		}

		const contentType = req.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return NextResponse.json(
				{ success: false, error: 'Content-Type must be application/json' },
				{ status: 400 }
			);
		}

		const body = await req.json();
		const { name, email, password } = body;

		console.log('Registration request received:', { name, email });

		if (!name || !email || !password) {
			console.log('Missing required fields:', {
				hasName: !!name,
				hasEmail: !!email,
				hasPassword: !!password,
			});
			return NextResponse.json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const formattedEmail = email.toLowerCase();
		console.log('Checking for existing user:', formattedEmail);

		const exist = await prisma.user.findUnique({
			where: {
				email: formattedEmail,
			},
		});

		if (exist) {
			console.log('User already exists:', formattedEmail);
			return NextResponse.json(
				{ success: false, error: 'Email already exists' },
				{ status: 400 }
			);
		}

		const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
		const isAdmin = adminEmails.includes(formattedEmail);
		console.log('Admin check:', { isAdmin, formattedEmail });

		const hashedPassword = await bcrypt.hash(password, 10);

		const userData = {
			name,
			email: formattedEmail,
			password: hashedPassword,
			role: isAdmin ? 'ADMIN' : 'USER',
			emailVerified: new Date(),
		};

		console.log('Creating new user:', { ...userData, password: '[HIDDEN]' });

		const user = await prisma.user.create({
			data: userData,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				emailVerified: true,
			},
		});

		console.log('User created successfully:', user);

		return NextResponse.json(
			{
				success: true,
				message: 'User registered successfully',
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			},
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error('Registration error:', error);

		if (error instanceof Error) {
			return NextResponse.json(
				{
					success: false,
					error: error.message,
				},
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: 'An unexpected error occurred',
			},
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
