'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingOverlay from '../LoadingOverlay';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if(!isReady) return;
    
    if (!user) {
      toast.error('Please log in first');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== 'admin') {
      toast.error('Access denied: Admins only');
      router.push('/');
    }
  }, [user, isReady, router]);

  if (!isReady) return <LoadingOverlay />;
  if (!user || user?.role !== 'admin') return null;

  return <>{children}</>;
};

export default AdminRoute;
