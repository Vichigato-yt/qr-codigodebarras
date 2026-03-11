import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type PrimaryButtonProps = TouchableOpacityProps & {
  label: string;
  loading?: boolean;
};

export function PrimaryButton({ label, loading = false, disabled, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
      activeOpacity={0.75}
      disabled={disabled || loading}
      {...props}
    >
      {loading
        ? <ActivityIndicator color="#0B1020" size="small" />
        : <Text style={styles.label}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  label: {
    color: "#0B1020",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});