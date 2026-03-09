import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";

/**
 * Stripe publishable key for the demo/test environment.
 * Replace with your own live key in production.
 */
const STRIPE_PUBLISHABLE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx";

export default function RootLayout() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.qrcodigodebarras"
    >
      <Stack />
    </StripeProvider>
  );
}
