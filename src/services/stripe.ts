import { Platform } from "react-native";
import type { PaymentSheetParams } from "../types/payment";

/**
 * Stripe backend endpoint.
 * Configurable via environment variable EXPO_PUBLIC_STRIPE_BACKEND.
 * 
 * Platform-specific defaults:
 * - Android emulator: http://10.0.2.2:3000 (special alias to host)
 * - iOS simulator: http://localhost:3000
 * - Web/Android device: Set EXPO_PUBLIC_STRIPE_BACKEND explicitly
 */
function getDefaultBackendUrl(): string {
  const env = process.env.EXPO_PUBLIC_STRIPE_BACKEND;
  if (env) {
    return env;
  }

  // Android emulator special host alias
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }

  // iOS simulator on same machine can reach localhost
  if (Platform.OS === "ios") {
    return "http://localhost:3000";
  }

  // Web and others
  return "http://localhost:3000";
}

const STRIPE_BACKEND = getDefaultBackendUrl();

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
  console.log(`[Stripe] Platform: ${Platform.OS}`);
  console.log(`[Stripe] Backend URL: ${STRIPE_BACKEND}`);
  console.log(`[Stripe] Fetching checkout params from: ${checkoutUrl}`);

  let response: Response;

  try {
    response = await fetch(checkoutUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: normalizedCurrency }),
    });
    console.log("[Stripe] Response status:", response.status);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[Stripe] Fetch error:", detail);
    console.error(`[Stripe] Troubleshooting: Make sure backend is running at ${STRIPE_BACKEND}`);
    throw new Error(
      `No se pudo conectar al backend de Stripe (${checkoutUrl}). ${detail}`
    );
  }

  if (!response.ok) {
    const tunnelAuthHeader = response.headers.get("www-authenticate");

    if (response.status === 401 && tunnelAuthHeader?.toLowerCase().includes("tunnel")) {
      throw new Error(
        "El backend responde 401 por autenticacion del tunel de Codespaces, no por Stripe. Configura el puerto 3000 como Public o usa una URL de backend accesible sin login."
      );
    }

    let detail = `status ${response.status}`;

    try {
      const payload = (await response.json()) as { error?: unknown };
      if (typeof payload?.error === "string" && payload.error.length > 0) {
        detail = payload.error;
      }
    } catch {
      // Keep HTTP status as fallback detail.
    }

    console.error("[Stripe] Backend error:", detail);
    throw new Error(`Error del backend de Stripe (${checkoutUrl}): ${detail}`);
  }

  const data = (await response.json()) as PaymentSheetParams;
  console.log("[Stripe] Got payment params successfully");

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
