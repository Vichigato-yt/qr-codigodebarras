import { supabase } from '../../core/supabase/client.supabase';

/**
 * Servicio de autenticación — centraliza el acceso a Supabase Auth.
 * La intención es que los componentes y hooks consuman este servicio
 * en lugar del cliente de Supabase directamente.
 */
export const authService = {
  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
  ) => supabase.auth.onAuthStateChange(callback),

  signInWithEmail: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUpWithEmail: (
    email: string,
    password: string,
    metadata?: { name?: string; phone?: string }
  ) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { name: metadata?.name, phone: metadata?.phone } },
    }),

  signOut: () => supabase.auth.signOut(),
};
