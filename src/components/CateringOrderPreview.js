'use client';

import { forwardRef } from 'react';

const MENU_ITEMS = [
  { num: '#1', name: 'BLT' },
  { num: '#2', name: "Jersey Shore's Favorite" },
  { num: '#3', name: 'Ham & Provolone' },
  { num: '#4', name: 'The Number Four' },
  { num: '#5', name: 'The Super Sub' },
  { num: '#6', name: 'Roast Beef & Provolone' },
  { num: '#7', name: 'Turkey & Provolone' },
  { num: '#8', name: 'Club Sub' },
  { num: '#9', name: 'Club Supreme' },
  { num: '#10', name: 'Tuna Fish' },
  { num: '#11', name: 'Stickball Special' },
  { num: '#12', name: 'Cancro Special' },
  { num: '#13', name: 'The Original Italian' },
  { num: '#14', name: 'The Veggie' },
  { num: '', name: 'California Club' },
  { num: '', name: 'Turkey Club' },
];

export { MENU_ITEMS };

const CateringOrderPreview = forwardRef(function CateringOrderPreview({ data }, ref) {
  const {
    customerName = '',
    customerPhone = '',
    customerEmail = '',
    companyName = '',
    deliveryAddress = '',
    deliveryDate = '',
    deliveryTime = '',
    storeName = '',
    storePhone = '',
    storeAddress = '',
    operatorName = '',
    operatorPhone = '',
    orderItems = [],
    numberOfBoxes = 0,
    totalPrice = 0,
    includeChips = false,
    includeDrinks = false,
    specialRequests = '',
  } = data || {};

  const totalSubs = orderItems.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        height: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
        <img
          src="/jmvg-logo.png"
          alt="JM Valley Group"
          style={{ width: '180px', height: 'auto' }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Tagline */}
      <div style={{
        textAlign: 'center', color: '#EE3227', fontSize: '8.5pt', fontWeight: 500,
        padding: '0 0 6px', letterSpacing: '2px',
      }}>
        FRESH &middot; LOCAL &middot; DELIVERED
      </div>

      {/* Title Banner */}
      <div style={{
        background: '#134A7C', color: '#fff', textAlign: 'center',
        fontSize: '16pt', fontWeight: 700, padding: '7px 0',
        margin: '0 20px', borderRadius: '6px', letterSpacing: '2px',
      }}>
        CATERING ORDER FORM
      </div>

      {/* Red Divider */}
      <div style={{ height: '2.5px', background: '#EE3227', margin: '6px 20px' }} />

      {/* Customer + Delivery Info */}
      <div style={{ display: 'flex', gap: '12px', padding: '4px 24px 0', fontSize: '7.5pt' }}>
        {/* Customer Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
            padding: '3px 8px', borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
          }}>
            CUSTOMER INFORMATION
          </div>
          <div style={{ border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '5px 8px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Name:</span>
              <span style={{ color: '#444' }}>{customerName || '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Phone:</span>
              <span style={{ color: '#444' }}>{customerPhone || '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Email:</span>
              <span style={{ color: '#444' }}>{customerEmail || '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Company:</span>
              <span style={{ color: '#444' }}>{companyName || '—'}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
            padding: '3px 8px', borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
          }}>
            DELIVERY DETAILS
          </div>
          <div style={{ border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '5px 8px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Address:</span>
              <span style={{ color: '#444' }}>{deliveryAddress || '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Date:</span>
              <span style={{ color: '#444' }}>{formatDate(deliveryDate) || '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '48px' }}>Time:</span>
              <span style={{ color: '#444' }}>{formatTime(deliveryTime) || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Table */}
      <div style={{ padding: '6px 24px 0' }}>
        <div style={{
          background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
          padding: '3px 8px', borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
        }}>
          ORDER ITEMS
        </div>
        <table style={{
          width: '100%', borderCollapse: 'collapse', fontSize: '7pt',
          border: '1px solid #ccc', borderTop: 'none',
        }}>
          <thead>
            <tr style={{ background: '#f0f4f8' }}>
              <th style={{ padding: '3px 6px', textAlign: 'left', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '42%' }}>Item</th>
              <th style={{ padding: '3px 6px', textAlign: 'center', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '10%' }}>Qty</th>
              <th style={{ padding: '3px 6px', textAlign: 'center', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '15%' }}>Mike&apos;s Way</th>
              <th style={{ padding: '3px 6px', textAlign: 'left', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '33%' }}>Special Instructions</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? orderItems.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '2.5px 6px', color: '#2D2D2D' }}>{item.subName || '—'}</td>
                <td style={{ padding: '2.5px 6px', textAlign: 'center', color: '#2D2D2D' }}>{item.quantity || '—'}</td>
                <td style={{ padding: '2.5px 6px', textAlign: 'center', color: '#2D2D2D' }}>{item.mikesWay ? 'Yes' : 'No'}</td>
                <td style={{ padding: '2.5px 6px', color: '#666' }}>{item.specialInstructions || '—'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ padding: '6px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>No items added yet</td>
              </tr>
            )}
            {/* Empty rows to fill space if few items */}
            {orderItems.length > 0 && orderItems.length < 8 && Array.from({ length: Math.min(8 - orderItems.length, 4) }).map((_, i) => (
              <tr key={`empty-${i}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '2.5px 6px' }}>&nbsp;</td>
                <td style={{ padding: '2.5px 6px' }}></td>
                <td style={{ padding: '2.5px 6px' }}></td>
                <td style={{ padding: '2.5px 6px' }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subtotal Row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '5px 24px 0', fontSize: '8.5pt',
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: '#2D2D2D' }}>
            <span style={{ fontWeight: 700 }}>Total Subs:</span> {totalSubs}
          </span>
          <span style={{ color: '#2D2D2D' }}>
            <span style={{ fontWeight: 700 }}>Boxes:</span> {numberOfBoxes}
          </span>
        </div>
        <div style={{ fontWeight: 700, color: '#EE3227', fontSize: '10pt' }}>
          Total: ${totalPrice.toFixed(2)}
        </div>
      </div>

      {/* Extras */}
      <div style={{
        display: 'flex', gap: '16px', padding: '4px 24px 0', fontSize: '7.5pt',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '10px', height: '10px', border: '1.5px solid #134A7C', borderRadius: '2px',
            background: includeChips ? '#134A7C' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {includeChips && <span style={{ color: '#fff', fontSize: '7pt', lineHeight: 1 }}>&#10003;</span>}
          </div>
          <span style={{ fontWeight: 600, color: '#2D2D2D' }}>Include Chips</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '10px', height: '10px', border: '1.5px solid #134A7C', borderRadius: '2px',
            background: includeDrinks ? '#134A7C' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {includeDrinks && <span style={{ color: '#fff', fontSize: '7pt', lineHeight: 1 }}>&#10003;</span>}
          </div>
          <span style={{ fontWeight: 600, color: '#2D2D2D' }}>Include Drinks</span>
        </div>
      </div>

      {/* Special Requests */}
      <div style={{ padding: '5px 24px 0' }}>
        <div style={{
          background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
          padding: '3px 8px', borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
        }}>
          SPECIAL REQUESTS
        </div>
        <div style={{
          border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 4px 4px',
          padding: '5px 8px', minHeight: '28px', fontSize: '7.5pt', color: '#444',
        }}>
          {specialRequests || 'None'}
        </div>
      </div>

      {/* Store Info */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 24px 0',
        fontSize: '7.5pt', color: '#2D2D2D',
      }}>
        <div>
          <span style={{ fontWeight: 700 }}>Store:</span> {storeName || '—'}
          {storePhone ? ` | ${storePhone}` : ''}
        </div>
        <div>
          <span style={{ fontWeight: 700 }}>Operator:</span> {operatorName || '—'}
          {operatorPhone ? ` | ${operatorPhone}` : ''}
        </div>
      </div>

      {/* Blue Border Line */}
      <div style={{ height: '2px', background: '#134A7C', margin: '6px 20px 0' }} />

      {/* Footer Bar */}
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '7pt', padding: '5px 20px', position: 'absolute',
        bottom: 0, left: 0, right: 0,
      }}>
        {storeAddress || storeName || 'Jersey Mike\'s Subs'} &middot; ORDER ONLINE AT JERSEYMIKES.COM &middot; CATERING AVAILABLE 7 DAYS A WEEK
      </div>
    </div>
  );
});

export default CateringOrderPreview;
