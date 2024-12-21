import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get the current user's keywords
		const keywords = await db.keyword.findMany({
			where: {
				user: {
					email: session.user.email,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(keywords);
	} catch (error) {
		console.error('Error fetching keywords:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred';
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: errorMessage,
			},
			{ status: 500 }
		);
	}
}
