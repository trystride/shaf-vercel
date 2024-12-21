import { NextResponse } from 'next/server';
import { PaylinkClient } from '@/paylink/client';
import { isAuthorized } from '@/lib/isAuthorized';

// Helper function
const getCallbackUrl = (path: string) => {
	return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${path}`;
};

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	try {
		// Check authorization
		const authorized = await isAuthorized(request);
		if (!authorized) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check environment variables at runtime
		if (!process.env.PAYLINK_API_ID) {
			console.error('Missing PAYLINK_API_ID');
			return NextResponse.json(
				{ error: 'Missing PAYLINK_API_ID configuration' },
				{ status: 500 }
			);
		}

		if (!process.env.PAYLINK_SECRET_KEY) {
			console.error('Missing PAYLINK_SECRET_KEY');
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

		// Log configuration status (without sensitive data)
		console.log('Paylink configuration:', {
			hasApiId: !!process.env.PAYLINK_API_ID,
			hasSecretKey: !!process.env.PAYLINK_SECRET_KEY,
			baseUrl: process.env.PAYLINK_BASE_URL,
			siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
		});

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
			sendEmail: true,
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
			transactionNo: response.data.transactionNo,
		});
	} catch (error) {
		console.error('Payment creation error:', error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Failed to create payment',
			},
			{ status: 500 }
		);
	}
}
