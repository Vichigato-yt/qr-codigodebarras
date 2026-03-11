import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

export function useScanAnimation() {
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
    return () => { animation.stop(); scanLineAnim.setValue(0); };
  }, [scanLineAnim]);

  const triggerFlash = useCallback((color: string) => {
    setFlashColor(color);
    flashAnim.setValue(0);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.35, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [flashAnim]);

  return { scanLineAnim, flashAnim, flashColor, triggerFlash };
}