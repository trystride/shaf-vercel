import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Announcement, Keyword, Match } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		// 1. Check if we have any announcements
		const announcements = await db.announcement.findMany({
			take: 5,
			orderBy: { publishDate: 'desc' },
		});

		// 2. Check if we have any keywords
		const keywords = await db.keyword.findMany({
			take: 5,
		});

		// 3. Check if we have any matches
		const matches = await db.match.findMany({
			take: 5,
			include: {
				announcement: true,
				keyword: true,
			},
		});

		// Create a test announcement if none exist
		if (announcements.length === 0) {
			await db.announcement.create({
				data: {
					annId: 'test-1',
					title: 'إعلان تجريبي',
					description: 'هذا إعلان تجريبي للتأكد من عمل النظام',
					announcementUrl: 'https://example.com',
					publishDate: new Date(),
				},
			});
		}

		return NextResponse.json({
			announcementsCount: announcements.length,
			announcements: announcements.map((a: Announcement) => ({
				id: a.id,
				title: a.title,
				description: a.description,
			})),
			keywordsCount: keywords.length,
			keywords: keywords.map((k: Keyword) => ({
				id: k.id,
				term: k.term,
			})),
			matchesCount: matches.length,
			matches: matches.map(
				(m: Match & { keyword: Keyword; announcement: Announcement }) => ({
					id: m.id,
					keyword: m.keyword.term,
					announcement: m.announcement.title,
				})
			),
		});
	} catch (error) {
		console.error('Debug error:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred';
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
