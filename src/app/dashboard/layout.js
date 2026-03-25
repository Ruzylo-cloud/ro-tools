'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', background: '#fafbfc' }}>
        {children}
      </main>
    </>
  );
}
