import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { storeAnnouncements } from '@/lib/announcements';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'nodejs';

// This endpoint handles long-running tasks
export const maxDuration = 60; // Maximum allowed for hobby plan

export async function POST(req: NextRequest) {
	try {
		const headersList = headers();
		const authHeader = headersList.get('authorization');

		// Only allow cron secret
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get announcements from request body
		const { announcements } = await req.json();
		if (!Array.isArray(announcements)) {
			return NextResponse.json(
				{ error: 'Invalid request body' },
				{ status: 400 }
			);
		}

		console.log(`Processing ${announcements.length} announcements...`);

		// Store announcements
		const { newCount, errors } = await storeAnnouncements(announcements);
		console.log(`Stored ${newCount} new announcements`);

		// If we have new announcements, trigger match creation
		if (newCount > 0) {
			console.log('Triggering match creation...');
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_APP_URL}/api/announcements/create-matches`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${process.env.CRON_SECRET}`,
							'Content-Type': 'application/json',
						},
					}
				);

				if (!response.ok) {
					console.error('Match creation failed:', await response.text());
				} else {
					console.log('Match creation triggered successfully');
				}
			} catch (error) {
				console.error('Error triggering match creation:', error);
			}
		}

		return NextResponse.json({
			success: true,
			newCount,
			errors,
		});
	} catch (error) {
		console.error('Error in /api/announcements/process:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'An error occurred',
			},
			{ status: 500 }
		);
	}
}
