import { z } from 'zod';
import { db } from './db';
import fetch from 'node-fetch';
import logger from './logger';

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

// Fetch announcements from external API
export async function fetchBankruptcyAnnouncements(): Promise<
	BankruptcyAnnouncement[]
> {
	const apiUrl =
		process.env.BANKRUPTCY_API_URL ||
		'https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI/';
	logger.info('Starting API request to:', apiUrl);

	try {
		// Create an AbortController with a 5-second timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
			logger.warn('API request timed out after 5 seconds');
		}, 5000);

		logger.info('Making fetch request with headers');
		try {
			const response = await fetch(apiUrl, {
				headers: {
					Accept: 'application/json',
					'User-Agent': 'Mozilla/5.0 (compatible; BankruptcyMonitor/1.0)',
					'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
					'Cache-Control': 'no-cache',
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);
			logger.info(`Response status: ${response.status} ${response.statusText}`);

			if (!response.ok) {
				const errorText = await response.text();
				logger.error('API error response:', {
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
			logger.info(`Received response of length: ${text.length}`);

			if (text.length === 0) {
				throw new Error('Empty response received from API');
			}

			logger.info('Raw API response:', text.substring(0, 500));

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
				announcements =
					typeof parsed === 'string' ? JSON.parse(parsed) : parsed;

				logger.info('Parsed announcements structure:', {
					type: typeof announcements,
					isArray: Array.isArray(announcements),
					length: Array.isArray(announcements) ? announcements.length : 0,
					sample:
						Array.isArray(announcements) && announcements.length > 0
							? Object.keys(announcements[0])
							: null,
				});
			} catch (e) {
				logger.error('Parse error:', e);
				logger.info('Response format:', text.substring(0, 1000));
				throw new Error('Failed to parse API response');
			}

			if (!Array.isArray(announcements)) {
				logger.error('Unexpected response format:', typeof announcements);
				logger.info('Response content:', announcements);
				throw new Error('API response is not an array');
			}

			logger.info(`Successfully parsed ${announcements.length} announcements`);
			return announcements;
		} catch (error) {
			clearTimeout(timeoutId);
			throw error;
		}
	} catch (error) {
		if (error instanceof Error) {
			logger.error('Error fetching announcements:', error.message);
		} else {
			logger.error('Error fetching announcements:', error);
		}
		throw error;
	}
}

// Store announcements in database
export async function storeAnnouncements(rawAnnouncements: unknown[]): Promise<{
	newCount: number;
	errors: Array<{ annId: number; error: string }>;
}> {
	const errors: Array<{ annId: number; error: string }> = [];
	let newCount = 0;

	try {
		// Validate the data
		const announcements = z
			.array(BankruptcyAnnouncementSchema)
			.parse(rawAnnouncements);
		logger.info(`Validated ${announcements.length} announcements`);

		// Process in batches of 10
		const batchSize = 10;
		for (let i = 0; i < announcements.length; i += batchSize) {
			const batch = announcements.slice(i, i + batchSize);

			await Promise.all(
				batch.map(async (announcement) => {
					try {
						const exists = await db.announcement.findUnique({
							where: { annId: announcement.AnnId.toString() },
						});

						if (!exists) {
							await db.announcement.create({
								data: {
									annId: announcement.AnnId.toString(),
									title: announcement.Header.trim(),
									description: announcement.Comment.trim(),
									announcementUrl: `https://bankruptcy.gov.sa/ar/Pages/AnnouncementDetails.aspx?aid=${announcement.AnnId}`,
									publishDate: new Date(announcement.PublishDate),
								},
							});
							newCount++;
						}
					} catch (error) {
						errors.push({
							annId: announcement.AnnId,
							error: error instanceof Error ? error.message : String(error),
						});
					}
				})
			);
		}
	} catch (error) {
		if (error instanceof Error) {
			logger.error('Error storing announcements:', error.message);
		} else {
			logger.error('Error storing announcements:', error);
		}
		throw error;
	}

	return { newCount, errors };
}
