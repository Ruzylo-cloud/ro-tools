'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const TOUR_STEPS = [
  {
    icon: '👋',
    title: 'Welcome to RO Tools',
    desc: 'Your operational platform for JM Valley Group. Let\u2019s take a quick 30-second tour.',
    path: null,
  },
  {
    icon: '📊',
    title: 'Overview Dashboard',
    desc: 'Your command center. Store stats, quick actions, recent updates, and compliance info \u2014 all at a glance.',
    path: '/dashboard',
  },
  {
    icon: '📄',
    title: 'Document Generators',
    desc: '12 professional PDF generators \u2014 written warnings, evaluations, injury reports, and more. Auto-filled with your store info.',
    path: '/dashboard/generators',
  },
  {
    icon: '📚',
    title: 'Training Documents',
    desc: '8 multi-page training packets rebuilt from the Director\u2019s originals. 54 pages covering Orientation through Shift Lead.',
    path: '/dashboard/documents',
  },
  {
    icon: '🍽️',
    title: 'Catering Tracker',
    desc: 'Full CRM for catering clients. Track orders, revenue, follow-ups, and reorder with one click.',
    path: '/dashboard/catering-tracker',
  },
  {
    icon: '🏆',
    title: 'Scoreboard',
    desc: '12 weeks of performance data across all 29+ stores. Grand Slams, Trifectas, and growth rankings.',
    path: '/dashboard/scoreboard',
  },
  // L10 removed from RO Tools — now on RO Control only
  {
    icon: '📢',
    title: 'Directives',
    desc: 'Monthly marketing directives, meeting recaps, and the full 2026 campaign calendar.',
    path: '/dashboard/directives',
  },
  {
    icon: '🎉',
    title: 'You\u2019re all set!',
    desc: 'That\u2019s the tour. Everything is accessible from the nav bar above. Jump in and start generating!',
    path: null,
  },
];

export default function QuickTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const done = localStorage.getItem('ro-tools-tour-done');
    if (done === 'true') return;

    // Check server-side too
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.profile?.tourCompleted) {
          setVisible(true);
        }
      })
      .catch(() => {
        // If API fails, show tour if not done locally
        if (!done) setVisible(true);
      });
  }, [user]);

  const goToStep = useCallback((newStep) => {
    if (newStep >= TOUR_STEPS.length) {
      completeTour();
      return;
    }
    setStep(newStep);
    const s = TOUR_STEPS[newStep];
    if (s.path) {
      router.push(s.path);
    }
  }, [router]);

  const completeTour = useCallback(() => {
    setVisible(false);
    localStorage.setItem('ro-tools-tour-done', 'true');
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourCompleted: true }),
    }).catch(() => {});
    router.push('/dashboard');
  }, [router]);

  if (!visible) return null;

  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;
  const pct = Math.round(((step + 1) / TOUR_STEPS.length) * 100);

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 9998, transition: 'opacity 0.3s',
      }} />

      {/* Tooltip */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 9999,
        background: '#fff', borderRadius: '16px', padding: '32px',
        maxWidth: '420px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        textAlign: 'center',
        animation: 'fadeUp 0.3s ease-out',
      }}>
        {/* Icon */}
        <div style={{ marginBottom: '16px', fontSize: '36px' }}>
          {current.icon}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '22px', fontWeight: 800,
          color: '#134A7C', marginBottom: '8px',
        }}>
          {current.title}
        </div>

        {/* Description */}
        <p style={{
          fontSize: '14px', color: '#6b7280',
          lineHeight: 1.7, margin: '0 0 20px 0',
        }}>
          {current.desc}
        </p>

        {/* Progress bar */}
        <div style={{
          background: '#f0f2f5', borderRadius: '100px',
          height: '6px', marginBottom: '20px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', background: '#EE3227',
            borderRadius: '100px', width: `${pct}%`,
            transition: 'width 0.3s',
          }} />
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button
            onClick={completeTour}
            style={{
              background: 'none', border: 'none', color: '#9ca3af',
              fontSize: '13px', cursor: 'pointer', padding: '8px 0',
            }}
          >
            Skip tour
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 0 && (
              <button
                onClick={() => goToStep(step - 1)}
                style={{
                  padding: '10px 20px', border: '1px solid #e5e7eb',
                  background: '#fff', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  color: '#374151',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => goToStep(step + 1)}
              style={{
                padding: '10px 24px', background: '#134A7C',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, -45%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
