/**
 * Stripe Payment Service — usa PaymentIntents para evitar el error HTTP 410.
 *
 * CAUSA DEL ERROR 410:
 *   Stripe devuelve HTTP 410 (Gone) cuando el backend llama a la API deprecada
 *   de Charges:
 *     ❌ INCORRECTO → stripe.charges.create({ amount, currency, source: token })
 *
 *   Ese endpoint fue eliminado para nuevas integraciones y produce HTTP 410.
 *
 * SOLUCIÓN:
 *   Usar la API moderna de PaymentIntents en el backend:
 *     ✅ CORRECTO → stripe.paymentIntents.create({ amount, currency })
 *
 * EJEMPLO DE BACKEND (Node.js / Express):
 *
 *   // ❌ DEPRECATED — causa HTTP 410
 *   app.post("/charge", async (req, res) => {
 *     const charge = await stripe.charges.create({
 *       amount: req.body.amount,
 *       currency: req.body.currency,
 *       source: req.body.token,
 *     });
 *     res.json({ id: charge.id });
 *   });
 *
 *   // ✅ CORRECTO — PaymentIntents (sin error 410)
 *   app.post("/create-payment-intent", async (req, res) => {
 *     const paymentIntent = await stripe.paymentIntents.create({
 *       amount: req.body.amount,          // en centavos
 *       currency: req.body.currency,      // p.ej. "usd"
 *       automatic_payment_methods: { enabled: true },
 *     });
 *     res.json({ clientSecret: paymentIntent.client_secret });
 *   });
 */

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "";

export type PaymentIntentResult = {
  clientSecret: string;
};

/**
 * Solicita al backend la creación de un PaymentIntent y devuelve su clientSecret.
 *
 * El backend DEBE usar `stripe.paymentIntents.create()`.
 * Usar `stripe.charges.create()` en el backend provoca HTTP 410 (Gone).
 *
 * @param amountCents - Monto en centavos (ej. $12.90 → 1290)
 * @param currency    - Código ISO de moneda (por defecto "usd")
 */
export async function createPaymentIntent(
  amountCents: number,
  currency = "usd"
): Promise<PaymentIntentResult> {
  if (!BACKEND_URL) {
    throw new Error(
      "Falta EXPO_PUBLIC_BACKEND_URL. Configura la variable de entorno con la URL de tu backend."
    );
  }

  const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountCents, currency }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Error del servidor de pagos (${response.status}): ${body}`);
  }

  return response.json() as Promise<PaymentIntentResult>;
}

/**
 * Convierte un string de precio ("$12.90") a centavos enteros (1290).
 */
export function parsePriceToCents(price: string): number {
  const numeric = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (isNaN(numeric)) return 0;
  return Math.round(numeric * 100);
}
