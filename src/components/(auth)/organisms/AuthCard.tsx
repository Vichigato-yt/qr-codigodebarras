import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AuthLogo } from "../atoms/AuthLogo";
import { AuthTabSwitcher } from "../molecules/AuthTabSwitcher";
import { LoginForm } from "../molecules/LoginForm";
import { RegisterForm } from "../molecules/RegisterForm";

type AuthTab = "login" | "register";

type AuthCardProps = {
  onAuth: () => void;
};

export function AuthCard({ onAuth }: AuthCardProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  return (
    <View style={styles.card}>
      <AuthLogo />
      <AuthTabSwitcher active={activeTab} onChange={setActiveTab} />
      {activeTab === "login"
        ? <LoginForm onSubmit={onAuth} />
        : <RegisterForm onSubmit={onAuth} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(11,16,32,0.95)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    padding: 28,
    gap: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
});