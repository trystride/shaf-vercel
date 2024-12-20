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

		const [users, keywords, announcements, matches] = await Promise.all([
			db.user.findMany(),
			db.keyword.findMany(),
			db.announcement.findMany({
				take: 5,
				orderBy: { publishDate: 'desc' },
			}),
			db.match.findMany({
				include: {
					keyword: true,
					announcement: true,
				},
			}),
		]);

		return NextResponse.json({
			users: users.length,
			keywords: keywords.length,
			announcements: announcements.length,
			matches: matches.length,
			sampleData: {
				keywords: keywords.map((k) => ({ id: k.id, term: k.term })),
				announcements: announcements.map((a) => ({
					id: a.id,
					title: a.title,
					publishDate: a.publishDate,
				})),
				matches: matches.map((m) => ({
					id: m.id,
					keyword: m.keyword.term,
					announcement: m.announcement.title,
				})),
			},
		});
	} catch (error) {
		console.error('Error checking data:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
