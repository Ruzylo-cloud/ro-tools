'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import QuickTour from '@/components/QuickTour';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [setupChecked, setSetupChecked] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
        // Check if demo mode (demo profile always has setupComplete: true)
        if (user.email === 'demo@ro-tools.app') {
          setIsDemoMode(true);
        }
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
      <main style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    );
  }

  if (!setupComplete) return null;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--gray-50)' }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <QuickTour />
      {/* Demo Mode Badge */}
      {isDemoMode && (
        <div style={{
          position: 'fixed', bottom: 16, left: 16, zIndex: 9999,
          background: 'rgba(19,74,124,0.9)', color: '#fff',
          padding: '6px 14px', borderRadius: '8px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}>
          DEMO MODE
        </div>
      )}
    </>
  );
}
