// RT-061: Auto-save draft state for generators
// Usage: const [form, setForm, clearDraft] = useFormDraft('written-warning', initialState)
import { useState, useEffect, useCallback } from 'react';

export function useFormDraft(key, initialState) {
  const storageKey = `ro-tools-draft-${key}`;

  const [form, setFormState] = useState(() => {
    if (typeof window === 'undefined') return initialState;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, ts } = JSON.parse(saved);
        // Expire drafts after 7 days
        if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) {
          return { ...initialState, ...data };
        }
      }
    } catch {}
    return initialState;
  });

  const setForm = useCallback((updater) => {
    setFormState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(storageKey, JSON.stringify({ data: next, ts: Date.now() }));
      } catch {}
      return next;
    });
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch {}
  }, [storageKey]);

  return [form, setForm, clearDraft];
}
