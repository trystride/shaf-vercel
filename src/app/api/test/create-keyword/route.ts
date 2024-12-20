import { NextResponse } from 'next/server';
import { db } from '@/libs/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

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

		// Test keywords
		const testKeywords = ['إفلاس', 'تصفية', 'دائن', 'مدين'];

		const createdKeywords = [];

		for (const term of testKeywords) {
			// Check if keyword already exists
			const existingKeyword = await db.keyword.findFirst({
				where: {
					userId: user.id,
					term,
				},
			});

			if (!existingKeyword) {
				const keyword = await db.keyword.create({
					data: {
						term,
						userId: user.id,
					},
				});
				createdKeywords.push(keyword);
			}
		}

		return NextResponse.json({
			message: `Created ${createdKeywords.length} new keywords`,
			keywords: createdKeywords,
		});
	} catch (error) {
		console.error('Error creating keywords:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
