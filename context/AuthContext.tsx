'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';

type UserType = {
  user_id: string;
  user_name: string;
  email: string;
  role: string
} | null;

type AuthContextType = {
  user: UserType;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      const email = data.user?.email;

      if (!userId || !email) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      setUser({
        user_id: userId,
        user_name: profile?.userName ?? '',
        email,
        role: profile?.role ?? '',
      });
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const userId = session.user.id;
          const email = session.user.email ?? '';

          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()
            .then(({ data }) =>
              setUser({
                user_id: userId,
                user_name: data?.userName ?? '',
                email,
                role: data?.role ?? '',
              })
            );
        } else {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
