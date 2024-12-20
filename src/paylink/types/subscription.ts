import { SubscriptionStatus, BillingCycle } from '@prisma/client';

export interface SubscriptionPlan {
	id: string;
	name: string;
	price: number;
	keywordsLimit: number; // Maximum number of keywords user can create
	features: {
		name: string;
		enabled: boolean;
		limit?: number;
	}[];
	billingCycle: BillingCycle;
	trialDays?: number;
	isTrial?: boolean;
}

export interface UserSubscription {
	id: string;
	userId: string;
	planId: string;
	status: SubscriptionStatus;
	billingCycle: BillingCycle;
	startDate: Date;
	endDate?: Date;
	trialEndsAt?: Date;
	cancelledAt?: Date;
	features: {
		id: string;
		name: string;
		enabled: boolean;
		limit?: number;
		used: number;
	}[];
	transactions: {
		id: string;
		amount: number;
		currency: string;
		status: string;
		paylinkTransactionId?: string;
		createdAt: Date;
	}[];
}

export const defaultFeatures = {
	KEYWORD_MANAGEMENT: 'keyword_management',
	EMAIL_NOTIFICATIONS: 'email_notifications',
	ANNOUNCEMENT_HISTORY: 'announcement_history',
	NOTIFICATION_SETTINGS: 'notification_settings',
};

export interface KeywordUsage {
	userId: string;
	month: string; // YYYY-MM format
	count: number;
	limit: number;
}
