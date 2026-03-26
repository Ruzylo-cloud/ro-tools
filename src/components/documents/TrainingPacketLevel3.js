'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel3 = forwardRef(function TrainingPacketLevel3({ data }, ref) {
  const { employeeName = '', storeNumber = '', storeName = '' } = data || {};

  return (
    <DocumentTemplate
      ref={ref}
      title="LEVEL 3 TRAINING PACKET"
      subtitle="Hot Side / Grill Certification"
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

      {/* Hot Side Skills */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        HOT SIDE BENCHMARKS
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Can operate the grill/flat top safely',
          'Knows all hot sub builds (Chipotle Cheesesteak, Big Kahuna, etc.)',
          'Proper cheesesteak technique - chop and season correctly',
          'Knows cook times for all proteins',
          'Can manage grill during a rush (multiple orders simultaneously)',
          'Proper grease trap and grill cleaning procedures',
          'Knows all sauce portions and applications',
          'Can prepare bacon, meatballs, and other hot items',
          'Temperature checks - knows required internal temps',
          'Proper hot holding procedures and times',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '24px' }}>&#9744;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Prep Knowledge */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '10px 0 6px', letterSpacing: '0.5px',
      }}>
        PREP &amp; CLOSING KNOWLEDGE
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Can complete prep list accurately and efficiently',
          'Knows all veggie prep specs (lettuce, tomatoes, onions, peppers)',
          'Can make tuna, oil blend, and other in-house recipes',
          'Closing checklist - all stations cleaned and restocked',
          'Walk-in cooler organization and FIFO rotation',
          'Knows waste log procedures',
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

export default TrainingPacketLevel3;
