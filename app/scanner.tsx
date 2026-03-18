import { useFocusEffect, useRouter } from "expo-router";
import { BookMarked, ScanLine } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { CameraScanner } from "@/src/components/Organisms/CameraScanner";
import { READER_INFO, SKU_CATALOG_MAP } from "@/src/data/sku-catalog";

const SAME_CODE_COOLDOWN_MS = 1800;

export default function ScannerScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const processingRef = useRef(false);
  const navigationLockRef = useRef(false);
  const lastAcceptedReadRef = useRef<{ code: string; scannedAt: number } | null>(null);

  const localProductMap = useMemo(() => SKU_CATALOG_MAP, []);

  const handleDataDetected = useCallback(async (data: string) => {
    if (navigationLockRef.current || processingRef.current) {
      return;
    }

    const code = data.trim();
    const now = Date.now();
    const lastAccepted = lastAcceptedReadRef.current;

    if (
      code &&
      lastAccepted &&
      lastAccepted.code === code &&
      now - lastAccepted.scannedAt < SAME_CODE_COOLDOWN_MS
    ) {
      return;
    }

    lastAcceptedReadRef.current = {
      code,
      scannedAt: now,
    };

    processingRef.current = true;
    setIsProcessing(true);

    try {
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
        navigationLockRef.current = true;

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

  // Reset navigation lock when the screen regains focus (e.g. after returning from payment).
  useFocusEffect(
    useCallback(() => {
      navigationLockRef.current = false;
      processingRef.current = false;
      setIsProcessing(false);
    }, [])
  );

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
        supportedTypes={READER_INFO.supportedTypes}
      />

      <View style={styles.headerPanel}>
        <View style={styles.row}>
          <ScanLine size={16} color="#d9e8ff" />
          <Text style={styles.headerTitle}>Escaner de productos</Text>
        </View>
        <Text style={styles.headerSubtitle}>Alinea el codigo dentro del marco para detectar el articulo.</Text>
        <View style={styles.rowHint}>
          <BookMarked size={14} color="#9fb3d1" />
          <Text style={styles.hintText}>{READER_INFO.helperText}</Text>
        </View>
      </View>

      <View style={styles.footerPanel}>
        <Text style={styles.footerLabel}>Ultima lectura</Text>
        <Text style={styles.footerValue}>{lastCode ?? "Aun no hay lecturas"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 56,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(8,11,19,0.84)",
    borderWidth: 1,
    borderColor: "#2c3b5d",
  },
  headerTitle: {
    color: "#f7f9fd",
    fontSize: 16,
    fontWeight: "800",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#b5c5e0",
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  rowHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  hintText: {
    flex: 1,
    color: "#9fb3d1",
    fontSize: 12,
    lineHeight: 16,
  },
  footerPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 22,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(10,15,29,0.88)",
    borderWidth: 1,
    borderColor: "#25324D",
  },
  footerLabel: {
    color: "#9FB3D1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  footerValue: {
    marginTop: 4,
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "500",
  },
});
