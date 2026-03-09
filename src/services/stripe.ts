import type { PaymentSheetParams } from "../types/payment";

/**
 * Stripe backend endpoint.
 * Configurable via environment variable EXPO_PUBLIC_STRIPE_BACKEND.
 * Default: Stripe's demo backend (requires manual setup).
 */
const STRIPE_BACKEND =
  process.env.EXPO_PUBLIC_STRIPE_BACKEND ||
  "https://stripe-mobile-payment-sheet.glitch.me";

/**
 * Fetch PaymentIntent params from the demo backend.
 *
 * @param amount   Amount in the smallest currency unit (e.g. cents for USD).
 * @param currency ISO 4217 currency code (default "usd").
 */
export async function fetchPaymentSheetParams(
  amount: number,
  currency: string = "usd"
): Promise<PaymentSheetParams> {
  const response = await fetch(`${STRIPE_BACKEND}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency }),
  });

  if (!response.ok) {
    throw new Error(`Demo backend error: ${response.status}`);
  }

  const data = (await response.json()) as PaymentSheetParams;

  if (!data.paymentIntent || !data.publishableKey) {
    throw new Error("Invalid response from demo backend");
  }

  return data;
}
