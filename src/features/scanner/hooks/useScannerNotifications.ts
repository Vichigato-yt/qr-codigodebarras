import { useCallback, useEffect, useRef } from "react";

import * as Notifications from "expo-notifications";

import { NotificationAdapter } from "@/src/lib/core/notifications";

NotificationAdapter.setup();

type ScanNotificationPayload = {
  code: string;
  name: string;
};

const sendExpoPush = async (token: string, payload: ScanNotificationPayload) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: token,
      title: "Escaneo exitoso",
      body: `${payload.name} (${payload.code}) listo para operacion`,
      sound: "default",
      data: payload,
    }),
  });
};

export function useScannerNotifications() {
  const pushTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const register = async () => {
      try {
        const token = await NotificationAdapter.registerForPushNotificationsAsync();
        if (token) {
          pushTokenRef.current = token;
        }
      } catch (error) {
        console.log("No se pudo registrar push notifications", error);
      }
    };

    register();
  }, []);

  const notifyScanSuccess = useCallback(async (payload: ScanNotificationPayload) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Escaneo exitoso",
          body: `${payload.name} (${payload.code}) listo para operacion`,
          data: payload,
        },
        trigger: null,
      });
    } catch (error) {
      console.log("No se pudo mostrar la notificacion local", error);
    }

    if (!pushTokenRef.current) {
      return;
    }

    try {
      await sendExpoPush(pushTokenRef.current, payload);
    } catch (error) {
      console.log("No se pudo enviar push remoto", error);
    }
  }, []);

  return {
    notifyScanSuccess,
  };
}
