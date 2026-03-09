import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import { StripeCheckoutSheet } from "@/src/components/payment/StripeCheckoutSheet";
import type { PaymentResult } from "@/src/types/payment";

/**
 * Payment screen.
 *
 * Receives product details from the scanner via query params:
 *   - `name`    Product name
 *   - `price`   Price in cents (integer string)
 *   - `code`    Original scanned barcode / QR data
 *   - `currency` Optional ISO-4217 code (default "usd")
 */
/** Delay (ms) before navigating back after a successful payment. */
const SUCCESS_REDIRECT_DELAY_MS = 2200;

export default function PaymentScreen() {
  const router = useRouter();
  const { name, price, code, currency } = useLocalSearchParams<{
    name: string;
    price: string;
    code: string;
    currency?: string;
  }>();

  const amount = Number(price ?? 0);
  const currencyCode = currency ?? "usd";

  const handlePaymentComplete = useCallback(
    (result: PaymentResult) => {
      if (result.status === "success") {
        setTimeout(() => router.back(), SUCCESS_REDIRECT_DELAY_MS);
      }
    },
    [router]
  );

  return (
    <StripeCheckoutSheet
      amount={amount}
      currency={currencyCode}
      merchantName="QR Tienda Demo"
      productName={name}
      onPaymentComplete={handlePaymentComplete}
      style={styles.sheet}
    >
      {/* ── Order summary ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Resumen del pedido</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Producto</Text>
        <Text style={styles.cardValue} numberOfLines={2}>
          {name ?? "Producto escaneado"}
        </Text>

        {code ? (
          <>
            <Text style={styles.cardLabel}>Código</Text>
            <Text style={styles.cardValueMono}>{code}</Text>
          </>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>
            {formatCurrency(amount, currencyCode)}
          </Text>
        </View>
      </View>

      {/* Divider before the payment button rendered by StripeCheckoutSheet */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>Método de pago</Text>
    </StripeCheckoutSheet>
  );
}

function formatCurrency(cents: number, currency: string): string {
  const symbols: Record<string, string> = {
    usd: "$",
    eur: "€",
    mxn: "$",
    gbp: "£",
    brl: "R$",
  };
  const sym = symbols[currency.toLowerCase()] ?? currency.toUpperCase();
  return `${sym}${(cents / 100).toFixed(2)}`;
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: "#0B1020",
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  card: {
    backgroundColor: "#121A2F",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#283655",
    padding: 16,
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9FB3D1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  cardValue: {
    fontSize: 15,
    color: "#F8FAFC",
    fontWeight: "600",
  },
  cardValueMono: {
    fontSize: 13,
    color: "#C8D4E5",
    fontFamily: "monospace",
  },
  divider: {
    height: 1,
    backgroundColor: "#283655",
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E2E8F0",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#1F2A44",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9FB3D1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
