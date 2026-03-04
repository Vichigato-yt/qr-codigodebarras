import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Paso 1 de 11</Text>
      </View>

      <Text style={styles.title}>Introducción a Códigos QR y Pagos</Text>
      <Text style={styles.subtitle}>Expo Camera · React Flow · Payment SDKs</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contexto</Text>
        <Text style={styles.paragraph}>
          En desarrollo móvil, interactuar con el mundo físico es clave. Los QR y
          códigos de barras conectan objetos reales (productos, entradas, mesas)
          con nuestra lógica digital.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Objetivo</Text>
        <Text style={styles.paragraph}>
          Esta guía te enseña a integrar visión artificial y flujos de pago con
          una estética premium y una arquitectura robusta para convertir tu app en
          una herramienta profesional de negocio.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Casos de uso en Expo</Text>
        <Text style={styles.listItem}>• Retail: escaneo de productos para precio y stock.</Text>
        <Text style={styles.listItem}>• Ticketing: validación de entradas con feedback instantáneo.</Text>
        <Text style={styles.listItem}>• Fintech: lectura y generación de QR para pagos seguros.</Text>
        <Text style={styles.listItem}>• Logística: rastreo con códigos EAN-13.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Requisitos previos</Text>
        <Text style={styles.listItem}>• Dispositivo físico (recomendado para cámara).</Text>
        <Text style={styles.listItem}>• Conocimientos básicos de Hooks.</Text>
        <Text style={styles.listItem}>• Cuenta EAS (para development builds con cámara).</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>¿Por qué aprender esto?</Text>
        <Text style={styles.paragraph}>
          Integrar lectores visuales mejora la UX al eliminar entradas manuales y
          habilita automatización de procesos críticos de negocio.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Paso 2 de 11</Text>
        <Text style={styles.paragraph}>
          Configuraremos la cámara en Expo con permisos robustos y una pantalla
          base de escaneo lista para producción.
        </Text>
        <Link href="/scanner" asChild>
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaText}>Abrir escáner</Text>
          </Pressable>
        </Link>
        <Text style={styles.note}>
          Nota: cambios de permisos en app.json requieren nuevo Development Build
          con EAS para reflejarse fuera de Expo Go.
        </Text>
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
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1F2A44",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: "#9FB3D1",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#F8FAFC",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: "#9FB3D1",
    marginTop: -2,
    marginBottom: 6,
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
  ctaButton: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#2C4C8A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  note: {
    marginTop: 4,
    color: "#9FB3D1",
    fontSize: 12,
    lineHeight: 18,
  },
});
