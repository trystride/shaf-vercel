import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import {
	fetchBankruptcyAnnouncements,
	storeAnnouncements,
} from '@/lib/announcements';

export const dynamic = 'force-dynamic';

// Set route segment config
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'nodejs';

// Set longer timeout for this route
export const maxDuration = 300; // 5 minutes

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
		const announcements = await fetchBankruptcyAnnouncements().catch(
			(error) => {
				console.error('Error fetching announcements:', error);
				throw error;
			}
		);
		console.log(`Fetched ${announcements.length} announcements`);

		// Store announcements without waiting
		storeAnnouncements(announcements)
			.then(({ newCount }) => {
				console.log(`Stored ${newCount} new announcements`);

				// If this is a cron job and we have new announcements, trigger match creation
				if (isCronJob && newCount > 0) {
					// Trigger match creation as a separate request
					return fetch(
						`${process.env.NEXT_PUBLIC_APP_URL}/api/announcements/create-matches`,
						{
							method: 'POST',
							headers: {
								Authorization: `Bearer ${process.env.CRON_SECRET}`,
								'Content-Type': 'application/json',
							},
						}
					);
				}
			})
			.catch((error) => {
				console.error('Error storing announcements:', error);
			});

		// Return success response immediately
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error in /api/announcements/fetch:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'An error occurred',
			},
			{ status: 500 }
		);
	}
}
