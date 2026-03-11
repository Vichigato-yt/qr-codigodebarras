import type { PaymentSheetParams } from "../types/payment";

/**
 * Stripe backend endpoint.
 * Configurable via environment variable EXPO_PUBLIC_STRIPE_BACKEND.
 * Default: Stripe's demo backend (requires manual setup).
 */
const STRIPE_BACKEND =
  process.env.EXPO_PUBLIC_STRIPE_BACKEND ||
  "https://silver-acorn-5xj7qgqjw6727vrw-3000.app.github.dev/";

function buildBackendUrl(path: string): string {
  const normalizedBase = STRIPE_BACKEND.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

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
  const checkoutUrl = buildBackendUrl("/checkout");
  let response: Response;

  try {
    response = await fetch(checkoutUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `No se pudo conectar al backend de Stripe (${checkoutUrl}). ${detail}`
    );
  }

  if (!response.ok) {
    throw new Error(`Demo backend error (${checkoutUrl}): ${response.status}`);
  }

  const data = (await response.json()) as PaymentSheetParams;

  if (!data.paymentIntent || !data.publishableKey) {
    throw new Error("Invalid response from demo backend");
  }

  return data;
}
