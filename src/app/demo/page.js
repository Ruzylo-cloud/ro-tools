'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to demo auth endpoint
    setTimeout(() => {
      window.location.href = '/api/auth/demo';
    }, 1500);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', fontFamily: "'Inter', sans-serif",
      background: '#0b0f19', color: '#f8fafc', fontSize: '16px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(238, 50, 39, 0.1) 0%, transparent 60%)', zIndex: 0 }}></div>
      
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        padding: '48px', borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 16px', fontSize: '2rem', fontWeight: 600 }}>Interactive Demo</h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Loading the secure demo environment...</p>
      </div>
    </div>
  );
}
