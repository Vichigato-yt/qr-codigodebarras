import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";

import { PaymentButton } from "./PaymentButton";
import { PaymentStatusCard } from "./PaymentStatusCard";
import type { PaymentResult } from "../../types/payment";

/**
 * Stripe publishable key for the demo environment.
 * The demo backend returns its own key, but we need one to initialise
 * StripeProvider before the first fetch.  Swap this for your live key in production.
 */
const DEMO_PUBLISHABLE_KEY =
  "pk_test_TYooMQauvdEDq54NiTphI7jx";

export type StripeCheckoutSheetProps = {
  /** Payment amount in the smallest currency unit (e.g. cents for USD). */
  amount: number;
  /** ISO 4217 currency code. Default: "usd". */
  currency?: string;
  /** Name displayed in the Stripe payment sheet header. Default: "Mi Tienda". */
  merchantName?: string;
  /** Stripe publishable key. Defaults to the Demo test key. */
  publishableKey?: string;
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
 * Wraps `StripeProvider`, a `PaymentButton`, and a `PaymentStatusCard`
 * so consumers only need to pass `amount` (and optional props) to get
 * a fully functional payment flow.
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
  publishableKey = DEMO_PUBLISHABLE_KEY,
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
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.qrcodigodebarras"
    >
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

        <Text style={styles.secureNote}>🔒 Pago seguro con Stripe</Text>
      </ScrollView>
    </StripeProvider>
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
    gap: 16,
    paddingBottom: 40,
  },
  statusCard: {
    marginTop: 4,
  },
  button: {
    width: "100%",
  },
  secureNote: {
    color: "#9FB3D1",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});
