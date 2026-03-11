import React, { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: "error" | "warning" | "success";
};

const TYPE_CONFIG = {
  error:   { color: "#ef4444", icon: "✕", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)"   },
  warning: { color: "#f59e0b", icon: "⚠", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  success: { color: "#22c55e", icon: "✓", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.25)"   },
};

export function CustomAlert({ visible, title, message, onClose, type = "error" }: CustomAlertProps) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const config = TYPE_CONFIG[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 200 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>

          {/* Icono */}
          <View style={[styles.iconBox, { backgroundColor: config.bg, borderColor: config.border }]}>
            <Text style={[styles.icon, { color: config.color }]}>{config.icon}</Text>
          </View>

          {/* Texto */}
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Botón */}
          <TouchableOpacity style={[styles.button, { borderColor: config.border }]} onPress={onClose} activeOpacity={0.75}>
            <Text style={[styles.buttonText, { color: config.color }]}>Entendido</Text>
          </TouchableOpacity>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#0F1626",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    padding: 24,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
    fontWeight: "700",
  },
  textBlock: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  message: {
    color: "#9FB3D1",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  button: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});