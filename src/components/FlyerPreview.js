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

  const addressLine = [street, `${city}${state ? ', ' + state : ''}`, phone].filter(Boolean).join(' · ').toUpperCase();
  const footerAddress = [street, `${city}${state ? ', ' + state : ''}`].filter(Boolean).join(', ');

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
      }}
    >
      {/* 1. Address Line */}
      <div style={{
        textAlign: 'center', color: '#EE3227', fontSize: '8pt', fontWeight: 500,
        padding: '8px 20px 4px', letterSpacing: '0.5px',
      }}>
        {addressLine || '199 S TURNPIKE RD · SANTA BARBARA, CA · (805) 497-5800'}
      </div>

      {/* 2. Logo */}
      <div style={{ textAlign: 'center', padding: '2px 0' }}>
        <img
          src="/jmvg-logo.png"
          alt="JM Valley Group"
          style={{ width: '210px', height: 'auto' }}
          crossOrigin="anonymous"
        />
      </div>

      {/* 3. Fresh Local Delivered */}
      <div style={{
        textAlign: 'center', color: '#EE3227', fontSize: '9.5pt', fontWeight: 500,
        padding: '2px 0 6px', letterSpacing: '2px',
      }}>
        FRESH · LOCAL · DELIVERED
      </div>

      {/* 4. Blue Divider */}
      <div style={{ height: '2.5px', background: '#134A7C', margin: '0 20px' }}></div>

      {/* 5. Office Catering Banner */}
      <div style={{
        background: '#134A7C', color: '#fff', textAlign: 'center',
        fontSize: '20pt', fontWeight: 700, padding: '10px 0',
        margin: '8px 20px', borderRadius: '6px', letterSpacing: '2px',
      }}>
        OFFICE CATERING
      </div>

      {/* 6. Catering Photo */}
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <img
          src="/JerseyMikesCatering.jpg"
          alt="Jersey Mike's catering box with subs and sides"
          style={{
            width: '300px', height: 'auto', borderRadius: '6px',
            border: '2px solid #134A7C',
          }}
          crossOrigin="anonymous"
        />
      </div>

      {/* 7. Price */}
      <div style={{
        textAlign: 'center', color: '#EE3227', fontSize: '16pt', fontWeight: 700,
        padding: '6px 0 2px',
      }}>
        $89.95 PER BOX
      </div>

      {/* 8. Box Description */}
      <div style={{
        textAlign: 'center', color: '#2D2D2D', fontSize: '9.5pt', fontWeight: 500,
        padding: '0 0 6px',
      }}>
        4 Giant Subs Cut Into Thirds · 12 Individually Wrapped Subs Per Box
      </div>

      {/* 9. Divider */}
      <div style={{ height: '1px', background: '#134A7C', margin: '0 40px' }}></div>

      {/* 10. Choose Your Subs Pill */}
      <div style={{ textAlign: 'center', padding: '6px 0' }}>
        <span style={{
          display: 'inline-block', background: '#134A7C', color: '#fff',
          fontSize: '9.5pt', fontWeight: 700, padding: '4px 20px',
          borderRadius: '100px', letterSpacing: '1px',
        }}>
          CHOOSE YOUR SUBS
        </span>
      </div>

      {/* 11. Menu Columns */}
      <div style={{
        display: 'flex', gap: '16px', padding: '2px 30px 4px',
      }}>
        {[MENU_LEFT, MENU_RIGHT].map((col, ci) => (
          <div key={ci} style={{ flex: 1 }}>
            {col.map((item, i) => (
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

      {/* 12. Mike's Way Note */}
      <div style={{
        textAlign: 'center', color: '#888', fontSize: '7.5pt', fontWeight: 300,
        padding: '2px 30px',
      }}>
        All subs available Mike&apos;s Way® — onions, lettuce, tomatoes, vinegar, oil, oregano &amp; salt
      </div>

      {/* 13. Lunchbox Line */}
      <div style={{
        textAlign: 'center', color: '#134A7C', fontSize: '7.5pt', fontWeight: 700,
        padding: '3px 0',
      }}>
        Individual Lunchboxes with chips and drinks available on request
      </div>

      {/* 14. Gift Banner */}
      <div style={{
        background: '#134A7C', borderRadius: '6px', textAlign: 'center',
        padding: '8px 20px', margin: '4px 30px',
      }}>
        <div style={{ color: '#fff', fontSize: '9.5pt', fontWeight: 700 }}>
          ENJOY THE FREE SUB &amp; FREE SUB CARDS — OUR TREAT!
        </div>
        <div style={{ color: '#B8CCE0', fontSize: '7.5pt', fontWeight: 300 }}>
          We&apos;d love to be your go-to for the next team lunch.
        </div>
      </div>

      {/* 15. Ready to Order */}
      <div style={{
        textAlign: 'center', color: '#2D2D2D', fontSize: '10pt', fontWeight: 700,
        padding: '8px 0 6px',
      }}>
        READY TO ORDER? CONTACT US:
      </div>

      {/* 16. Contact Cards */}
      <div style={{
        display: 'flex', gap: '12px', padding: '0 30px 8px', justifyContent: 'center',
      }}>
        <div style={{
          flex: 1, maxWidth: '250px', background: '#134A7C', borderRadius: '8px',
          padding: '10px 16px', textAlign: 'center',
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
          padding: '10px 16px', textAlign: 'center',
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

      {/* 17. Blue Border Line */}
      <div style={{ height: '2px', background: '#134A7C', margin: '0 20px' }}></div>

      {/* 18. Footer Bar */}
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '7.5pt', padding: '6px 20px', margin: '0',
      }}>
        {footerAddress || '199 S Turnpike Rd, Santa Barbara, CA'} · Reach out for Fundraising Opportunities · CATERING AVAILABLE 7 DAYS A WEEK
      </div>

      {/* 19. Ownership Line */}
      <div style={{ fontSize: '5pt', color: '#999', textAlign: 'center', padding: '3px 20px' }}>
        Property of JM Valley Group. All rights reserved. Confidential — not for distribution.
      </div>
    </div>
  );
});

export default FlyerPreview;
