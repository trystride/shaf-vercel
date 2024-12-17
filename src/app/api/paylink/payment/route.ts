import { NextResponse } from 'next/server';
import { PaylinkClient } from '@/paylink/client';
import { isAuthorized } from '@/libs/isAuthorized';

// Helper function
const getCallbackUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${path}`;
};

// Log environment variables (without sensitive data)
console.log('Environment check:', {
  hasApiId: !!process.env.PAYLINK_API_ID,
  hasSecretKey: !!process.env.PAYLINK_SECRET_KEY,
  baseUrl: process.env.PAYLINK_BASE_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!process.env.PAYLINK_API_ID || !process.env.PAYLINK_SECRET_KEY) {
  console.error('Missing Paylink configuration');
  throw new Error('Missing Paylink configuration. Please check your .env file.');
}

const paylinkClient = new PaylinkClient({
  apiId: process.env.PAYLINK_API_ID,
  secretKey: process.env.PAYLINK_SECRET_KEY,
  baseUrl: process.env.PAYLINK_BASE_URL || 'https://restapi.paylink.sa/api',
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Payment request data:', {
      ...data,
      amount: Number(data.amount),
    });

    const user = await isAuthorized();
    console.log('Authorized user:', {
      email: user?.email,
      name: user?.name,
    });
    
    const callbackUrl = data.callBackUrl || getCallbackUrl('/');
    
    const invoiceData = {
      amount: Number(data.amount),
      merchantOrderNumber: `ORDER-${Date.now()}`,
      customerEmail: user?.email || undefined,
      customerName: user?.name || undefined,
      callBackUrl: callbackUrl,
      success_url: callbackUrl,
      cancel_url: callbackUrl,
      language: 'en',
      cardBrands: ['mada', 'visaMastercard', 'stcpay'],
      sendEmail: true
    };

    console.log('Creating invoice with data:', invoiceData);

    const response = await paylinkClient.createInvoice(invoiceData);
    console.log('Paylink response:', response);

    if (!response.success || !response.data) {
      console.error('Failed to create payment:', response.error);
      return NextResponse.json(
        { error: response.error?.message || 'Failed to create payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      paymentUrl: response.data.paymentUrl,
      transactionNo: response.data.transactionNo 
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    );
  }
}
