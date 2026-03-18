// app/_layout.tsx
import Constants from "expo-constants";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, { type ComponentType, type ReactNode } from "react";

// Import and register Stripe background task early in the app lifecycle
import { AuthProvider, useAuth } from "@/src/lib/modules/auth/AuthProvider";
import { usePushNotifications } from "@/src/lib/modules/notifications/usePushNotifications";
import "../src/stripe-task-manager";

type StripeProviderProps = {
  children: ReactNode;
  publishableKey?: string;
  merchantIdentifier?: string;
};

const FallbackStripeProvider: ComponentType<StripeProviderProps> = ({ children }) => {
  return <>{children}</>;
};

function isExpoGo(): boolean {
  const executionEnvironment = (Constants as { executionEnvironment?: string })
    .executionEnvironment;
  const appOwnership = (Constants as { appOwnership?: string }).appOwnership;

  return executionEnvironment === "storeClient" || appOwnership === "expo";
}

function getStripeProvider(): ComponentType<StripeProviderProps> {
  if (isExpoGo()) {
    return FallbackStripeProvider;
  }

  try {
    const stripeModule = require("@stripe/stripe-react-native") as {
      StripeProvider?: ComponentType<StripeProviderProps>;
    };

    return stripeModule.StripeProvider ?? FallbackStripeProvider;
  } catch {
    return FallbackStripeProvider;
  }
}

const StripeProvider = getStripeProvider();

/**
 * Stripe publishable key for the demo/test environment.
 * Must match the STRIPE_PUBLISHABLE_KEY in .env
 * Replace with your own live key in production.
 */
const STRIPE_PUBLISHABLE_KEY = "pk_test_51T9BAM2dY7yEhpcTllfcWGrDHuvRpewbnY9ehXvOID9PJpt78nBKICTs0pln8Tj1b9NUTqq1DSzRqiTRf4sQRVSz009yRT9Fgx";

function AuthGate() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  usePushNotifications(session?.user.id);

  React.useEffect(() => {
    if (loading || !navigationState?.key) {
      return;
    }

    const insideAuthGroup = segments[0] === "(auth)";

    if (!session && !insideAuthGroup) {
      router.replace("/(auth)/Login");
      return;
    }

    if (session && insideAuthGroup) {
      router.replace("/");
    }
  }, [loading, navigationState?.key, router, segments, session]);

  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.qrcodigodebarras"
    >
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </StripeProvider>
  );
}