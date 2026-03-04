import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { FlashOverlay } from "../atoms/FlashOverlay";
import { CameraPermission } from "../molecules/CameraPermission";
import { ScanOverlay } from "../molecules/ScanOverlay";
import { useScannerAudio } from "../hooks/useScannerAudio";
import { useScanAnimation } from "../hooks/useScanAnimation";
import { useScanState } from "../hooks/useScanState";
import React from "react";

type CameraScannerProps = {
  isPaused?: boolean;
  onDataDetected: (data: string) => Promise<void> | void;
  onScanError?: (error: Error) => void;
};

export function CameraScanner({ isPaused = false, onDataDetected, onScanError }: CameraScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const { scanLineAnim } = useScanAnimation();
  const { flashAnim, flashColor, triggerFlash } = useScanAnimation();  
  const { playSuccessBeep } = useScannerAudio();
  const { scanState, setScanState, handlingScanRef } = useScanState(isPaused);

  const handleBarcodeScanned = useCallback(async ({ data }: BarcodeScanningResult) => {
    if (isPaused || handlingScanRef.current) return;
    handlingScanRef.current = true;
    const content = data?.trim() ?? "";

    if (!content) {
      setScanState("error");
      triggerFlash("#ef4444");
      onScanError?.(new Error("EMPTY_SCAN"));
      setTimeout(() => { handlingScanRef.current = false; if (!isPaused) setScanState("idle"); }, 450);
      return;
    }

    setScanState("success");
    triggerFlash("#22c55e");
    Promise.allSettled([Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), playSuccessBeep()]);

    try {
      await onDataDetected(content);
    } catch (error) {
      setScanState("error");
      triggerFlash("#ef4444");
      onScanError?.(error instanceof Error ? error : new Error("SCAN_ACTION_FAILED"));
    } finally {
      handlingScanRef.current = false;
      if (!isPaused) setScanState("idle");
    }
  }, [isPaused, onDataDetected, onScanError, playSuccessBeep, triggerFlash, setScanState, handlingScanRef]);

  const uiState = useMemo(() => {
    if (scanState === "success") return { frameColor: "#22c55e", label: "Código detectado", icon: "✓" };
    if (scanState === "error") return { frameColor: "#ef4444", label: "Lectura inválida", icon: "!" };
    return { frameColor: "#d1d5db", label: "Apunta al código", icon: "◦" };
  }, [scanState]);

  if (!permission) return <View style={styles.loadingContainer} />;
  if (!permission.granted) return <CameraPermission onRequest={requestPermission} />;

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={isPaused ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <FlashOverlay flashAnim={flashAnim} flashColor={flashColor} />
      <ScanOverlay uiState={uiState} scanState={scanState} scanLineAnim={scanLineAnim} isPaused={isPaused} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: "#0B1020" },
  cameraContainer: { flex: 1, backgroundColor: "#000000" },
});