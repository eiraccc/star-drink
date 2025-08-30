'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error('Please log in first');
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      toast.error('Access denied: Admins only');
      router.push('/');
    }
  }, [user]);

  if (!user || user?.role !== 'admin') return null;

  return <>{children}</>;
};

export default AdminRoute;
