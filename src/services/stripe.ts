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
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("El monto debe ser un entero positivo en la unidad menor de la moneda.");
  }

  const normalizedCurrency = currency.toLowerCase().trim();
  if (!/^[a-z]{3}$/.test(normalizedCurrency)) {
    throw new Error("La moneda debe ser un codigo ISO 4217 de 3 letras, por ejemplo 'usd'.");
  }

  const checkoutUrl = buildBackendUrl("/checkout");
  let response: Response;

  try {
    response = await fetch(checkoutUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: normalizedCurrency }),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `No se pudo conectar al backend de Stripe (${checkoutUrl}). ${detail}`
    );
  }

  if (!response.ok) {
    let detail = `status ${response.status}`;

    try {
      const payload = (await response.json()) as { error?: unknown };
      if (typeof payload?.error === "string" && payload.error.length > 0) {
        detail = payload.error;
      }
    } catch {
      // Keep HTTP status as fallback detail.
    }

    throw new Error(`Error del backend de Stripe (${checkoutUrl}): ${detail}`);
  }

  const data = (await response.json()) as PaymentSheetParams;

  if (
    typeof data.paymentIntent !== "string" ||
    typeof data.ephemeralKey !== "string" ||
    typeof data.customer !== "string" ||
    typeof data.publishableKey !== "string"
  ) {
    throw new Error("Respuesta invalida del backend de Stripe.");
  }

  return data;
}
