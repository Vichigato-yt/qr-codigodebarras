import type { PaymentSheetParams } from "../types/payment";

/**
 * Stripe Demo backend — Stripe's publicly available test server.
 * Replace with your own backend endpoint in production.
 */
const STRIPE_DEMO_BACKEND =
  "https://rigorous-heartbreaking-cephalopod.stripedemos.com";

/**
 * Fetch PaymentIntent params from the demo backend.
 *
 * @param amount   Amount in the smallest currency unit (e.g. cents for USD).
 *                 Note: the demo backend uses a fixed test amount; replace with
 *                 your own backend to charge the exact amount.
 * @param currency ISO 4217 currency code (default "usd").
 */
export async function fetchPaymentSheetParams(
  amount: number,
  currency: string = "usd"
): Promise<PaymentSheetParams> {
  // The demo backend ignores amount/currency; pass them for future compatibility
  // with a custom backend that supports dynamic pricing.
  void amount;
  void currency;

  const response = await fetch(`${STRIPE_DEMO_BACKEND}/payment-sheet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_key_type: "legacy_ephemeral_key" }),
  });

  if (!response.ok) {
    throw new Error(`Demo backend error: ${response.status}`);
  }

  const data = (await response.json()) as PaymentSheetParams;

  if (!data.paymentIntent || !data.ephemeralKey) {
    throw new Error("Invalid response from demo backend");
  }

  return data;
}
