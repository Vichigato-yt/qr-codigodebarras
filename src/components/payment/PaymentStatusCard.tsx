import { AlertCircle, Ban, CheckCircle2 } from "lucide-react-native";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { PaymentResult } from "../../types/payment";

export type PaymentStatusCardProps = {
  /** Payment result to display. Pass `null` to render nothing. */
  result: PaymentResult | null;
  /** Optional product name shown in the card. */
  productName?: string;
  /** Amount in smallest currency unit (e.g. cents). Used for display only. */
  amount?: number;
  /** ISO 4217 currency code. Default: "usd". */
  currency?: string;
  /** Additional style applied to the outer container. */
  style?: StyleProp<ViewStyle>;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  eur: "€",
  mxn: "$",
  gbp: "£",
  brl: "R$",
};

function formatAmount(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()] ?? currency.toUpperCase();
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

/**
 * Reusable card that displays the outcome of a Stripe payment.
 *
 * @example
 * <PaymentStatusCard
 *   result={{ status: "success", paymentIntentId: "pi_xxx" }}
 *   productName="Café en grano 500g"
 *   amount={1290}
 *   currency="usd"
 * />
 */
export function PaymentStatusCard({
  result,
  productName,
  amount,
  currency = "usd",
  style,
}: PaymentStatusCardProps) {
  if (!result) {
    return null;
  }

  const isSuccess = result.status === "success";
  const isCanceled = result.status === "canceled";

  const cardColor = isSuccess ? "#113b2a" : isCanceled ? "#1a2740" : "#5e1e1f";
  const borderColor = isSuccess ? "#34d399" : isCanceled ? "#9FB3D1" : "#f87171";
  const title = isSuccess
    ? "Pago exitoso"
    : isCanceled
      ? "Pago cancelado"
      : "Pago fallido";

  return (
    <View style={[styles.card, { backgroundColor: cardColor, borderColor }, style]}>
      <View style={styles.row}>
        {isSuccess ? (
          <CheckCircle2 size={18} color={borderColor} />
        ) : isCanceled ? (
          <Ban size={18} color={borderColor} />
        ) : (
          <AlertCircle size={18} color={borderColor} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {productName ? (
        <Text style={styles.detail} numberOfLines={1}>
          Producto: {productName}
        </Text>
      ) : null}

      {amount !== undefined ? (
        <Text style={styles.detail}>
          Monto: {formatAmount(amount, currency)}
        </Text>
      ) : null}

      {result.paymentIntentId ? (
        <Text style={styles.intentId} numberOfLines={1}>
          ID: {result.paymentIntentId}
        </Text>
      ) : null}

      {result.message ? (
        <Text style={styles.message}>{result.message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  detail: {
    color: "#dbe8fb",
    fontSize: 13,
    lineHeight: 20,
  },
  intentId: {
    color: "#9FB3D1",
    fontSize: 11,
    fontFamily: "monospace",
  },
  message: {
    color: "#FCA5A5",
    fontSize: 12,
    lineHeight: 18,
  },
});
