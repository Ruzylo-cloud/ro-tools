'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import QuickTour from '@/components/QuickTour';

// RT-018: Page title map for document.title updates
const PAGE_TITLES = {
  '/dashboard': 'Dashboard — RO Tools',
  '/dashboard/generators': 'Generators — RO Tools',
  '/dashboard/generators/written-warning': 'Written Warning — RO Tools',
  '/dashboard/generators/evaluation': 'Performance Evaluation — RO Tools',
  '/dashboard/generators/coaching-form': 'Employee Coaching — RO Tools',
  '/dashboard/generators/resignation': 'Employee Resignation — RO Tools',
  '/dashboard/generators/termination': 'Employee Termination — RO Tools',
  '/dashboard/generators/injury-report': 'Injury Report — RO Tools',
  '/dashboard/generators/timesheet-correction': 'Timesheet Correction — RO Tools',
  '/dashboard/generators/attestation-correction': 'Attestation Correction — RO Tools',
  '/dashboard/generators/meal-break-waiver': 'Meal Break Waiver — RO Tools',
  '/dashboard/generators/catering-order': 'Catering Order — RO Tools',
  '/dashboard/generators/food-labels': 'Food Labels — RO Tools',
  '/dashboard/generators/work-orders': 'Work Orders — RO Tools',
  '/dashboard/generators/manager-log': 'Manager Log — RO Tools',
  '/dashboard/generators/dm-walkthroughs': 'DM Walk-Through — RO Tools',
  '/dashboard/generators/onboarding-packets': 'Onboarding Packet — RO Tools',
  '/dashboard/flyer': 'Catering Flyer — RO Tools',
  '/dashboard/scoreboard': 'Scoreboard — RO Tools',
  '/dashboard/catering-tracker': 'Catering Tracker — RO Tools',
  '/dashboard/directives': 'Directives — RO Tools',
  '/dashboard/profile': 'Store Profile — RO Tools',
  '/dashboard/support': 'Support — RO Tools',
  '/dashboard/admin': 'Admin Panel — RO Tools',
  '/dashboard/documents': 'Training Documents — RO Tools',
  '/dashboard/history': 'Document History — RO Tools',
  '/dashboard/updates': 'Updates — RO Tools',
  '/dashboard/reading': 'Reading — RO Tools',
  '/dashboard/setup': 'Setup — RO Tools',
};

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [setupChecked, setSetupChecked] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  // RT-026: Session timeout warning
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  // RT-073: Keyboard shortcut help
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // RT-026: Session timeout warning (warn at 55 min, expire at 60 min)
  // RT-253: Auto-logout after 30min inactivity
  useEffect(() => {
    if (!user) return;
    let inactivityTimer;
    const INACTIVITY_MS = 30 * 60 * 1000; // 30 min
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Store redirect destination and push to login
        sessionStorage.setItem('rt-post-login', window.location.pathname);
        router.push('/');
      }, INACTIVITY_MS);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    // Warn at 55 min of session (session-level, not inactivity)
    const warnTimer = setTimeout(() => setShowTimeoutWarning(true), 55 * 60 * 1000);
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warnTimer);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [user, router]);

  // RT-018: Update document.title on route change
  useEffect(() => {
    const title = PAGE_TITLES[pathname] || 'RO Tools';
    document.title = title;
  }, [pathname]);

  // RT-073: Global ? to show keyboard shortcut help
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setShowShortcutHelp(v => !v);
      }
      if (e.key === 'Escape') setShowShortcutHelp(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // RT-120: Ctrl+Enter to download — moved to each generator's onKeyDown (RT-139)
  // Global handler removed to prevent double-firing after per-generator handlers were added

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
        <p style={{ color: 'var(--gray-500)', fontSize: '16px' }}>Loading...</p>
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
      <a href="#main-content" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden', zIndex: 10000 }} onFocus={e => { e.target.style.position = 'fixed'; e.target.style.left = '16px'; e.target.style.top = '16px'; e.target.style.width = 'auto'; e.target.style.height = 'auto'; e.target.style.padding = '8px 16px'; e.target.style.background = 'var(--jm-blue, #134A7C)'; e.target.style.color = '#fff'; e.target.style.borderRadius = '8px'; e.target.style.fontSize = '14px'; e.target.style.fontWeight = '600'; }} onBlur={e => { e.target.style.position = 'absolute'; e.target.style.left = '-9999px'; e.target.style.width = '1px'; e.target.style.height = '1px'; }}>Skip to main content</a>
      {/* RT-263: Offline banner */}
      <OfflineBanner />
      <Sidebar />
      <div className="rt-sidebar-content">
        <main id="main-content" role="main" style={{ flex: 1, background: 'var(--gray-50)', minHeight: 'calc(100vh - 53px)' }}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        {/* RT-016: Footer */}
        <Footer />
      </div>
      <QuickTour />
      {/* RT-026: Session Timeout Warning */}
      {showTimeoutWarning && (
        <div style={{
          position: 'fixed', top: 80, right: 16, zIndex: 9999,
          background: '#fff9e6', border: '1.5px solid #f59e0b',
          borderRadius: '12px', padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          maxWidth: 300, fontSize: '13px', color: '#92400e',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Session Expiring Soon</div>
            <div>Your session will expire in 5 minutes. Save your work.</div>
          </div>
          <button onClick={() => setShowTimeoutWarning(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: 16, flexShrink: 0, padding: '0 2px', marginLeft: 4 }}>×</button>
        </div>
      )}
      {/* RT-073: Keyboard shortcut help overlay */}
      {showShortcutHelp && (
        <div onClick={() => setShowShortcutHelp(false)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '28px 32px', width: '360px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--jm-blue)', margin: 0 }}>Keyboard Shortcuts</h2>
              <button onClick={() => setShowShortcutHelp(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)', lineHeight: 1 }}>×</button>
            </div>
            {[
              ['⌘K / Ctrl+K', 'Open generator search'],
              ['⌘↵ / Ctrl+Enter', 'Download PDF (on generator pages)'],
              ['?', 'Show this help'],
              ['Esc', 'Close this dialog'],
            ].map(([key, desc]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{desc}</span>
                <kbd style={{ fontSize: '11px', fontFamily: 'monospace', background: 'var(--gray-100)', border: '1px solid var(--border)', borderRadius: '5px', padding: '2px 8px', color: 'var(--gray-700)', whiteSpace: 'nowrap' }}>{key}</kbd>
              </div>
            ))}
            <p style={{ marginTop: 14, fontSize: '11px', color: 'var(--gray-400)', textAlign: 'center', marginBottom: 0 }}>Press <kbd style={{ fontSize: '10px', background: 'var(--gray-100)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 5px' }}>?</kbd> anytime to toggle</p>
          </div>
        </div>
      )}
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
