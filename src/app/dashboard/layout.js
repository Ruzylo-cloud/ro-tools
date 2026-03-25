'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [setupChecked, setSetupChecked] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const checkSetup = useCallback(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => {
        if (!res.ok) throw new Error('Profile check failed');
        return res.json();
      })
      .then(data => {
        const complete = data.profile?.setupComplete === true;
        setSetupComplete(complete);
        setSetupChecked(true);
        if (!complete && pathname !== '/dashboard/setup') {
          router.push('/dashboard/setup');
        }
      })
      .catch(() => setSetupChecked(true));
  }, [user, pathname, router]);

  useEffect(() => {
    checkSetup();
  }, [checkSetup]);

  if (loading || !setupChecked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (pathname === '/dashboard/setup') {
    return (
      <main style={{ minHeight: '100vh', background: '#fafbfc' }}>
        {children}
      </main>
    );
  }

  if (!setupComplete) return null;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', background: '#fafbfc' }}>
        {children}
      </main>
    </>
  );
}
