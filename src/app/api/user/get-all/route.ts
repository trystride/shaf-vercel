import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLogger } from '@/utils/logger';
import { rateLimit } from '@/lib/rateLimit';

const logger = createLogger('GetAllUsersAPI');
const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

export const dynamic = 'force-dynamic';

export async function GET(_request: Request) {
	try {
		// Rate limiting
		await limiter.check(10, 'GET_ALL_USERS'); // 10 requests per minute
	} catch {
		return new NextResponse('Too Many Requests', { status: 429 });
	}

	// Authorization check
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) {
		logger.warn('Unauthorized access attempt to get all users');
		return new NextResponse('Unauthorized', { status: 401 });
	}

	// Check if user is admin
	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		select: { role: true },
	});

	if (user?.role !== 'ADMIN') {
		logger.warn('Non-admin user attempted to get all users', {
			email: session.user.email,
		});
		return new NextResponse('Forbidden', { status: 403 });
	}

	try {
		// Get users with limited fields for security
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				emailVerified: true,
				// Exclude sensitive fields like password
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		logger.info('Users list retrieved successfully', {
			count: users.length,
			requestedBy: session.user.email,
		});

		return new NextResponse(JSON.stringify(users), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		logger.error('Failed to retrieve users', {
			error: error instanceof Error ? error.message : 'Unknown error',
			requestedBy: session.user.email,
		});
		return new NextResponse('Failed to retrieve users', { status: 500 });
	}
}
