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

const SUBS_PER_BOX = 12;

const CateringOrderPreview = forwardRef(function CateringOrderPreview({ data }, ref) {
  const {
    customerName = '',
    customerPhone = '',
    customerEmail = '',
    companyName = '',
    nextDeliveryDate = '',
    deliveryAddress = '',
    deliveryDate = '',
    deliveryTime = '',
    storeName = '',
    storePhone = '',
    storeAddress = '',
    operatorName = '',
    operatorPhone = '',
    boxes = [],
    numberOfBoxes = 0,
    totalSubs = 0,
    boxTotal = 0,
    chipsTotal = 0,
    drinksTotal = 0,
    cookieTotal = 0,
    brownieTotal = 0,
    subtotal = 0,
    discountAmount = 0,
    totalPrice = 0,
    includeChips = false,
    includeDrinks = false,
    cookiePlatter = 0,
    browniePlatter = 0,
    discount = 0,
    specialRequests = '',
  } = data || {};

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

  const sectionHeader = (text) => ({
    background: '#134A7C', color: '#fff', fontSize: '7.5pt', fontWeight: 700,
    padding: '2.5px 8px', borderRadius: '3px 3px 0 0', letterSpacing: '0.5px',
  });

  const infoRow = (label, value) => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5px' }}>
      <span style={{ fontWeight: 700, color: '#2D2D2D', minWidth: '52px', fontSize: '6.5pt' }}>{label}:</span>
      <span style={{ color: '#444', fontSize: '6.5pt' }}>{value || '\u2014'}</span>
    </div>
  );

  const checkBox = (checked, label) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      <div style={{
        width: '8px', height: '8px', border: '1.5px solid #134A7C', borderRadius: '2px',
        background: checked ? '#134A7C' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: '6pt', lineHeight: 1 }}>&#10003;</span>}
      </div>
      <span style={{ fontWeight: 600, color: '#2D2D2D', fontSize: '6.5pt' }}>{label}</span>
    </div>
  );

  // Build flat row list from boxes
  const orderRows = [];
  boxes.forEach((box, bi) => {
    box.subs.forEach((sub, si) => {
      orderRows.push({
        boxNum: bi + 1,
        subName: sub.subName || '\u2014',
        bread: sub.bread || 'White',
        quantity: sub.quantity || 0,
        mikesWay: sub.mikesWay,
        specialInstructions: sub.specialInstructions || '',
        isFirstInBox: si === 0,
        subsInBox: box.subs.length,
      });
    });
  });

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        minHeight: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '90px', width: 'auto' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 4px' }} />

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>
          JM VALLEY GROUP
        </div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          JERSEY MIKE&apos;S SUBS &mdash; FRANCHISE OPERATIONS
        </div>
      </div>

      {/* Red Divider */}
      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: '14pt', fontWeight: 700, color: '#134A7C',
        padding: '4px 0 4px', letterSpacing: '1px',
      }}>
        CATERING ORDER FORM
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 6px' }} />

      {/* Customer + Delivery Info — side by side */}
      <div style={{ display: 'flex', gap: '8px', padding: '2px 28px 0', fontSize: '6.5pt' }}>
        {/* Customer */}
        <div style={{ flex: 1 }}>
          <div style={sectionHeader()}>CUSTOMER INFORMATION</div>
          <div style={{ border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 3px 3px', padding: '4px 6px' }}>
            {infoRow('Name', customerName)}
            {infoRow('Phone', customerPhone)}
            {infoRow('Email', customerEmail)}
            {infoRow('Company', companyName)}
            {nextDeliveryDate && infoRow('Next Order', formatDate(nextDeliveryDate))}
          </div>
        </div>
        {/* Delivery */}
        <div style={{ flex: 1 }}>
          <div style={sectionHeader()}>DELIVERY DETAILS</div>
          <div style={{ border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 3px 3px', padding: '4px 6px' }}>
            {infoRow('Address', deliveryAddress)}
            {infoRow('Date', formatDate(deliveryDate))}
            {infoRow('Time', formatTime(deliveryTime))}
          </div>
        </div>
      </div>

      {/* Order Table */}
      <div style={{ padding: '4px 28px 0' }}>
        <div style={sectionHeader()}>ORDER DETAILS</div>
        <table style={{
          width: '100%', borderCollapse: 'collapse', fontSize: '6.5pt',
          border: '1px solid #ccc', borderTop: 'none',
        }}>
          <thead>
            <tr style={{ background: '#f0f4f8' }}>
              <th style={{ padding: '2px 4px', textAlign: 'left', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '10%' }}>Box</th>
              <th style={{ padding: '2px 4px', textAlign: 'left', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '28%' }}>Sub</th>
              <th style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '12%' }}>Bread</th>
              <th style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '7%' }}>Qty</th>
              <th style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '10%' }}>Mike&apos;s Way</th>
              <th style={{ padding: '2px 4px', textAlign: 'left', fontWeight: 700, color: '#2D2D2D', borderBottom: '1px solid #ccc', width: '33%' }}>Special Instructions</th>
            </tr>
          </thead>
          <tbody>
            {orderRows.length > 0 ? orderRows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '2px 4px', color: '#134A7C', fontWeight: row.isFirstInBox ? 700 : 400 }}>
                  {row.isFirstInBox ? `Box ${row.boxNum}` : ''}
                </td>
                <td style={{ padding: '2px 4px', color: '#2D2D2D' }}>{row.subName}</td>
                <td style={{ padding: '2px 4px', textAlign: 'center', color: '#2D2D2D' }}>{row.bread}</td>
                <td style={{ padding: '2px 4px', textAlign: 'center', color: '#2D2D2D' }}>{row.quantity}</td>
                <td style={{ padding: '2px 4px', textAlign: 'center', color: '#2D2D2D' }}>{row.mikesWay ? 'Yes' : 'No'}</td>
                <td style={{ padding: '2px 4px', color: '#666' }}>{row.specialInstructions || '\u2014'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '5px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>No boxes added yet</td>
              </tr>
            )}
            {/* Fill empty rows */}
            {orderRows.length > 0 && orderRows.length < 6 && Array.from({ length: 6 - orderRows.length }).map((_, i) => (
              <tr key={`e-${i}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '2px 4px' }}>&nbsp;</td>
                <td style={{ padding: '2px 4px' }}></td>
                <td style={{ padding: '2px 4px' }}></td>
                <td style={{ padding: '2px 4px' }}></td>
                <td style={{ padding: '2px 4px' }}></td>
                <td style={{ padding: '2px 4px' }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extras Row */}
      <div style={{
        display: 'flex', gap: '10px', padding: '4px 28px 0', fontSize: '6.5pt', flexWrap: 'wrap', alignItems: 'center',
      }}>
        {checkBox(includeChips, `Chips (${totalSubs} × $2.55)`)}
        {checkBox(includeDrinks, `Bottled Drinks (${totalSubs} × $3.45)`)}
        {checkBox(cookiePlatter > 0, `Cookie Platter (${cookiePlatter} × $17.99)`)}
        {checkBox(browniePlatter > 0, `Brownie Platter (${browniePlatter} × $19.99)`)}
      </div>

      {/* Pricing Section — full width */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px 28px 0' }}>
        {/* Discount badge (left) */}
        <div style={{
          width: '80px', flexShrink: 0,
          border: '1.5px solid #134A7C', borderRadius: '4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '4px',
        }}>
          <div style={{ fontSize: '6pt', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discount</div>
          <div style={{ fontSize: '16pt', fontWeight: 800, color: discount > 0 ? '#134A7C' : '#ccc', lineHeight: 1.1 }}>
            {discount > 0 ? `${discount}%` : '\u2014'}
          </div>
          {discount > 0 && (
            <div style={{ fontSize: '6pt', color: '#16a34a', fontWeight: 700 }}>
              Save ${discountAmount.toFixed(2)}
            </div>
          )}
        </div>

        {/* Pricing breakdown (right) */}
        <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '6.5pt' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
            <span style={{ color: '#2D2D2D' }}>{numberOfBoxes} Box{numberOfBoxes !== 1 ? 'es' : ''} ({SUBS_PER_BOX} subs ea × $89.95)</span>
            <span style={{ fontWeight: 700, color: '#2D2D2D' }}>${boxTotal.toFixed(2)}</span>
          </div>
          {includeChips && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
              <span style={{ color: '#2D2D2D' }}>Chips ({totalSubs} × $2.55)</span>
              <span style={{ fontWeight: 600, color: '#2D2D2D' }}>${chipsTotal.toFixed(2)}</span>
            </div>
          )}
          {includeDrinks && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
              <span style={{ color: '#2D2D2D' }}>Bottled Drinks ({totalSubs} × $3.45)</span>
              <span style={{ fontWeight: 600, color: '#2D2D2D' }}>${drinksTotal.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
            <span style={{ color: '#2D2D2D' }}>Cookie Platter ({cookiePlatter} × $17.99)</span>
            <span style={{ fontWeight: 600, color: '#2D2D2D' }}>${cookieTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
            <span style={{ color: '#2D2D2D' }}>Brownie Platter ({browniePlatter} × $19.99)</span>
            <span style={{ fontWeight: 600, color: '#2D2D2D' }}>${brownieTotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <>
              <div style={{ borderTop: '1px solid #eee', margin: '2px 0', paddingTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#2D2D2D' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#2D2D2D' }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>Discount ({discount}%)</span>
                <span style={{ fontWeight: 700 }}>-${discountAmount.toFixed(2)}</span>
              </div>
            </>
          )}
          <div style={{
            borderTop: '1.5px solid #134A7C', marginTop: '2px', paddingTop: '3px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 700, color: '#134A7C', fontSize: '8pt' }}>TOTAL</span>
            <span style={{ fontWeight: 800, color: '#EE3227', fontSize: '11pt' }}>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {specialRequests && (
        <div style={{ padding: '4px 28px 0' }}>
          <div style={sectionHeader()}>SPECIAL REQUESTS</div>
          <div style={{
            border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 3px 3px',
            padding: '3px 6px', fontSize: '6.5pt', color: '#444',
          }}>
            {specialRequests}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '5.5pt', padding: '4px 28px', fontWeight: 400, lineHeight: 1.3,
      }}>
        Property of JM Valley Group. All rights reserved. Confidential &mdash; not for distribution.
      </div>
    </div>
  );
});

export default CateringOrderPreview;
