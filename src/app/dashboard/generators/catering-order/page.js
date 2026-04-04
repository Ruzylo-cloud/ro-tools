'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import CateringOrderPreview, { MENU_ITEMS } from '@/components/CateringOrderPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const PRICE_PER_BOX = 89.95;
const CHIP_PRICE = 2.55;
const DRINK_PRICE = 3.45;
const COOKIE_PLATTER_PRICE = 17.99;
const BROWNIE_PLATTER_PRICE = 19.99;
const SUBS_PER_BOX = 12;

export default function CateringOrderPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);
  const prefillApplied = useRef(false);

  const [form, setForm, clearDraft] = useFormDraft('catering-order', {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    companyName: '',
    nextDeliveryDate: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    operatorName: '',
    operatorPhone: '',
    boxes: [],
    includeChips: false,
    includeDrinks: false,
    cookiePlatter: 0,
    browniePlatter: 0,
    discount: 0,
    specialRequests: '',
  });

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          const p = data.profile;
          const addr = [p.street, `${p.city || ''}${p.state ? ', ' + p.state : ''}`].filter(Boolean).join(', ');
          setForm(prev => ({
            ...prev,
            storeName: p.storeName || '',
            storePhone: p.phone || '',
            storeAddress: addr,
            operatorName: p.operatorName || '',
            operatorPhone: p.operatorPhone || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Pre-fill from tracker (client info or full reorder)
  useEffect(() => {
    if (loading || prefillApplied.current) return;
    prefillApplied.current = true;

    // Reorder: full form snapshot from sessionStorage
    if (searchParams.get('reorder') === 'true') {
      try {
        const raw = sessionStorage.getItem('catering-reorder');
        if (raw) {
          sessionStorage.removeItem('catering-reorder');
          const data = JSON.parse(raw);
          setForm(prev => ({
            ...prev,
            customerName: data.customerName || prev.customerName,
            customerPhone: data.customerPhone || prev.customerPhone,
            customerEmail: data.customerEmail || prev.customerEmail,
            companyName: data.companyName || prev.companyName,
            deliveryAddress: data.deliveryAddress || prev.deliveryAddress,
            deliveryDate: '', // Force re-entry
            deliveryTime: '', // Force re-entry
            nextDeliveryDate: '',
            boxes: Array.isArray(data.boxes) ? data.boxes : prev.boxes,
            includeChips: data.includeChips ?? prev.includeChips,
            includeDrinks: data.includeDrinks ?? prev.includeDrinks,
            cookiePlatter: data.cookiePlatter ?? prev.cookiePlatter,
            browniePlatter: data.browniePlatter ?? prev.browniePlatter,
            discount: data.discount ?? prev.discount,
            specialRequests: data.specialRequests || prev.specialRequests,
          }));
          showToast('Reorder loaded — please set a new delivery date.', 'info');
        }
      } catch { /* ignore bad data */ }
      return;
    }

    // Pre-fill from client: basic contact info
    if (searchParams.get('prefill') === 'client') {
      try {
        const raw = sessionStorage.getItem('catering-prefill');
        if (raw) {
          sessionStorage.removeItem('catering-prefill');
          const data = JSON.parse(raw);
          setForm(prev => ({
            ...prev,
            customerName: data.clientName || prev.customerName,
            customerPhone: data.phone || prev.customerPhone,
            customerEmail: data.email || prev.customerEmail,
            companyName: data.companyName || prev.companyName,
            deliveryAddress: data.address || prev.deliveryAddress,
          }));
          showToast(`Loaded client: ${data.clientName}`, 'success');
        }
      } catch { /* ignore */ }
    }
  }, [loading, searchParams, showToast]);

  // Calculations
  const numberOfBoxes = form.boxes.length;
  const totalSubs = numberOfBoxes * SUBS_PER_BOX;
  const boxTotal = numberOfBoxes * PRICE_PER_BOX;
  const chipsTotal = form.includeChips ? totalSubs * CHIP_PRICE : 0;
  const drinksTotal = form.includeDrinks ? totalSubs * DRINK_PRICE : 0;
  const cookieTotal = (form.cookiePlatter || 0) * COOKIE_PLATTER_PRICE;
  const brownieTotal = (form.browniePlatter || 0) * BROWNIE_PLATTER_PRICE;
  const subtotal = boxTotal + chipsTotal + drinksTotal + cookieTotal + brownieTotal;
  const discountAmount = subtotal * (form.discount / 100);
  const totalPrice = subtotal - discountAmount;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Box sub management
  const addBox = () => {
    setForm(prev => ({
      ...prev,
      boxes: [...prev.boxes, { subs: [{ subName: '', bread: 'White', quantity: 12, mikesWay: true, specialInstructions: '' }] }],
    }));
  };

  const removeBox = (boxIndex) => {
    setForm(prev => ({
      ...prev,
      boxes: prev.boxes.filter((_, i) => i !== boxIndex),
    }));
  };

  const addSubToBox = (boxIndex) => {
    setForm(prev => {
      const boxes = [...prev.boxes];
      const box = { ...boxes[boxIndex], subs: [...boxes[boxIndex].subs] };
      if (box.subs.length >= 4) return prev;
      // Calculate remaining for this box
      const used = box.subs.reduce((s, sub) => s + (parseInt(sub.quantity, 10) || 0), 0);
      const remaining = Math.max(0, SUBS_PER_BOX - used);
      box.subs.push({ subName: '', bread: 'White', quantity: remaining || 1, mikesWay: true, specialInstructions: '' });
      boxes[boxIndex] = box;
      return { ...prev, boxes };
    });
  };

  const removeSubFromBox = (boxIndex, subIndex) => {
    setForm(prev => {
      const boxes = [...prev.boxes];
      const box = { ...boxes[boxIndex], subs: boxes[boxIndex].subs.filter((_, i) => i !== subIndex) };
      boxes[boxIndex] = box;
      return { ...prev, boxes };
    });
  };

  const handleSubChange = (boxIndex, subIndex, key, value) => {
    setForm(prev => {
      const boxes = [...prev.boxes];
      const box = { ...boxes[boxIndex], subs: [...boxes[boxIndex].subs] };
      box.subs[subIndex] = { ...box.subs[subIndex], [key]: value };
      boxes[boxIndex] = box;
      return { ...prev, boxes };
    });
  };

  const getBoxSubCount = (box) => {
    return box.subs.reduce((s, sub) => s + (parseInt(sub.quantity, 10) || 0), 0);
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, logging: false, width: 612, height: 792,
      });
      if (!mountedRef.current) return;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);
      const filename = form.customerName
        ? `catering-order-${form.customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`
        : 'catering-order-form.pdf';
      pdf.save(filename);
      logActivity({ generatorType: 'catering-order', action: 'download', formData: form, filename });
      // Auto-save catering client + order with full form snapshot for reorder
      if (form.customerName?.trim()) {
        fetch('/api/catering/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: form.customerName,
            companyName: form.companyName,
            phone: form.customerPhone,
            email: form.customerEmail,
            address: form.deliveryAddress,
            orderDate: form.deliveryDate || new Date().toISOString().split('T')[0],
            totalAmount: totalPrice,
            itemCount: totalSubs,
            headCount: totalSubs,
            autoGenerated: true,
            formSnapshot: {
              boxes: form.boxes,
              includeChips: form.includeChips,
              includeDrinks: form.includeDrinks,
              cookiePlatter: form.cookiePlatter,
              browniePlatter: form.browniePlatter,
              discount: form.discount,
              specialRequests: form.specialRequests,
              deliveryAddress: form.deliveryAddress,
            },
          }),
        }).catch(() => {});
      }
      showToast('PDF downloaded successfully!', 'success'); clearDraft(); if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, totalPrice, totalSubs, showToast]);

  const previewData = {
    ...form,
    numberOfBoxes,
    totalSubs,
    boxTotal,
    chipsTotal,
    drinksTotal,
    cookieTotal,
    brownieTotal,
    subtotal,
    discountAmount,
    totalPrice,
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Catering Order Form</h2>
        <p className={styles.sidebarDesc}>
          Fill in customer and order details. Store info is pre-filled from your profile.
        </p>

        {/* Customer Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Customer Information</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Customer Name</label>
              <input type="text" className={styles.input} value={form.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="John Smith" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input type="text" className={styles.input} value={form.customerPhone} onChange={(e) => handleChange('customerPhone', e.target.value)} placeholder="(555) 123-4567" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input type="text" className={styles.input} value={form.customerEmail} onChange={(e) => handleChange('customerEmail', e.target.value)} placeholder="john@company.com" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Company Name</label>
              <input type="text" className={styles.input} value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="Acme Corp" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Next Delivery Date (Follow-Up)</label>
              <input type="date" className={styles.input} value={form.nextDeliveryDate} onChange={(e) => handleChange('nextDeliveryDate', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Delivery Details</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Delivery Address</label>
              <input type="text" className={styles.input} value={form.deliveryAddress} onChange={(e) => handleChange('deliveryAddress', e.target.value)} placeholder="123 Main St, City, ST" />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <input type="date" className={styles.input} value={form.deliveryDate} onChange={(e) => handleChange('deliveryDate', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Time</label>
                <input type="time" className={styles.input} value={form.deliveryTime} onChange={(e) => handleChange('deliveryTime', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Boxes */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Boxes</h3>
          {form.boxes.map((box, bi) => {
            const filled = getBoxSubCount(box);
            const isFull = filled >= SUBS_PER_BOX;
            return (
              <div key={bi} className={styles.orderItem}>
                <div className={styles.orderItemHeader}>
                  <span className={styles.orderItemNum}>
                    Box {bi + 1}
                    <span style={{ fontWeight: 400, fontSize: '11px', color: isFull ? '#16a34a' : '#b45309', marginLeft: '8px' }}>
                      {filled}/{SUBS_PER_BOX} subs
                    </span>
                  </span>
                  <button className={styles.removeBtn} onClick={() => removeBox(bi)} title="Remove box">&times;</button>
                </div>
                {box.subs.map((sub, si) => (
                  <div key={si} style={{ marginBottom: '8px', paddingBottom: si < box.subs.length - 1 ? '8px' : 0, borderBottom: si < box.subs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)' }}>Sub {si + 1}</span>
                      {box.subs.length > 1 && (
                        <button className={styles.removeBtn} style={{ fontSize: '14px' }} onClick={() => removeSubFromBox(bi, si)}>&times;</button>
                      )}
                    </div>
                    <div className={styles.fields}>
                      <div className={styles.field}>
                        <select className={styles.input} value={sub.subName} onChange={(e) => handleSubChange(bi, si, 'subName', e.target.value)}>
                          <option value="">Select a sub...</option>
                          {MENU_ITEMS.map((mi) => (
                            <option key={mi.name} value={`${mi.num ? mi.num + ' ' : ''}${mi.name}`}>
                              {mi.num ? `${mi.num} ` : ''}{mi.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label className={styles.label}>Bread</label>
                          <select className={styles.input} value={sub.bread || 'White'} onChange={(e) => handleSubChange(bi, si, 'bread', e.target.value)}>
                            <option value="White">White</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Rosemary">Rosemary</option>
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Qty</label>
                          <input type="number" className={styles.input} min="1" max={SUBS_PER_BOX} value={sub.quantity} onChange={(e) => handleSubChange(bi, si, 'quantity', e.target.value)} />
                        </div>
                        <div className={styles.field} style={{ justifyContent: 'flex-end' }}>
                          <label className={styles.checkboxLabel}>
                            <input type="checkbox" checked={sub.mikesWay} onChange={(e) => handleSubChange(bi, si, 'mikesWay', e.target.checked)} />
                            <span>Mike&apos;s Way</span>
                          </label>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <input type="text" className={styles.input} value={sub.specialInstructions} onChange={(e) => handleSubChange(bi, si, 'specialInstructions', e.target.value)} placeholder="Special instructions..." />
                      </div>
                    </div>
                  </div>
                ))}
                {box.subs.length < 4 && (
                  <button
                    className={styles.addItemBtn}
                    style={{ marginTop: '8px', padding: '6px', fontSize: '12px' }}
                    onClick={() => addSubToBox(bi)}
                  >
                    + Add Sub Variety
                  </button>
                )}
              </div>
            );
          })}
          <button className={styles.addItemBtn} onClick={addBox}>+ Add Box (12 Subs &mdash; ${PRICE_PER_BOX})</button>
        </div>

        {/* Extras & Discount */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Extras & Add-Ons</h3>
          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.includeChips} onChange={(e) => handleChange('includeChips', e.target.checked)} />
                <span>Include Chips{totalSubs > 0 && form.includeChips ? ` (${totalSubs} × $${CHIP_PRICE} = $${chipsTotal.toFixed(2)})` : ` ($${CHIP_PRICE}/ea)`}</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.includeDrinks} onChange={(e) => handleChange('includeDrinks', e.target.checked)} />
                <span>Include Bottled Drinks{totalSubs > 0 && form.includeDrinks ? ` (${totalSubs} × $${DRINK_PRICE} = $${drinksTotal.toFixed(2)})` : ` ($${DRINK_PRICE}/ea)`}</span>
              </label>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Cookie Platter ($17.99/ea)</label>
                <input type="number" className={styles.input} min="0" value={form.cookiePlatter || ''} onChange={(e) => handleChange('cookiePlatter', parseInt(e.target.value, 10) || 0)} placeholder="0" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Brownie Platter ($19.99/ea)</label>
                <input type="number" className={styles.input} min="0" value={form.browniePlatter || ''} onChange={(e) => handleChange('browniePlatter', parseInt(e.target.value, 10) || 0)} placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Discount</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 5, 10, 15].map(d => (
              <button
                key={d}
                onClick={() => handleChange('discount', d)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '6px',
                  border: form.discount === d ? '2px solid var(--jm-blue)' : '1px solid var(--border)',
                  background: form.discount === d ? 'rgba(19,74,124,0.08)' : 'var(--white)',
                  color: form.discount === d ? 'var(--jm-blue)' : 'var(--charcoal)',
                  fontWeight: form.discount === d ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {d === 0 ? 'None' : `${d}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Summary</h3>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Boxes ({SUBS_PER_BOX} subs ea):</span>
              <span className={styles.summaryValue}>{numberOfBoxes} &times; ${PRICE_PER_BOX} = ${boxTotal.toFixed(2)}</span>
            </div>
            {form.includeChips && (
              <div className={styles.summaryRow}>
                <span>Chips ({totalSubs}):</span>
                <span className={styles.summaryValue}>${chipsTotal.toFixed(2)}</span>
              </div>
            )}
            {form.includeDrinks && (
              <div className={styles.summaryRow}>
                <span>Bottled Drinks ({totalSubs}):</span>
                <span className={styles.summaryValue}>${drinksTotal.toFixed(2)}</span>
              </div>
            )}
            {form.cookiePlatter > 0 && (
              <div className={styles.summaryRow}>
                <span>Cookie Platter ({form.cookiePlatter}):</span>
                <span className={styles.summaryValue}>${cookieTotal.toFixed(2)}</span>
              </div>
            )}
            {form.browniePlatter > 0 && (
              <div className={styles.summaryRow}>
                <span>Brownie Platter ({form.browniePlatter}):</span>
                <span className={styles.summaryValue}>${brownieTotal.toFixed(2)}</span>
              </div>
            )}
            {form.discount > 0 && (
              <>
                <div className={styles.summaryRow} style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '6px' }}>
                  <span>Subtotal:</span>
                  <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow} style={{ color: '#16a34a' }}>
                  <span>Discount ({form.discount}%):</span>
                  <span style={{ fontWeight: 600 }}>-${discountAmount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total:</span>
              <span className={styles.summaryPrice}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Special Requests</h3>
          <div className={styles.field}>
            <textarea className={styles.textarea} rows={3} value={form.specialRequests} onChange={(e) => handleChange('specialRequests', e.target.value)} placeholder="Any additional notes or requests..." maxLength={400} />
            <div className={styles.charCount}>{(form.specialRequests || '').length}/400</div>
          </div>
        </div>

        {/* Store Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Store Information</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Store Name</label>
              <input type="text" className={styles.input} value={form.storeName} onChange={(e) => handleChange('storeName', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Store Phone</label>
              <input type="text" className={styles.input} value={form.storePhone} onChange={(e) => handleChange('storePhone', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Operator Name</label>
              <input type="text" className={styles.input} value={form.operatorName} onChange={(e) => handleChange('operatorName', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Operator Phone</label>
              <input type="text" className={styles.input} value={form.operatorPhone} onChange={(e) => handleChange('operatorPhone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* RT-097: Itemized total breakdown */}
        {subtotal > 0 && (
          <div className={styles.totalBreakdown}>
            {boxTotal > 0 && <div className={styles.totalRow}><span>Box Lunches ({numberOfBoxes} box{numberOfBoxes !== 1 ? 'es' : ''})</span><span>${boxTotal.toFixed(2)}</span></div>}
            {chipsTotal > 0 && <div className={styles.totalRow}><span>Chips</span><span>${chipsTotal.toFixed(2)}</span></div>}
            {drinksTotal > 0 && <div className={styles.totalRow}><span>Drinks</span><span>${drinksTotal.toFixed(2)}</span></div>}
            {cookieTotal > 0 && <div className={styles.totalRow}><span>Cookie Platters</span><span>${cookieTotal.toFixed(2)}</span></div>}
            {brownieTotal > 0 && <div className={styles.totalRow}><span>Brownie Platters</span><span>${brownieTotal.toFixed(2)}</span></div>}
            {discountAmount > 0 && <div className={styles.totalRow}><span>Discount ({form.discount}%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
            <div className={styles.totalFinal}><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
          </div>
        )}

        <button className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`} onClick={handleDownload} disabled={generating} title="Ctrl+Enter to download">
          {generating ? <><span className="gen-btn-spinner" />Generating PDF...</> : showSuccess ? '✓ Downloaded!' : 'Download PDF'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="catering-order.pdf"
          disabled={generating}
          generatorType="catering-order"
          formData={form}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--gray-500)' }}>
            <button onClick={() => setPreviewZoom(z => Math.max(50, z - 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ minWidth: '36px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{previewZoom}%</span>
            <button onClick={() => setPreviewZoom(z => Math.min(150, z + 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <button onClick={() => setPreviewZoom(100)} style={{ padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '11px' }}>Reset</button>
          </div>
        </div>
        <div className={styles.previewContainer} style={{ overflow: 'auto' }}>
          <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top left', width: `${10000 / previewZoom}%` }}>
            <CateringOrderPreview ref={previewRef} data={previewData} />
          </div>
        </div>
      </div>
    </div>
  );
}
