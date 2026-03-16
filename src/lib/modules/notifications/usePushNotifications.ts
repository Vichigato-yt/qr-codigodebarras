import { useEffect } from 'react';
import { Platform } from 'react-native';

import { NotificationAdapter } from '../../core/notifications/notification.adapter';
import { supabase } from '../../core/supabase/client.supabase';

// Configura los handlers globales una sola vez al cargar el módulo.
NotificationAdapter.setup();

export const usePushNotifications = (userId?: string) => {
  useEffect(() => {
    if (!userId) return;

    const register = async () => {
      const token = await NotificationAdapter.registerForPushNotificationsAsync();

      if (!token) return;

      console.log('Token obtenido:', token);
      await saveTokenToDatabase(token, userId);
    };

    register();
  }, [userId]);
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
    console.error('Error guardando device:', error);
  } else {
    console.log('Dispositivo registrado en Supabase');
  }
}
