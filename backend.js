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

/**
 * Create a Stripe PaymentIntent via REST API
 */
async function createPaymentIntent(amount, currency) {
  const params = new URLSearchParams();
  params.append("amount", amount);
  params.append("currency", currency);
  params.append("automatic_payment_methods[enabled]", "true");

  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Stripe API error: ${response.status}`);
  }

  return response.json();
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
        const data = JSON.parse(body);
        const { amount, currency = "usd" } = data;

        if (!amount || typeof amount !== "number") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid amount" }));
          return;
        }

        // Create PaymentIntent
        const paymentIntent = await createPaymentIntent(amount, currency.toLowerCase());

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            paymentIntent: paymentIntent.client_secret,
            publishableKey: STRIPE_PUBLISHABLE_KEY,
          })
        );
      } catch (error) {
        console.error("Error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
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
