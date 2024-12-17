import axios from 'axios';
import { PaylinkConfig, CreateInvoiceRequest, PaylinkResponse, InvoiceResponse } from './types';

export class PaylinkClient {
  private config: PaylinkConfig;
  private axiosInstance;

  constructor(config: PaylinkConfig) {
    this.config = config;
    console.log('Initializing Paylink client with config:', {
      baseUrl: config.baseUrl,
      hasApiId: !!config.apiId,
      hasSecretKey: !!config.secretKey
    });

    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-id': config.apiId,
        'secret-key': config.secretKey
      }
    });
  }

  async createInvoice(request: CreateInvoiceRequest): Promise<PaylinkResponse<InvoiceResponse>> {
    try {
      console.log('Creating invoice with request:', {
        ...request,
        customerEmail: request.customerEmail ? '***' : undefined,
        customerName: request.customerName ? '***' : undefined
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
        products: [{
          title: 'Subscription',
          price: formattedAmount,
          quantity: 1
        }],
        success_url: request.callBackUrl,
        cancel_url: request.callBackUrl,
        language: request.language || 'en',
        sendEmail: true
      };

      console.log('Sending request to Paylink API:', {
        url: `${this.config.baseUrl}/addInvoice`,
        payload
      });

      const response = await this.axiosInstance.post('/addInvoice', payload);
      console.log('Raw Paylink API Response:', response.data);

      if (response.data.status === 'success' && response.data.data) {
        const result = {
          success: true,
          data: {
            transactionNo: response.data.data.transactionNo,
            paymentUrl: response.data.data.url,
            orderStatus: response.data.data.orderStatus || 'Pending',
            paid: response.data.data.orderStatus === 'Paid',
            amount: request.amount
          }
        };
        console.log('Processed response:', result);
        return result;
      } else {
        const error = {
          success: false,
          error: {
            message: response.data.message || 'Failed to create invoice',
            code: response.data.code || '400'
          }
        };
        console.error('Failed to create invoice:', error);
        return error;
      }
    } catch (error) {
      console.error('Paylink API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        const errorResponse = {
          success: false,
          error: {
            message: error.response?.data?.message || error.message,
            code: error.response?.status?.toString() || '500'
          }
        };
        console.error('Formatted error response:', errorResponse);
        return errorResponse;
      }
      throw error;
    }
  }

  async getInvoice(transactionNo: string): Promise<PaylinkResponse<InvoiceResponse>> {
    try {
      const response = await this.axiosInstance.get(`/getInvoice/${transactionNo}`);
      return {
        success: true,
        data: {
          transactionNo: response.data.transactionNo,
          paymentUrl: response.data.url,
          orderStatus: response.data.orderStatus || 'Pending',
          paid: response.data.orderStatus === 'Paid',
          amount: response.data.amount
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: {
            message: error.response?.data?.message || error.message,
            code: error.response?.status?.toString() || '500'
          }
        };
      }
      throw error;
    }
  }

  async cancelInvoice(transactionNo: string): Promise<PaylinkResponse<{ success: boolean }>> {
    try {
      console.log('Cancelling invoice with transactionNo:', transactionNo);

      const payload = { transactionNo };

      console.log('Sending request to Paylink API:', {
        url: `${this.config.baseUrl}/cancelInvoice`,
        payload
      });

      const response = await this.axiosInstance.post('/cancelInvoice', payload);
      console.log('Raw Paylink API Response:', response.data);

      const result = {
        success: true,
        data: { success: true }
      };
      console.log('Processed response:', result);
      return result;
    } catch (error) {
      console.error('Paylink API Error:', error);
      if (axios.isAxiosError(error)) {
        const errorResponse = {
          success: false,
          error: {
            message: error.response?.data?.message || error.message,
            code: error.response?.status?.toString() || '500'
          }
        };
        console.error('Formatted error response:', errorResponse);
        return errorResponse;
      }
      throw error;
    }
  }
}
