import { Stack } from "expo-router";
import { useCallback } from "react";

import { usePushNotifications } from "@/src/lib/core/notifications";

const NotificationsGate = () => {
  const handleToken = useCallback((token: string) => {
    console.log("[push] Expo token", token);
  }, []);

  usePushNotifications(undefined, {
    enabled: true,
    onToken: handleToken,
  });

  return null;
};

export default function RootLayout() {
  return (
    <>
      <NotificationsGate />
      <Stack />
    </>
  );
}
