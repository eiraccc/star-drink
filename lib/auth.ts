import { supabase } from "./supabase";

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.log(error);
    throw error;
  }
  return data.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.log(error);
    throw error;
  }
  return data.user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
