'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { Subscription, User } from '@supabase/supabase-js';

type UserType = {
  userId: string;
  userName: string;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: UserType;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isReady: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('--Auth Start--')
    let subscription: Subscription | undefined;

    const initAuth = async (): Promise<void> => {
      try {
        // 1. 先拿 session
        const { data: { session } } = await supabase.auth.getSession();
        // console.log('initial session', session);

        if (session?.user) {
          await loadProfile(session.user);
        }
        setIsReady(true);

        // 2. 再監聽 session 變化
        const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
          // console.log('session changed', session);
          if (session?.user) {
            await loadProfile(session.user);
          } else {
            setUser(null); // sign out
          }
        });

        subscription = data.subscription;
      } catch (err) {
        console.error('auth init error', err);
      }
    };

    initAuth();

    return () => subscription?.unsubscribe();
  }, []);


  const loadProfile = async (user: User) => {
    const { id, email } = user;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load profile', error);
        setUser(null);
        return;
      }

      if (!profile) {
        console.warn('Profile not found for user', id);
        setUser({
          userId: id,
          userName: '',
          email: email ?? '',
          role: ''
        });
        return;
      }

      setUser({
        userId: id,
        userName: profile.user_name,
        email: email ?? '',
        role: profile.role
      });
    } catch (err) {
      console.error('loadProfile exception', err);
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider value={{ user, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
