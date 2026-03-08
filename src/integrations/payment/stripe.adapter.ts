import Stripe from 'stripe';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentOptions, PaymentIntent, RefundOptions, RefundResult } from './payment.types';
import appConfig from '../../config/app.config';

export class StripePaymentService extends PaymentService {
  private stripe: Stripe;

  constructor() {
    super();
    const secretKey = appConfig.stripe.secretKey;

    if (!secretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
    });
  }

  async createPaymentIntent(options: CreatePaymentIntentOptions): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(options.amount * 100),
      currency: options.currency.toLowerCase(),
      metadata: options.metadata,
      description: options.description,
      customer: options.customerId,
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || '',
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }

  async refund(options: RefundOptions): Promise<RefundResult> {
    const refund = await this.stripe.refunds.create({
      payment_intent: options.paymentIntentId,
      amount: options.amount ? Math.round(options.amount * 100) : undefined,
      reason: options.reason as Stripe.RefundCreateParams.Reason,
    });

    return {
      id: refund.id,
      status: refund.status || 'pending',
      amount: (refund.amount || 0) / 100,
    };
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || '',
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }
}
