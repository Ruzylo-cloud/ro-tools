'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import CateringOrderPreview, { MENU_ITEMS } from '@/components/CateringOrderPreview';
import SaveToDrive from '@/components/SaveToDrive';
import styles from './page.module.css';

const PRICE_PER_BOX = 89.95;

export default function CateringOrderPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    companyName: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    operatorName: '',
    operatorPhone: '',
    orderItems: [],
    includeChips: false,
    includeDrinks: false,
    specialRequests: '',
  });

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  // Load profile data
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

  // Auto-calculate boxes and total
  const totalSubs = form.orderItems.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  const numberOfBoxes = Math.ceil(totalSubs / 12);
  const totalPrice = numberOfBoxes * PRICE_PER_BOX;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleItemChange = (index, key, value) => {
    setForm(prev => {
      const items = [...prev.orderItems];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, orderItems: items };
    });
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      orderItems: [...prev.orderItems, { subName: '', quantity: 1, mikesWay: true, specialInstructions: '' }],
    }));
  };

  const removeItem = (index) => {
    setForm(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 612,
        height: 792,
      });

      if (!mountedRef.current) return;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);

      const filename = form.customerName
        ? `catering-order-${form.customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`
        : 'catering-order-form.pdf';
      pdf.save(filename);
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form.customerName, showToast]);

  const previewData = {
    ...form,
    numberOfBoxes,
    totalPrice,
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: '#6b7280', padding: '48px' }}>Loading store info...</p>
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

        {/* Customer Info Section */}
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
          </div>
        </div>

        {/* Delivery Section */}
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

        {/* Order Items Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Items</h3>
          {form.orderItems.map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <div className={styles.orderItemHeader}>
                <span className={styles.orderItemNum}>Item {i + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeItem(i)} title="Remove item">&times;</button>
              </div>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Sub</label>
                  <select className={styles.input} value={item.subName} onChange={(e) => handleItemChange(i, 'subName', e.target.value)}>
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
                    <label className={styles.label}>Quantity</label>
                    <input type="number" className={styles.input} min="1" value={item.quantity} onChange={(e) => handleItemChange(i, 'quantity', e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" checked={item.mikesWay} onChange={(e) => handleItemChange(i, 'mikesWay', e.target.checked)} />
                      <span>Mike&apos;s Way</span>
                    </label>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Special Instructions</label>
                  <input type="text" className={styles.input} value={item.specialInstructions} onChange={(e) => handleItemChange(i, 'specialInstructions', e.target.value)} placeholder="e.g. No onions" />
                </div>
              </div>
            </div>
          ))}
          <button className={styles.addItemBtn} onClick={addItem}>+ Add Item</button>
        </div>

        {/* Summary */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Summary</h3>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Total Subs:</span>
              <span className={styles.summaryValue}>{totalSubs}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Boxes (12 subs/box):</span>
              <span className={styles.summaryValue}>{numberOfBoxes}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total Price:</span>
              <span className={styles.summaryPrice}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className={styles.fields} style={{ marginTop: '10px' }}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.includeChips} onChange={(e) => handleChange('includeChips', e.target.checked)} />
              <span>Include Chips</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.includeDrinks} onChange={(e) => handleChange('includeDrinks', e.target.checked)} />
              <span>Include Drinks</span>
            </label>
          </div>
        </div>

        {/* Special Requests */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Special Requests</h3>
          <div className={styles.field}>
            <textarea className={styles.textarea} rows={3} value={form.specialRequests} onChange={(e) => handleChange('specialRequests', e.target.value)} placeholder="Any additional notes or requests..." />
          </div>
        </div>

        {/* Store Info (auto-filled) */}
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

        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="catering-order.pdf"
          disabled={generating}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <CateringOrderPreview ref={previewRef} data={previewData} />
        </div>
      </div>
    </div>
  );
}
