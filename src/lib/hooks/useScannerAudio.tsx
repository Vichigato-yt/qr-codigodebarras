import { Audio } from "expo-av";
import { useCallback, useEffect, useRef } from "react";

export function useScannerAudio() {
  const successSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(require("../../../assets/success_beep.mp3"));
        if (!mounted) { await sound.unloadAsync(); return; }
        successSoundRef.current = sound;
      } catch { successSoundRef.current = null; }
    };
    setupAudio();
    return () => {
      mounted = false;
      if (successSoundRef.current) { successSoundRef.current.unloadAsync(); successSoundRef.current = null; }
    };
  }, []);

  const playSuccessBeep = useCallback(async () => {
    if (!successSoundRef.current) return;
    try {
      await successSoundRef.current.setPositionAsync(0);
      await successSoundRef.current.playAsync();
    } catch { return; }
  }, []);

  return { playSuccessBeep };
}