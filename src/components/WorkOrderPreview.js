'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const PRIORITY_COLORS = { urgent: '#DC2626', high: '#EA580C', medium: '#D97706', low: '#16A34A' };

const WorkOrderPreview = forwardRef(function WorkOrderPreview({ data }, ref) {
  const {
    title = '', description = '', category = '', priority = 'medium',
    reportedBy = '', assignedTo = '', assignedType = 'internal',
    equipment = '', location = '', estimatedCost = '', dueDate = '',
    storeNumber = '', storeName = '', managerName = '', userEmail = '',
    date = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  const sectionHdr = (text) => (
    <div style={{
      background: '#134A7C', color: '#fff', fontSize: '7pt', fontWeight: 700,
      padding: '2px 8px', borderRadius: '2px', marginBottom: '3px', marginTop: '6px',
      letterSpacing: '0.5px',
    }}>
      {text}
    </div>
  );

  const fieldRow = (label, value, width) => (
    <div style={{ flex: width || 1 }}>
      <span style={{ fontSize: '6pt', color: '#6b7280', fontWeight: 500 }}>{label}</span>
      <div style={{
        borderBottom: '1px solid #134A7C', padding: '0', fontSize: '7.5pt',
        fontWeight: 600, color: '#2D2D2D', minHeight: '12px',
      }}>
        {value || ''}
      </div>
    </div>
  );

  const textBox = (content, placeholder, minH) => (
    <div style={{
      border: '1px solid #ccc', borderRadius: '2px', padding: '3px 6px',
      fontSize: '6.5pt', color: content ? '#2D2D2D' : '#999', minHeight: minH || '28px',
      lineHeight: 1.4, whiteSpace: 'pre-wrap',
    }}>
      {content || placeholder || ''}
    </div>
  );

  const priorityColor = PRIORITY_COLORS[priority] || '#D97706';
  const categoryLabel = {
    equipment: 'Equipment', plumbing: 'Plumbing', electrical: 'Electrical',
    hvac: 'HVAC', cleaning: 'Cleaning', structural: 'Structural', general: 'General',
  }[category] || '';

  return (
    <div
      ref={ref}
      style={{
        width: '612px', minHeight: '792px', background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex', flexDirection: 'column', margin: '0 auto',
      }}
    >
      <div style={{ height: '5px', background: '#EE3227' }} />
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JMVG" style={{ height: '90px', width: '90px', objectFit: 'contain' }} crossOrigin="anonymous" />
      </div>
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 4px' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>JM VALLEY GROUP</div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          JERSEY MIKE&apos;S SUBS &mdash; FRANCHISE OPERATIONS
        </div>
      </div>
      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      <div style={{ padding: '0 28px' }}>
        <div style={{
          textAlign: 'center', fontSize: '11pt', fontWeight: 800, color: '#134A7C',
          letterSpacing: '1px', padding: '4px 0 2px',
        }}>
          WORK ORDER
        </div>

        {/* Priority + Category badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          {priority && (
            <span style={{
              background: priorityColor, color: '#fff', fontSize: '6.5pt', fontWeight: 700,
              padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase',
            }}>
              {priority}
            </span>
          )}
          {categoryLabel && (
            <span style={{
              background: '#134A7C', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
              padding: '2px 8px', borderRadius: '3px',
            }}>
              {categoryLabel}
            </span>
          )}
        </div>

        {/* Store + Date info */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Store #', storeNumber, 0.3)}
          {fieldRow('Store Name', storeName, 0.7)}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Date Submitted', formatDate(date || new Date().toISOString().split('T')[0]))}
          {fieldRow('Due Date', formatDate(dueDate), 0.5)}
        </div>

        {/* Title + Description */}
        {sectionHdr('WORK ORDER DETAILS')}
        <div style={{ marginBottom: '3px' }}>
          {fieldRow('Title', title)}
        </div>
        {textBox(description, 'Description of the issue or work needed...', '50px')}

        {/* Equipment / Location */}
        {sectionHdr('EQUIPMENT / LOCATION')}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Equipment / Asset', equipment)}
          {fieldRow('Location', location, 0.5)}
        </div>

        {/* Assignment */}
        {sectionHdr('ASSIGNMENT')}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Reported By', reportedBy)}
          {fieldRow('Assigned To', assignedTo)}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Type', assignedType === 'vendor' ? 'Vendor / External' : 'Internal Staff')}
          {fieldRow('Estimated Cost', estimatedCost ? `$${estimatedCost}` : '', 0.5)}
        </div>

        {/* Resolution section (blank for fill-in) */}
        {sectionHdr('RESOLUTION (TO BE COMPLETED)')}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Resolved By', '')}
          {fieldRow('Date Resolved', '', 0.5)}
        </div>
        {textBox('', 'Resolution notes...', '40px')}
        <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
          {fieldRow('Actual Cost', '', 0.5)}
          <div style={{ flex: 1 }} />
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Reported By Signature</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: '14px' }}>
              <ManagerSignature name={managerName} email={userEmail} compact />
            </div>
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Manager Approval</div>
          </div>
          <div style={{ width: '80px' }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '5.5pt', padding: '4px 28px', fontWeight: 400, lineHeight: 1.3,
      }}>
        Property of JM Valley Group. All rights reserved. Confidential &mdash; not for distribution.
      </div>
    </div>
  );
});

export default WorkOrderPreview;
