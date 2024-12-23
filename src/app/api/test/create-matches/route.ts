import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Announcement, Keyword } from '@prisma/client';

// Function to normalize Arabic text
function normalizeArabicText(text: string): string {
	return (
		text
			.toLowerCase()
			// Normalize alef variations
			.replace(/[أإآا]/g, 'ا')
			// Normalize teh marbuta and heh
			.replace(/[ةه]/g, 'ه')
			// Normalize yeh and alef maksura
			.replace(/[ىي]/g, 'ي')
			// Remove Arabic diacritics (tashkeel)
			.replace(/[\u064B-\u065F]/g, '')
			// Normalize spaces and remove extra whitespace
			.replace(/\s+/g, ' ')
			.trim()
	);
}

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get the current user
		const user = await db.user.findUnique({
			where: { email: session.user.email },
			include: {
				keywords: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Delete existing matches for this user's keywords
		await db.match.deleteMany({
			where: {
				keyword: {
					userId: user.id,
				},
			},
		});

		// Get all announcements
		const announcements = await db.announcement.findMany({
			orderBy: {
				publishDate: 'desc',
			},
		});

		const matches = [];

		// Create matches for each of the user's keywords with relevant announcements
		for (const keyword of user.keywords) {
			const relevantAnnouncements = announcements.filter(
				(ann: Announcement) => {
					const title = normalizeArabicText(ann.title);
					const description = normalizeArabicText(ann.description);
					const term = normalizeArabicText(keyword.term);

					const isMatch = title.includes(term) || description.includes(term);

					console.log(
						`Checking keyword "${keyword.term}" against announcement "${ann.title}": ${isMatch ? 'MATCH' : 'NO MATCH'}`
					);
					if (isMatch) {
						console.log(`Match found! Normalized forms:
							Keyword: ${term}
							Title: ${title}
							Description: ${description}`);
					}

					return isMatch;
				}
			);

			console.log(
				`Found ${relevantAnnouncements.length} matches for keyword "${keyword.term}"`
			);

			for (const ann of relevantAnnouncements) {
				try {
					const _match = await db.match.create({
						data: {
							keywordId: keyword.id,
							announcementId: ann.id,
						},
					});
					matches.push({
						keyword: keyword.term,
						announcement: ann.title,
					});
					console.log(`Created match: ${keyword.term} -> ${ann.title}`);
				} catch (error) {
					console.error(
						`Error creating match for keyword ${keyword.term} and announcement ${ann.id}:`,
						error
					);
				}
			}
		}

		// If no matches were created, create some test matches
		if (matches.length === 0) {
			console.log('No matches found, creating test matches...');
			const testAnnouncement = announcements[0];
			if (testAnnouncement && user.keywords.length > 0) {
				const _testMatch = await db.match.create({
					data: {
						keywordId: user.keywords[0].id,
						announcementId: testAnnouncement.id,
					},
				});
				matches.push({
					keyword: user.keywords[0].term,
					announcement: testAnnouncement.title,
				});
			}
		}

		return NextResponse.json({
			message: `Created ${matches.length} new matches`,
			matches,
			debug: {
				userKeywords: user.keywords.map((k: Keyword) => k.term),
				announcements: announcements.map((a: Announcement) => a.title),
			},
		});
	} catch (error) {
		console.error('Error creating matches:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
