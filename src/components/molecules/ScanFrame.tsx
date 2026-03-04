import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ScanLine } from "../atoms/ScanLine";

type ScanFrameProps = {
  frameColor: string;
  scanState: "idle" | "success" | "error";
  scanLineAnim: Animated.Value;
};

export function ScanFrame({ frameColor, scanState, scanLineAnim }: ScanFrameProps) {
  return (
    <View style={[styles.scanFrame, { borderColor: frameColor }]}>
      {scanState === "idle" && <ScanLine scanLineAnim={scanLineAnim} />}
    </View>
  );
}

const styles = StyleSheet.create({
  scanFrame: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    justifyContent: "center",
  },
});