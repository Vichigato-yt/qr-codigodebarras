/**
 * Stripe background task registration.
 *
 * This module registers the StripeKeepJsAwakeTask required by the native Stripe SDK.
 * It must be imported at the very beginning of the app lifecycle, before any Stripe initialization.
 */

import { Platform } from "react-native";

async function registerStripeTask() {
  if (Platform.OS === "web") {
    return;
  }

  try {
    // eslint-disable-next-line global-require
    const TaskManager = require("expo-task-manager");
    
    // Define the no-op task that Stripe native expects.
    // Calling defineTask multiple times is safe; newer definitions replace older ones.
    TaskManager.defineTask("StripeKeepJsAwakeTask", async () => {
      // Background task executed periodically by the system.
      // Stripe only needs this task to exist; the implementation doesn't matter.
      // Platform-specific handling may be added here if needed.
    });
    
    console.log(`[StripeTaskManager] Task "StripeKeepJsAwakeTask" registered successfully on ${Platform.OS}`);
  } catch (error) {
    console.warn(`[StripeTaskManager] Failed to register StripeKeepJsAwakeTask on ${Platform.OS}:`, error);
  }
}

// Register immediately
registerStripeTask();
