import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type AuthMode = "login" | "register";

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type AuthFormProps = {
  mode: AuthMode;
  loading: boolean;
  errorMessage?: string | null;
  onSwitchMode: (mode: AuthMode) => void;
  onLogin?: (payload: { email: string; password: string }) => Promise<void>;
  onRegister?: (payload: RegisterPayload) => Promise<void>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({
  mode,
  loading,
  errorMessage,
  onSwitchMode,
  onLogin,
  onRegister,
}: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submitLabel = mode === "login" ? "Entrar" : "Crear cuenta";

  const visibleError = localError ?? errorMessage ?? null;

  const title = useMemo(
    () => (mode === "login" ? "Inicia sesion" : "Crea tu cuenta"),
    [mode]
  );

  const subtitle =
    mode === "login"
      ? "Accede para escanear y cobrar con Stripe."
      : "Registra tus datos para comenzar.";

  const validate = (): boolean => {
    if (mode === "register" && (!name || !phone)) {
      setLocalError("Completa nombre y telefono.");
      return false;
    }

    if (!email || !password) {
      setLocalError("Completa email y contrasena.");
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setLocalError("Ingresa un correo valido.");
      return false;
    }

    if (password.length < 8) {
      setLocalError("La contrasena debe tener al menos 8 caracteres.");
      return false;
    }

    setLocalError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || loading) {
      return;
    }

    if (mode === "login") {
      if (!onLogin) {
        setLocalError("El inicio de sesion no esta disponible.");
        return;
      }
      await onLogin({ email: email.trim(), password });
      return;
    }

    if (!onRegister) {
      setLocalError("El registro no esta disponible.");
      return;
    }

    await onRegister({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.brand}>QR POS</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.switchRow}>
        <Pressable
          style={[styles.switchBtn, mode === "login" && styles.switchBtnActive]}
          onPress={() => onSwitchMode("login")}
        >
          <Text style={[styles.switchText, mode === "login" && styles.switchTextActive]}>
            Ingresar
          </Text>
        </Pressable>
        <Pressable
          style={[styles.switchBtn, mode === "register" && styles.switchBtnActive]}
          onPress={() => onSwitchMode("register")}
        >
          <Text
            style={[styles.switchText, mode === "register" && styles.switchTextActive]}
          >
            Registrarse
          </Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        {mode === "register" ? (
          <>
            <Field label="Nombre" value={name} onChangeText={setName} autoCapitalize="words" />
            <Field
              label="Telefono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </>
        ) : null}

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Contrasena"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {visibleError ? <Text style={styles.error}>{visibleError}</Text> : null}

        <Pressable
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#041022" />
          ) : (
            <Text style={styles.submitText}>{submitLabel}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & {
  label: string;
};

function Field({ label, ...props }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        style={styles.fieldInput}
        placeholderTextColor="#6f86a6"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(11,16,32,0.94)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    gap: 14,
  },
  brand: {
    color: "#90caf9",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#f8faff",
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 31,
  },
  subtitle: {
    color: "#a9c0de",
    fontSize: 13,
    lineHeight: 18,
  },
  switchRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#304564",
    backgroundColor: "#152340",
    padding: 4,
    marginTop: 4,
  },
  switchBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 8,
  },
  switchBtnActive: {
    backgroundColor: "#5bb0ff",
  },
  switchText: {
    color: "#b3c9e8",
    fontSize: 13,
    fontWeight: "700",
  },
  switchTextActive: {
    color: "#031529",
  },
  form: {
    marginTop: 6,
    gap: 12,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: "#cfe1f8",
    fontSize: 12,
    fontWeight: "700",
  },
  fieldInput: {
    backgroundColor: "#101d35",
    borderWidth: 1,
    borderColor: "#2c4262",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: "#f5faff",
    fontSize: 14,
  },
  error: {
    color: "#ff8fa3",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  submitBtn: {
    marginTop: 4,
    backgroundColor: "#5bb0ff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#031427",
    fontSize: 15,
    fontWeight: "800",
  },
});