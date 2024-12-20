export interface PaylinkConfig {
	apiId: string;
	secretKey: string;
	baseUrl: string;
}

export interface CreateInvoiceRequest {
	amount: number;
	merchantOrderNumber: string;
	customerEmail?: string;
	customerName?: string;
	callBackUrl: string;
	language?: string;
	cardBrands?: string[];
}

export interface PaylinkResponse<T> {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		code: string;
	};
}

export interface InvoiceResponse {
	transactionNo: string;
	paymentUrl: string;
	orderStatus: string;
	paid: boolean;
	amount: number;
}

export interface PaylinkApiResponse {
	status: string;
	message?: string;
	code?: string;
	data?: {
		transactionNo: string;
		url: string;
		orderStatus?: string;
	};
}
