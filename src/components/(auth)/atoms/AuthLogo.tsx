import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function AuthLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>◈</Text>
      </View>
      <Text style={styles.title}>QRCodeLector</Text>
      <Text style={styles.subtitle}>Escanea. Gestiona. Listo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(34,197,94,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  icon: {
    fontSize: 28,
    color: "#22c55e",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#4B5A72",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});