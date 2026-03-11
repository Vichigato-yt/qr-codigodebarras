import { Audio } from "expo-av";
import {
    CameraView,
    useCameraPermissions,
    type BarcodeScanningResult,
    type BarcodeType,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { AlertTriangle, CheckCircle2, ScanLine } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Button, Easing, StyleSheet, Text, View } from "react-native";

type CameraScannerProps = {
  isPaused?: boolean;
  onDataDetected: (data: string) => Promise<void> | void;
  onScanError?: (error: Error) => void;
  supportedTypes?: BarcodeType[];
};

export function CameraScanner({
  isPaused = false,
  onDataDetected,
  onScanError,
  supportedTypes = ["qr"],
}: CameraScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<"idle" | "success" | "error">("idle");

  const successSoundRef = useRef<Audio.Sound | null>(null);
  const handlingScanRef = useRef(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const [flashColor, setFlashColor] = useState("#22c55e");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
      scanLineAnim.setValue(0);
    };
  }, [scanLineAnim]);

  useEffect(() => {
    let mounted = true;

    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(require("../../../assets/success_beep.mp3"));

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        successSoundRef.current = sound;
      } catch {
        successSoundRef.current = null;
      }
    };

    setupAudio();

    return () => {
      mounted = false;

      if (successSoundRef.current) {
        successSoundRef.current.unloadAsync();
        successSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isPaused && !handlingScanRef.current) {
      setScanState("idle");
    }
  }, [isPaused]);

  const triggerFlash = useCallback((color: string) => {
    setFlashColor(color);
    flashAnim.setValue(0);

    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 0.35,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [flashAnim]);

  const playSuccessBeep = useCallback(async () => {
    if (!successSoundRef.current) {
      return;
    }

    try {
      await successSoundRef.current.setPositionAsync(0);
      await successSoundRef.current.playAsync();
    } catch {
      return;
    }
  }, []);

  const handleBarcodeScanned = useCallback(async ({ data }: BarcodeScanningResult) => {
    if (isPaused || handlingScanRef.current) {
      return;
    }

    handlingScanRef.current = true;
    const content = data?.trim() ?? "";

    if (!content) {
      setScanState("error");
      triggerFlash("#ef4444");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      onScanError?.(new Error("EMPTY_SCAN"));

      setTimeout(() => {
        handlingScanRef.current = false;
        if (!isPaused) {
          setScanState("idle");
        }
      }, 450);
      return;
    }

    setScanState("success");
    triggerFlash("#22c55e");

    Promise.allSettled([
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      playSuccessBeep(),
    ]);

    try {
      await onDataDetected(content);
    } catch (error) {
      setScanState("error");
      triggerFlash("#ef4444");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      if (error instanceof Error) {
        onScanError?.(error);
      } else {
        onScanError?.(new Error("SCAN_ACTION_FAILED"));
      }
    } finally {
      handlingScanRef.current = false;
      if (!isPaused) {
        setScanState("idle");
      }
    }
  }, [isPaused, onDataDetected, onScanError, playSuccessBeep, triggerFlash]);

  const uiState = useMemo(() => {
    if (scanState === "success") {
      return {
        frameColor: "#22c55e",
        label: "Código detectado",
      };
    }

    if (scanState === "error") {
      return {
        frameColor: "#ef4444",
        label: "Lectura inválida",
      };
    }

    return {
      frameColor: "#d1d5db",
      label: "Apunta al código",
    };
  }, [scanState]);

  if (!permission) {
    return <View style={styles.loadingContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Necesitamos acceso a tu cámara</Text>
        <Text style={styles.permissionDescription}>
          Para escanear códigos QR y de barras, habilita permisos de cámara.
        </Text>
        <Button onPress={requestPermission} title="Dar permiso" />
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={isPaused ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: supportedTypes }}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          styles.flashOverlay,
          { backgroundColor: flashColor, opacity: flashAnim },
        ]}
      />

      <View style={styles.overlay} pointerEvents="none">
        <View style={[styles.scanFrame, { borderColor: uiState.frameColor }]}> 
          {scanState === "idle" && (
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-110, 110],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
        </View>

        <View style={[styles.stateBadge, { borderColor: uiState.frameColor }]}> 
          {scanState === "success" ? (
            <CheckCircle2 size={16} color={uiState.frameColor} />
          ) : scanState === "error" ? (
            <AlertTriangle size={16} color={uiState.frameColor} />
          ) : (
            <ScanLine size={16} color={uiState.frameColor} />
          )}
          <Text style={styles.stateText}>{uiState.label}</Text>
        </View>

        {isPaused && <Text style={styles.processingText}>Procesando lectura...</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B1020",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    backgroundColor: "#0B1020",
  },
  permissionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  permissionDescription: {
    color: "#C8D4E5",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 6,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    gap: 18,
  },
  flashOverlay: {
    zIndex: 5,
  },
  scanFrame: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    justifyContent: "center",
  },
  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: "#E2E8F0",
    opacity: 0.9,
  },
  stateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(8,11,19,0.85)",
  },
  stateText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  processingText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "500",
  },
});