import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import { fetchBankruptcyAnnouncements } from '@/lib/announcements';

export const dynamic = 'force-dynamic';

// Set route segment config
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Use Edge Runtime for longer timeout (30s instead of 10s)
export const runtime = 'edge';

// Vercel has a 30s timeout limit for Edge Runtime
export const maxDuration = 30;

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

		// Phase 1: Quick fetch
		console.log('Phase 1: Fetching announcements...');
		const announcements = await fetchBankruptcyAnnouncements().catch(
			(error) => {
				console.error('Error fetching announcements:', error);
				throw error;
			}
		);
		console.log(`Fetched ${announcements.length} announcements`);

		// Phase 2: Trigger background processing
		console.log('Phase 2: Triggering background processing...');
		fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/announcements/process`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.CRON_SECRET}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ announcements }),
		}).catch((error) => {
			console.error('Error triggering background processing:', error);
		});

		// Return success immediately
		return NextResponse.json({
			success: true,
			message: `Fetched ${announcements.length} announcements. Processing started.`,
		});
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
