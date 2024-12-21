import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLogger } from '@/utils/logger';
import { rateLimit } from '@/lib/rateLimit';
import { isValidEmail } from '@/lib/utils';

const logger = createLogger('UserDeleteAPI');
const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

export async function DELETE(request: Request) {
	try {
		// Rate limiting
		await limiter.check(3, 'DELETE_USER'); // 3 requests per minute
	} catch {
		return new NextResponse('Too Many Requests', { status: 429 });
	}

	const body = await request.json();
	const { email } = body;

	if (!email) {
		return new NextResponse('Missing email field', { status: 400 });
	}

	if (!isValidEmail(email)) {
		return new NextResponse('Invalid email format', { status: 400 });
	}

	const session = await getServerSession(authOptions);
	const formattedEmail = email.toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email: formattedEmail,
		},
	});

	if (!user) {
		return new NextResponse('User not found', { status: 404 });
	}

	const isAuthorized = session?.user?.email === email || user?.role === 'ADMIN';

	if (!isAuthorized) {
		logger.warn('Unauthorized delete attempt', {
			requestedEmail: formattedEmail,
			requestingUser: session?.user?.email,
		});
		return new NextResponse('Unauthorized', { status: 401 });
	}

	const isDemoUser = user?.email?.includes('demo-');

	if (isDemoUser) {
		return new NextResponse("Can't delete demo user", { status: 401 });
	}

	try {
		await prisma.user.delete({
			where: {
				email: formattedEmail,
			},
		});

		logger.info('User deleted successfully', { email: formattedEmail });
		return new NextResponse('Account deleted successfully', { status: 200 });
	} catch (error) {
		logger.error('Failed to delete user', {
			email: formattedEmail,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		return new NextResponse(
			'Failed to delete account. Please try again later.',
			{ status: 500 }
		);
	}
}
