import { AuthCard } from "@/src/components/(auth)/organisms/AuthCard";
import { router } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

export default function RegisterScreen() {
  const handleAuth = () => {
    // TODO: conectar lógica real de auth
    router.replace("./index");
  };

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
          <AuthCard onAuth={handleAuth} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B1020",
  },
  bgGlow: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(34,197,94,0.06)",
    top: -80,
    alignSelf: "center",
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
});