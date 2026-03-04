import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StateBadgeProps = {
  icon: string;
  label: string;
  frameColor: string;
};

export function StateBadge({ icon, label, frameColor }: StateBadgeProps) {
  return (
    <View style={[styles.stateBadge, { borderColor: frameColor }]}>
      <Text style={[styles.stateIcon, { color: frameColor }]}>{icon}</Text>
      <Text style={styles.stateText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  stateIcon: {
    fontSize: 16,
    fontWeight: "700",
  },
  stateText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
});