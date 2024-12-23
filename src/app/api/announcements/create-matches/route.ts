import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { matchAnnouncementsWithKeywords } from '@/lib/matchAnnouncements';
import { z } from 'zod';

const requestSchema = z.object({
	since: z.string().transform((str) => new Date(str)),
});

export async function POST(req: Request) {
	try {
		const headersList = headers();
		const authHeader = headersList.get('authorization');

		// Only allow cron jobs
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const body = await req.json();
		const { since } = requestSchema.parse(body);

		console.log('Creating matches for announcements since:', since);

		// Create matches
		const matches = await matchAnnouncementsWithKeywords(since);
		console.log(`Created ${matches.length} matches`);

		// If we have matches, trigger digest creation
		if (matches.length > 0) {
			try {
				await fetch(
					`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/process-digests`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${process.env.CRON_SECRET}`,
							'Content-Type': 'application/json',
						},
					}
				);
				console.log('Triggered digest creation');
			} catch (error) {
				console.error('Failed to trigger digest creation:', error);
			}
		}

		return NextResponse.json({
			message: `Created ${matches.length} matches`,
			matches,
		});
	} catch (error) {
		console.error('Error creating matches:', error);
		return NextResponse.json(
			{ error: 'Failed to create matches' },
			{ status: 500 }
		);
	}
}
