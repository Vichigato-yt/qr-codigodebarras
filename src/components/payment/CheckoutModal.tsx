import { useStripe } from "@stripe/stripe-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createPaymentIntent, parsePriceToCents } from "@/src/services/stripeService";

export type CheckoutProduct = {
  sku: string;
  name: string;
  price: string;
};

type CheckoutModalProps = {
  product: CheckoutProduct | null;
  onClose: () => void;
  onPaymentSuccess: (product: CheckoutProduct) => void;
};

export function CheckoutModal({ product, onClose, onPaymentSuccess }: CheckoutModalProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePay = useCallback(async () => {
    if (!product) return;

    setLoading(true);
    try {
      // 1. Solicita el clientSecret al backend usando PaymentIntents
      //    El backend usa stripe.paymentIntents.create() — NO stripe.charges.create()
      //    Usar charges.create() provoca HTTP 410 (Gone) porque ese endpoint está deprecado.
      const { clientSecret } = await createPaymentIntent(
        parsePriceToCents(product.price)
      );

      // 2. Inicializa el Payment Sheet de Stripe con el clientSecret del PaymentIntent
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "QR Pagos",
      });

      if (initError) {
        Alert.alert("Error al iniciar pago", initError.message);
        return;
      }

      // 3. Presenta la hoja de pago nativa de Stripe
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== "Canceled") {
          Alert.alert("Pago fallido", presentError.message);
        }
        return;
      }

      onPaymentSuccess(product);
    } catch (error) {
      Alert.alert(
        "Error de pago",
        error instanceof Error ? error.message : "No se pudo procesar el pago."
      );
    } finally {
      setLoading(false);
    }
  }, [product, initPaymentSheet, presentPaymentSheet, onPaymentSuccess]);

  return (
    <Modal
      visible={product !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Text style={styles.title}>Resumen del pedido</Text>

        {product && (
          <>
            <View style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSku}>SKU · {product.sku}</Text>
              </View>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{product.price}</Text>
            </View>
          </>
        )}

        <Pressable
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pagar ahora</Text>
          )}
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={onClose} disabled={loading}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#121A2F",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: "#283655",
    gap: 16,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3A4D6B",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A2540",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#283655",
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
  productSku: {
    color: "#9FB3D1",
    fontSize: 12,
  },
  productPrice: {
    color: "#60A5FA",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#283655",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#9FB3D1",
    fontSize: 14,
    fontWeight: "600",
  },
  totalAmount: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  payButton: {
    backgroundColor: "#2C4C8A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelText: {
    color: "#9FB3D1",
    fontSize: 14,
  },
});
