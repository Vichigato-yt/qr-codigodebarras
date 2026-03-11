import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type CameraPermissionProps = {
  onRequest: () => void;
};

export function CameraPermission({ onRequest }: CameraPermissionProps) {
  return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>Necesitamos acceso a tu cámara</Text>
      <Text style={styles.permissionDescription}>
        Para escanear códigos QR y de barras, habilita permisos de cámara.
      </Text>
      <Button onPress={onRequest} title="Dar permiso" />
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    backgroundColor: "#0B1020",
  },
  permissionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  permissionDescription: {
    color: "#C8D4E5",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 6,
  },
});