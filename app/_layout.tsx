import { Stack, useRouter, useSegments } from "expo-router";
import { useCallback, useEffect } from "react";

import { usePushNotifications } from "@/src/lib/core/notifications";
import { AuthProvider, useAuth } from "@/src/lib/modules/auth/AuthProvider";

const NotificationsGate = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  const handleToken = useCallback(
    (token: string) => {
      console.log("[push] Expo token", token, "user", userId ?? "anon");
    },
    [userId]
  );

  usePushNotifications(userId, {
    enabled: true,
    onToken: handleToken,
  });

  return null;
};

function AuthLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (loading) return;

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, loading, inAuthGroup, router]);

  return (
    <>
      <NotificationsGate />
      <Stack />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}
