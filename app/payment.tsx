import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CreditCard, ReceiptText } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
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
  const hasNotifiedRef = useRef(false);
  const { name, price, code, currency } = useLocalSearchParams<{
    name: string;
    price: string;
    code: string;
    currency?: string;
  }>();

  const amount = Number(price ?? 0);
  const currencyCode = currency ?? "usd";

  const handlePaymentComplete = useCallback(
    async (result: PaymentResult) => {
      if (result.status === "success") {
        if (!hasNotifiedRef.current) {
          hasNotifiedRef.current = true;

          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Pago confirmado",
                body: `${name ?? "Producto"} pagado con éxito.`,
                data: {
                  code,
                  paymentIntentId: result.paymentIntentId ?? null,
                  screen: "payment",
                },
              },
              trigger: null,
            });
          } catch (notificationError) {
            console.log("No se pudo enviar la notificación de pago", notificationError);
          }
        }

        setTimeout(() => router.back(), SUCCESS_REDIRECT_DELAY_MS);
      }
    },
    [code, name, router]
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
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <ReceiptText size={20} color="#d4e5ff" />
          <Text style={styles.screenTitle}>Checkout</Text>
        </View>
        <Text style={styles.screenSubtitle}>Revisa tu orden antes de confirmar el cobro.</Text>
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

      <View style={styles.sectionDivider} />
      <View style={styles.paymentMethodRow}>
        <CreditCard size={16} color="#bfd2f0" />
        <Text style={styles.sectionTitle}>Método de pago</Text>
      </View>
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
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  screenTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  screenSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#a6badb",
    lineHeight: 20,
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
    color: "#bfd2f0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
