import { NextApiRequest, NextApiResponse } from 'next';
import { PaylinkClient } from '../../../paylink/client';
import { SubscriptionService } from '../../../paylink/services/SubscriptionService';
import { PrismaClient, _BillingCycle } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { SubscriptionPlan } from '@/paylink/types/subscription';

const prisma = new PrismaClient();
const paylinkClient = new PaylinkClient({
	apiId: process.env.PAYLINK_API_ID!,
	secretKey: process.env.PAYLINK_SECRET_KEY!,
	baseUrl: process.env.PAYLINK_BASE_URL!,
});

const subscriptionService = new SubscriptionService(paylinkClient, prisma);

const DEFAULT_FEATURES = {
	KEYWORD_MANAGEMENT: 'keyword_management',
	EMAIL_NOTIFICATIONS: 'email_notifications',
	ANNOUNCEMENT_HISTORY: 'announcement_history',
	NOTIFICATION_SETTINGS: 'notification_settings',
};

type PlanId = 'TRIAL' | 'BASIC' | 'PRO' | 'ENTERPRISE';

const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
	TRIAL: {
		id: 'trial',
		name: 'Free Trial',
		price: 0,
		keywordsLimit: 2,
		features: [
			{ name: DEFAULT_FEATURES.KEYWORD_MANAGEMENT, enabled: true },
			{ name: DEFAULT_FEATURES.EMAIL_NOTIFICATIONS, enabled: true },
			{ name: DEFAULT_FEATURES.ANNOUNCEMENT_HISTORY, enabled: true, limit: 10 },
			{ name: DEFAULT_FEATURES.NOTIFICATION_SETTINGS, enabled: true },
		],
		billingCycle: 'trial',
		trialDays: 14,
		isTrial: true,
	},
	BASIC: {
		id: 'basic',
		name: 'Basic Plan',
		price: 9.99,
		keywordsLimit: 5,
		features: [
			{ name: DEFAULT_FEATURES.KEYWORD_MANAGEMENT, enabled: true },
			{ name: DEFAULT_FEATURES.EMAIL_NOTIFICATIONS, enabled: true },
			{ name: DEFAULT_FEATURES.ANNOUNCEMENT_HISTORY, enabled: true },
			{ name: DEFAULT_FEATURES.NOTIFICATION_SETTINGS, enabled: true },
		],
		billingCycle: 'monthly',
	},
	PRO: {
		id: 'pro',
		name: 'Pro Plan',
		price: 19.99,
		keywordsLimit: 15,
		features: [
			{ name: DEFAULT_FEATURES.KEYWORD_MANAGEMENT, enabled: true },
			{ name: DEFAULT_FEATURES.EMAIL_NOTIFICATIONS, enabled: true },
			{ name: DEFAULT_FEATURES.ANNOUNCEMENT_HISTORY, enabled: true },
			{ name: DEFAULT_FEATURES.NOTIFICATION_SETTINGS, enabled: true },
		],
		billingCycle: 'monthly',
	},
	ENTERPRISE: {
		id: 'enterprise',
		name: 'Enterprise Plan',
		price: 49.99,
		keywordsLimit: 50,
		features: [
			{ name: DEFAULT_FEATURES.KEYWORD_MANAGEMENT, enabled: true },
			{ name: DEFAULT_FEATURES.EMAIL_NOTIFICATIONS, enabled: true },
			{ name: DEFAULT_FEATURES.ANNOUNCEMENT_HISTORY, enabled: true },
			{ name: DEFAULT_FEATURES.NOTIFICATION_SETTINGS, enabled: true },
		],
		billingCycle: 'monthly',
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { priceId, amount, callBackUrl } = req.body;
		const session = (await unstable_getServerSession(
			req,
			res,
			authOptions
		)) as any;
		const userId = session?.user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// Get user details
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Get plan details
		const planId = priceId.toUpperCase() as PlanId;
		const plan = SUBSCRIPTION_PLANS[planId];
		if (!plan) {
			return res.status(400).json({ error: 'Invalid plan selected' });
		}

		// For trial plan, don't validate amount since it's free
		if (!plan.isTrial && amount !== plan.price) {
			return res
				.status(400)
				.json({ error: 'Invalid amount for selected plan' });
		}

		// Check if user already has an active subscription
		const activeSubscription = await prisma.subscription.findFirst({
			where: {
				userId,
				status: { in: ['active', 'trial'] },
			},
		});

		if (activeSubscription && !plan.isTrial) {
			// Handle upgrade/downgrade
			if (activeSubscription.planId === plan.id) {
				return res
					.status(400)
					.json({ error: 'Already subscribed to this plan' });
			}
		}

		// Create subscription and get payment URL (or redirect URL for trial)
		const redirectUrl = await subscriptionService.createSubscription(
			userId,
			plan,
			callBackUrl
		);

		res.status(200).json({ paymentUrl: redirectUrl });
	} catch (error) {
		console.error('Subscription creation error:', error);
		res.status(500).json({ error: 'Failed to create subscription' });
	} finally {
		await prisma.$disconnect();
	}
}
