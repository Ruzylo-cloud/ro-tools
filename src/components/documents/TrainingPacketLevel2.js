'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel2 = forwardRef(function TrainingPacketLevel2({ data }, ref) {
  const { employeeName = '', storeNumber = '', storeName = '' } = data || {};

  return (
    <DocumentTemplate
      ref={ref}
      title="LEVEL 2 TRAINING PACKET"
      subtitle="Cold Side Certification"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '8pt', color: '#6b7280', fontWeight: 500 }}>Employee: </span>
        <span style={{
          fontSize: '10pt', fontWeight: 600, color: '#2D2D2D',
          borderBottom: '1px solid #134A7C', padding: '0 4px',
        }}>
          {employeeName || '___________________'}
        </span>
      </div>

      {/* Cold Side Skills */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        COLD SIDE BENCHMARKS
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Can identify all cold side meats and cheeses by sight',
          'Knows all sub builds #1 through #14 plus specialty subs',
          'Can slice meat/cheese to proper thickness and portions',
          'Understands Mike\'s Way (onions, lettuce, tomatoes, vinegar, oil, oregano, salt)',
          'Can build a sub from start to finish in under 60 seconds',
          'Proper glove usage and hand washing procedures',
          'Knows all bread types and sizes',
          'Can operate the slicer safely and clean properly',
          'Wrap/bag procedures - proper wrapping technique',
          'Can handle a 3-sub order without assistance',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '24px' }}>&#9744;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Customer Service */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '10px 0 6px', letterSpacing: '0.5px',
      }}>
        CUSTOMER SERVICE STANDARDS
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Greet every customer within 3 seconds of approach',
          'Make eye contact and smile - "Welcome to Jersey Mike\'s!"',
          'Repeat order back to customer before making',
          'Suggestive selling: drinks, chips, cookies',
          'Thank the customer by name if possible',
          'Handle complaints with patience - get a manager if needed',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '24px' }}>&#9744;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Sign Off */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '10px 0 6px', letterSpacing: '0.5px',
      }}>
        CERTIFICATION SIGN-OFF
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '24px' }} />
          <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '2px' }}>Employee Signature</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '24px' }} />
          <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '2px' }}>Trainer Signature</div>
        </div>
        <div style={{ width: '120px' }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '24px' }} />
          <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '2px' }}>Date</div>
        </div>
      </div>
    </DocumentTemplate>
  );
});

export default TrainingPacketLevel2;
