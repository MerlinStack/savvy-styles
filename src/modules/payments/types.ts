export const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SUCCESSFUL",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface PaymentInitializationInput {
  /** Our immutable order reference. */
  reference: string;
  /** Minor units in the settlement currency. */
  amountMinor: number;
  currency: "NGN";
  email: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
}

export interface PaymentInitializationResult {
  reference: string;
  authorizationUrl: string;
  accessCode?: string;
}

export interface VerifiedPayment {
  reference: string;
  status: PaymentStatus;
  amountMinor: number;
  currency: string;
  paidAt?: string;
  channel?: string;
  providerTransactionId?: string;
}

export interface PaymentProvider {
  id: string;
  initialize(
    input: PaymentInitializationInput,
  ): Promise<PaymentInitializationResult>;
  verify(reference: string): Promise<VerifiedPayment>;
  /** Constant-time signature verification of the raw request body. */
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
}
