import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
    confirmMockPayment,
    createMockPaymentIntent,
    notifyMockWebhook,
    processMockPayment,
    tokenizeMockCard,
} from "@/src/core/payments/paymentService";

type FlowStepKey = "tokenization" | "intent" | "confirmation" | "webhook" | "ui";
type FlowStatus = "idle" | "running" | "success" | "error";

type StepState = Record<FlowStepKey, FlowStatus>;

const INITIAL_STEPS: StepState = {
  tokenization: "idle",
  intent: "idle",
  confirmation: "idle",
  webhook: "idle",
  ui: "idle",
};

const labels: Record<FlowStepKey, string> = {
  tokenization: "1. Tokenización (Client-Side)",
  intent: "2. Payment Intent (Server-Side)",
  confirmation: "3. Confirmación + 3D Secure",
  webhook: "4. Webhook asíncrono",
  ui: "5. Éxito UI",
};

export default function PaymentsScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount] = useState(1290);
  const [steps, setSteps] = useState<StepState>(INITIAL_STEPS);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedAmount = useMemo(() => `$${(amount / 100).toFixed(2)} USD`, [amount]);

  const setStep = (step: FlowStepKey, status: FlowStatus) => {
    setSteps((previous) => ({ ...previous, [step]: status }));
  };

  const resetFlow = () => {
    setSteps(INITIAL_STEPS);
    setTransactionId(null);
    setErrorMessage(null);
  };

  const runMockPaymentFlow = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    resetFlow();

    const idempotencyKey = `order_${Date.now()}`;
    let activeStep: FlowStepKey | null = null;

    try {
      activeStep = "tokenization";
      setStep("tokenization", "running");
      const paymentMethodId = await tokenizeMockCard();
      setStep("tokenization", "success");

      activeStep = "intent";
      setStep("intent", "running");
      const paymentIntent = await createMockPaymentIntent(paymentMethodId, amount);
      setStep("intent", "success");

      activeStep = "confirmation";
      setStep("confirmation", "running");
      await confirmMockPayment(paymentIntent.clientSecret);
      setStep("confirmation", "success");

      activeStep = "webhook";
      setStep("webhook", "running");
      const paymentResult = await processMockPayment({ amount, idempotencyKey });
      await notifyMockWebhook(paymentResult.transactionId);
      setStep("webhook", "success");

      activeStep = "ui";
      setStep("ui", "success");
      setTransactionId(paymentResult.transactionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado en el flujo";
      setErrorMessage(message);

      if (activeStep) {
        setStep(activeStep, "error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Paso 7 de 11</Text>
      </View>

      <Text style={styles.title}>Arquitectura de Pagos</Text>
      <Text style={styles.subtitle}>App · Backend · Pasarela</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Flujo de 4 pasos</Text>
        <Text style={styles.paragraph}>Tu app nunca toca datos crudos de tarjeta: solo tokens.</Text>
        <Text style={styles.listItem}>• Tokenización: tarjeta ⮕ PaymentMethod ID.</Text>
        <Text style={styles.listItem}>• Intención: app ⮕ backend para generar client secret.</Text>
        <Text style={styles.listItem}>• Confirmación: 3D Secure en cliente.</Text>
        <Text style={styles.listItem}>• Webhook: la pasarela confirma captura al servidor.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Seguridad crítica</Text>
        <Text style={styles.listItem}>• HTTPS obligatorio en todas las comunicaciones.</Text>
        <Text style={styles.listItem}>• Idempotencia para evitar cargos duplicados.</Text>
        <Text style={styles.listItem}>• Sandbox con tarjetas de prueba únicamente.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Simulación mock</Text>
        <Text style={styles.paragraph}>Monto simulado: {formattedAmount}</Text>

        {(
          Object.keys(labels) as FlowStepKey[]
        ).map((step) => (
          <View key={step} style={styles.stepRow}>
            <Text style={styles.stepLabel}>{labels[step]}</Text>
            <Text style={styles.stepStatus}>{toStatusLabel(steps[step])}</Text>
          </View>
        ))}

        <Pressable
          style={[styles.ctaButton, isProcessing && styles.ctaButtonDisabled]}
          onPress={runMockPaymentFlow}
          disabled={isProcessing}
        >
          <Text style={styles.ctaText}>{isProcessing ? "Procesando..." : "Simular pago"}</Text>
        </Pressable>

        {transactionId && (
          <Text style={styles.successText}>Pago exitoso. Transacción: {transactionId}</Text>
        )}

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Responsabilidad</Text>
        <Text style={styles.paragraph}>
          Cualquier integración real debe seguir las guías oficiales PCI y de la pasarela
          elegida. Esta pantalla usa solo simulación para tu proyecto integrador.
        </Text>
      </View>
    </ScrollView>
  );
}

const toStatusLabel = (status: FlowStatus) => {
  if (status === "running") {
    return "En proceso";
  }

  if (status === "success") {
    return "OK";
  }

  if (status === "error") {
    return "Error";
  }

  return "Pendiente";
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 44,
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
    lineHeight: 21,
    color: "#C8D4E5",
  },
  listItem: {
    fontSize: 14,
    lineHeight: 21,
    color: "#C8D4E5",
  },
  stepRow: {
    borderWidth: 1,
    borderColor: "#283655",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  stepStatus: {
    color: "#9FB3D1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  ctaButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#2C4C8A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  successText: {
    color: "#86EFAC",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
});
