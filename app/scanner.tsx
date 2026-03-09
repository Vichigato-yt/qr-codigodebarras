import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { CameraScanner } from "@/src/components/scanner/CameraScanner";

/** Products keyed by barcode / QR code value. Price is stored in cents. */
const LOCAL_PRODUCTS: Record<string, { name: string; price: number; currency: string }> = {
  "SKU-9920": { name: "Café en grano 500g",   price: 1290, currency: "usd" },
  "SKU-1101": { name: "Leche deslactosada 1L", price:  165, currency: "usd" },
  "SKU-2007": { name: "Galletas integrales",   price:  240, currency: "usd" },
};

export default function ScannerScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const processingRef = useRef(false);

  const localProductMap = useMemo(() => LOCAL_PRODUCTS, []);

  const handleDataDetected = useCallback(async (data: string) => {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const code = data.trim();
      setLastCode(code);

      if (code.startsWith("myapp://products/")) {
        const productId = code.replace("myapp://products/", "");

        Alert.alert(
          "Deep link detectado",
          `Producto: ${productId}\nAquí conectarías Expo Router para navegar al detalle.`
        );
        return;
      }

      const localProduct = localProductMap[code];

      if (localProduct) {
        // Navigate to the payment screen with product details.
        router.push({
          pathname: "/payment",
          params: {
            code,
            name:     localProduct.name,
            price:    String(localProduct.price),
            currency: localProduct.currency,
          },
        });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      throw new Error("Código no registrado en el sistema");
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [localProductMap, router]);

  const handleScanError = useCallback((error: Error) => {
    if (error.message === "EMPTY_SCAN") {
      Alert.alert("Lectura inválida", "No se detectó contenido en el código.");
      return;
    }

    Alert.alert("Error", error.message || "No se pudo procesar el código escaneado.");
  }, []);

  return (
    <View style={styles.screen}>
      <CameraScanner
        isPaused={isProcessing}
        onDataDetected={handleDataDetected}
        onScanError={handleScanError}
      />

      <View style={styles.bridgeBadge}>
        <Text style={styles.bridgeTitle}>Observer activo</Text>
        <Text style={styles.bridgeText}>Último dato emitido: {lastCode ?? "Sin lecturas"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  bridgeBadge: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 22,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(10,15,29,0.92)",
    borderWidth: 1,
    borderColor: "#25324D",
  },
  bridgeTitle: {
    color: "#9FB3D1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  bridgeText: {
    marginTop: 4,
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "500",
  },
});
