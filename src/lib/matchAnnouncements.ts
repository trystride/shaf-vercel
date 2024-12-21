import { db } from './db';
import { sendMatchNotifications } from './notifications';
import { normalizeArabicText } from './textUtils';

export async function matchAnnouncementsWithKeywords() {
	try {
		// Get all enabled keywords
		const keywords = await db.keyword.findMany({
			where: { enabled: true },
			include: { user: true },
		});

		// Get announcements from the last 24 hours that haven't been matched yet
		const recentAnnouncements = await db.announcement.findMany({
			where: {
				publishDate: {
					gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
				},
			},
		});

		const matches = [];

		// Check each announcement against each keyword
		for (const announcement of recentAnnouncements) {
			// Normalize announcement text for better matching
			const announcementText = normalizeArabicText(
				`${announcement.title} ${announcement.description}`
			).toLowerCase();

			for (const keyword of keywords) {
				// Normalize keyword term for consistent matching
				const term = normalizeArabicText(keyword.term).toLowerCase();

				// Split term into words for more precise matching
				const terms = term.split(/\s+/).filter((t) => t.length > 0);

				// Check if all terms are present in the announcement
				const isMatch = terms.every((t) => announcementText.includes(t));

				if (isMatch) {
					// Check if this match already exists
					const existingMatch = await db.match.findFirst({
						where: {
							keywordId: keyword.id,
							announcementId: announcement.id,
						},
					});

					if (!existingMatch) {
						// Create new match
						const match = await db.match.create({
							data: {
								keywordId: keyword.id,
								announcementId: announcement.id,
							},
						});
						matches.push({
							match,
							keyword,
							announcement,
						});
					}
				}
			}
		}

		// Send notifications for new matches
		if (matches.length > 0) {
			await sendMatchNotifications(matches);
		}

		return matches;
	} catch (error) {
		console.error('Error matching announcements:', error);
		throw error;
	}
}
