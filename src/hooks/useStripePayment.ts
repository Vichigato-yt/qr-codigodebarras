import { useCallback, useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";

import { fetchPaymentSheetParams } from "../services/stripe";
import type { PaymentResult, PaymentStatus } from "../types/payment";

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
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pay = useCallback(async () => {
    if (status === "loading" || status === "success") {
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams(amount, currency);

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
        setStatus("error");
        setErrorMessage(initError.message);
        onPaymentComplete?.({ status: "error", message: initError.message });
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          setStatus("idle");
          onPaymentComplete?.({ status: "canceled" });
        } else {
          setStatus("error");
          setErrorMessage(presentError.message);
          onPaymentComplete?.({ status: "error", message: presentError.message });
        }
        return;
      }

      setStatus("success");
      const intentId = paymentIntent.split("_secret_")[0];
      onPaymentComplete?.({ status: "success", paymentIntentId: intentId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
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
