import { db } from './db';
import logger from './logger';
import type { Match } from '@prisma/client';

export async function matchAnnouncementsWithKeywords(
	since?: Date
): Promise<Match[]> {
	try {
		const defaultDate = new Date();
		defaultDate.setDate(defaultDate.getDate() - 1); // Default to 1 day ago

		// Get announcements since the specified date
		const recentAnnouncements = await db.announcement.findMany({
			where: {
				publishDate: {
					gte: since || defaultDate,
				},
			},
		});

		logger.info(
			`Found ${recentAnnouncements.length} announcements since ${since || defaultDate}`
		);

		// Get all enabled keywords
		const activeKeywords = await db.keyword.findMany({
			where: {
				enabled: true,
			},
			include: {
				user: true,
			},
		});

		// Create matches
		const matches: Match[] = [];
		const userMatches = new Map<string, Match[]>();

		// For each announcement
		for (const announcement of recentAnnouncements) {
			const announcementText =
				`${announcement.title} ${announcement.description}`.toLowerCase();

			// For each keyword
			for (const keyword of activeKeywords) {
				const keywordText = keyword.term.toLowerCase();

				// If the announcement contains the keyword
				if (announcementText.includes(keywordText)) {
					const match = await db.match.create({
						data: {
							announcementId: announcement.id,
							keywordId: keyword.id,
						},
					});
					matches.push(match);

					// Group matches by user
					const userMatchList = userMatches.get(keyword.userId) || [];
					userMatchList.push(match);
					userMatches.set(keyword.userId, userMatchList);
				}
			}
		}

		logger.info(`Created ${matches.length} matches`);

		// Create digest queue entries for users with matches
		for (const [userId, userMatchList] of userMatches.entries()) {
			await db.digestQueue.create({
				data: {
					frequency: 'DAILY',
					scheduledFor: new Date(),
					matches: {
						connect: userMatchList.map((match: Match) => ({ id: match.id })),
					},
					userId, // This will automatically connect to the user
				},
			});
		}

		return matches;
	} catch (error) {
		logger.error('Error in matchAnnouncementsWithKeywords:', error);
		throw error;
	}
}
