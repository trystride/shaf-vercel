import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PaylinkWebhookEvent } from '@/paylink/types/webhook';
import { WebhookService } from '@/paylink/services/WebhookService';
import { SubscriptionService } from '@/paylink/services/SubscriptionService';
import { PaylinkClient } from '@/paylink/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const paylinkClient = new PaylinkClient({
  apiId: process.env.PAYLINK_API_ID!,
  secretKey: process.env.PAYLINK_SECRET_KEY!,
  baseUrl: process.env.PAYLINK_BASE_URL!,
});

const subscriptionService = new SubscriptionService(paylinkClient, prisma);
const webhookService = new WebhookService(subscriptionService, prisma);

// Verify webhook signature
const verifyWebhookSignature = (signature: string | null, rawBody: string): boolean => {
  if (!signature) return false;
  
  // Add your signature verification logic here
  // This should match your Paylink webhook signature verification requirements
  return true; // Replace with actual verification
};

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const signature = headersList.get('x-paylink-signature');
    const rawBody = await request.text();
    
    // Verify webhook signature
    if (!verifyWebhookSignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const body = JSON.parse(rawBody) as PaylinkWebhookEvent;
    
    // Process the webhook event
    await webhookService.processWebhook(body);
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
