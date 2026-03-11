import Constants from "expo-constants";
import { useCallback, useState } from "react";

import { fetchPaymentSheetParams } from "../services/stripe";
import type { PaymentResult, PaymentStatus } from "../types/payment";

type StripeSheetError = {
  code?: string;
  message: string;
};

type StripeSheetResult = {
  error?: StripeSheetError | null;
};

type StripeHooks = {
  initPaymentSheet: (params: unknown) => Promise<StripeSheetResult>;
  presentPaymentSheet: () => Promise<StripeSheetResult>;
};

function isExpoGo(): boolean {
  const executionEnvironment = (Constants as { executionEnvironment?: string })
    .executionEnvironment;
  const appOwnership = (Constants as { appOwnership?: string }).appOwnership;

  return executionEnvironment === "storeClient" || appOwnership === "expo";
}

function useSafeStripe(): StripeHooks {
  if (isExpoGo()) {
    console.warn(
      "[Stripe] Running in Expo Go - native Stripe features unavailable. Use a Development Build for full functionality:\n" +
      "  npm run start:dev-client"
    );
    return {
      initPaymentSheet: async () => ({
        error: {
          code: "Unavailable",
          message:
            "Stripe no está disponible en Expo Go. Usa un Development Build para pagos nativos.",
        },
      }),
      presentPaymentSheet: async () => ({
        error: {
          code: "Unavailable",
          message:
            "Stripe no está disponible en Expo Go. Usa un Development Build para pagos nativos.",
        },
      }),
    };
  }

  try {
    const stripeModule = require("@stripe/stripe-react-native") as {
      useStripe?: () => StripeHooks;
    };

    if (stripeModule.useStripe) {
      console.log("[Stripe] Using native Stripe hooks from @stripe/stripe-react-native");
      return stripeModule.useStripe();
    }
  } catch (error) {
    // Native Stripe module not available (e.g., Expo Go).
    console.error("[Stripe] Failed to load native stripe module:", error);
  }

  console.warn("[Stripe] Falling back to unavailable implementation");
  return {
    initPaymentSheet: async () => ({
      error: {
        code: "Unavailable",
        message:
          "Stripe no está disponible en este binario. Usa un Development Build para pagos nativos.",
      },
    }),
    presentPaymentSheet: async () => ({
      error: {
        code: "Unavailable",
        message:
          "Stripe no está disponible en este binario. Usa un Development Build para pagos nativos.",
      },
    }),
  };
}

export type UseStripePaymentOptions = {
  /** Payment amount in the smallest currency unit (e.g. cents for USD). */
  amount: number;
  /** ISO 4217 currency code. Default: "usd". */
  currency?: string;
  /** Merchant name shown in the Stripe PaymentSheet. Default: "Mi Tienda". */
  merchantName?: string;
  /** Called when a payment result is available. */
  onPaymentComplete?: (result: PaymentResult) => void;
};

export type UseStripePaymentReturn = {
  /** Current payment status. */
  status: PaymentStatus;
  /** `true` while the sheet is loading or being presented. */
  isLoading: boolean;
  /** `true` after a successful payment. */
  isSuccess: boolean;
  /** Error message from the last failed attempt, or `null`. */
  errorMessage: string | null;
  /** Initiate the Stripe PaymentSheet flow. */
  pay: () => Promise<void>;
};

/**
 * Custom hook that encapsulates the full Stripe PaymentSheet flow.
 *
 * Fetches a PaymentIntent from the demo backend, initialises the sheet,
 * and presents it — all in a single `pay()` call.
 *
 * Requires `StripeProvider` to be mounted higher in the tree.
 *
 * @example
 * const { pay, isLoading, status } = useStripePayment({ amount: 1290 });
 * <Button onPress={pay} disabled={isLoading} title="Pagar $12.90" />
 */
export function useStripePayment({
  amount,
  currency = "usd",
  merchantName = "Mi Tienda",
  onPaymentComplete,
}: UseStripePaymentOptions): UseStripePaymentReturn {
  const { initPaymentSheet, presentPaymentSheet } = useSafeStripe();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pay = useCallback(async () => {
    if (status === "loading" || status === "success") {
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      console.log("[Payment] Starting payment flow...");
      const { paymentIntent, ephemeralKey, customer, publishableKey } =
        await fetchPaymentSheetParams(amount, currency);
      console.log("[Payment] Got payment params:");
      console.log("  paymentIntent:", paymentIntent?.substring(0, 30) + "...");
      console.log("  ephemeralKey:", ephemeralKey?.substring(0, 30) + "...");
      console.log("  customer:", customer);
      console.log("  publishableKey:", publishableKey);
      console.log("[Payment] Initializing sheet with merchantName:", merchantName);

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: merchantName,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: { name: merchantName },
        returnURL: "qrcodigodebarras://stripe-redirect",
        allowsDelayedPaymentMethods: false,
        appearance: {
          colors: {
            primary: "#2C4C8A",
            background: "#121A2F",
            componentBackground: "#1F2A44",
            componentBorder: "#283655",
            componentDivider: "#283655",
            primaryText: "#F8FAFC",
            secondaryText: "#9FB3D1",
            componentText: "#F8FAFC",
            placeholderText: "#9FB3D1",
            icon: "#9FB3D1",
            error: "#ef4444",
          },
          shapes: { borderRadius: 12, borderWidth: 1 },
        },
      });

      if (initError) {
        console.error("[Payment] initPaymentSheet failed:", initError);
        setStatus("error");
        setErrorMessage(initError.message);
        onPaymentComplete?.({ status: "error", message: initError.message });
        return;
      }

      console.log("[Payment] Sheet initialized, presenting...");
      const { error: presentError } = await presentPaymentSheet();
      console.log("[Payment] presentPaymentSheet returned:", presentError);

      if (presentError) {
        if (presentError.code === "Canceled") {
          console.log("[Payment] User cancelled payment");
          setStatus("idle");
          onPaymentComplete?.({ status: "canceled" });
        } else {
          console.error("[Payment] presentPaymentSheet error:", presentError);
          setStatus("error");
          setErrorMessage(presentError.message);
          onPaymentComplete?.({ status: "error", message: presentError.message });
        }
        return;
      }

      console.log("[Payment] Payment successful!");
      setStatus("success");
      const intentId = paymentIntent.split("_secret_")[0];
      onPaymentComplete?.({ status: "success", paymentIntentId: intentId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("[Payment] Unexpected error:", err);
      setStatus("error");
      setErrorMessage(message);
      onPaymentComplete?.({ status: "error", message });
    }
  }, [
    amount,
    currency,
    initPaymentSheet,
    merchantName,
    onPaymentComplete,
    presentPaymentSheet,
    status,
  ]);

  return {
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    errorMessage,
    pay,
  };
}
