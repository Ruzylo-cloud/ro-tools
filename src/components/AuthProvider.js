'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // RT-182: Auto-cleanup expired form drafts and stale localStorage keys
    try {
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('ro-tools-draft-')) {
          try {
            const val = JSON.parse(localStorage.getItem(key));
            if (val && val.ts && now - val.ts > maxAge) {
              localStorage.removeItem(key);
            }
          } catch (e) { localStorage.removeItem(key); }
        }
      }
    } catch (e) { console.debug('[auth] draft cleanup failed (non-fatal):', e); }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Auth check failed');
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setUser(data.user || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const login = (remember = false) => {
    window.location.href = `/api/auth/login${remember ? '?remember=1' : ''}`;
  };

  const logout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
