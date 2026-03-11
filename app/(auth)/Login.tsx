// app/(auth)/Login.tsx
import { AuthForm } from "@/src/components/auth/AuthForm";
import { useAuth } from "@/src/lib/modules/auth/AuthProvider";
import { router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLogin = async (payload: { email: string; password: string }) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      await signInWithEmail(payload.email, payload.password);
      router.replace("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => router.replace("/(auth)/Register");

  return (
    <View style={styles.root}>
      <View style={styles.bgGlow} pointerEvents="none" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthForm
            mode="login"
            loading={loading}
            errorMessage={errorMessage}
            onSwitchMode={(mode) => {
              if (mode === "register") {
                goToRegister();
              }
            }}
            onLogin={handleLogin}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0B1020" },
  bgGlow: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(34,197,94,0.06)",
    top: -80,
    alignSelf: "center",
  },
  keyboardView: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
});