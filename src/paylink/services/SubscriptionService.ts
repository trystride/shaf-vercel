import { PaylinkClient } from '../client';
import { SubscriptionPlan, UserSubscription } from '../types/subscription';
import { CreateInvoiceRequest } from '../types';
import { PrismaClient, BillingCycle } from '@prisma/client';

export class SubscriptionService {
	private paylinkClient: PaylinkClient;
	private prisma: PrismaClient;

	constructor(paylinkClient: PaylinkClient, prisma: PrismaClient) {
		this.paylinkClient = paylinkClient;
		this.prisma = prisma;
	}

	// Create trial subscription
	async createTrialSubscription(
		userId: string,
		plan: SubscriptionPlan
	): Promise<void> {
		// Check if user has already used trial
		const existingTrial = await this.prisma.subscription.findFirst({
			where: {
				userId,
				status: 'trial',
			},
		});

		if (existingTrial) {
			throw new Error('Trial period has already been used');
		}

		const trialDays = plan.trialDays || 14;
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + trialDays);

		await this.prisma.subscription.create({
			data: {
				userId,
				planId: plan.id,
				status: 'trial',
				billingCycle: 'trial',
				startDate,
				endDate,
				trialEndsAt: endDate,
				features: {
					create: plan.features.map((f) => ({
						name: f.name,
						enabled: f.enabled,
						limit: f.limit,
						used: 0,
					})),
				},
			},
		});
	}

	// Create or upgrade subscription
	async createSubscription(
		userId: string,
		plan: SubscriptionPlan,
		callBackUrl: string
	): Promise<string> {
		// If it's a trial plan, create trial subscription
		if (plan.isTrial) {
			await this.createTrialSubscription(userId, plan);
			return callBackUrl;
		}

		const request: CreateInvoiceRequest = {
			amount: plan.price,
			merchantOrderNumber: `SUB-${userId}-${Date.now()}`,
			callBackUrl,
			language: 'en',
		};

		const response = await this.paylinkClient.createInvoice(request);
		if (!response.success) {
			throw new Error('Failed to create subscription payment');
		}

		// Check if upgrading from trial
		const existingSubscription = await this.getUserSubscription(userId);
		const _isTrialUpgrade = existingSubscription?.status === 'trial';

		// Create subscription record
		await this.prisma.subscription.create({
			data: {
				userId,
				planId: plan.id,
				status: 'active',
				billingCycle: plan.billingCycle,
				startDate: new Date(),
				endDate: this.calculateEndDate(new Date(), plan.billingCycle),
				features: {
					create: plan.features.map((f) => ({
						name: f.name,
						enabled: f.enabled,
						limit: f.limit,
						used: 0,
					})),
				},
				transactions: {
					create: {
						amount: plan.price,
						currency: 'USD',
						status: 'pending',
						paylinkTransactionId: response.data!.transactionNo,
					},
				},
			},
		});

		return response.data!.paymentUrl;
	}

	// Get user's current subscription
	async getUserSubscription(userId: string): Promise<UserSubscription | null> {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				userId,
				status: { in: ['active', 'trial'] },
			},
			include: {
				features: true,
				transactions: {
					orderBy: { createdAt: 'desc' },
					take: 10,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		if (!subscription) return null;

		return {
			id: subscription.id,
			userId: subscription.userId,
			planId: subscription.planId,
			status: subscription.status,
			billingCycle: subscription.billingCycle,
			startDate: subscription.startDate,
			endDate: subscription.endDate,
			trialEndsAt: subscription.trialEndsAt,
			cancelledAt: subscription.cancelledAt,
			features: subscription.features.map((f) => ({
				id: f.id,
				name: f.name,
				enabled: f.enabled,
				limit: f.limit,
				used: f.used,
			})),
			transactions: subscription.transactions.map((t) => ({
				id: t.id,
				amount: t.amount,
				currency: t.currency,
				status: t.status,
				paylinkTransactionId: t.paylinkTransactionId,
				createdAt: t.createdAt,
			})),
		};
	}

	// Check feature access
	async checkFeatureAccess(
		userId: string,
		featureName: string
	): Promise<boolean> {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				userId,
				status: { in: ['active', 'trial'] },
			},
			include: {
				features: {
					where: {
						name: featureName,
					},
				},
			},
		});

		if (!subscription) return false;

		const feature = subscription.features[0];
		return feature?.enabled ?? false;
	}

	// Check feature usage limit
	async checkFeatureLimit(
		userId: string,
		featureName: string
	): Promise<boolean> {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				userId,
				status: { in: ['active', 'trial'] },
			},
			include: {
				features: {
					where: {
						name: featureName,
					},
				},
			},
		});

		if (!subscription) return false;

		const feature = subscription.features[0];
		if (!feature?.limit) return true;

		return (feature.used || 0) < feature.limit;
	}

	// Increment feature usage
	async incrementFeatureUsage(
		userId: string,
		featureName: string
	): Promise<void> {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				userId,
				status: { in: ['active', 'trial'] },
			},
			include: {
				features: {
					where: {
						name: featureName,
					},
				},
			},
		});

		if (!subscription || !subscription.features[0]) return;

		await this.prisma.subscriptionFeature.update({
			where: { id: subscription.features[0].id },
			data: {
				used: {
					increment: 1,
				},
			},
		});
	}

	private calculateEndDate(startDate: Date, billingCycle: BillingCycle): Date {
		const endDate = new Date(startDate);
		switch (billingCycle) {
			case 'monthly':
				endDate.setMonth(endDate.getMonth() + 1);
				break;
			case 'yearly':
				endDate.setFullYear(endDate.getFullYear() + 1);
				break;
			case 'trial':
				endDate.setDate(endDate.getDate() + 14);
				break;
		}
		return endDate;
	}
}
