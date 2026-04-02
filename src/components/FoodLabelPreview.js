'use client';

import { forwardRef } from 'react';

const ALLERGEN_COLORS = {
  milk: '#3B82F6', eggs: '#F59E0B', wheat: '#D97706', soy: '#10B981',
  fish: '#6366F1', shellfish: '#EC4899','tree nuts': '#EF4444', peanuts: '#B45309',
};

const FoodLabelPreview = forwardRef(function FoodLabelPreview({ data }, ref) {
  const {
    itemName = '',
    category = '',
    shelfLifeHours = '',
    shelfLifeDays = '',
    allergens = [],
    storageTemp = '',
    preparedBy = '',
    storeNumber = '',
    storeName = '',
    labelSize = '2x2',
    quantity = 1,
  } = data || {};

  const now = new Date();
  const prepStr = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  let expiryDate = new Date(now);
  if (shelfLifeHours && parseInt(shelfLifeHours)) {
    expiryDate = new Date(now.getTime() + parseInt(shelfLifeHours) * 60 * 60 * 1000);
  } else if (shelfLifeDays && parseInt(shelfLifeDays)) {
    expiryDate = new Date(now.getTime() + parseInt(shelfLifeDays) * 24 * 60 * 60 * 1000);
  } else {
    expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  const expStr = expiryDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  const categoryLabel = {
    produce: 'Produce', protein: 'Protein', dairy: 'Dairy',
    prepared: 'Prepared', bread: 'Bread', sauce: 'Sauce/Dressing', other: 'Other',
  }[category] || '';

  const labelW = labelSize === '2x2' ? 192 : labelSize === '2x1' ? 192 : 96;
  const labelH = labelSize === '2x2' ? 192 : labelSize === '2x1' ? 96 : 96;

  const renderLabel = (idx) => (
    <div key={idx} style={{
      width: `${labelW}px`, height: `${labelH}px`, border: '1.5px solid #2D2D2D',
      borderRadius: '4px', padding: '6px 8px', fontFamily: "'DM Sans', Arial, sans-serif",
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      background: '#fff', boxSizing: 'border-box',
    }}>
      <div>
        <div style={{
          fontSize: labelSize === '1x1' ? '8pt' : '11pt', fontWeight: 800, color: '#134A7C',
          lineHeight: 1.2, marginBottom: '2px', overflow: 'hidden',
          maxHeight: labelSize === '1x1' ? '20px' : '30px',
        }}>
          {itemName || 'Item Name'}
        </div>
        {categoryLabel && (
          <div style={{
            fontSize: '6pt', color: '#fff', background: '#134A7C',
            display: 'inline-block', padding: '1px 5px', borderRadius: '2px',
            fontWeight: 600, marginBottom: '3px',
          }}>
            {categoryLabel}
          </div>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <div>
            <div style={{ fontSize: '5.5pt', color: '#6b7280', fontWeight: 500 }}>PREP</div>
            <div style={{ fontSize: labelSize === '1x1' ? '6pt' : '7.5pt', fontWeight: 700, color: '#2D2D2D' }}>{prepStr}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '5.5pt', color: '#EE3227', fontWeight: 700 }}>EXP</div>
            <div style={{ fontSize: labelSize === '1x1' ? '6pt' : '7.5pt', fontWeight: 700, color: '#EE3227' }}>{expStr}</div>
          </div>
        </div>
        {storageTemp && labelSize !== '1x1' && (
          <div style={{ fontSize: '6pt', color: '#6b7280' }}>Storage: {storageTemp}</div>
        )}
        {allergens.length > 0 && (
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginTop: '2px' }}>
            {allergens.map(a => (
              <span key={a} style={{
                fontSize: '5pt', background: ALLERGEN_COLORS[a] || '#6b7280', color: '#fff',
                padding: '0 3px', borderRadius: '1px', fontWeight: 600,
              }}>
                {a.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: '1px solid #e5e7eb', paddingTop: '2px', marginTop: '2px',
      }}>
        <div style={{ fontSize: '5.5pt', color: '#6b7280' }}>By: {preparedBy || '___'}</div>
        <div style={{ fontSize: '5pt', color: '#9ca3af' }}>#{storeNumber || '—'}</div>
      </div>
    </div>
  );

  const qty = Math.min(Math.max(parseInt(quantity) || 1, 1), 12);

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        minHeight: '792px',
        background: '#fff',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <img src="/jmvg-logo.png" alt="JMVG" style={{ height: '60px', width: 'auto' }} crossOrigin="anonymous" />
      </div>
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 4px' }} />
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '10pt', fontWeight: 800, color: '#134A7C', letterSpacing: '1.5px' }}>
          FOOD PREP LABELS
        </div>
        <div style={{ fontSize: '6pt', color: '#6b7280' }}>
          {storeName ? `${storeName} #${storeNumber}` : 'JM Valley Group'} &mdash; {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* RT-101: Label Grid with print sheet layout (cut lines) */}
      <div style={{
        padding: '0 28px 8px', flex: 1,
        display: 'flex', flexWrap: 'wrap', gap: '0',
        alignContent: 'flex-start', justifyContent: 'center',
      }}>
        {Array.from({ length: qty }, (_, i) => (
          <div key={i} style={{
            padding: '6px',
            borderRight: '1px dashed #d1d5db',
            borderBottom: '1px dashed #d1d5db',
            borderLeft: i % 3 === 0 ? '1px dashed #d1d5db' : 'none',
            borderTop: i < 3 ? '1px dashed #d1d5db' : 'none',
            boxSizing: 'border-box',
          }}>
            {renderLabel(i)}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '5.5pt', padding: '4px 28px', fontWeight: 400, lineHeight: 1.3,
      }}>
        Food safety labels &mdash; JM Valley Group. Discard items past expiry date.
      </div>
    </div>
  );
});

export default FoodLabelPreview;
