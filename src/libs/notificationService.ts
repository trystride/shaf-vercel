import prisma from './prisma';
import { sendEmail } from './email';
import { Match } from '@prisma/client';
import { generateImmediateNotification } from '@/emails/templates/immediateNotification';
import { generateDigestNotification } from '@/emails/templates/digestNotification';

export async function processNotifications(matches: Match[]) {
	// Group matches by user
	const userMatches = await groupMatchesByUser(matches);

	// Process immediate notifications
	await processImmediateNotifications(userMatches);

	// Queue matches for digest notifications
	await queueDigestNotifications(userMatches);
}

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

		await sendImmediateNotification(user.email!, matches);
	}
}

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

type AnnouncementWithKeyword = {
	id: string;
	annId: string;
	title: string;
	description: string;
	announcementUrl: string;
	publishDate: Date;
	createdAt: Date;
	updatedAt: Date;
	keyword: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		term: string;
		userId: string;
		enabled: boolean;
	};
};

async function sendImmediateNotification(email: string, matches: Match[]) {
	const matchesWithDetails = await Promise.all(
		matches.map(async (match) => {
			const [announcement, keyword] = await Promise.all([
				prisma.announcement.findUnique({
					where: { id: match.announcementId },
				}),
				prisma.keyword.findUnique({
					where: { id: match.keywordId },
				}),
			]);

			if (!announcement || !keyword) return null;

			return {
				...announcement,
				keyword,
			};
		})
	);

	const validMatches = matchesWithDetails.filter((match): match is AnnouncementWithKeyword => match !== null);

	if (validMatches.length === 0) return;

	const user = await prisma.user.findFirst({
		where: {
			id: (
				await prisma.keyword.findUnique({
					where: { id: matches[0].keywordId },
				})
			)?.userId,
		},
	});

	const emailContent = generateImmediateNotification({
		announcements: validMatches,
		userName: user?.name,
	});

	const subject = 'New Bankruptcy Announcements Found';

	try {
		await sendEmail({
			to: email,
			subject,
			html: emailContent,
		});

		// Record successful notification
		const notifications = await Promise.all(
			matches.map(async (match) =>
				prisma.notificationHistory.create({
					data: {
						userId: match.keyword.userId,
						type: 'EMAIL',
						status: 'SENT',
						subject,
						content: emailContent,
						match: {
							connect: { id: match.id },
						},
					},
				})
			)
		);

		const validNotifications = notifications.filter(
			(n): n is NonNullable<typeof n> => n !== null
		);
	} catch (error) {
		console.error('Error sending immediate notification:', error);

		// Record failed notification
		await prisma.notificationHistory.create({
			data: {
				userId: matches[0].keyword.userId,
				type: 'EMAIL',
				status: 'FAILED',
				subject,
				content: emailContent,
				error: error instanceof Error ? error.message : 'Unknown error',
				matches: {
					connect: matches.map((m) => ({ id: m.id })),
				},
			},
		});

		throw error;
	}
}

export async function processDigestNotifications() {
	try {
		const now = new Date();

		// Find all pending digests that are due
		const pendingDigests = await prisma.digestQueue.findMany({
			where: {
				sent: false,
				scheduledFor: {
					lte: now,
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

		for (const digest of pendingDigests) {
			if (!digest.user.email) continue;

			// Generate and send digest email
			const emailContent = await generateDigestNotification(digest);
			await sendEmail({
				to: digest.user.email,
				subject: `Your ${digest.frequency.toLowerCase()} Bankruptcy Announcements Digest`,
				html: emailContent,
			});

			// Mark digest as sent
			await prisma.digestQueue.update({
				where: { id: digest.id },
				data: { sent: true },
			});
		}

		return pendingDigests.length;
	} catch (error) {
		console.error('Error processing digest notifications:', error);
		throw error;
	}
}

function calculateNextDigestTime(preferences: {
	emailFrequency: string;
	emailDigestDay?: string | null;
	emailDigestTime?: string | null;
}): Date {
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
