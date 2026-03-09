import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type PanelCardProps = {
  title: string;
  children: ReactNode;
};

export function PanelCard({ title, children }: PanelCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#221A13",
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: "#6F5139",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F5DCC2",
  },
});
