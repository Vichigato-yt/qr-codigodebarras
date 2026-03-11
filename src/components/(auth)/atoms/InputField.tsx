import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function InputField({ label, error, ...props }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        placeholderTextColor="#4B5A72"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    color: "#C8D4E5",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#22c55e",
    backgroundColor: "rgba(34,197,94,0.05)",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239,68,68,0.05)",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 11,
    fontWeight: "500",
  },
});