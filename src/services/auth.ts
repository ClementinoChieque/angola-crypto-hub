
import { supabase } from "@/integrations/supabase/client";

export type SignUpCredentials = {
  email?: string;
  password?: string;
  username?: string;
  fullName?: string;
};

export type SignInCredentials = {
  email?: string;
  password?: string;
};

export type PhoneSignUpCredentials = {
  phone: string;
  username?: string;
  fullName?: string;
};

export const signUp = async ({ email, password, username, fullName }: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email,
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

export const signIn = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signUpWithPhone = async ({ phone, username, fullName }: PhoneSignUpCredentials) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
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

export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) throw error;
  return data;
};

export const verifyOTP = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
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
