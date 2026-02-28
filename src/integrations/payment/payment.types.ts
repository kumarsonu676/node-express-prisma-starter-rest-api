export interface CreatePaymentIntentOptions {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  description?: string;
  customerId?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface RefundOptions {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  id: string;
  status: string;
  amount: number;
}

export interface IPaymentService {
  createPaymentIntent(options: CreatePaymentIntentOptions): Promise<PaymentIntent>;
  refund(options: RefundOptions): Promise<RefundResult>;
  getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;
}
