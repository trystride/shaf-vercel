import { prisma } from './prisma';
import { sendEmail } from './email';
import type { Match, Announcement, Keyword, User } from '@prisma/client';
import { generateImmediateNotification } from '@/emails/templates/immediateNotification';
import { generateDigestNotification } from '@/emails/templates/digestNotification';
import { createLogger } from '@/utils/logger';
import axios from 'axios';

const logger = createLogger('NotificationService');
const PLUNK_API_URL = 'https://api.useplunk.com/v1/send';
const PLUNK_API_KEY = process.env.PLUNK_API_KEY;

/**
 * Represents a match with its associated keyword and announcement details
 */
type MatchWithDetails = {
	match: Match;
	keyword: Keyword & { user: User };
	announcement: Announcement;
};

// ============= Immediate Notification Functions =============

/**
 * Sends immediate notifications for new matches to relevant users
 * @param matches Array of matches with their associated details
 * @throws Error if sending notifications fails
 */
export async function sendMatchNotifications(matches: MatchWithDetails[]) {
	// Group matches by user
	const userMatches = matches.reduce(
		(acc, match) => {
			const userId = match.keyword.user.id;
			if (!acc[userId]) {
				acc[userId] = {
					user: match.keyword.user,
					matches: [],
				};
			}
			acc[userId].matches.push(match);
			return acc;
		},
		{} as Record<string, { user: User; matches: MatchWithDetails[] }>
	);

	// Send notifications for each user
	for (const { user, matches } of Object.values(userMatches)) {
		await sendEmailNotification(user, matches);
	}
}

/**
 * Sends an email notification to a user about their matches
 * @param user The user to notify
 * @param matches Array of matches to include in the notification
 * @throws Error if PLUNK_API_KEY is not set or if sending email fails
 */
async function sendEmailNotification(user: User, matches: MatchWithDetails[]) {
	if (!PLUNK_API_KEY) {
		logger.error('PLUNK_API_KEY is not set');
		return;
	}

	// Group matches by keyword
	const matchesByKeyword = matches.reduce(
		(acc, match) => {
			const keywordId = match.keyword.id;
			if (!acc[keywordId]) {
				acc[keywordId] = {
					keyword: match.keyword,
					announcements: [],
				};
			}
			acc[keywordId].announcements.push(match.announcement);
			return acc;
		},
		{} as Record<string, { keyword: Keyword; announcements: Announcement[] }>
	);

	const emailContent = generateEmailContent(matchesByKeyword);

	try {
		await axios.post(
			PLUNK_API_URL,
			{
				to: user.email,
				subject: 'New Matches Found!',
				body: emailContent,
			},
			{
				headers: {
					Authorization: `Bearer ${PLUNK_API_KEY}`,
				},
			}
		);
	} catch (error) {
		logger.error('Failed to send email notification:', {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

/**
 * Generates HTML content for email notifications
 * @param matchesByKeyword Record of keywords and their matched announcements
 * @returns HTML string for the email content
 */
function generateEmailContent(
	matchesByKeyword: Record<
		string,
		{ keyword: Keyword; announcements: Announcement[] }
	>
) {
	let content = '<h1>New Matches Found!</h1>';

	for (const { keyword, announcements } of Object.values(matchesByKeyword)) {
		content += `<h2>Keyword: ${keyword.term}</h2>`;
		content += '<ul>';
		for (const announcement of announcements) {
			content += `
        <li>
          <h3>${announcement.title}</h3>
          <p>${announcement.description}</p>
          <a href="${announcement.announcementUrl}">Read More</a>
        </li>
      `;
		}
		content += '</ul>';
	}

	return content;
}

// ============= Digest Notification Functions =============

/**
 * Processes new matches and sends notifications based on user preferences
 * @param matches Array of new matches to process
 * @throws Error if processing fails
 */
export async function processNotifications(matches: Match[]) {
	try {
		// Group matches by user
		const userMatches = await groupMatchesByUser(matches);

		// Process immediate notifications
		await processImmediateNotifications(userMatches);

		// Queue digest notifications
		await queueDigestNotifications(userMatches);
	} catch (error) {
		logger.error('Error processing notifications:', {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

/**
 * Groups matches by user ID and includes user preferences
 * @param matches Array of matches to group
 * @returns Record of user IDs to their matches
 */
async function groupMatchesByUser(matches: Match[]) {
	const userMatches: Record<string, Match[]> = {};

	for (const match of matches) {
		const keyword = await prisma.keyword.findUnique({
			where: { id: match.keywordId },
			include: { user: { include: { notificationPreference: true } } },
		});

		if (!keyword?.user) continue;

		if (!userMatches[keyword.userId]) {
			userMatches[keyword.userId] = [];
		}
		userMatches[keyword.userId].push(match);
	}

	return userMatches;
}

/**
 * Processes and sends immediate notifications for users who have chosen that preference
 * @param userMatches Record of user IDs to their matches
 */
async function processImmediateNotifications(
	userMatches: Record<string, Match[]>
) {
	for (const [userId, matches] of Object.entries(userMatches)) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { notificationPreference: true },
		});

		if (!user?.notificationPreference?.emailEnabled) continue;
		if (user.notificationPreference.emailFrequency !== 'IMMEDIATE') continue;

		if (!user || !user.email) {
			logger.error('User or email not found for immediate notification');
			continue;
		}

		await sendImmediateNotification(user.email, matches);
	}
}

/**
 * Queues matches for digest notifications based on user preferences
 * @param userMatches Record of user IDs to their matches
 */
async function queueDigestNotifications(userMatches: Record<string, Match[]>) {
	for (const [userId, matches] of Object.entries(userMatches)) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { notificationPreference: true },
		});

		if (!user?.notificationPreference?.emailEnabled) continue;
		if (user.notificationPreference.emailFrequency === 'IMMEDIATE') continue;

		await prisma.digestQueue.create({
			data: {
				userId,
				matches: { connect: matches.map((m) => ({ id: m.id })) },
				frequency: user.notificationPreference.emailFrequency,
				scheduledFor: calculateNextDigestTime(user.notificationPreference),
			},
		});
	}
}

/**
 * Sends an immediate notification for a set of matches
 * @param email Recipient email address
 * @param matches Array of matches to include in the notification
 * @returns Number of matches processed
 * @throws Error if sending notification fails
 */
export async function sendImmediateNotification(
	email: string,
	matches: Match[]
) {
	let matchWithKeyword = null;
	try {
		// Get the first match with its keyword data to get the user
		matchWithKeyword = await prisma.match.findFirst({
			where: { id: matches[0].id },
			include: { keyword: true },
		});

		if (!matchWithKeyword) {
			throw new Error('Match not found');
		}

		// Get user data for the notification
		const user = await prisma.user.findUnique({
			where: { id: matchWithKeyword.keyword.userId },
		});

		if (!user) {
			throw new Error('User not found');
		}

		// Get full announcement data for all matches
		const matchesWithData = await Promise.all(
			matches.map(async (match) => {
				const matchData = await prisma.match.findUnique({
					where: { id: match.id },
					include: {
						announcement: true,
						keyword: true,
					},
				});

				if (!matchData) {
					throw new Error(`Match data not found for id: ${match.id}`);
				}

				return matchData;
			})
		);

		// Generate email content
		const emailContent = generateImmediateNotification({
			announcements: matchesWithData.map((match) => ({
				...match.announcement,
				keyword: match.keyword,
			})),
			userName: user.name || undefined,
		}) as string;

		// Send email
		await sendEmail({
			to: email,
			subject: 'New Bankruptcy Announcements Found',
			html: emailContent,
		});

		// Create notification record
		const notification = await prisma.notificationHistory.create({
			data: {
				userId: matchWithKeyword.keyword.userId,
				type: 'EMAIL',
				status: 'SENT',
				subject: 'New Bankruptcy Announcements Found',
				content: emailContent,
			},
		});

		// Connect matches to notification
		await Promise.all(
			matches.map((match) =>
				prisma.match.update({
					where: { id: match.id },
					data: {
						notifications: {
							connect: { id: notification.id },
						},
					},
				})
			)
		);

		// Return number of matches processed
		return matches.length;
	} catch (error) {
		logger.error('Error sending immediate notification', {
			error: error instanceof Error ? error.message : String(error),
		});

		// Record failed notification
		const failedNotification = await prisma.notificationHistory.create({
			data: {
				userId: matchWithKeyword?.keyword?.userId ?? '',
				type: 'EMAIL',
				status: 'FAILED',
				subject: 'New Bankruptcy Announcements Found',
				content: '',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
		});

		// Connect matches to failed notification
		await Promise.all(
			matches.map((match) =>
				prisma.match.update({
					where: { id: match.id },
					data: {
						notifications: {
							connect: { id: failedNotification.id },
						},
					},
				})
			)
		);

		throw error;
	}
}

/**
 * Processes and sends digest notifications that are due
 * @returns Number of digests processed
 * @throws Error if processing fails
 */
export async function processDigestNotifications() {
	try {
		const digests = await prisma.digestQueue.findMany({
			where: {
				sent: false,
				scheduledFor: {
					lte: new Date(),
				},
			},
			include: {
				user: true,
				matches: {
					include: {
						announcement: true,
						keyword: true,
					},
				},
			},
		});

		for (const digest of digests) {
			try {
				// Generate and send digest email
				const emailContent = generateDigestNotification({
					announcements: digest.matches.map(
						(m: Match & { announcement: Announcement; keyword: Keyword }) => ({
							...m.announcement,
							keyword: m.keyword,
						})
					),
					userName: digest.user.name || undefined,
					frequency: digest.frequency as 'DAILY' | 'WEEKLY',
					periodStart: new Date(digest.scheduledFor),
					periodEnd: new Date(),
				}) as string;

				const userEmail = digest.user.email;
				if (!userEmail) {
					logger.error('User email not found for digest notification');
					continue;
				}

				await sendEmail({
					to: userEmail,
					subject: `Your ${digest.frequency.toLowerCase()} Bankruptcy Announcements Digest`,
					html: emailContent,
				});

				// Mark digest as sent
				await prisma.digestQueue.update({
					where: { id: digest.id },
					data: { sent: true },
				});

				// Record successful notification
				await prisma.notificationHistory.create({
					data: {
						userId: digest.user.id,
						type: 'EMAIL',
						status: 'SENT',
						subject: `Your ${digest.frequency.toLowerCase()} Bankruptcy Announcements Digest`,
						content: emailContent,
						matches: {
							connect: digest.matches.map(
								(
									m: Match & { announcement: Announcement; keyword: Keyword }
								) => ({
									id: m.id,
								})
							),
						},
					},
				});
			} catch (error) {
				logger.error('Error sending digest notification', {
					error: error instanceof Error ? error.message : String(error),
				});

				// Record failed notification
				await prisma.notificationHistory.create({
					data: {
						userId: digest.user.id,
						type: 'EMAIL',
						status: 'FAILED',
						subject: `Your ${digest.frequency.toLowerCase()} Bankruptcy Announcements Digest`,
						content: '',
						error: error instanceof Error ? error.message : 'Unknown error',
						matches: {
							connect: digest.matches.map(
								(
									m: Match & { announcement: Announcement; keyword: Keyword }
								) => ({
									id: m.id,
								})
							),
						},
					},
				});
			}
		}

		return digests.length;
	} catch (error) {
		logger.error('Error processing digest notifications', {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

/**
 * Calculates the next digest time based on user preferences
 * @param preferences User's email preferences
 * @returns Date object representing the next digest time
 */
function calculateNextDigestTime(preferences: {
	emailFrequency: string;
	emailDigestDay?: string | null;
	emailDigestTime?: string | null;
}) {
	const now = new Date();
	const [hours, minutes] = (preferences.emailDigestTime || '09:00')
		.split(':')
		.map(Number);

	const nextDigest = new Date(now);
	nextDigest.setHours(hours, minutes, 0, 0);

	if (nextDigest <= now) {
		if (preferences.emailFrequency === 'DAILY') {
			nextDigest.setDate(nextDigest.getDate() + 1);
		} else if (preferences.emailFrequency === 'WEEKLY') {
			const days = [
				'SUNDAY',
				'MONDAY',
				'TUESDAY',
				'WEDNESDAY',
				'THURSDAY',
				'FRIDAY',
				'SATURDAY',
			];
			const targetDay = days.indexOf(preferences.emailDigestDay || 'MONDAY');
			const currentDay = nextDigest.getDay();

			let daysToAdd = targetDay - currentDay;
			if (daysToAdd <= 0) daysToAdd += 7;

			nextDigest.setDate(nextDigest.getDate() + daysToAdd);
		}
	}

	return nextDigest;
}
