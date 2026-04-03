'use client';

import { forwardRef } from 'react';

const MENU_LEFT = [
  { id: '1', num: '#1', name: 'BLT', desc: 'Bacon, lettuce, tomato & mayo', side: 'left' },
  { id: '2', num: '#2', name: "Jersey Shore's Favorite", desc: 'Provolone, ham & cappacuolo', side: 'left' },
  { id: '3', num: '#3', name: 'Ham & Provolone', desc: 'Provolone & ham', side: 'left' },
  { id: '4', num: '#4', name: 'The Number Four', desc: 'Provolone, prosciuttini & cappacuolo', side: 'left' },
  { id: '5', num: '#5', name: 'The Super Sub', desc: 'Provolone, ham, prosciuttini & cappacuolo', side: 'left' },
  { id: '6', num: '#6', name: 'Roast Beef & Provolone', desc: 'Provolone & oven-roasted top rounds', side: 'left' },
  { id: '7', num: '#7', name: 'Turkey & Provolone', desc: 'Provolone & 99% fat-free turkey', side: 'left' },
  { id: '8', num: '#8', name: 'Club Sub', desc: 'Provolone, turkey, ham, bacon & mayo', side: 'left' },
];

const MENU_RIGHT = [
  { id: '9', num: '#9', name: 'Club Supreme', desc: 'Swiss, roast beef, turkey, bacon & mayo', side: 'right' },
  { id: '10', num: '#10', name: 'Tuna Fish', desc: 'Made fresh in-store daily', side: 'right' },
  { id: '11', num: '#11', name: 'Stickball Special', desc: 'Provolone, ham & salami', side: 'right' },
  { id: '12', num: '#12', name: 'Cancro Special', desc: 'Provolone, roast beef & pepperoni', side: 'right' },
  { id: '13', num: '#13', name: 'The Original Italian', desc: 'Provolone, ham, prosciuttini, cappacuolo, salami & pepperoni', side: 'right' },
  { id: '14', num: '#14', name: 'The Veggie', desc: 'Swiss, provolone & green bell peppers', side: 'right' },
  { id: 'cali', num: '', name: 'California Club', desc: 'Provolone, turkey, bacon & avocado', side: 'right' },
  { id: 'turkey', num: '', name: 'Turkey Club', desc: 'Provolone, turkey, bacon & mayo', side: 'right' },
];

export const ALL_MENU_ITEMS = [...MENU_LEFT, ...MENU_RIGHT];

// RT-141: Template color schemes
const TEMPLATE_COLORS = {
  classic: { primary: '#134A7C', accent: '#EE3227', cardBg: '#134A7C', cardText: '#fff', cardSub: '#B8CCE0', pillBg: '#134A7C', pillText: '#fff', menuColor: '#2D2D2D', menuDesc: '#666' },
  bold:    { primary: '#EE3227', accent: '#134A7C', cardBg: '#EE3227', cardText: '#fff', cardSub: '#ffd0cd', pillBg: '#EE3227', pillText: '#fff', menuColor: '#1a1a1a', menuDesc: '#555' },
  minimal: { primary: '#2D2D2D', accent: '#2D2D2D', cardBg: '#2D2D2D', cardText: '#fff', cardSub: '#aaa', pillBg: '#2D2D2D', pillText: '#fff', menuColor: '#111', menuDesc: '#666' },
  dark:    { primary: '#F59E0B', accent: '#F59E0B', cardBg: '#16213e', cardText: '#F59E0B', cardSub: '#c9a84c', pillBg: '#F59E0B', pillText: '#1a1a2e', pageBg: '#1a1a2e', menuColor: '#e0e0f0', menuDesc: '#a0a0b0' },
};

// RT-140: Apply menu overrides to default items
function applyOverrides(items, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return items;
  return items.map(item => {
    const ov = overrides[item.name] || overrides[item.id];
    if (!ov) return item;
    return { ...item, name: ov.name ?? item.name, desc: ov.desc ?? item.desc };
  });
}

const FlyerPreview = forwardRef(function FlyerPreview({ data, template = 'classic', enabledMenuIds, allMenuItems, menuOverrides }, ref) {
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

  // RT-141: Resolve template colors
  const c = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.classic;

  // RT-140: Apply overrides to menu items, then filter by enabled IDs if present
  const srcItems = allMenuItems || ALL_MENU_ITEMS;
  const withOverrides = applyOverrides(srcItems, menuOverrides);
  const baseLeft = withOverrides.filter(i => i.side === 'left');
  const baseRight = withOverrides.filter(i => i.side === 'right');
  const activeLeft = enabledMenuIds ? baseLeft.filter(i => enabledMenuIds.has(i.id)) : baseLeft;
  const activeRight = enabledMenuIds ? baseRight.filter(i => enabledMenuIds.has(i.id)) : baseRight;

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        minHeight: '792px',
        background: c.pageBg || '#fff',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent bar — RT-141: uses template accent color */}
      <div style={{ height: '5px', background: c.accent }} />

      {/* Jersey Mike's Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jersey-mikes-logo.png" alt="Jersey Mike's Subs" style={{ height: '50px', width: 'auto' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1.5px', background: c.primary, margin: '0 28px 4px' }} />

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: c.primary, letterSpacing: '2px' }}>
          {[street, `${city}${state ? ', ' + state : ''}`].filter(Boolean).join(' · ').toUpperCase() || 'YOUR STORE ADDRESS'}
        </div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          {phone || '(555) 000-0000'} &mdash; FRESH · LOCAL · DELIVERED
        </div>
      </div>

      {/* Accent Divider */}
      <div style={{ height: '1.5px', background: c.accent, margin: '2px 28px 4px' }} />

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: '18pt', fontWeight: 700, color: c.primary,
        padding: '2px 0 2px', letterSpacing: '2px',
      }}>
        OFFICE CATERING
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1px', background: c.primary, margin: '0 28px 4px' }} />

      {/* Catering Photo */}
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <img
          src="/JerseyMikesCatering.jpg"
          alt="Jersey Mike's catering box with subs and sides"
          style={{
            width: '290px', height: 'auto', borderRadius: '6px',
            border: `2px solid ${c.primary}`,
          }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Price */}
      <div style={{
        textAlign: 'center', color: c.accent, fontSize: '16pt', fontWeight: 700,
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
      <div style={{ height: '1px', background: c.primary, margin: '0 40px' }} />

      {/* Choose Your Subs Pill */}
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <span style={{
          display: 'inline-block', background: c.pillBg, color: c.pillText,
          fontSize: '9pt', fontWeight: 700, padding: '3px 18px',
          borderRadius: '100px', letterSpacing: '1px',
        }}>
          CHOOSE YOUR SUBS
        </span>
      </div>

      {/* RT-140: Menu Columns (filtered) */}
      <div style={{
        display: 'flex', gap: '16px', padding: '2px 30px 4px',
      }}>
        {[activeLeft, activeRight].map((col, ci) => (
          <div key={ci} style={{ flex: 1 }}>
            {col.map((item) => (
              <div key={item.id || item.name} style={{ marginBottom: '2px' }}>
                <div style={{ fontSize: '7.5pt', fontWeight: 700, color: c.menuColor }}>
                  {item.num ? `${item.num} ` : ''}{item.name}
                </div>
                <div style={{ fontSize: '6.5pt', fontWeight: 300, color: c.menuDesc, fontStyle: 'italic' }}>
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
        textAlign: 'center', color: c.primary, fontSize: '7pt', fontWeight: 700,
        padding: '2px 0',
      }}>
        Individual Lunchboxes with chips and drinks available on request
      </div>

      {/* Gift Banner */}
      <div style={{
        background: c.cardBg, borderRadius: '6px', textAlign: 'center',
        padding: '6px 20px', margin: '3px 30px',
      }}>
        <div style={{ color: c.cardText, fontSize: '9pt', fontWeight: 700 }}>
          ENJOY THE FREE SUB &amp; FREE SUB CARDS — OUR TREAT!
        </div>
        <div style={{ color: c.cardSub, fontSize: '7pt', fontWeight: 300 }}>
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
          flex: 1, maxWidth: '250px', background: c.cardBg, borderRadius: '8px',
          padding: '8px 16px', textAlign: 'center',
        }}>
          <div style={{ color: c.cardText, fontSize: '10pt', fontWeight: 700 }}>
            {operatorName || 'Operator Name'}
          </div>
          <div style={{ color: c.cardSub, fontSize: '6.5pt' }}>
            Restaurant Operator
          </div>
          <div style={{ color: c.cardText, fontSize: '10pt', fontWeight: 700 }}>
            {operatorPhone || '(555) 000-0000'}
          </div>
        </div>
        <div style={{
          flex: 1, maxWidth: '250px', background: c.cardBg, borderRadius: '8px',
          padding: '8px 16px', textAlign: 'center',
        }}>
          <div style={{ color: c.cardText, fontSize: '10pt', fontWeight: 700 }}>
            {assistantName || 'Assistant Name'}
          </div>
          <div style={{ color: c.cardSub, fontSize: '6.5pt' }}>
            {assistantTitle}
          </div>
          <div style={{ color: c.cardText, fontSize: '10pt', fontWeight: 700 }}>
            {assistantPhone || '(555) 000-0000'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FlyerPreview;
