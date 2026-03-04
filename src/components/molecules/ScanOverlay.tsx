import { Animated, StyleSheet, Text, View } from "react-native";
import { StateBadge } from "../atoms/StateBadge";
import { ScanFrame } from "./ScanFrame";
import React from "react";

type UiState = {
  frameColor: string;
  label: string;
  icon: string;
};

type ScanOverlayProps = {
  uiState: UiState;
  scanState: "idle" | "success" | "error";
  scanLineAnim: Animated.Value;
  isPaused: boolean;
};

export function ScanOverlay({ uiState, scanState, scanLineAnim, isPaused }: ScanOverlayProps) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <ScanFrame
        frameColor={uiState.frameColor}
        scanState={scanState}
        scanLineAnim={scanLineAnim}
      />
      <StateBadge
        icon={uiState.icon}
        label={uiState.label}
        frameColor={uiState.frameColor}
      />
      {isPaused && <Text style={styles.processingText}>Procesando lectura...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    gap: 18,
  },
  processingText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "500",
  },
});