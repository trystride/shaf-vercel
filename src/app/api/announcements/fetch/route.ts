import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/libs/db';
import { matchAnnouncementsWithKeywords } from '@/libs/matchAnnouncements';
import nodeFetch from 'node-fetch';
import https from 'https';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

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
  PublishDate: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, {
    message: "Invalid date format"
  }),
  debtorName: z.string().nullable().optional(),
  ActionDate: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  AnnCreatedDate: z.string().nullable().optional(),
  PageItems: z.any().optional(),
  debtorIdentifier: z.string().nullable().optional()
});

type BankruptcyAnnouncement = z.infer<typeof BankruptcyAnnouncementSchema>;

// Authorization helper
function isAuthorized(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  const authHeader = headers().get('Authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

// Timeout wrapper
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

// Retry wrapper with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Fetch announcements from external API
async function fetchBankruptcyAnnouncements(): Promise<BankruptcyAnnouncement[]> {
  const apiUrl = process.env.BANKRUPTCY_API_URL || 'https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI/';
  console.info('Starting API request to:', apiUrl);

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    console.debug('Making fetch request with headers');
    const response = await nodeFetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; BankruptcyMonitor/1.0)',
        'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      agent: httpsAgent,
      timeout: 15000 // 15 second timeout
    });

    console.debug(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500)
      });
      throw new Error(`API request failed with status ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const text = await response.text();
    console.debug(`Received response of length: ${text.length}`);
    
    if (text.length === 0) {
      throw new Error('Empty response received from API');
    }

    console.debug('Raw API response:', text.substring(0, 500));

    let announcements;
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
        sample: Array.isArray(announcements) && announcements.length > 0 ? 
          Object.keys(announcements[0]) : null
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
    const validated = z.array(BankruptcyAnnouncementSchema).parse(announcements);
    console.debug(`Validated ${validated.length} announcements`);
  
    return validated;
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
    throw error;
  }
}

// Store announcements in database
async function storeAnnouncements(announcements: BankruptcyAnnouncement[]): Promise<{
  newCount: number;
  errors: Array<{ annId: number; error: string }>;
}> {
  const errors = [];
  let newCount = 0;

  for (const ann of announcements) {
    try {
      const existingAnnouncement = await db.announcement.findUnique({
        where: { annId: ann.AnnId.toString() }
      });

      if (!existingAnnouncement) {
        await db.announcement.create({
          data: {
            annId: ann.AnnId.toString(),
            title: ann.Header.trim(),
            description: ann.Comment.trim(),
            announcementUrl: `https://bankruptcy.gov.sa/ar/Pages/AnnouncementDetails.aspx?aid=${ann.AnnId}`,
            publishDate: new Date(ann.PublishDate)
          }
        });
        newCount++;
        console.debug(`Stored announcement: ${ann.AnnId}`);
      }
    } catch (error) {
      console.error(`Error processing announcement ${ann.AnnId}:`, error);
      errors.push({
        annId: ann.AnnId,
        error: error.message
      });
    }
  }

  return { newCount, errors };
}

export async function GET() {
  const startTime = Date.now();
  console.info('Starting announcement fetch process');

  try {
    if (!isAuthorized()) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.info('Authorization passed, fetching announcements...');
    
    // Fetch announcements with retry and timeout
    let announcements;
    try {
      announcements = await withRetry(
        () => withTimeout(fetchBankruptcyAnnouncements(), 30000)
      );
      console.info(`Successfully fetched ${announcements.length} announcements`);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch announcements from the API',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }
    
    // Store announcements
    let storeResult;
    try {
      storeResult = await storeAnnouncements(announcements);
      console.info(`Successfully stored ${storeResult.newCount} new announcements`);
    } catch (error) {
      console.error('Failed to store announcements:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to store announcements in database',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }
    
    // Match announcements with keywords
    let matches;
    try {
      matches = await matchAnnouncementsWithKeywords();
      console.info(`Found ${matches.length} matches`);
    } catch (error) {
      console.error('Failed to match announcements:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to match announcements with keywords',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    const processingTime = Date.now() - startTime;
    console.info(`Completed in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${announcements.length} announcements. Added ${storeResult.newCount} new announcements. Found ${matches.length} new matches.`,
      validationErrors: storeResult.errors.length > 0 ? storeResult.errors : undefined,
      processingTimeMs: processingTime
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Announcement fetch failed:', {
      type: error.constructor.name,
      message: error.message,
      cause: error.cause,
      processingTimeMs: processingTime
    });

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing announcements',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
