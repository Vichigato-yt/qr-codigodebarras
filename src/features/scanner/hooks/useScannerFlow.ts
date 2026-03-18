import { useCallback, useRef, useState } from "react";

import { decodeQrFromUrl } from "@/src/core/scanner/qrApi";
import { useScannerNotifications } from "@/src/features/scanner/hooks/useScannerNotifications";
import { FAST_SCAN_CODE, MOCK_PRODUCTS } from "@/src/features/scanner/model/mockProducts";
import type { MockProduct } from "@/src/features/scanner/model/types";

const SAME_CODE_COOLDOWN_MS = 1800;

const resolveCodeFromQrApi = async (rawCode: string) => {
  const isImageUrl = /^https?:\/\/.+\.(png|jpg|jpeg|webp)$/i.test(rawCode);

  if (!isImageUrl) {
    return rawCode;
  }

  const decoded = await decodeQrFromUrl(rawCode);
  if (!decoded.content) {
    throw new Error(decoded.error ?? "La API de QR no encontro contenido en la imagen");
  }

  return decoded.content.trim();
};

const createFastScanProduct = (): MockProduct => ({
  code: FAST_SCAN_CODE,
  name: "Pase rapido de mision",
  description: "Atajo ficticio para validar la lectura.",
  priceCents: 990,
});

export function useScannerFlow() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState(
    "Escanea un codigo QR o de barras para validar un producto."
  );
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const processingRef = useRef(false);
  const lastAcceptedReadRef = useRef<{ code: string; scannedAt: number } | null>(null);
  const { notifyScanSuccess } = useScannerNotifications();

  const handleDataDetected = useCallback(async (data: string) => {
    if (processingRef.current) {
      return;
    }

    const rawCode = data.trim();
    const now = Date.now();
    const lastAccepted = lastAcceptedReadRef.current;

    if (
      rawCode &&
      lastAccepted &&
      lastAccepted.code === rawCode &&
      now - lastAccepted.scannedAt < SAME_CODE_COOLDOWN_MS
    ) {
      return;
    }

    lastAcceptedReadRef.current = {
      code: rawCode,
      scannedAt: now,
    };

    processingRef.current = true;
    setIsProcessing(true);

    try {
      setLastCode(rawCode);
      setScanMessage("Analizando lectura...");
      const code = await resolveCodeFromQrApi(rawCode);

      if (code.startsWith("myapp://products/")) {
        const productId = code.replace("myapp://products/", "");
        const deepLinkProduct = MOCK_PRODUCTS[productId];

        if (!deepLinkProduct) {
          throw new Error(`Producto ficticio no encontrado para: ${productId}`);
        }

        setSelectedProduct(deepLinkProduct);
        setScanMessage("Producto detectado desde deep link.");
        await notifyScanSuccess({ code: deepLinkProduct.code, name: deepLinkProduct.name });
        return;
      }

      if (code === FAST_SCAN_CODE) {
        const fastProduct = createFastScanProduct();
        setSelectedProduct(fastProduct);
        setScanMessage("Lectura valida del codigo rapido.");
        await notifyScanSuccess({ code: fastProduct.code, name: fastProduct.name });
        return;
      }

      const matchedProduct = MOCK_PRODUCTS[code as keyof typeof MOCK_PRODUCTS];

      if (matchedProduct) {
        setSelectedProduct(matchedProduct);
        setScanMessage("Producto encontrado por API/lectura local.");
        await notifyScanSuccess({ code: matchedProduct.code, name: matchedProduct.name });
        return;
      }

      throw new Error("Codigo no registrado en el sistema");
    } catch (error) {
      setSelectedProduct(null);
      const message = error instanceof Error ? error.message : "No se pudo procesar el codigo.";
      setScanMessage(message);
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [notifyScanSuccess]);

  const handleScanError = useCallback((error: Error) => {
    if (error.message === "EMPTY_SCAN") {
      setScanMessage("Lectura invalida: no se detecto contenido en el codigo.");
      return;
    }

    setScanMessage(error.message || "No se pudo procesar el codigo escaneado.");
  }, []);

  return {
    isProcessing,
    lastCode,
    scanMessage,
    selectedProduct,
    handleDataDetected,
    handleScanError,
  };
}
