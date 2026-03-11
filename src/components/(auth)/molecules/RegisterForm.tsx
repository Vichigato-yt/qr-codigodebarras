import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CustomAlert } from "../atoms/CustomAlert";
import { InputField } from "../atoms/InputField";
import { PrimaryButton } from "../atoms/Primarybutton";

type RegisterFormProps = {
  onSubmit: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);

  const handleSubmit = () => {
    if (!name || !email || !phone || !password) {
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
      <PrimaryButton label="Crear cuenta" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
});