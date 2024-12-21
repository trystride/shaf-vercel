import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createLogger } from '@/utils/logger';
import { isValidEmail, isStrongPassword, rateLimit } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const logger = createLogger('ChangePasswordAPI');
const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
	try {
		// Rate limiting
		await limiter.check(request, 5, 'CHANGE_PASSWORD'); // 5 requests per minute
	} catch {
		return new NextResponse('Too Many Requests', { status: 429 });
	}

	const body = await request.json();
	const { email, password, currentPassword } = body;

	// Input validation
	if (!email || !password || !currentPassword) {
		return new NextResponse(
			'Missing required fields. Please provide email, current password, and new password.',
			{ status: 400 }
		);
	}

	if (!isValidEmail(email)) {
		return new NextResponse('Invalid email format', { status: 400 });
	}

	if (!isStrongPassword(password)) {
		return new NextResponse(
			'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			{ status: 400 }
		);
	}

	const formattedEmail = email.toLowerCase();

	// Authorization check
	const session = await getServerSession(authOptions);
	if (session?.user?.email !== formattedEmail) {
		logger.warn('Unauthorized password change attempt', {
			requestedEmail: formattedEmail,
			requestingUser: session?.user?.email,
		});
		return new NextResponse('Unauthorized', { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: {
			email: formattedEmail,
		},
	});

	if (!user) {
		logger.warn('Password change attempted for non-existent user', {
			email: formattedEmail,
		});
		return new NextResponse('User not found', { status: 404 });
	}

	// Verify current password
	const passwordMatch = await bcrypt.compare(
		currentPassword,
		user.password as string
	);

	if (!passwordMatch) {
		logger.warn('Incorrect current password provided', {
			email: formattedEmail,
		});
		return new NextResponse('Incorrect current password', { status: 400 });
	}

	const isDemo = user.email?.includes('demo-');

	if (isDemo) {
		return new NextResponse("Can't change password for demo user", {
			status: 401,
		});
	}

	// Check if new password is different from current
	const isSamePassword = await bcrypt.compare(
		password,
		user.password as string
	);
	if (isSamePassword) {
		return new NextResponse(
			'New password must be different from current password',
			{ status: 400 }
		);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.update({
			where: {
				email: formattedEmail,
			},
			data: {
				password: hashedPassword,
			},
		});

		logger.info('Password changed successfully', { email: formattedEmail });
		return new NextResponse('Password changed successfully', { status: 200 });
	} catch (error) {
		logger.error('Failed to change password', {
			email: formattedEmail,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		return new NextResponse(
			'Failed to change password. Please try again later.',
			{ status: 500 }
		);
	}
}
