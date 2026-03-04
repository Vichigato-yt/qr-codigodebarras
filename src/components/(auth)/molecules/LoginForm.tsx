import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { InputField } from "../atoms/InputField";
import { PrimaryButton } from "../atoms/Primarybutton";

type LoginFormProps = {
  onSubmit: () => void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <InputField
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <InputField
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <PrimaryButton
        label="Entrar"
        onPress={onSubmit}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  button: {
    marginTop: 4,
  },
});