import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useStripePayment } from "../../hooks/useStripePayment";
import type { PaymentResult } from "../../types/payment";

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
 * Internally uses `useStripePayment` to fetch a PaymentIntent from the demo
 * backend, initialise the Stripe PaymentSheet, and present it when pressed.
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
  const { pay, isLoading, isSuccess } = useStripePayment({
    amount,
    currency,
    merchantName,
    onPaymentComplete,
  });

  return (
    <Pressable
      onPress={pay}
      disabled={disabled || isLoading || isSuccess}
      style={({ pressed }) => [
        styles.button,
        isSuccess && styles.buttonSuccess,
        (disabled || isLoading || isSuccess) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || isLoading || isSuccess, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#F8FAFC" />
      ) : (
        <Text style={styles.label}>{isSuccess ? "✓ Pago completado" : label}</Text>
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
