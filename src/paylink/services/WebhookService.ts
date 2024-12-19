import { PaylinkWebhookEvent, WebhookHandlerResponse, WebhookHandler } from '../types/webhook';
import { SubscriptionService } from './SubscriptionService';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';

export class WebhookService {
  private subscriptionService: SubscriptionService;
  private prisma: PrismaClient;

  constructor(subscriptionService: SubscriptionService, prisma: PrismaClient) {
    this.subscriptionService = subscriptionService;
    this.prisma = prisma;
  }

  // Handle successful payment
  private handlePaymentSuccess: WebhookHandler = async (event: PaylinkWebhookEvent): Promise<WebhookHandlerResponse> => {
    try {
      // Extract subscription ID from merchantOrderNumber (format: SUB-{userId}-{timestamp})
      const [prefix, userId] = event.merchantOrderNumber.split('-');
      
      if (prefix !== 'SUB' || !userId) {
        throw new Error('Invalid merchant order number format');
      }

      // Get the subscription
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['trial', 'expired'] as SubscriptionStatus[] }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Update subscription status
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'active' as SubscriptionStatus,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          transactions: {
            create: {
              amount: event.amount,
              status: 'success',
              paylinkTransactionId: event.transactionNo,
              currency: 'USD'
            }
          }
        }
      });

      return {
        success: true,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('Payment success handler error:', error);
      return {
        success: false,
        message: 'Failed to process payment success',
        error
      };
    }
  };

  // Handle failed payment
  private handlePaymentFailure: WebhookHandler = async (event: PaylinkWebhookEvent): Promise<WebhookHandlerResponse> => {
    try {
      const [prefix, userId] = event.merchantOrderNumber.split('-');
      
      if (prefix !== 'SUB' || !userId) {
        throw new Error('Invalid merchant order number format');
      }

      // Get the subscription
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['trial', 'active'] as SubscriptionStatus[] }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Update subscription status
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'expired' as SubscriptionStatus,
          transactions: {
            create: {
              amount: event.amount,
              status: 'failed',
              paylinkTransactionId: event.transactionNo,
              currency: 'USD'
            }
          }
        }
      });

      // Send notification to user about failed payment
      await this.notifyPaymentFailure(subscription.userId, event);

      return {
        success: true,
        message: 'Payment failure processed'
      };
    } catch (error) {
      console.error('Payment failure handler error:', error);
      return {
        success: false,
        message: 'Failed to process payment failure',
        error
      };
    }
  };

  // Handle cancelled payment
  private handlePaymentCancellation: WebhookHandler = async (event: PaylinkWebhookEvent): Promise<WebhookHandlerResponse> => {
    try {
      const [prefix, userId] = event.merchantOrderNumber.split('-');
      
      if (prefix !== 'SUB' || !userId) {
        throw new Error('Invalid merchant order number format');
      }

      // Get the subscription
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['trial', 'active'] as SubscriptionStatus[] }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Update subscription status
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'cancelled' as SubscriptionStatus,
          cancelledAt: new Date(),
          transactions: {
            create: {
              amount: event.amount,
              status: 'cancelled',
              paylinkTransactionId: event.transactionNo,
              currency: 'USD'
            }
          }
        }
      });

      return {
        success: true,
        message: 'Payment cancellation processed'
      };
    } catch (error) {
      console.error('Payment cancellation handler error:', error);
      return {
        success: false,
        message: 'Failed to process payment cancellation',
        error
      };
    }
  };

  // Process webhook event
  async processWebhook(event: PaylinkWebhookEvent): Promise<WebhookHandlerResponse> {
    try {
      console.log('Processing webhook event:', {
        transactionNo: event.transactionNo,
        status: event.orderStatus,
        merchantOrderNumber: event.merchantOrderNumber
      });

      switch (event.orderStatus) {
        case 'Paid':
          return await this.handlePaymentSuccess(event);
        case 'Failed':
          return await this.handlePaymentFailure(event);
        case 'Cancelled':
          return await this.handlePaymentCancellation(event);
        case 'Pending':
          return {
            success: true,
            message: 'Payment pending, no action needed'
          };
        default:
          return {
            success: false,
            message: `Unsupported payment status: ${event.orderStatus}`
          };
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        message: 'Failed to process webhook',
        error
      };
    }
  }

  // Helper method to notify users of payment failures
  private async notifyPaymentFailure(userId: string, event: PaylinkWebhookEvent): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user?.email) return;

      // Implement your email notification logic here
      // For example:
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Payment Failed',
      //   template: 'payment-failed',
      //   data: {
      //     amount: event.amount,
      //     errorMessage: event.errorMessage
      //   }
      // });
    } catch (error) {
      console.error('Failed to send payment failure notification:', error);
    }
  }
}
