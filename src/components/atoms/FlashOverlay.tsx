import { Animated, StyleSheet } from "react-native";

type FlashOverlayProps = {
  flashAnim: Animated.Value;
  flashColor: string;
};

export function FlashOverlay({ flashAnim, flashColor }: FlashOverlayProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.flashOverlay,
        { backgroundColor: flashColor, opacity: flashAnim },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  flashOverlay: {
    zIndex: 5,
  },
});