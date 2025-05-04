
import { supabase } from "@/integrations/supabase/client";

export type SignUpCredentials = {
  phone?: string;
  password?: string;
  username?: string;
  fullName?: string;
};

export type SignInCredentials = {
  phone?: string;
  password?: string;
};

export const signUp = async ({ phone, password, username, fullName }: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signIn = async ({ phone, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};
