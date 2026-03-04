import { Animated, StyleSheet } from "react-native";

type ScanLineProps = {
  scanLineAnim: Animated.Value;
};

export function ScanLine({ scanLineAnim }: ScanLineProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: "#E2E8F0",
    opacity: 0.9,
  },
});