import { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../lib/auth';
import { toast } from 'react-toastify';
import Link from 'next/link';
import LoadingOverlay from './LoadingOverlay';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

const AuthForm = ({ mode }: AuthFormProps) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
      setIsLoading(true);
      try {
        const result = await signInWithEmail(email, password);
        toast.success('Logged in!');
        router.push('/');
      } catch (err: any) {
        console.log('err', err.message);
        
        if (err.message.includes('Email not confirmed')) {
            toast.error("Your email is not confirmed. Please check your inbox.");
        } else {
            toast.error("Login error! Please try again.");
        }
        return;
      } finally {
        setIsLoading(false);
      }
    };

    const handleSignUp = async () => {
        setIsLoading(true);
        try {
            const user = await signUpWithEmail(email, password); 
            if (!user) throw new Error('User creation failed');

            // 同步新增到 profiles 表
            const { error: profileError } = await supabase
            .from('profiles')
            .upsert(
                { user_id: user.id, name },
                { onConflict: 'user_id' } // 避免重複 key 錯誤
            );

            if (profileError) {
                alert(profileError.message);
                return;
            }

            toast.success('Signed up!');
        } catch (err: any) {
            console.log('err', err.message);
            toast.error("Sign up error! Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center bg-background">
            <div className="text-text sm:bg-contrast p-8 rounded-lg sm:shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                </h1>

                {isLoading && <LoadingOverlay />}

                {mode === 'signup' && <input
                    type="name"
                    placeholder="Name"
                    className="w-full p-3 px-4 mb-4 border rounded-full placeholder-surface border-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 px-4 mb-4 border rounded-full placeholder-surface border-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 px-4 mb-4 border rounded-full placeholder-surface border-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex flex-col gap-3 mb-2">
                    {mode === 'login' ? (
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className={`w-full px-4 py-2 rounded-md text-sm text-contrast bg-primary hover:opacity-80 disabled:opacity-50`}
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={handleSignUp}
                            disabled={isLoading}
                            className={`w-full px-4 py-2 rounded-md text-sm text-contrast bg-highlight hover:opacity-80 disabled:opacity-50`}
                        >
                            Sign Up
                        </button>
                    )}
                </div>

                {/* 底線註冊按鈕 */}
                {mode === 'login' && <div className="text-center mt-2">
                    <Link href="/signup">
                        <button className="text-primary underline text-sm hover:opacity-80">
                        Don't have an account? Sign Up
                        </button>
                    </Link>
                </div>}
            </div>
        </section>
    )
};

export default AuthForm;