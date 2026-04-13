'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * EmployeeSelect — searchable dropdown for employee fields in generators.
 * Fetches from /api/employees, groups by store, supports type-ahead search.
 * Falls back to free text input if no employees loaded.
 *
 * Props:
 *   value: string — current employee name
 *   onChange: (name, employee) => void — called with name string and full employee object
 *   onPositionFill: (position) => void — auto-fill position field
 *   storeNumber: string — optional store filter
 *   placeholder: string
 *   label: string
 *   style: object
 */
export default function EmployeeSelect({ value, onChange, onPositionFill, storeNumber, placeholder, label, style, hasError }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const url = storeNumber ? `/api/employees?store=${storeNumber}` : '/api/employees';
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch((e) => { console.error('[EmployeeSelect] employee load failed:', e); setLoading(false); });
  }, [storeNumber]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Sync external value changes
  useEffect(() => { setSearch(value || ''); }, [value]);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes((search || '').toLowerCase())
  );

  // Group by store
  const grouped = {};
  filtered.forEach(e => {
    const key = e.store_number ? `#${e.store_number}${e.store_name ? ` — ${e.store_name}` : ''}` : 'Unassigned';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  const flatFiltered = Object.values(grouped).flat();

  const selectEmployee = (emp) => {
    setSearch(emp.name);
    setOpen(false);
    setHighlightIdx(-1);
    if (onChange) onChange(emp.name, emp);
    if (onPositionFill && emp.position) onPositionFill(emp.position);
  };

  const handleInputChange = (val) => {
    setSearch(val);
    setOpen(true);
    setHighlightIdx(-1);
    if (onChange) onChange(val, null);
  };

  const handleKeyDown = (e) => {
    if (!open || flatFiltered.length === 0) {
      if (e.key === 'ArrowDown') { setOpen(true); setHighlightIdx(0); e.preventDefault(); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(i => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      selectEmployee(flatFiltered[highlightIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlightIdx(-1);
    }
  };

  const errorStyle = hasError ? { borderColor: 'var(--jm-red, #EE3227)' } : {};

  // RT-246: unified input style so loading / empty / populated all render the
  // same full-width box. Previously the loading + empty branches rendered a
  // bare input with zero styling, causing a tiny browser-default box.
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--gray-200, #e5e7eb)',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: 'var(--white, #fff)',
    color: 'var(--charcoal, #1a1a2e)',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    ...errorStyle,
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', ...style }}>
      <input
        type="text"
        value={search}
        onChange={e => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || (loading ? 'Loading employees...' : 'Search employees...')}
        maxLength={100}
        autoComplete="off"
        style={inputStyle}
      />
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          maxHeight: '280px',
          overflowY: 'auto',
          background: 'var(--white, #fff)',
          border: '1px solid var(--gray-200, #e5e7eb)',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          zIndex: 100,
          padding: '6px',
        }}>
          {Object.keys(grouped).length === 0 ? (
            <div style={{ padding: '12px', color: 'var(--gray-400, #9ca3af)', fontSize: '13px', textAlign: 'center' }}>
              No employees match &ldquo;{search}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([store, emps]) => (
              <div key={store}>
                {Object.keys(grouped).length > 1 && (
                  <div style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--jm-blue, #134A7C)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {store}
                  </div>
                )}
                {emps.map(emp => {
                  const flatIdx = flatFiltered.indexOf(emp);
                  const isHighlighted = flatIdx === highlightIdx;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => selectEmployee(emp)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                        fontSize: '13px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: isHighlighted ? 'rgba(19,74,124,0.1)' : 'transparent',
                      }}
                      onMouseEnter={() => setHighlightIdx(flatIdx)}
                      onMouseLeave={() => setHighlightIdx(-1)}
                    >
                      <span style={{ fontWeight: 500, color: 'var(--charcoal, #1a1a2e)' }}>{emp.name}</span>
                      {emp.position && (
                        <span style={{ fontSize: '11px', color: 'var(--gray-400, #9ca3af)' }}>{emp.position}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
