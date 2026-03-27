'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to demo auth endpoint
    window.location.href = '/api/auth/demo';
  }, []);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', fontFamily: "'DM Sans', sans-serif",
      color: '#6b7280', fontSize: '16px',
    }}>
      Loading demo...
    </div>
  );
}
