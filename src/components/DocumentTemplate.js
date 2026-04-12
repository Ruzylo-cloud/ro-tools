'use client';

import { forwardRef } from 'react';

/**
 * Uniform document template for all JMVG documents.
 * Letter size: 612x792pt. Compact header, ownership footer.
 */
const DocumentTemplate = forwardRef(function DocumentTemplate({ title, subtitle, storeNumber, storeName, children }, ref) {
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

      {/* Header: Logo centered */}
      <div style={{ textAlign: 'center', padding: '6px 28px 2px' }}>
        <img
          src="/jmvg-logo.png"
          alt="JM Valley Group"
          style={{ height: '90px', width: '90px', objectFit: 'contain' }}
          crossOrigin="anonymous"
        />
        {(storeNumber || storeName) && (
          <div style={{ fontSize: '7pt', color: '#6b7280', marginTop: '1px' }}>
            {storeNumber ? `Store #${storeNumber}` : ''}{storeNumber && storeName ? ' — ' : ''}{storeName || ''}
          </div>
        )}
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px' }} />

      {/* Title Section */}
      <div style={{
        background: '#134A7C',
        color: '#fff',
        textAlign: 'center',
        padding: '6px 28px',
        margin: '6px 28px 0',
        borderRadius: '4px',
      }}>
        <div style={{ fontSize: '14pt', fontWeight: 700, letterSpacing: '1px' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: '8pt', fontWeight: 400, color: '#B8CCE0', marginTop: '1px' }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Red Accent Line Under Title */}
      <div style={{ height: '2px', background: '#EE3227', margin: '0 28px' }} />

      {/* Content Area */}
      <div style={{ padding: '8px 28px 0' }}>
        {children}
      </div>

      {/* Spacer pushes footer to bottom on short pages */}
      <div style={{ flex: 1, minHeight: '8px' }} />

      {/* Footer */}
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 6px' }} />
      <div style={{
        background: '#EE3227',
        color: '#fff',
        textAlign: 'center',
        fontSize: '5.5pt',
        padding: '4px 28px',
        fontWeight: 400,
        lineHeight: 1.3,
      }}>
        Property of JM Valley Group. All rights reserved. Confidential &mdash; not for distribution.
      </div>
    </div>
  );
});

export default DocumentTemplate;
