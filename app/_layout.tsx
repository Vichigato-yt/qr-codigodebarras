// app/_layout.tsx
import { Redirect, Stack } from "expo-router";
import React from "react";
import { useState } from "react";

export default function RootLayout() {
  const [isAuthenticated] = useState(false);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated && <Redirect href="/(auth)/Login" />}
    </Stack>
  );
}