import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.eyebrowBadge}>
        <Text style={styles.eyebrowText}>POS inteligente</Text>
      </View>

      <Text style={styles.title}>Escanea, cobra y confirma en segundos</Text>
      <Text style={styles.subtitle}>
        Punto de venta con QR/codigo de barras y cobro con Stripe PaymentSheet.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Flujo de caja listo para usar</Text>
        <Text style={styles.heroText}>
          Escanea un producto, revisa el total y procesa el pago sin salir de la app.
        </Text>
        <Link href="/scanner" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Abrir escaner</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Como funciona</Text>
        <Text style={styles.listItem}>1. Escaneas un codigo del catalogo local.</Text>
        <Text style={styles.listItem}>2. La app arma el resumen del pedido.</Text>
        <Text style={styles.listItem}>3. Stripe presenta el metodo de pago y confirma.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Codigos de prueba</Text>
        <View style={styles.codePill}>
          <Text style={styles.codePillText}>SKU-9920</Text>
        </View>
        <View style={styles.codePill}>
          <Text style={styles.codePillText}>SKU-1101</Text>
        </View>
        <View style={styles.codePill}>
          <Text style={styles.codePillText}>SKU-2007</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Pago de prueba</Text>
        <Text style={styles.paragraph}>
          Usa la tarjeta 4242 4242 4242 4242 en modo test para completar compras.
        </Text>
        <Text style={styles.note}>Requiere un backend activo en /checkout.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#0B1020",
    gap: 14,
  },
  eyebrowBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#16233d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2f4d85",
  },
  eyebrowText: {
    color: "#c2d4f2",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f8faff",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: "#a8bddf",
    marginTop: -2,
    marginBottom: 6,
    lineHeight: 22,
  },
  heroCard: {
    backgroundColor: "#182746",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#325694",
    gap: 10,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "800",
  },
  heroText: {
    color: "#d6e3f7",
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#5bb0ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#03142a",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#121A2F",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#283655",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E2E8F0",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#C8D4E5",
  },
  listItem: {
    fontSize: 14,
    lineHeight: 21,
    color: "#C8D4E5",
  },
  codePill: {
    alignSelf: "flex-start",
    backgroundColor: "#1f2a44",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2c3f68",
  },
  codePillText: {
    color: "#dce8fc",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  note: {
    marginTop: 4,
    color: "#9FB3D1",
    fontSize: 12,
    lineHeight: 18,
  },
});
