import { useEffect, useRef, useState } from "react";

export function useScanState(isPaused: boolean) {
  const [scanState, setScanState] = useState<"idle" | "success" | "error">("idle");
  const handlingScanRef = useRef(false);

  useEffect(() => {
    if (!isPaused && !handlingScanRef.current) setScanState("idle");
  }, [isPaused]);

  return { scanState, setScanState, handlingScanRef };
}