import { useEffect } from 'react';
import { Platform } from 'react-native';

import { supabase } from '../supabase/client.supabase';
import { NotificationAdapter } from './notification.adapter';

export type UsePushNotificationsOptions = {
  enabled?: boolean;
  projectId?: string;
  onToken?: (token: string) => void | Promise<void>;
};

NotificationAdapter.setup();

export const usePushNotifications = (
  userId?: string,
  options: UsePushNotificationsOptions = {}
) => {
  const { enabled, projectId, onToken } = options;
  const shouldRun = enabled ?? Boolean(userId);

  useEffect(() => {
    if (!shouldRun) return;

    const register = async () => {
      const token = await NotificationAdapter.registerForPushNotificationsAsync({
        projectId,
      });

      if (!token) return;

      if (userId) {
        await saveTokenToDatabase(token, userId);
      }

      if (onToken) {
        await onToken(token);
      }
    };

    register();
  }, [shouldRun, projectId, userId, onToken]);
};

async function saveTokenToDatabase(token: string, userId: string) {
  const { error } = await supabase
    .from('devices')
    .upsert(
      {
        user_id: userId,
        token,
        platform: Platform.OS,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: 'token' }
    );

  if (error) {
    console.error('Error saving device token:', error);
  } else {
    console.log('Device token registered in Supabase');
  }
}
