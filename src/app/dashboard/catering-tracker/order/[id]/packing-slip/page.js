'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function fmt(n) {
  return '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(s) {
  if (!s) return '';
  const d = new Date(s + (s.includes('T') ? '' : 'T00:00:00'));
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PackingSlipPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/catering/orders/${id}`);
        if (!res.ok) throw new Error((await res.json()).error || 'Failed');
        const data = await res.json();
        setOrder(data.order);
        setClient(data.client);
        // Auto-trigger print dialog shortly after render.
        setTimeout(() => { try { window.print(); } catch {} }, 400);
      } catch (e) {
        setError(e.message || 'Failed to load order');
      }
    })();
  }, [id]);

  if (error) return <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif' }}>Error: {error}</div>;
  if (!order) return <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif' }}>Loading packing slip…</div>;

  const items = order.items || [];
  const subtotal = order.subtotal || items.reduce((s, it) => s + (it.qty || 0) * (it.unitPrice || 0), 0);
  const taxAmt = subtotal * ((order.tax || 0) / 100);

  return (
    <>
      <style jsx global>{`
        @media print {
          @page { size: letter; margin: 0.5in; }
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
        body { background: #f3f4f6; }
      `}</style>

      <div className="no-print" style={{ position: 'fixed', top: 12, right: 12, zIndex: 10 }}>
        <button
          onClick={() => window.print()}
          style={{ padding: '10px 20px', background: '#134A7C', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          Print
        </button>
      </div>

      <div style={{
        maxWidth: 720, margin: '30px auto', background: '#fff',
        padding: 48, fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#111', boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #134A7C', paddingBottom: 20, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#EE3227', letterSpacing: '-0.5px' }}>JERSEY MIKE&rsquo;S</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Catering Packing Slip</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Order #</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{(order.id || '').slice(0, 8).toUpperCase()}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Deliver To</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{order.customerName || client?.clientName || 'Customer'}</div>
            {order.customerPhone && <div style={{ fontSize: 12, color: '#374151' }}>{order.customerPhone}</div>}
            {order.customerEmail && <div style={{ fontSize: 12, color: '#374151' }}>{order.customerEmail}</div>}
            {order.deliveryAddress && <div style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>{order.deliveryAddress}</div>}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Delivery</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtDate(order.deliveryDate || order.orderDate)}</div>
            {order.deliveryTime && <div style={{ fontSize: 13, color: '#134A7C', fontWeight: 700 }}>{order.deliveryTime}</div>}
            {order.headCount > 0 && <div style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>{order.headCount} people</div>}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #134A7C' }}>
              <th style={{ textAlign: 'left', padding: '8px 6px', fontSize: 11, textTransform: 'uppercase', color: '#6b7280' }}>Item</th>
              <th style={{ textAlign: 'right', padding: '8px 6px', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', width: 60 }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '8px 6px', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', width: 80 }}>Unit</th>
              <th style={{ textAlign: 'right', padding: '8px 6px', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', width: 90 }}>Line</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 14, color: '#9ca3af', textAlign: 'center' }}>No itemized items recorded.</td></tr>
            )}
            {items.map((it, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '8px 6px' }}>{it.name}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>{it.qty}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>{fmt(it.unitPrice)}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>{fmt(it.qty * it.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <div style={{ width: 260 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: '#6b7280' }}>
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: '#6b7280' }}>
              <span>Tax ({order.tax || 0}%)</span><span>{fmt(taxAmt)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 17, fontWeight: 800, borderTop: '2px solid #134A7C', marginTop: 4 }}>
              <span>Total</span><span>{fmt(order.totalAmount)}</span>
            </div>
            <div style={{ fontSize: 11, color: order.depositPaid ? '#16a34a' : '#dc2626', fontWeight: 700, marginTop: 4 }}>
              {order.depositPaid ? 'Deposit Paid' : 'Deposit Not Paid'}
            </div>
          </div>
        </div>

        {order.notes && (
          <div style={{ background: '#f9fafb', borderLeft: '3px solid #134A7C', padding: '10px 14px', fontSize: 12, color: '#374151' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 2 }}>Notes</div>
            {order.notes}
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid #e5e7eb', fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>
          Thank you for choosing Jersey Mike&rsquo;s. We appreciate your business.
        </div>
      </div>
    </>
  );
}
