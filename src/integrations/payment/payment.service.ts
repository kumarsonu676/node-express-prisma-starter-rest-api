import { IPaymentService, CreatePaymentIntentOptions, PaymentIntent, RefundOptions, RefundResult } from './payment.types';

export abstract class PaymentService implements IPaymentService {
  abstract createPaymentIntent(options: CreatePaymentIntentOptions): Promise<PaymentIntent>;
  abstract refund(options: RefundOptions): Promise<RefundResult>;
  abstract getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;
}
