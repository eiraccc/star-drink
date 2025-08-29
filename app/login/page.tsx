'use client'
import { useEffect } from "react";
import AuthForm from "../../components/AuthForm";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const  LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.replace('/');
      }
    };

    checkUser();
  }, [router]);

  return <AuthForm mode="login" />;
};

export default LoginPage;