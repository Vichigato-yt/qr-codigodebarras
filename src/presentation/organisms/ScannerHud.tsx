import { Pressable, StyleSheet, Text, View } from "react-native";

import type { MockProduct } from "@/src/features/scanner/model/types";
import { LabelPill } from "@/src/presentation/cells/LabelPill";

type ScannerHudProps = {
  scanMessage: string;
  lastCode: string | null;
  selectedProduct: MockProduct | null;
};

const formatUsd = (amountCents: number) => `$${(amountCents / 100).toFixed(2)} USD`;

export function ScannerHud({ scanMessage, lastCode, selectedProduct }: ScannerHudProps) {
  return (
    <View style={styles.hudCard}>
      <LabelPill text="MANN CO. SCANNER" />
      <Text style={styles.hudStatus}>{scanMessage}</Text>
      <Text style={styles.hudMeta}>Ultima lectura: {lastCode ?? "SIN DATOS"}</Text>

      {selectedProduct ? (
        <View style={styles.productCard}>
          <Text style={styles.productName}>{selectedProduct.name}</Text>
          <Text style={styles.productDescription}>{selectedProduct.description}</Text>
          <View style={styles.productRow}>
            <Text style={styles.productCode}>#{selectedProduct.code}</Text>
            <Text style={styles.productPrice}>{formatUsd(selectedProduct.priceCents)}</Text>
          </View>
          <Pressable style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>LECTURA CONFIRMADA</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  confirmButton: {
    marginTop: 8,
    backgroundColor: "#B04A1E",
    borderWidth: 1,
    borderColor: "#E08A56",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
  confirmButtonText: {
    color: "#FFF2E3",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
