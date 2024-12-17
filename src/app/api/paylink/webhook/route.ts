import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PaylinkClient } from '@/paylink/client';

const paylinkClient = new PaylinkClient({
  apiId: process.env.PAYLINK_API_ID!,
  secretKey: process.env.PAYLINK_SECRET_KEY!,
  baseUrl: process.env.PAYLINK_BASE_URL!,
});

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    // Verify the webhook payload by checking the payment status
    const { transactionNo, orderStatus, amount } = body;
    
    if (orderStatus === 'Paid') {
      // Verify the payment with Paylink API
      const response = await paylinkClient.getInvoice(transactionNo);
      
      if (response.success && response.data?.paid && response.data?.amount === amount) {
        // Payment is verified, update your database here
        // For example: await db.subscription.update({ ... })
        
        return NextResponse.json({ success: true });
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid payment status' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
