import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import {
	fetchBankruptcyAnnouncements,
	storeAnnouncements,
} from '@/lib/announcements';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
	try {
		const headersList = headers();
		const authHeader = headersList.get('authorization');

		// Debug logging
		console.log('Auth header:', authHeader);
		console.log('Expected:', `Bearer ${process.env.CRON_SECRET}`);
		console.log('Match:', authHeader === `Bearer ${process.env.CRON_SECRET}`);

		// Check if this is a cron job request
		const isCronJob = authHeader === `Bearer ${process.env.CRON_SECRET}`;

		if (!isCronJob) {
			const session = await getServerSession(authOptions);
			if (!session?.user?.email) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}
		}

		// Only fetch and store announcements
		console.log('Fetching announcements...');
		const announcements = await fetchBankruptcyAnnouncements();
		console.log(`Fetched ${announcements.length} announcements`);

		// Store announcements without waiting
		storeAnnouncements(announcements).then(({ newCount, errors }) => {
			console.log(`Stored ${newCount} new announcements`);

			// If this is a cron job and we have new announcements, trigger match creation
			if (isCronJob && newCount > 0) {
				// Trigger match creation as a separate request
				fetch(
					`${process.env.NEXT_PUBLIC_APP_URL}/api/announcements/create-matches`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${process.env.CRON_SECRET}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							since: new Date(Date.now() - 24 * 60 * 60 * 1000),
						}),
					}
				).catch((error) => {
					console.error('Failed to trigger match creation:', error);
				});

				console.log('Triggered match creation');
			}
		}).catch((error) => {
			console.error('Error storing announcements:', error);
		});

		return NextResponse.json({
			message: `Fetched ${announcements.length} announcements. Storage and matching in progress.`,
		});
	} catch (error) {
		logger.error('Error in fetch announcements:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
