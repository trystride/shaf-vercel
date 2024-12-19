export interface PaylinkWebhookEvent {
  transactionNo: string;
  orderStatus: 'Paid' | 'Pending' | 'Failed' | 'Cancelled';
  amount: number;
  merchantOrderNumber: string;
  clientEmail?: string;
  clientName?: string;
  paymentDate?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface WebhookHandlerResponse {
  success: boolean;
  message: string;
  error?: any;
}

export type WebhookHandler = (event: PaylinkWebhookEvent) => Promise<WebhookHandlerResponse>;

export interface WebhookHandlerMap {
  [key: string]: WebhookHandler;
}
