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
export default function EmployeeSelect({ value, onChange, onPositionFill, storeNumber, placeholder, label, style }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    const url = storeNumber ? `/api/employees?store=${storeNumber}` : '/api/employees';
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  const selectEmployee = (emp) => {
    setSearch(emp.name);
    setOpen(false);
    if (onChange) onChange(emp.name, emp);
    if (onPositionFill && emp.position) onPositionFill(emp.position);
  };

  const handleInputChange = (val) => {
    setSearch(val);
    setOpen(true);
    if (onChange) onChange(val, null);
  };

  // If no employees loaded, just show a text input
  if (loading) {
    return (
      <input
        type="text"
        value={search}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder || 'Loading employees...'}
        style={style}
      />
    );
  }

  if (employees.length === 0) {
    return (
      <input
        type="text"
        value={search}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder || 'Employee name'}
        style={style}
      />
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <input
        type="text"
        value={search}
        onChange={e => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || 'Search employees...'}
        autoComplete="off"
        style={{
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
        }}
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
                {emps.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => selectEmployee(emp)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontSize: '13px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(19,74,124,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontWeight: 500, color: 'var(--charcoal, #1a1a2e)' }}>{emp.name}</span>
                    {emp.position && (
                      <span style={{ fontSize: '11px', color: 'var(--gray-400, #9ca3af)' }}>{emp.position}</span>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
