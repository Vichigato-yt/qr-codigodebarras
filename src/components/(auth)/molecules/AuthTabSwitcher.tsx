import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AuthTab = "login" | "register";

type AuthTabSwitcherProps = {
  active: AuthTab;
  onChange: (tab: AuthTab) => void;
};

export function AuthTabSwitcher({ active, onChange }: AuthTabSwitcherProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, active === "login" && styles.tabActive]}
        onPress={() => onChange("login")}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, active === "login" && styles.tabTextActive]}>
          Ingresar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, active === "register" && styles.tabActive]}
        onPress={() => onChange("register")}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, active === "register" && styles.tabTextActive]}>
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  tabText: {
    color: "#4B5A72",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: "#22c55e",
  },
});