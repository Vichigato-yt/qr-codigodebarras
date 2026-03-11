/**
 * Simple Stripe Demo Backend
 * Runs on http://localhost:3000
 *
 * Provides a /checkout endpoint to create PaymentIntents for testing.
 * Requires STRIPE_SECRET_KEY environment variable.
 *
 * Usage:
 *   export STRIPE_SECRET_KEY=sk_test_...
 *   node backend.js
 */

const http = require("http");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const PORT = process.env.PORT || 3000;

if (!STRIPE_SECRET_KEY || !STRIPE_PUBLISHABLE_KEY) {
  console.error(
    "Error: Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY environment variables"
  );
  process.exit(1);
}

console.log(`[Backend] Starting backend with STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY.substring(0, 20)}...`);
console.log(`[Backend] STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}`);

const STRIPE_API_BASE = "https://api.stripe.com/v1";
const STRIPE_API_VERSION = process.env.STRIPE_API_VERSION || "2023-10-16";

async function stripeRequest(path, params, extraHeaders = {}) {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...extraHeaders,
    },
    body: params.toString(),
  });

  const json = await response.json();

  if (!response.ok) {
    const detail =
      typeof json?.error?.message === "string"
        ? json.error.message
        : `HTTP ${response.status}`;
    throw new Error(`Stripe API error: ${detail}`);
  }

  return json;
}

async function createCustomer() {
  return stripeRequest("/customers", new URLSearchParams());
}

async function createEphemeralKey(customerId) {
  const params = new URLSearchParams();
  params.append("customer", customerId);

  return stripeRequest("/ephemeral_keys", params, {
    "Stripe-Version": STRIPE_API_VERSION,
  });
}

async function createPaymentIntent(amount, currency, customerId) {
  const params = new URLSearchParams();
  params.append("amount", String(amount));
  params.append("currency", currency);
  params.append("customer", customerId);
  params.append("automatic_payment_methods[enabled]", "true");

  return stripeRequest("/payment_intents", params);
}

const requestListener = async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname.replace(/\/{2,}/g, "/");

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", message: "Stripe Demo Backend" }));
    return;
  }

  // Payment checkout endpoint
  if (pathname === "/checkout" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const { amount, currency = "usd" } = data;

        console.log(`[Backend] POST /checkout - amount=${amount}, currency=${currency}`);

        if (
          typeof amount !== "number" ||
          !Number.isInteger(amount) ||
          amount <= 0
        ) {
          console.warn("[Backend] Invalid amount:", amount);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Invalid amount. Must be a positive integer in minor units.",
            })
          );
          return;
        }

        if (typeof currency !== "string" || currency.trim().length !== 3) {
          console.warn("[Backend] Invalid currency:", currency);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid currency. Use ISO 4217 code." }));
          return;
        }

        const normalizedCurrency = currency.toLowerCase();
        console.log("[Backend] Creating customer...");
        const customer = await createCustomer();
        console.log("[Backend] Customer created:", customer.id);

        console.log("[Backend] Creating ephemeral key...");
        const ephemeralKey = await createEphemeralKey(customer.id);
        console.log("[Backend] Ephemeral key created");

        console.log("[Backend] Creating payment intent...");
        const paymentIntent = await createPaymentIntent(
          amount,
          normalizedCurrency,
          customer.id
        );
        console.log("[Backend] Payment intent created:", paymentIntent.id);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: STRIPE_PUBLISHABLE_KEY,
          })
        );
      } catch (error) {
        console.error("[Backend] Error in /checkout:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : "Unexpected server error while creating payment sheet params.",
          })
        );
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
};

const server = http.createServer(requestListener);
server.listen(PORT, () => {
  console.log(`Stripe Demo Backend running on http://localhost:${PORT}`);
  console.log(`Checkout endpoint: POST http://localhost:${PORT}/checkout`);
});
