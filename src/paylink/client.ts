import axios from 'axios';
import {
	PaylinkConfig,
	CreateInvoiceRequest,
	PaylinkResponse,
	InvoiceResponse,
} from './types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('PaylinkClient');

export class PaylinkClient {
	private config: PaylinkConfig;
	private axiosInstance;

	constructor(config: PaylinkConfig) {
		this.config = config;
		logger.info('Initializing Paylink client', {
			baseUrl: config.baseUrl,
			hasApiId: !!config.apiId,
			hasSecretKey: !!config.secretKey,
		});

		this.axiosInstance = axios.create({
			baseURL: config.baseUrl,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'api-id': config.apiId,
				'secret-key': config.secretKey,
			},
		});
	}

	async createInvoice(
		request: CreateInvoiceRequest
	): Promise<PaylinkResponse<InvoiceResponse>> {
		try {
			logger.debug('Creating invoice', {
				...request,
				customerEmail: request.customerEmail ? '***' : undefined,
				customerName: request.customerName ? '***' : undefined,
			});

			// Format amount to have exactly 2 decimal places
			const formattedAmount = Number(request.amount).toFixed(2);

			const payload = {
				amount: formattedAmount,
				callBackUrl: request.callBackUrl,
				clientEmail: request.customerEmail,
				clientName: request.customerName,
				orderNumber: request.merchantOrderNumber,
				note: `Order ${request.merchantOrderNumber}`,
				products: [
					{
						title: 'Subscription',
						price: formattedAmount,
						quantity: 1,
					},
				],
				success_url: request.callBackUrl,
				cancel_url: request.callBackUrl,
				language: request.language || 'en',
				sendEmail: true,
			};

			logger.debug('Sending request to Paylink API', {
				url: `${this.config.baseUrl}/addInvoice`,
				payload,
			});

			const response = await this.axiosInstance.post('/addInvoice', payload);
			logger.debug('Raw Paylink API Response', { data: response.data });

			if (response.data.status === 'success' && response.data.data) {
				const result = {
					success: true,
					data: {
						transactionNo: response.data.data.transactionNo,
						paymentUrl: response.data.data.url,
						orderStatus: response.data.data.orderStatus || 'Pending',
						paid: response.data.data.orderStatus === 'Paid',
						amount: request.amount,
					},
				};
				logger.debug('Processed response', { result });
				return result;
			} else {
				const error = {
					success: false,
					error: {
						message: response.data.message || 'Failed to create invoice',
						code: response.data.code || '400',
					},
				};
				logger.error('Failed to create invoice', error);
				return error;
			}
		} catch (error) {
			logger.error('Paylink API Error', {
				error: error instanceof Error ? error.message : String(error),
			});
			if (axios.isAxiosError(error)) {
				logger.error('Axios Error Details', {
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
				});
				const errorResponse = {
					success: false,
					error: {
						message: error.response?.data?.message || error.message,
						code: error.response?.status?.toString() || '500',
					},
				};
				logger.error('Formatted error response', errorResponse);
				return errorResponse;
			}
			throw error;
		}
	}

	async getInvoice(
		transactionNo: string
	): Promise<PaylinkResponse<InvoiceResponse>> {
		try {
			logger.debug('Getting invoice details', { transactionNo });

			const response = await this.axiosInstance.get(
				`/getInvoice/${transactionNo}`
			);
			logger.debug('Raw Paylink API Response', { data: response.data });

			const result = {
				success: true,
				data: {
					transactionNo: response.data.transactionNo,
					paymentUrl: response.data.url,
					orderStatus: response.data.orderStatus || 'Pending',
					paid: response.data.orderStatus === 'Paid',
					amount: response.data.amount,
				},
			};
			logger.debug('Processed response', { result });
			return result;
		} catch (error) {
			logger.error('Paylink API Error', {
				error: error instanceof Error ? error.message : String(error),
			});
			if (axios.isAxiosError(error)) {
				logger.error('Axios Error Details', {
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
				});
				const errorResponse = {
					success: false,
					error: {
						message: error.response?.data?.message || error.message,
						code: error.response?.status?.toString() || '500',
					},
				};
				logger.error('Formatted error response', { error: errorResponse });
				return errorResponse;
			}
			throw error;
		}
	}

	async cancelInvoice(
		transactionNo: string
	): Promise<PaylinkResponse<{ success: boolean }>> {
		try {
			logger.debug('Cancelling invoice with transactionNo', { transactionNo });

			const payload = { transactionNo };

			logger.debug('Sending request to Paylink API', {
				url: `${this.config.baseUrl}/cancelInvoice`,
				payload,
			});

			const response = await this.axiosInstance.post('/cancelInvoice', payload);
			logger.debug('Raw Paylink API Response', { data: response.data });

			const result = {
				success: true,
				data: { success: true },
			};
			logger.debug('Processed response', { result });
			return result;
		} catch (error) {
			logger.error('Paylink API Error', {
				error: error instanceof Error ? error.message : String(error),
			});
			if (axios.isAxiosError(error)) {
				const errorResponse = {
					success: false,
					error: {
						message: error.response?.data?.message || error.message,
						code: error.response?.status?.toString() || '500',
					},
				};
				logger.error('Formatted error response', errorResponse);
				return errorResponse;
			}
			throw error;
		}
	}
}
