import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { InputField } from "../atoms/InputField";
import { PrimaryButton } from "../atoms/Primarybutton";

type RegisterFormProps = {
  onSubmit: () => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const isValid = !!name && !!email && !!phone && !!password;

  return (
    <View style={styles.container}>
      <InputField
        label="Nombre"
        placeholder="Juan Pérez"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
      />
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
        label="Teléfono"
        placeholder="+593 99 999 9999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
      />
      <InputField
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
      />
      <PrimaryButton
        label="Crear cuenta"
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