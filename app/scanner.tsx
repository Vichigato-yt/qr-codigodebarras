import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CameraScanner } from "@/src/components/scanner/CameraScanner";

type MockProduct = {
  code: string;
  name: string;
  description: string;
  priceCents: number;
};

const formatUsd = (amountCents: number) => `$${(amountCents / 100).toFixed(2)} USD`;

export default function ScannerScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState("Escanea un código QR o de barras para agregar al carrito.");
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const processingRef = useRef(false);

  const localProductMap = useMemo<Record<string, MockProduct>>(
    () => ({
      "SKU-9920": {
        code: "SKU-9920",
        name: "Munición energética 500g",
        description: "Blend ficticio premium para operaciones intensas.",
        priceCents: 1290,
      },
      "SKU-1101": {
        code: "SKU-1101",
        name: "Ración táctica 1L",
        description: "Bebida láctea ficticia para recuperación rápida.",
        priceCents: 165,
      },
      "SKU-2007": {
        code: "SKU-2007",
        name: "Kit crujiente integral",
        description: "Snack ficticio de misión con fibra y energía.",
        priceCents: 240,
      },
      "5901234123457": {
        code: "5901234123457",
        name: "Botiquín compacto",
        description: "Consumible ficticio escaneado por EAN-13.",
        priceCents: 799,
      },
    }),
    []
  );

  const sendLocalNotification = useCallback(async (code: string, name: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Escaneo exitoso",
          body: `${name} (${code}) listo para checkout`,
          data: { code, name },
        },
        trigger: null,
      });
    } catch (notificationError) {
      console.log("No se pudo mostrar la notificación local", notificationError);
    }
  }, []);

  const handleDataDetected = useCallback(async (data: string) => {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const code = data.trim();
      setLastCode(code);
      setScanMessage("Analizando lectura...");

      if (code.startsWith("myapp://products/")) {
        const productId = code.replace("myapp://products/", "");

        const deepLinkProduct = localProductMap[productId];
        if (deepLinkProduct) {
          setSelectedProduct(deepLinkProduct);
          setScanMessage("Producto detectado desde deep link. Listo para checkout.");
          await sendLocalNotification(deepLinkProduct.code, deepLinkProduct.name);
          return;
        }

        throw new Error(`Producto ficticio no encontrado para: ${productId}`);
      }

      if (code === "TF2-CHECKOUT-FAST") {
        const fastProduct: MockProduct = {
          code,
          name: "Pase rápido de misión",
          description: "Atajo ficticio directo a checkout.",
          priceCents: 990,
        };

        setSelectedProduct(fastProduct);
        setScanMessage("Lectura válida. Producto preparado para pagar.");
        await sendLocalNotification(fastProduct.code, fastProduct.name);
        return;
      }

      const localProduct = localProductMap[code as keyof typeof localProductMap];

      if (localProduct) {
        setSelectedProduct(localProduct);
        setScanMessage("Producto encontrado en catálogo ficticio.");
        await sendLocalNotification(localProduct.code, localProduct.name);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      throw new Error("Código no registrado en el sistema");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar el código.";
      setSelectedProduct(null);
      setScanMessage(message);
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [localProductMap, sendLocalNotification]);

  const handleScanError = useCallback((error: Error) => {
    if (error.message === "EMPTY_SCAN") {
      setScanMessage("Lectura inválida: no se detectó contenido en el código.");
      return;
    }

    setScanMessage(error.message || "No se pudo procesar el código escaneado.");
  }, []);

  const openCheckout = () => {
    if (!selectedProduct) {
      return;
    }

    router.push({
      pathname: "/checkout",
      params: {
        productName: selectedProduct.name,
        productCode: selectedProduct.code,
        productPriceCents: String(selectedProduct.priceCents),
      },
    });
  };

  return (
    <View style={styles.screen}>
      <CameraScanner
        isPaused={isProcessing}
        onDataDetected={handleDataDetected}
        onScanError={handleScanError}
      />

      <View style={styles.hudCard}>
        <Text style={styles.hudBadge}>MANN CO. SCANNER</Text>
        <Text style={styles.hudStatus}>{scanMessage}</Text>
        <Text style={styles.hudMeta}>Última lectura: {lastCode ?? "SIN DATOS"}</Text>

        {selectedProduct ? (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{selectedProduct.name}</Text>
            <Text style={styles.productDescription}>{selectedProduct.description}</Text>
            <View style={styles.productRow}>
              <Text style={styles.productCode}>#{selectedProduct.code}</Text>
              <Text style={styles.productPrice}>{formatUsd(selectedProduct.priceCents)}</Text>
            </View>
            <Pressable style={styles.checkoutButton} onPress={openCheckout}>
              <Text style={styles.checkoutButtonText}>IR A CHECKOUT</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  hudCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "rgba(34,27,20,0.92)",
    borderWidth: 2,
    borderColor: "#7F5A3A",
  },
  hudBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#B04A1E",
    color: "#F8ECDD",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hudStatus: {
    marginTop: 8,
    color: "#F6DEC6",
    fontSize: 13,
    fontWeight: "600",
  },
  hudMeta: {
    marginTop: 4,
    color: "#CFAE8E",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  productCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#8B6848",
    borderRadius: 8,
    backgroundColor: "#2C2119",
    padding: 10,
    gap: 4,
  },
  productName: {
    color: "#FFE6CC",
    fontSize: 15,
    fontWeight: "800",
  },
  productDescription: {
    color: "#E8C9AA",
    fontSize: 12,
    lineHeight: 18,
  },
  productRow: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productCode: {
    color: "#CFAE8E",
    fontSize: 11,
    fontWeight: "700",
  },
  productPrice: {
    color: "#F8ECDD",
    fontSize: 13,
    fontWeight: "800",
  },
  checkoutButton: {
    marginTop: 8,
    backgroundColor: "#B04A1E",
    borderWidth: 1,
    borderColor: "#E08A56",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
  checkoutButtonText: {
    color: "#FFF2E3",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
