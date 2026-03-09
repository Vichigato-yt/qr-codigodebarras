import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { LabelPill } from "@/src/presentation/cells/LabelPill";
import { PanelCard } from "@/src/presentation/tissues/PanelCard";

export function HomeScreenView() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LabelPill text="Paso 1 de 11" />

      <Text style={styles.title}>Centro Operativo de Escaneo</Text>
      <Text style={styles.subtitle}>QR/Barcode Reader · API QR</Text>

      <PanelCard title="Contexto">
        <Text style={styles.paragraph}>
          Esta rama esta enfocada solo en escaneo: lectura de codigos QR/barras y
          validacion con API de QR, sin pasarela de pagos.
        </Text>
      </PanelCard>

      <PanelCard title="Objetivo">
        <Text style={styles.paragraph}>
          Construir una experiencia rapida y robusta para captura de codigos y
          confirmacion de productos ficticios.
        </Text>
      </PanelCard>

      <PanelCard title="Flujo sugerido">
        <Text style={styles.listItem}>- 1) Abrir escaner y detectar un SKU ficticio.</Text>
        <Text style={styles.listItem}>- 2) Si es URL de imagen QR, decodificar via API externa.</Text>
        <Text style={styles.listItem}>- 3) Resolver y mostrar producto en panel operativo.</Text>
        <Text style={styles.listItem}>- 4) Confirmar lectura y continuar operacion local.</Text>
      </PanelCard>

      <PanelCard title="Catalogo ficticio">
        <Text style={styles.listItem}>- No usa base de datos ni backend de productos.</Text>
        <Text style={styles.listItem}>- El inventario esta embebido localmente para demo.</Text>
        <Text style={styles.listItem}>- Ideal para pruebas de UX antes de produccion.</Text>
      </PanelCard>

      <PanelCard title="API de QR">
        <Text style={styles.paragraph}>
          La capa src/core/scanner/qrApi.ts permite decodificar imagenes QR por URL y mantener
          el escaner desacoplado de la UI.
        </Text>
      </PanelCard>

      <PanelCard title="Paso 2 de 11">
        <Text style={styles.paragraph}>
          Configuraremos la camara en Expo con permisos robustos y una pantalla
          base de escaneo lista para produccion.
        </Text>
        <Link href="/scanner" asChild>
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaText}>Abrir escaner</Text>
          </Pressable>
        </Link>
        <Text style={styles.note}>
          Nota: cambios de permisos en app.json requieren nuevo Development Build
          con EAS para reflejarse fuera de Expo Go.
        </Text>
      </PanelCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#17120F",
    gap: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#F5DEC6",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: "#CDA985",
    marginTop: -2,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#D7BA9A",
  },
  listItem: {
    fontSize: 14,
    lineHeight: 21,
    color: "#D7BA9A",
  },
  ctaButton: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#AF4A1E",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2A469",
  },
  ctaText: {
    color: "#FFF2E3",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  note: {
    marginTop: 4,
    color: "#D2AF8D",
    fontSize: 12,
    lineHeight: 18,
  },
});
