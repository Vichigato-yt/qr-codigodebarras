import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

import { fetchPaymentSheetParams } from "../../services/stripe";
import type { PaymentResult, PaymentStatus } from "../../types/payment";

export type PaymentButtonProps = {
  /** Payment amount in the smallest currency unit (e.g. cents). */
  amount: number;
  /** ISO 4217 currency code. Default: "usd". */
  currency?: string;
  /** Label shown on the button. Default: "Pagar". */
  label?: string;
  /** Name shown in the Stripe payment sheet. Default: "Mi Tienda". */
  merchantName?: string;
  /** Called when the payment completes (success, error, or cancellation). */
  onPaymentComplete?: (result: PaymentResult) => void;
  /** Disable the button externally. */
  disabled?: boolean;
  /** Additional style applied to the outer Pressable. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Reusable Stripe payment button.
 *
 * Fetches a PaymentIntent from the demo backend, initialises
 * the Stripe PaymentSheet and presents it when pressed.
 *
 * @example
 * <PaymentButton
 *   amount={1290}
 *   currency="usd"
 *   label="Comprar ahora"
 *   merchantName="Mi Tienda"
 *   onPaymentComplete={(result) => console.log(result)}
 * />
 */
export function PaymentButton({
  amount,
  currency = "usd",
  label = "Pagar",
  merchantName = "Mi Tienda",
  onPaymentComplete,
  disabled = false,
  style,
}: PaymentButtonProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [status, setStatus] = useState<PaymentStatus>("idle");

  const handlePress = useCallback(async () => {
    if (disabled || status === "loading") {
      return;
    }

    setStatus("loading");

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
          onPaymentComplete?.({ status: "error", message: presentError.message });
        }
        return;
      }

      setStatus("success");
      const intentId = paymentIntent.split("_secret_")[0];
      onPaymentComplete?.({ status: "success", paymentIntentId: intentId });
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Error desconocido";
      onPaymentComplete?.({ status: "error", message });
    }
  }, [
    amount,
    currency,
    disabled,
    initPaymentSheet,
    merchantName,
    onPaymentComplete,
    presentPaymentSheet,
    status,
  ]);

  const isLoading = status === "loading";
  const isDone = status === "success";

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading || isDone}
      style={({ pressed }) => [
        styles.button,
        isDone && styles.buttonSuccess,
        (disabled || isLoading || isDone) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || isLoading || isDone, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#F8FAFC" />
      ) : (
        <Text style={styles.label}>{isDone ? "✓ Pago completado" : label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2C4C8A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonSuccess: {
    backgroundColor: "#16603A",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  label: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
});
