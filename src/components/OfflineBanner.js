// RT-263: Offline mode banner
'use client';
import { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div style={{
      background: '#fef3c7',
      borderBottom: '1px solid #f59e0b',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      fontWeight: 600,
      color: '#92400e',
      zIndex: 9000,
    }}>
      <span>⚠️</span>
      <span>You&apos;re offline. Some features may not be available. Your work will sync when you reconnect.</span>
    </div>
  );
}
