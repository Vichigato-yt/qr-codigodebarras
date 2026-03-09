import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export default function RootLayout() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      urlScheme="qrcodigodebarras"
      merchantIdentifier="merchant.com.qrcodigodebarras"
    >
      <Stack />
    </StripeProvider>
  );
}
