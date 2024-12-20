import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/libs/auth';
import prisma from '@/libs/prisma';
import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { db } from '@/libs/db';
import { matchAnnouncementsWithKeywords } from '@/libs/matchAnnouncements';
import fetch from 'node-fetch';
import https from 'node:https';
import { AbortController } from 'node-abort-controller';

const querySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	sortBy: z.enum(['date', 'relevance']).default('date'),
	sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Types
const BankruptcyAnnouncementSchema = z.object({
	AnnId: z.number(),
	Id: z.number(),
	ActionType: z.string(),
	ActionTypeID: z.number(),
	ActionTypeEn: z.string(),
	CourtType: z.string(),
	AnnouncementType: z.string(),
	Status: z.string().nullable(),
	RequestId: z.number(),
	StatusId: z.number(),
	Header: z.string(),
	Comment: z.string(),
	Body: z.string().nullable(),
	PublishDate: z.string().refine(
		(date) => {
			const parsed = new Date(date);
			return !Number.isNaN(parsed.getTime());
		},
		{
			message: 'Invalid date format',
		}
	),
	debtorName: z.string().nullable().optional(),
	ActionDate: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	AnnCreatedDate: z.string().nullable().optional(),
	PageItems: z.any().optional(),
	debtorIdentifier: z.string().nullable().optional(),
});

type BankruptcyAnnouncement = z.infer<typeof BankruptcyAnnouncementSchema>;

// Authorization helper

// Timeout wrapper
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error(`Operation timed out after ${timeoutMs}ms`));
		}, timeoutMs);

		promise
			.then((result: T) => {
				clearTimeout(timeoutId);
				resolve(result);
			})
			.catch((error: unknown) => {
				clearTimeout(timeoutId);
				reject(error);
			});
	});
};

// Retry wrapper with exponential backoff
async function withRetry<T>(
	operation: () => Promise<T>,
	maxRetries = 3,
	baseDelay = 1000
): Promise<T> {
	let lastError = new Error('Operation failed after maximum retries');

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			if (attempt < maxRetries - 1) {
				const delay = baseDelay * 2 ** attempt;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw lastError;
}

// Fetch announcements from external API
async function fetchBankruptcyAnnouncements(): Promise<
	BankruptcyAnnouncement[]
> {
	const apiUrl =
		process.env.BANKRUPTCY_API_URL ||
		'https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI/';
	console.info('Starting API request to:', apiUrl);

	try {
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false,
		});

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

		console.debug('Making fetch request with headers');
		const response = await fetch(apiUrl, {
			headers: {
				Accept: 'application/json',
				'User-Agent': 'Mozilla/5.0 (compatible; BankruptcyMonitor/1.0)',
				'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
				'Cache-Control': 'no-cache',
			},
			agent: httpsAgent,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		console.debug(`Response status: ${response.status} ${response.statusText}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API error response:', {
				status: response.status,
				statusText: response.statusText,
				body: errorText.substring(0, 500),
			});
			throw new Error(
				`API request failed with status ${response.status}: ${errorText.substring(
					0,
					200
				)}`
			);
		}

		const text = await response.text();
		console.debug(`Received response of length: ${text.length}`);

		if (text.length === 0) {
			throw new Error('Empty response received from API');
		}

		console.debug('Raw API response:', text.substring(0, 500));

		let announcements: BankruptcyAnnouncement[] | null = null;
		try {
			// The API returns a JSON string that's double-encoded
			// First, remove any XML wrapper if present
			const xmlMatch = text.match(/<string[^>]*>(.*)<\/string>/s);
			const jsonText = xmlMatch ? xmlMatch[1] : text;

			// Then handle the double-encoded JSON
			// First parse: Convert the string into a JSON string
			const parsed = JSON.parse(jsonText);
			// Second parse: Parse the actual JSON data
			announcements = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;

			console.debug('Parsed announcements structure:', {
				type: typeof announcements,
				isArray: Array.isArray(announcements),
				length: Array.isArray(announcements) ? announcements.length : 0,
				sample:
					Array.isArray(announcements) && announcements.length > 0
						? Object.keys(announcements[0])
						: null,
			});
		} catch (e) {
			console.error('Parse error:', e);
			console.debug('Response format:', text.substring(0, 1000));
			throw new Error('Failed to parse API response');
		}

		if (!Array.isArray(announcements)) {
			console.error('Unexpected response format:', typeof announcements);
			console.debug('Response content:', announcements);
			throw new Error('API response is not an array');
		}

		console.info(`Successfully parsed ${announcements.length} announcements`);

		// Validate the data
		const validated = z
			.array(BankruptcyAnnouncementSchema)
			.parse(announcements);
		console.debug(`Validated ${validated.length} announcements`);

		return validated;
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching announcements:', error.message);
		} else {
			console.error('Error fetching announcements:', error);
		}
		throw error;
	}
}

// Store announcements in database
async function storeAnnouncements(
	announcements: BankruptcyAnnouncement[]
): Promise<{
	newCount: number;
	errors: Array<{ annId: number; error: string }>;
}> {
	const errors = [];
	let newCount = 0;

	for (const ann of announcements) {
		try {
			const existingAnnouncement = await db.announcement.findUnique({
				where: { annId: ann.AnnId.toString() },
			});

			if (!existingAnnouncement) {
				await db.announcement.create({
					data: {
						annId: ann.AnnId.toString(),
						title: ann.Header.trim(),
						description: ann.Comment.trim(),
						announcementUrl: `https://bankruptcy.gov.sa/ar/Pages/AnnouncementDetails.aspx?aid=${ann.AnnId}`,
						publishDate: new Date(ann.PublishDate),
					},
				});
				newCount++;
				console.debug(`Stored announcement: ${ann.AnnId}`);
			}
		} catch (error) {
			errors.push({
				annId: ann.AnnId,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return { newCount, errors };
}

export async function GET(req: NextRequest) {
	try {
		// Check if it's a cron job request
		const headersList = headers();
		const isCronJob = headersList.get('x-cron-job') === 'true';

		if (isCronJob) {
			const startTime = Date.now();
			console.info('Starting announcement fetch process');

			const announcements: BankruptcyAnnouncement[] = [];
			const fetchedAnnouncements = await withTimeout<BankruptcyAnnouncement[]>(
				withRetry(() => fetchBankruptcyAnnouncements()),
				240000
			);
			announcements.push(...(fetchedAnnouncements ?? []));

			const { newCount, errors } = await storeAnnouncements(announcements);

			if (newCount > 0) {
				await matchAnnouncementsWithKeywords();
			}

			const duration = ((Date.now() - startTime) / 1000).toFixed(2);
			console.info(
				`Completed in ${duration}s. Processed ${announcements.length} announcements, ${newCount} new.`
			);

			if (errors.length > 0) {
				console.warn('Encountered errors:', errors);
			}

			return NextResponse.json({
				success: true,
				processed: announcements.length,
				new: newCount,
				errors: errors.length,
				duration: `${duration}s`,
			});
		}

		// Regular API request
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const validatedQuery = querySchema.parse(Object.fromEntries(searchParams));

		const where: Prisma.AnnouncementWhereInput = {
			AND: [
				validatedQuery.search
					? {
							OR: [
								{ title: { contains: validatedQuery.search } },
								{ description: { contains: validatedQuery.search } },
							],
						}
					: {},
				validatedQuery.startDate
					? {
							publishDate: {
								gte: new Date(validatedQuery.startDate),
							},
						}
					: {},
				validatedQuery.endDate
					? {
							publishDate: {
								lte: new Date(validatedQuery.endDate),
							},
						}
					: {},
			],
		};

		const [total, announcements] = await Promise.all([
			prisma.announcement.count({ where }),
			prisma.announcement.findMany({
				where,
				take: validatedQuery.limit,
				skip: (validatedQuery.page - 1) * validatedQuery.limit,
				orderBy: {
					publishDate: validatedQuery.sortOrder,
				},
				include: {
					matches: {
						where: {
							keyword: {
								userId: session.user.id,
							},
						},
						include: { keyword: true },
					},
				},
			}),
		]);

		const totalPages = Math.ceil(total / validatedQuery.limit);
		const hasMore = validatedQuery.page < totalPages;

		revalidatePath('/api/announcements/fetch');

		return NextResponse.json({
			announcements,
			pagination: {
				currentPage: validatedQuery.page,
				totalPages,
				totalItems: total,
				hasMore,
			},
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: 'Invalid query parameters',
					details: error.errors,
				},
				{ status: 400 }
			);
		}

		console.error('Error in GET handler:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
