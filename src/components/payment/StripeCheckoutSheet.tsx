import { ShieldCheck } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import type { PaymentResult } from "../../types/payment";
import { PaymentButton } from "./PaymentButton";
import { PaymentStatusCard } from "./PaymentStatusCard";

export type StripeCheckoutSheetProps = {
  /** Payment amount in the smallest currency unit (e.g. cents for USD). */
  amount: number;
  /** ISO 4217 currency code. Default: "usd". */
  currency?: string;
  /** Name displayed in the Stripe payment sheet header. Default: "Mi Tienda". */
  merchantName?: string;
  /** Optional product name shown in the status card. */
  productName?: string;
  /** Called when any payment result is available. */
  onPaymentComplete?: (result: PaymentResult) => void;
  /** Content rendered above the pay button (e.g. order summary). */
  children?: React.ReactNode;
  /** Additional style for the outer container. */
  style?: StyleProp<ViewStyle>;
};

/**
 * All-in-one Stripe checkout component.
 *
 * Composes a `PaymentButton` and a `PaymentStatusCard` into a scrollable
 * layout. Requires `StripeProvider` to be mounted higher in the tree
 * (already done in `app/_layout.tsx`).
 *
 * @example
 * <StripeCheckoutSheet
 *   amount={1290}
 *   currency="usd"
 *   merchantName="Mi Tienda"
 *   productName="Café en grano 500g"
 *   onPaymentComplete={(r) => console.log(r)}
 * >
 *   <OrderSummary />
 * </StripeCheckoutSheet>
 */
export function StripeCheckoutSheet({
  amount,
  currency = "usd",
  merchantName = "Mi Tienda",
  productName,
  onPaymentComplete,
  children,
  style,
}: StripeCheckoutSheetProps) {
  const [result, setResult] = useState<PaymentResult | null>(null);

  const handlePaymentComplete = useCallback(
    (paymentResult: PaymentResult) => {
      setResult(paymentResult);
      onPaymentComplete?.(paymentResult);
    },
    [onPaymentComplete]
  );

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}

      <PaymentStatusCard
        result={result}
        productName={productName}
        amount={amount}
        currency={currency}
        style={styles.statusCard}
      />

      <PaymentButton
        amount={amount}
        currency={currency}
        label={`Pagar ${formatLabel(amount, currency)}`}
        merchantName={merchantName}
        onPaymentComplete={handlePaymentComplete}
        disabled={result?.status === "success"}
        style={styles.button}
      />

      <View style={styles.secureRow}>
        <ShieldCheck size={14} color="#9fb3d1" />
        <Text style={styles.secureNote}>Pago seguro procesado por Stripe</Text>
      </View>
    </ScrollView>
  );
}

function formatLabel(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    usd: "$",
    eur: "€",
    mxn: "$",
    gbp: "£",
    brl: "R$",
  };
  const sym = symbols[currency.toLowerCase()] ?? currency.toUpperCase();
  return `${sym}${(amount / 100).toFixed(2)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
  },
  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  statusCard: {
    marginTop: 4,
  },
  button: {
    width: "100%",
  },
  secureNote: {
    color: "#9fb3d1",
    fontSize: 12,
  },
  secureRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
});
