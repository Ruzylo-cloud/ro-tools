'use client';

import { forwardRef } from 'react';

const MENU_LEFT = [
  { num: '#1', name: 'BLT', desc: 'Bacon, lettuce, tomato & mayo' },
  { num: '#2', name: "Jersey Shore's Favorite", desc: 'Provolone, ham & cappacuolo' },
  { num: '#3', name: 'Ham & Provolone', desc: 'Provolone & ham' },
  { num: '#4', name: 'The Number Four', desc: 'Provolone, prosciuttini & cappacuolo' },
  { num: '#5', name: 'The Super Sub', desc: 'Provolone, ham, prosciuttini & cappacuolo' },
  { num: '#6', name: 'Roast Beef & Provolone', desc: 'Provolone & oven-roasted top rounds' },
  { num: '#7', name: 'Turkey & Provolone', desc: 'Provolone & 99% fat-free turkey' },
  { num: '#8', name: 'Club Sub', desc: 'Provolone, turkey, ham, bacon & mayo' },
];

const MENU_RIGHT = [
  { num: '#9', name: 'Club Supreme', desc: 'Swiss, roast beef, turkey, bacon & mayo' },
  { num: '#10', name: 'Tuna Fish', desc: 'Made fresh in-store daily' },
  { num: '#11', name: 'Stickball Special', desc: 'Provolone, ham & salami' },
  { num: '#12', name: 'Cancro Special', desc: 'Provolone, roast beef & pepperoni' },
  { num: '#13', name: 'The Original Italian', desc: 'Provolone, ham, prosciuttini, cappacuolo, salami & pepperoni' },
  { num: '#14', name: 'The Veggie', desc: 'Swiss, provolone & green bell peppers' },
  { num: '', name: 'California Club', desc: 'Provolone, turkey, bacon & avocado' },
  { num: '', name: 'Turkey Club', desc: 'Provolone, turkey, bacon & mayo' },
];

const FlyerPreview = forwardRef(function FlyerPreview({ data }, ref) {
  const {
    street = '',
    city = '',
    state = '',
    phone = '',
    operatorName = '',
    operatorPhone = '',
    assistantName = '',
    assistantTitle = 'Catering Coordinator - Assistant Operator',
    assistantPhone = '',
  } = data || {};

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        minHeight: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* Jersey Mike's Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="Jersey Mike's Subs" style={{ height: '40px', width: 'auto' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 4px' }} />

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>
          {[street, `${city}${state ? ', ' + state : ''}`].filter(Boolean).join(' · ').toUpperCase() || 'YOUR STORE ADDRESS'}
        </div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          {phone || '(555) 000-0000'} &mdash; FRESH · LOCAL · DELIVERED
        </div>
      </div>

      {/* Red Divider */}
      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: '18pt', fontWeight: 700, color: '#134A7C',
        padding: '2px 0 2px', letterSpacing: '2px',
      }}>
        OFFICE CATERING
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 4px' }} />

      {/* Catering Photo */}
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <img
          src="/JerseyMikesCatering.jpg"
          alt="Jersey Mike's catering box with subs and sides"
          style={{
            width: '290px', height: 'auto', borderRadius: '6px',
            border: '2px solid #134A7C',
          }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Price */}
      <div style={{
        textAlign: 'center', color: '#EE3227', fontSize: '16pt', fontWeight: 700,
        padding: '4px 0 2px',
      }}>
        $89.95 PER BOX
      </div>

      {/* Box Description */}
      <div style={{
        textAlign: 'center', color: '#2D2D2D', fontSize: '9pt', fontWeight: 500,
        padding: '0 0 4px',
      }}>
        4 Giant Subs Cut Into Thirds · 12 Individually Wrapped Subs Per Box
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#134A7C', margin: '0 40px' }} />

      {/* Choose Your Subs Pill */}
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <span style={{
          display: 'inline-block', background: '#134A7C', color: '#fff',
          fontSize: '9pt', fontWeight: 700, padding: '3px 18px',
          borderRadius: '100px', letterSpacing: '1px',
        }}>
          CHOOSE YOUR SUBS
        </span>
      </div>

      {/* Menu Columns */}
      <div style={{
        display: 'flex', gap: '16px', padding: '2px 30px 4px',
      }}>
        {[MENU_LEFT, MENU_RIGHT].map((col, ci) => (
          <div key={ci} style={{ flex: 1 }}>
            {col.map((item) => (
              <div key={item.name} style={{ marginBottom: '2px' }}>
                <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#2D2D2D' }}>
                  {item.num ? `${item.num} ` : ''}{item.name}
                </div>
                <div style={{ fontSize: '6.5pt', fontWeight: 300, color: '#666', fontStyle: 'italic' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mike's Way Note */}
      <div style={{
        textAlign: 'center', color: '#888', fontSize: '7pt', fontWeight: 300,
        padding: '2px 30px',
      }}>
        All subs available Mike&apos;s Way® — onions, lettuce, tomatoes, vinegar, oil, oregano &amp; salt
      </div>

      {/* Lunchbox Line */}
      <div style={{
        textAlign: 'center', color: '#134A7C', fontSize: '7pt', fontWeight: 700,
        padding: '2px 0',
      }}>
        Individual Lunchboxes with chips and drinks available on request
      </div>

      {/* Gift Banner */}
      <div style={{
        background: '#134A7C', borderRadius: '6px', textAlign: 'center',
        padding: '6px 20px', margin: '3px 30px',
      }}>
        <div style={{ color: '#fff', fontSize: '9pt', fontWeight: 700 }}>
          ENJOY THE FREE SUB &amp; FREE SUB CARDS — OUR TREAT!
        </div>
        <div style={{ color: '#B8CCE0', fontSize: '7pt', fontWeight: 300 }}>
          We&apos;d love to be your go-to for the next team lunch.
        </div>
      </div>

      {/* Ready to Order */}
      <div style={{
        textAlign: 'center', color: '#2D2D2D', fontSize: '10pt', fontWeight: 700,
        padding: '6px 0 4px',
      }}>
        READY TO ORDER? CONTACT US:
      </div>

      {/* Contact Cards */}
      <div style={{
        display: 'flex', gap: '12px', padding: '0 30px 6px', justifyContent: 'center',
      }}>
        <div style={{
          flex: 1, maxWidth: '250px', background: '#134A7C', borderRadius: '8px',
          padding: '8px 16px', textAlign: 'center',
        }}>
          <div style={{ color: '#fff', fontSize: '10pt', fontWeight: 700 }}>
            {operatorName || 'Operator Name'}
          </div>
          <div style={{ color: '#B8CCE0', fontSize: '6.5pt' }}>
            Restaurant Operator
          </div>
          <div style={{ color: '#fff', fontSize: '10pt', fontWeight: 700 }}>
            {operatorPhone || '(555) 000-0000'}
          </div>
        </div>
        <div style={{
          flex: 1, maxWidth: '250px', background: '#134A7C', borderRadius: '8px',
          padding: '8px 16px', textAlign: 'center',
        }}>
          <div style={{ color: '#fff', fontSize: '10pt', fontWeight: 700 }}>
            {assistantName || 'Assistant Name'}
          </div>
          <div style={{ color: '#B8CCE0', fontSize: '6.5pt' }}>
            {assistantTitle}
          </div>
          <div style={{ color: '#fff', fontSize: '10pt', fontWeight: 700 }}>
            {assistantPhone || '(555) 000-0000'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FlyerPreview;
