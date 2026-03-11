/**
 * Stripe background task registration.
 *
 * This module registers the StripeKeepJsAwakeTask required by the native Stripe SDK.
 * It must be imported at the very beginning of the app lifecycle, before any Stripe initialization.
 * 
 * IMPORTANT: The task definition must be SYNCHRONOUS, not async, or TaskManager won't recognize it.
 */

import { Platform } from "react-native";

if (Platform.OS !== "web") {
  try {
    // eslint-disable-next-line global-require
    const TaskManager = require("expo-task-manager");
    
    // Define the task SYNCHRONOUSLY - this is critical!
    // TaskManager requires a synchronous task function or it won't register properly.
    TaskManager.defineTask("StripeKeepJsAwakeTask", () => {
      // Stripe background task - must be synchronous!
      // This is called periodically to keep the JS runtime alive while processing payments.
      console.log("[StripeTaskManager] StripeKeepJsAwakeTask executed");
    });
    
    console.log("[StripeTaskManager] Successfully registered StripeKeepJsAwakeTask on", Platform.OS);
  } catch (error) {
    console.warn(
      "[StripeTaskManager] Failed to register StripeKeepJsAwakeTask:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
