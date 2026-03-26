'use client';

import { forwardRef } from 'react';

/**
 * Uniform document template for all JMVG documents.
 * JMVG logo at top, red accent bars, blue headers, Poppins font.
 * Letter size: 612x792pt
 */
const DocumentTemplate = forwardRef(function DocumentTemplate({ title, subtitle, storeNumber, storeName, children }, ref) {
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
      {/* Top Red Bar */}
      <div style={{ height: '6px', background: '#EE3227' }} />

      {/* Header: Logo + Store Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 28px 10px',
      }}>
        <img
          src="/jmvg-logo.png"
          alt="JM Valley Group"
          style={{ height: '52px', width: 'auto' }}
          crossOrigin="anonymous"
        />
        {(storeNumber || storeName) && (
          <div style={{ textAlign: 'right' }}>
            {storeNumber && (
              <div style={{ fontSize: '9pt', fontWeight: 700, color: '#134A7C' }}>
                Store #{storeNumber}
              </div>
            )}
            {storeName && (
              <div style={{ fontSize: '8pt', fontWeight: 400, color: '#6b7280' }}>
                {storeName}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blue Divider */}
      <div style={{ height: '2px', background: '#134A7C', margin: '0 28px' }} />

      {/* Title Section */}
      <div style={{
        background: '#134A7C',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 28px',
        margin: '10px 28px 0',
        borderRadius: '6px',
      }}>
        <div style={{ fontSize: '16pt', fontWeight: 700, letterSpacing: '1px' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: '9pt', fontWeight: 400, color: '#B8CCE0', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Red Accent Line Under Title */}
      <div style={{ height: '3px', background: '#EE3227', margin: '0 28px' }} />

      {/* Content Area */}
      <div style={{ padding: '12px 28px 0' }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        <div style={{ height: '2px', background: '#134A7C', margin: '0 28px' }} />
        <div style={{
          background: '#EE3227',
          color: '#fff',
          textAlign: 'center',
          fontSize: '7pt',
          padding: '5px 28px',
          fontWeight: 400,
        }}>
          JM Valley Group &middot; jmvalleygroup.com &middot; Confidential
        </div>
      </div>
    </div>
  );
});

export default DocumentTemplate;
