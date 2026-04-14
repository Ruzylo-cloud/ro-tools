// RT-061: Auto-save draft state for generators
// Usage: const [form, setForm, clearDraft] = useFormDraft('written-warning', initialState)
import { useState, useEffect, useCallback } from 'react';

export function useFormDraft(key, initialState) {
  const storageKey = `ro-tools-draft-${key}`;

  const [form, setFormState] = useState(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, ts } = JSON.parse(saved);
        // Expire drafts after 7 days
        if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) {
          setFormState({ ...initialState, ...data });
        }
      }
    } catch (e) { console.debug('[formDraft] draft load failed (non-fatal):', e); }
    setLoaded(true);
  }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const setForm = useCallback((updater) => {
    setFormState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(storageKey, JSON.stringify({ data: next, ts: Date.now() }));
      } catch (e) { console.debug('[formDraft] draft save failed (non-fatal):', e); }
      return next;
    });
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch (e) { console.debug('[formDraft] draft clear failed (non-fatal):', e); }
    setFormState(initialState);
  }, [storageKey, initialState]); // eslint-disable-line react-hooks/exhaustive-deps

  return [form, setForm, clearDraft, loaded];
}
