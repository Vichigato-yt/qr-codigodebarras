import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const featuredProducts = [
    { name: "Munición energética 500g", price: "$12.90" },
    { name: "Botiquín compacto", price: "$7.99" },
    { name: "Pase rápido de misión", price: "$9.90" },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MANN CO. MOBILE</Text>
        </View>

        <Text style={styles.title}>Punto de Venta Táctico</Text>
        <Text style={styles.subtitle}>Escanea códigos · Cobra rápido · Opera sin fricción</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>LISTO PARA VENDER</Text>
          <Text style={styles.heroTitle}>Tu caja móvil en una sola pantalla</Text>
          <Text style={styles.heroDescription}>
            Escanea QR o barras, confirma el producto ficticio y envía el cobro al checkout en segundos.
          </Text>

          <View style={styles.heroActions}>
            <Link href="/scanner" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>INICIAR ESCANEO</Text>
              </Pressable>
            </Link>

            <Link href="/checkout" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>ABRIR CHECKOUT</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>97%</Text>
            <Text style={styles.statLabel}>Lectura exitosa</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1.8s</Text>
            <Text style={styles.statLabel}>Escaneo promedio</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3x</Text>
            <Text style={styles.statLabel}>Conversión rápida</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Catálogo rápido</Text>
          {featuredProducts.map((product) => (
            <View key={product.name} style={styles.productRow}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acciones del operador</Text>
          <Link href="/scanner" asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Escáner</Text>
              <Text style={styles.actionSubtitle}>Detecta QR, EAN, UPC y Code128 en tiempo real</Text>
            </Pressable>
          </Link>

          <Link href="/payments" asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Arquitectura de pagos</Text>
              <Text style={styles.actionSubtitle}>Simula tokenización, intent y webhook de forma segura</Text>
            </Pressable>
          </Link>

          <Link href="/checkout" asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Checkout</Text>
              <Text style={styles.actionSubtitle}>Formulario táctil listo para cobro ficticio</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Estado del sistema</Text>
          <Text style={styles.footerText}>Modo demo activo · Catálogo local ficticio · Sin backend requerido</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Link href="/" asChild>
          <Pressable style={[styles.navButton, styles.navButtonActive]}>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Inicio</Text>
          </Pressable>
        </Link>

        <Link href="/scanner" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navLabel}>Escanear</Text>
          </Pressable>
        </Link>

        <Link href="/checkout" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navLabel}>Checkout</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#17120F",
  },
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 120,
    backgroundColor: "#17120F",
    gap: 14,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#A7461C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E69661",
  },
  badgeText: {
    color: "#FFEAD2",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#F5DEC6",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: "#CDA985",
    marginTop: -2,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#221A13",
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: "#6F5139",
    gap: 8,
  },
  heroCard: {
    backgroundColor: "#2A2018",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#A07047",
    gap: 10,
  },
  heroLabel: {
    alignSelf: "flex-start",
    color: "#FDE9D2",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    backgroundColor: "#AF4A1E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  heroTitle: {
    color: "#FFF2E3",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
  },
  heroDescription: {
    color: "#D7BA9A",
    fontSize: 14,
    lineHeight: 21,
  },
  heroActions: {
    marginTop: 4,
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#AF4A1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2A469",
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFF2E3",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#3A2A1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A07047",
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#F8DFC5",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#221A13",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6F5139",
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statValue: {
    color: "#FEE7CD",
    fontSize: 20,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 2,
    color: "#CFAE8E",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F5DCC2",
  },
  productRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6F5139",
    borderRadius: 8,
    backgroundColor: "#2B2119",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  productName: {
    color: "#F6DBC0",
    fontSize: 14,
    fontWeight: "700",
  },
  productPrice: {
    color: "#FFE8D0",
    fontSize: 14,
    fontWeight: "900",
  },
  actionButton: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#8A6445",
    borderRadius: 8,
    backgroundColor: "#2B2119",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionTitle: {
    color: "#FFE8D0",
    fontSize: 14,
    fontWeight: "800",
  },
  actionSubtitle: {
    marginTop: 2,
    color: "#D2AF8D",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
  },
  footerCard: {
    marginTop: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6F5139",
    backgroundColor: "#1F1813",
    padding: 14,
  },
  footerTitle: {
    color: "#F8DFC5",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  footerText: {
    marginTop: 4,
    color: "#D2AF8D",
    fontSize: 12,
    lineHeight: 19,
    fontWeight: "600",
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8A6445",
    backgroundColor: "#221A13",
    flexDirection: "row",
    padding: 6,
    gap: 6,
  },
  navButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#2F231B",
    borderWidth: 1,
    borderColor: "#6F5139",
  },
  navButtonActive: {
    backgroundColor: "#AF4A1E",
    borderColor: "#F2A469",
  },
  navLabel: {
    color: "#D6B496",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  navLabelActive: {
    color: "#FFF2E3",
  },
});
