import { Link, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type CardNetwork = "visa" | "mastercard" | null;

const detectCardNetwork = (digits: string): CardNetwork => {
  if (digits.startsWith("4")) {
    return "visa";
  }

  const firstTwo = Number(digits.slice(0, 2));
  const firstFour = Number(digits.slice(0, 4));

  const isMastercardClassic = firstTwo >= 51 && firstTwo <= 55;
  const isMastercardExtended = firstFour >= 2221 && firstFour <= 2720;

  if (isMastercardClassic || isMastercardExtended) {
    return "mastercard";
  }

  return null;
};

const formatCardNumber = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
  return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiry = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
};

export default function CheckoutScreen() {
  const params = useLocalSearchParams<{
    productName?: string;
    productCode?: string;
    productPriceCents?: string;
  }>();

  const productName = params.productName ?? "Pack de misión estándar";
  const productCode = params.productCode ?? "SKU-OPS-001";
  const totalCents = Number(params.productPriceCents ?? "1290") || 1290;

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const cardDigits = useMemo(() => cardNumber.replace(/\D/g, ""), [cardNumber]);
  const cardNetwork = useMemo(() => detectCardNetwork(cardDigits), [cardDigits]);

  const animatePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        speed: 24,
        bounciness: 4,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 20,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const submitMockCheckout = async () => {
    if (isSubmitting) {
      return;
    }

    if (cardNumber.replace(/\D/g, "").length < 16 || !cardHolder.trim() || expiry.length < 5 || cvv.length < 3) {
      Alert.alert("Datos incompletos", "Completa correctamente los campos de pago para continuar.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    Alert.alert("Pago aprobado", `Compra ficticia confirmada para ${productName}.`);
  };

  const buttonShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Paso 8 de 11</Text>
      </View>

      <Text style={styles.title}>Terminal de Checkout</Text>
      <Text style={styles.subtitle}>Modo Operativo · Estética Industrial</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>RESUMEN DE CARGA</Text>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productCode}>Código: {productCode}</Text>
        <Text style={styles.totalAmount}>${(totalCents / 100).toFixed(2)} USD</Text>
        <Text style={styles.totalNote}>Total visible, sin costos ocultos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Métodos rápidos</Text>
        <Text style={styles.paragraph}>Apple Pay y Google Pay van primero para máxima conversión.</Text>

        <View style={styles.quickMethodsRow}>
          <Pressable style={styles.quickMethodButton}>
            <Text style={styles.quickMethodText}>Apple Pay</Text>
          </Pressable>
          <Pressable style={styles.quickMethodButton}>
            <Text style={styles.quickMethodText}>Google Pay</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Formulario de pago</Text>

        <Text style={styles.fieldLabel}>NÚMERO DE TARJETA</Text>
        <View style={styles.networkRow}>
          <TextInput
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#6B7C99"
            keyboardType="numeric"
            maxLength={19}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            style={[styles.input, styles.flexInput]}
          />
          <View style={styles.networkBadge}>
            <Text style={styles.networkText}>{cardNetwork ? cardNetwork.toUpperCase() : "CARD"}</Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>TITULAR</Text>
        <TextInput
          placeholder="NOMBRE COMO APARECE"
          placeholderTextColor="#6B7C99"
          autoCapitalize="characters"
          value={cardHolder}
          onChangeText={setCardHolder}
          style={styles.input}
        />

        <View style={styles.doubleRow}>
          <View style={styles.doubleCol}>
            <Text style={styles.fieldLabel}>EXPIRACIÓN</Text>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor="#6B7C99"
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              style={styles.input}
            />
          </View>

          <View style={styles.doubleCol}>
            <Text style={styles.fieldLabel}>CVV</Text>
            <TextInput
              placeholder="123"
              placeholderTextColor="#6B7C99"
              keyboardType="numeric"
              maxLength={4}
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, "").slice(0, 4))}
              style={styles.input}
              secureTextEntry
            />
          </View>
        </View>

        <Animated.View
          style={[
            styles.ctaWrapper,
            {
              transform: [{ scale: scaleAnim }],
              shadowOpacity: buttonShadow,
            },
          ]}
        >
          <Pressable
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={submitMockCheckout}
            disabled={isSubmitting}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>
              {isSubmitting ? "PROCESANDO..." : "COMPLETAR PAGO"}
            </Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.secureNote}>PCI DSS COMPLIANT • ENCRYPTED</Text>

        <Link href="/scanner" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>VOLVER A ESCÁNER</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 44,
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
  totalCard: {
    backgroundColor: "#2A2018",
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: "#7E5B3D",
  },
  totalLabel: {
    color: "#E3C4A7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  productName: {
    marginTop: 5,
    color: "#FFF2E3",
    fontSize: 18,
    fontWeight: "800",
  },
  productCode: {
    marginTop: 2,
    color: "#D2AF8C",
    fontSize: 12,
    fontWeight: "700",
  },
  totalAmount: {
    marginTop: 4,
    color: "#F8E6D2",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  totalNote: {
    marginTop: 6,
    color: "#D4B89A",
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#221A13",
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: "#6F5139",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F5DCC2",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: "#D7BA9A",
  },
  quickMethodsRow: {
    marginTop: 4,
    flexDirection: "row",
    gap: 8,
  },
  quickMethodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3A2A1E",
    borderWidth: 1.5,
    borderColor: "#9D6C45",
    alignItems: "center",
  },
  quickMethodText: {
    color: "#FCEBD9",
    fontSize: 14,
    fontWeight: "800",
  },
  fieldLabel: {
    marginTop: 8,
    color: "#D3B091",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  networkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  networkBadge: {
    height: 44,
    minWidth: 92,
    borderRadius: 8,
    backgroundColor: "#3A2A1E",
    borderWidth: 1,
    borderColor: "#9D6C45",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  networkText: {
    color: "#FCEBD9",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  input: {
    marginTop: 6,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9D6C45",
    backgroundColor: "#1A140F",
    color: "#FCEBD9",
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: "700",
  },
  doubleRow: {
    flexDirection: "row",
    gap: 8,
  },
  doubleCol: {
    flex: 1,
  },
  ctaWrapper: {
    marginTop: 12,
    borderRadius: 8,
    shadowColor: "#E79058",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  ctaButton: {
    backgroundColor: "#AF4A1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2A469",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  ctaText: {
    color: "#FFF2E3",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  secureNote: {
    marginTop: 8,
    color: "#D2AF8D",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.6,
  },
  backButton: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8E6748",
    backgroundColor: "#2E231B",
  },
  backButtonText: {
    color: "#E9CFB4",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
});
