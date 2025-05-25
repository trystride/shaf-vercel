import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { matchAnnouncementsWithKeywords } from '@/lib/matchAnnouncements';
import { z } from 'zod';

// Define the schema for the request body
const CreateMatchesBodySchema = z.object({
	since: z.string().transform((str) => new Date(str)),
});

// Type for the parsed request body
type CreateMatchesBody = z.infer<typeof CreateMatchesBodySchema>;

/**
 * POST handler for creating matches between announcements and keywords
 * @param req Request object containing the 'since' date in the body
 * @returns NextResponse with the created matches or error information
 */
export async function POST(req: Request) {
	try {
		// Validate CRON_SECRET
		const headersList = headers();
		const authHeader = headersList.get('authorization');

		// Only allow cron jobs with valid CRON_SECRET
		if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			console.error('Unauthorized access attempt to create-matches endpoint');
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body with robust error handling
		let rawBody: string = '';
		let body: CreateMatchesBody;

		try {
			// Clone the request to read the raw body for logging if needed
			const clonedReq = req.clone();
			rawBody = await clonedReq.text();

			// Check if body is empty
			if (!rawBody || rawBody.trim() === '') {
				throw new Error('Empty request body');
			}

			// Parse the JSON
			const jsonBody = JSON.parse(rawBody);
			
			// Validate against schema
			body = CreateMatchesBodySchema.parse(jsonBody);
		} catch (parseError: any) {
			console.error('JSON parsing error:', parseError.message);
			console.error('Raw request body (truncated):', rawBody.substring(0, 200));
			return NextResponse.json(
				{ 
					error: 'Invalid JSON input', 
					details: parseError.message 
				}, 
				{ status: 400 }
			);
		}

		const { since } = body;

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
	} catch (error: any) {
		console.error('Error creating matches:', error);
		return NextResponse.json(
			{ 
				error: 'Failed to create matches', 
				details: error.message || 'Unknown error' 
			},
			{ status: 500 }
		);
	}
}
