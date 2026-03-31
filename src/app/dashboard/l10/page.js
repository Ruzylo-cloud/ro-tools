'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const CATEGORIES = [
  {
    name: 'Sales',
    icon: '💰',
    metrics: [
      { key: 'weekly_sales', label: 'Weekly Sales', goal: null, type: 'currency' },
      { key: 'projected_sales', label: 'Projected Sales', goal: null, type: 'currency' },
      { key: 'actual_vs_scheduled', label: 'Actual Vs. Scheduled Hours', goal: '0 or negative', type: 'number', evaluate: v => parseFloat(v) <= 0 },
      { key: 'refund_value', label: 'Refund Value', goal: '$0', type: 'currency', evaluate: v => parseFloat(v) === 0 },
    ],
  },
  {
    name: 'People',
    icon: '👥',
    metrics: [
      { key: 'certified_ro', label: 'Certified RO (Phase 1, 2, 3, S.Safe)', goal: '1', type: 'number', evaluate: v => parseInt(v) >= 1 },
      { key: 'certified_aro', label: 'Certified ARO (Phase 1, Phase 3)', goal: '1', type: 'number', evaluate: v => parseInt(v) >= 1 },
      { key: 'shift_leads', label: 'Shift Leads In Addition to RO & ARO (Phase 1)', goal: '3', type: 'number', evaluate: v => parseInt(v) >= 3 },
      { key: 'shifts_stability', label: 'Shifts +/- from Stability Snapshot Sheet', goal: '10 or above', type: 'number', evaluate: v => parseInt(v) >= 10 },
      { key: 'ro_hours', label: 'RO Hours Clocked In', goal: '35 or more', type: 'number', evaluate: v => parseFloat(v) >= 35 },
      { key: 'ro_on_time', label: 'RO On Time Percentage', goal: '100%', type: 'percent', evaluate: v => parseFloat(v) >= 100 },
      { key: 'stability_updated', label: 'Stability Snapshot Updated', goal: 'Y', type: 'yesno', evaluate: v => v === 'Y' },
      { key: 'timesheet_edits', label: 'Timesheet edits', goal: '3 or less', type: 'number', evaluate: v => parseInt(v) <= 3 },
      { key: 'timesheets_corrected', label: 'All Timesheets edited with correction forms', goal: 'Y', type: 'yesno', evaluate: v => v === 'Y' },
      { key: 'callout_updated', label: 'Call Out Sheet updated', goal: 'Y', type: 'yesno', evaluate: v => v === 'Y' },
      { key: 'corrective_actions', label: 'Corrective Actions signed with DM present and loaded to drive', goal: 'Y or NA', type: 'yesna', evaluate: v => v === 'Y' || v === 'NA' },
    ],
  },
  {
    name: 'Operations',
    icon: '⚙️',
    metrics: [
      { key: 'missed_attestations', label: 'Missed Attestations', goal: '0', type: 'number', evaluate: v => parseInt(v) === 0 },
      { key: 'attestation_forms', label: 'Attestation Correction Forms Completed', goal: 'Y or NA', type: 'yesna', evaluate: v => v === 'Y' || v === 'NA' },
      { key: 'attestation_no', label: '"No" answer to Attestation questions', goal: '0', type: 'number', evaluate: v => parseInt(v) === 0 },
    ],
  },
  {
    name: 'Reporting',
    icon: '📊',
    metrics: [
      { key: 'deep_clean', label: 'Last Deep Clean Evaluation', goal: '90% or above', type: 'percent', evaluate: v => parseFloat(v) >= 90 },
      { key: 'mystery_shopper', label: 'Last Mystery Shopper Score', goal: '90% or above', type: 'percent', evaluate: v => parseFloat(v) >= 90 },
      { key: 'steritech', label: 'Steritech Score', goal: null, type: 'number' },
      { key: 'throughput', label: 'Throughput Goal Reached', goal: 'Y', type: 'yesno', evaluate: v => v === 'Y' },
      { key: 'food_waste', label: 'Total Food Waste Goal Reached on KGB', goal: 'Y', type: 'yesno', evaluate: v => v === 'Y' },
    ],
  },
  {
    name: 'Profitability',
    icon: '📈',
    metrics: [
      { key: 'bph', label: 'BPH', goal: '4.1 or above', type: 'number', evaluate: v => parseFloat(v) >= 4.1 },
      { key: 'labor_pct', label: 'Labor %', goal: 'Tier 3 or under', type: 'percent', evaluate: v => parseFloat(v) <= 20.5 },
      { key: 'avt_variance', label: 'AvT Variance', goal: '-1% to -2%', type: 'percent', evaluate: v => { const n = parseFloat(v); return n >= -2.5 && n <= -1; } },
      { key: 'cogs', label: 'COGS', goal: '22%-25%', type: 'percent', evaluate: v => { const n = parseFloat(v); return n >= 22 && n <= 25; } },
      { key: 'sales_vs_ly', label: 'Sales higher than last year', goal: 'Above 0%', type: 'percent', evaluate: v => parseFloat(v) > 0 },
      { key: 'ebitda', label: 'EBITDA', goal: '10% or above', type: 'percent', evaluate: v => parseFloat(v) >= 10 },
    ],
  },
];

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 604800000;
  return Math.ceil(diff / oneWeek);
}

function getWeekDateRange(weekNum) {
  const year = new Date().getFullYear();
  const jan1 = new Date(year, 0, 1);
  const startDay = jan1.getDay();
  const start = new Date(jan1);
  start.setDate(jan1.getDate() + (weekNum - 1) * 7 - startDay);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = d => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

export default function L10Page() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber());
  const [values, setValues] = useState({});
  const [employees, setEmployees] = useState([
    { name: 'Chris Ruzylo', eval: false, attestation: false },
    { name: 'Adrian Llamas', eval: false, attestation: false },
    { name: 'Kristina Grosso', eval: false, attestation: false },
    { name: 'Angel Broeffle', eval: false, attestation: false },
    { name: 'Madison Levy', eval: false, attestation: false },
    { name: 'Arturo Espinoza', eval: false, attestation: false },
    { name: 'Wyatt Smith', eval: false, attestation: false },
    { name: 'Giovanna Rodriguez', eval: false, attestation: false },
    { name: 'Bri Sykes', eval: false, attestation: false },
    { name: 'Carson Poulton', eval: false, attestation: false },
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [timeFinished, setTimeFinished] = useState('');

  const handleChange = useCallback((key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  }, []);

  const evaluateMetric = (metric, val) => {
    if (!val || val === '' || !metric.evaluate) return null;
    try {
      return metric.evaluate(val) ? 'met' : 'missed';
    } catch {
      return null;
    }
  };

  const calculateGrade = () => {
    let total = 0;
    let met = 0;
    CATEGORIES.forEach(cat => {
      cat.metrics.forEach(m => {
        if (m.evaluate) {
          total++;
          const result = evaluateMetric(m, values[m.key]);
          if (result === 'met') met++;
        }
      });
    });
    return total > 0 ? Math.round((met / total) * 100) : 0;
  };

  const grade = calculateGrade();

  const handleSave = async () => {
    setSaving(true);
    const now = new Date();
    setTimeFinished(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    // Save to localStorage for now (API integration later)
    const data = { week: currentWeek, values, employees, grade, timeFinished: now.toISOString() };
    try {
      await fetch('/api/l10', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Fallback to localStorage if API fails
      localStorage.setItem(`l10-week-${currentWeek}`, JSON.stringify(data));
    }
    setSaved(true);
    setSaving(false);
  };

  // Load saved data for current week
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/l10?week=${currentWeek}`);
        if (res.ok) {
          const data = await res.json();
          setValues(data.values || {});
          if (data.employees?.length) setEmployees(data.employees);
          if (data.timeFinished) {
            const d = new Date(data.timeFinished);
            setTimeFinished(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
          } else {
            setTimeFinished('');
          }
          return;
        }
      } catch {}
      // Fallback to localStorage
      const saved = localStorage.getItem(`l10-week-${currentWeek}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setValues(data.values || {});
          if (data.employees) setEmployees(data.employees);
          if (data.timeFinished) {
            const d = new Date(data.timeFinished);
            setTimeFinished(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
          }
        } catch {}
      } else {
        setValues({});
        setTimeFinished('');
      }
    }
    load();
  }, [currentWeek]);

  const renderInput = (metric) => {
    const val = values[metric.key] || '';
    if (metric.type === 'yesno') {
      return (
        <select value={val} onChange={e => handleChange(metric.key, e.target.value)}>
          <option value="">--</option>
          <option value="Y">Y</option>
          <option value="N">N</option>
        </select>
      );
    }
    if (metric.type === 'yesna') {
      return (
        <select value={val} onChange={e => handleChange(metric.key, e.target.value)}>
          <option value="">--</option>
          <option value="Y">Y</option>
          <option value="N">N</option>
          <option value="NA">N/A</option>
        </select>
      );
    }
    if (metric.type === 'currency') {
      return (
        <input
          type="text"
          value={val}
          onChange={e => handleChange(metric.key, e.target.value)}
          placeholder="$0.00"
        />
      );
    }
    if (metric.type === 'percent') {
      return (
        <input
          type="text"
          value={val}
          onChange={e => handleChange(metric.key, e.target.value)}
          placeholder="0%"
        />
      );
    }
    return (
      <input
        type="text"
        value={val}
        onChange={e => handleChange(metric.key, e.target.value)}
        placeholder="0"
      />
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>L10 Weekly Scorecard</h1>
          <p className={styles.subtitle}>Fill out every Monday &mdash; reviewed with DM</p>
        </div>
        <div className={styles.weekSelector}>
          <button
            className={styles.weekBtn}
            onClick={() => setCurrentWeek(w => Math.max(1, w - 1))}
          >
            &larr;
          </button>
          <span className={styles.currentWeek}>
            Week {currentWeek} &mdash; {getWeekDateRange(currentWeek)}
          </span>
          <button
            className={styles.weekBtn}
            onClick={() => setCurrentWeek(w => Math.min(52, w + 1))}
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Grade bar */}
      <div className={styles.gradeBar}>
        <span className={styles.gradeLabel}>Grade</span>
        <div className={styles.gradeProgress}>
          <div
            className={styles.gradeProgressFill}
            style={{ width: `${grade}%`, background: grade >= 80 ? '#16a34a' : grade >= 60 ? '#ca8a04' : '#EE3227' }}
          />
        </div>
        <span className={styles.gradeValue} style={{ color: grade >= 80 ? '#16a34a' : grade >= 60 ? '#ca8a04' : '#EE3227' }}>
          {grade}%
        </span>
        {timeFinished && (
          <span className={styles.gradeTime}>Finished: {timeFinished}</span>
        )}
      </div>

      {/* Categories */}
      {CATEGORIES.map(cat => (
        <div key={cat.name} className={styles.category}>
          <div className={styles.categoryHeader}>
            <span className={styles.categoryIcon}>{cat.icon}</span>
            {cat.name}
          </div>
          {cat.metrics.map(metric => {
            const status = evaluateMetric(metric, values[metric.key]);
            return (
              <div
                key={metric.key}
                className={`${styles.metricRow} ${status === 'met' ? styles.met : status === 'missed' ? styles.missed : ''}`}
              >
                <span className={styles.metricName}>{metric.label}</span>
                <span className={styles.metricGoal}>{metric.goal || '—'}</span>
                <div className={styles.metricInput}>
                  {renderInput(metric)}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Employee Section */}
      <div className={styles.employeeSection}>
        <h2 className={styles.employeeHeader}>Employee Evaluations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: '0', marginBottom: '8px', padding: '0 16px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>EMPLOYEE</span>
          <span className={styles.checkLabel}>EVAL</span>
          <span className={styles.checkLabel}>ATTEST</span>
        </div>
        {employees.map((emp, i) => (
          <div key={emp.name} className={styles.employeeRow}>
            <span className={styles.employeeName}>{emp.name}</span>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={emp.eval}
              onChange={e => {
                const updated = [...employees];
                updated[i] = { ...emp, eval: e.target.checked };
                setEmployees(updated);
                setSaved(false);
              }}
            />
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={emp.attestation}
              onChange={e => {
                const updated = [...employees];
                updated[i] = { ...emp, attestation: e.target.checked };
                setEmployees(updated);
                setSaved(false);
              }}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Submit Week ' + currentWeek}
        </button>
        <button className={styles.secondaryBtn} onClick={() => setCurrentWeek(getWeekNumber())}>
          Current Week
        </button>
      </div>
    </div>
  );
}
