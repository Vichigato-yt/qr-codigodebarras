import { StyleSheet, View } from "react-native";

import { CameraScanner } from "@/src/components/Organisms/CameraScanner";
import { useScannerFlow } from "@/src/features/scanner/hooks/useScannerFlow";
import { ScannerHud } from "@/src/presentation/organisms/ScannerHud";

export function ScannerScreenView() {
  const {
    isProcessing,
    lastCode,
    scanMessage,
    selectedProduct,
    handleDataDetected,
    handleScanError,
  } = useScannerFlow();

  return (
    <View style={styles.screen}>
      <CameraScanner
        isPaused={isProcessing}
        onDataDetected={handleDataDetected}
        onScanError={handleScanError}
      />

      <ScannerHud
        scanMessage={scanMessage}
        lastCode={lastCode}
        selectedProduct={selectedProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
});
