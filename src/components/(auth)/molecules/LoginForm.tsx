import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CustomAlert } from "../atoms/CustomAlert";
import { InputField } from "../atoms/InputField";
import { PrimaryButton } from "../atoms/Primarybutton";

type LoginFormProps = {
  onSubmit: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);

  const handleSubmit = () => {
    if (!email || !password) {
      setAlert({ title: "Campos incompletos", message: "Por favor completa todos los campos." });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setAlert({ title: "Email inválido", message: "Ingresa un correo electrónico válido." });
      return;
    }
    if (password.length < 8) {
      setAlert({ title: "Contraseña muy corta", message: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }
    onSubmit();
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={!!alert}
        title={alert?.title ?? ""}
        message={alert?.message ?? ""}
        onClose={() => setAlert(null)}
        type="error"
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
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <PrimaryButton label="Entrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
});