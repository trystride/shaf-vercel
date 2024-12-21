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

		const user = await db.user.findUnique({
			where: { email: session.user.email },
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Delete existing keywords for this user
		await db.keyword.deleteMany({
			where: {
				userId: user.id,
			},
		});

		// Create test keywords
		const testKeywords = ['تصفية', 'إفلاس', 'دائن', 'مدين'];
		const createdKeywords = [];

		for (const term of testKeywords) {
			const keyword = await db.keyword.create({
				data: {
					term,
					userId: user.id,
				},
			});
			createdKeywords.push(keyword);
		}

		return NextResponse.json({
			message: `Created ${createdKeywords.length} keywords`,
			keywords: createdKeywords,
		});
	} catch (error) {
		console.error('Error creating keywords:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
