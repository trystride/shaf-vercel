import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookService } from '@/paylink/services/WebhookService';
import { SubscriptionService } from '@/paylink/services/SubscriptionService';
import { PaylinkClient } from '@/paylink/client';
import { prisma } from '@/lib/prisma';
import { createLogger } from '@/utils/logger';

const logger = createLogger('WebhookAPI');

// Verify webhook signature
const verifyWebhookSignature = (
	signature: string | null,
	_rawBody: string
): boolean => {
	if (!signature) return false;

	// Add your signature verification logic here
	// This should match your Paylink webhook signature verification requirements
	return true; // Replace with actual verification
};

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	try {
		// Check environment variables at runtime
		if (!process.env.PAYLINK_API_ID) {
			logger.error('Missing PAYLINK_API_ID');
			return NextResponse.json(
				{ error: 'Missing PAYLINK_API_ID configuration' },
				{ status: 500 }
			);
		}

		if (!process.env.PAYLINK_SECRET_KEY) {
			logger.error('Missing PAYLINK_SECRET_KEY');
			return NextResponse.json(
				{ error: 'Missing PAYLINK_SECRET_KEY configuration' },
				{ status: 500 }
			);
		}

		// Initialize client with runtime configuration
		const paylinkClient = new PaylinkClient({
			apiId: process.env.PAYLINK_API_ID,
			secretKey: process.env.PAYLINK_SECRET_KEY,
			baseUrl: process.env.PAYLINK_BASE_URL || 'https://restapi.paylink.sa/api',
		});

		const subscriptionService = new SubscriptionService(paylinkClient);
		const webhookService = new WebhookService(prisma, subscriptionService);

		const headersList = headers();
		const signature = headersList.get('x-paylink-signature');

		// Get raw body for signature verification
		const rawBody = await request.text();

		// Verify webhook signature
		if (!verifyWebhookSignature(signature, rawBody)) {
			logger.warn('Invalid webhook signature received');
			return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
		}

		// Parse the body as JSON
		const data = JSON.parse(rawBody);

		// Process the webhook event
		const result = await webhookService.processWebhook(data);

		logger.info('Webhook processed successfully', {
			event: data.event,
			result,
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		logger.error('Error processing webhook', {
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
