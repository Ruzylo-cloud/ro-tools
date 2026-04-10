'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { logActivity } from '@/lib/log-activity';

/**
 * SaveToDrive — a button + folder picker for saving generated PDFs to Google Drive.
 * Props:
 *  - getCanvasRef: function that returns the ref to the DOM element to capture
 *  - fileName: string, the PDF file name (without .pdf)
 *  - disabled: boolean
 *  - generatorType: string, for audit logging (e.g. 'written-warning')
 *  - formData: object, form data for audit logging
 */
export default function SaveToDrive({ getCanvasRef, fileName, disabled, generatorType, formData }) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [folders, setFolders] = useState([]);
  const [sharedDrives, setSharedDrives] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([{ id: 'root', name: 'My Drive' }]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [result, setResult] = useState(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  // RT-181: Storage usage
  const [storageQuota, setStorageQuota] = useState(null);

  const currentFolderId = breadcrumb[breadcrumb.length - 1].id;
  const isAtRoot = breadcrumb.length === 1 && currentFolderId === 'root';

  // Check if user has Drive access when opening picker
  const handleOpenPicker = async () => {
    try {
      const res = await fetch('/api/auth/scopes');
      const data = await res.json();
      if (!data.hasExtendedScopes) {
        setNeedsUpgrade(true);
        return;
      }
    } catch (e) {
      console.debug('[SaveToDrive] Scope check failed, trying anyway (Drive call will fail gracefully):', e);
    }
    setNeedsUpgrade(false);
    setShowPicker(true);
    // RT-181: Load storage quota when picker opens
    fetch('/api/drive/quota').then(r => r.json()).then(d => {
      if (d.limit && d.usage) setStorageQuota(d);
    }).catch((e) => { console.debug('[saveToDrive] quota load failed (non-fatal):', e); });
  };

  const handleUpgrade = () => {
    // Save current page URL so user comes back after granting access
    const returnTo = window.location.pathname + window.location.search;
    window.location.href = `/api/auth/upgrade?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const loadFolders = async (parentId) => {
    setLoadingFolders(true);
    try {
      // Check if we're in the "Shared with me" virtual folder
      const currentCrumb = breadcrumb[breadcrumb.length - 1];
      const isSharedWithMe = currentCrumb && currentCrumb.source === 'sharedWithMe';

      let url = `/api/drive/folders?parentId=${parentId}`;
      if (isSharedWithMe && parentId === 'sharedWithMe') {
        url = `/api/drive/folders?parentId=root&source=sharedWithMe`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load folders: ${res.status}`);
      const data = await res.json();
      setFolders(data.folders || []);
      setSharedDrives(data.sharedDrives || []);
    } catch {
      setFolders([]);
      setSharedDrives([]);
    }
    setLoadingFolders(false);
  };

  useEffect(() => {
    if (showPicker) {
      const currentCrumb = breadcrumb[breadcrumb.length - 1];
      if (currentCrumb.source === 'sharedWithMe' && currentCrumb.id === 'sharedWithMe') {
        loadFolders('sharedWithMe');
      } else {
        loadFolders(currentFolderId);
      }
    }
  }, [showPicker, currentFolderId, breadcrumb]);

  const navigateToFolder = (folder) => {
    setBreadcrumb(prev => [...prev, { id: folder.id, name: folder.name, ...(folder.source ? { source: folder.source } : {}) }]);
  };

  const navigateToBreadcrumb = (index) => {
    setBreadcrumb(prev => prev.slice(0, index + 1));
  };

  const handleSave = async () => {
    const ref = getCanvasRef();
    if (!ref) return;

    setSaving(true);
    setResult(null);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(ref, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 612,
        height: 792,
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);

      // Convert to base64
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      const res = await fetch('/api/drive/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: `${fileName}.pdf`,
          pdfBase64,
          folderId: currentFolderId === 'root' ? null : currentFolderId,
        }),
      });

      if (!res.ok && res.status !== 400 && res.status !== 413) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setResult({ type: 'success', link: data.file.webViewLink });
        setShowPicker(false);
        if (generatorType) {
          logActivity({ generatorType, action: 'drive-save', formData: formData || {}, filename: `${fileName}.pdf` });
        }
      } else {
        setResult({ type: 'error', message: data.error || 'Upload failed' });
      }
    } catch (err) {
      console.error('Save to Drive error:', err);
      setResult({ type: 'error', message: 'Failed to save to Drive' });
    }
    setSaving(false);
  };

  const handleCreateFolder = async () => {
    const name = prompt('New folder name:');
    if (!name) return;

    try {
      const res = await fetch('/api/drive/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          parentId: currentFolderId === 'root' ? null : currentFolderId,
        }),
      });
      if (!res.ok) throw new Error(`Failed to create folder: ${res.status}`);
      const data = await res.json();
      if (data.folder) {
        loadFolders(currentFolderId);
      }
    } catch {
      showToast('Failed to create folder', 'error');
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      {/* Save to Drive button */}
      {!showPicker && !needsUpgrade && (
        <button
          onClick={handleOpenPicker}
          disabled={disabled || saving}
          style={{
            width: '100%',
            padding: '14px',
            background: '#134A7C',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          Save to Google Drive
        </button>
      )}

      {/* Upgrade prompt — shown when user hasn't granted Drive access */}
      {needsUpgrade && !showPicker && (
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '13px', color: '#374151', marginBottom: '10px', lineHeight: 1.5 }}>
            To save files to Google Drive, you need to grant additional access to your account.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setNeedsUpgrade(false)}
              style={{
                flex: 1, padding: '10px', background: '#f0f4f8', color: '#6b7280',
                border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              style={{
                flex: 1, padding: '10px', background: '#134A7C', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '13px',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Grant Access
            </button>
          </div>
        </div>
      )}

      {/* Folder Picker */}
      {showPicker && (
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: '#134A7C',
            color: '#fff',
            padding: '10px 14px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Choose folder</span>
            <button
              onClick={() => setShowPicker(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
            >
              &times;
            </button>
          </div>

          {/* RT-181: Storage usage bar */}
          {storageQuota && storageQuota.limit > 0 && (
            <div style={{ padding: '6px 14px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginBottom: 3 }}>
                <span>Drive Storage</span>
                <span>{(storageQuota.usage / 1073741824).toFixed(1)} GB / {(storageQuota.limit / 1073741824).toFixed(0)} GB</span>
              </div>
              <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: storageQuota.usage / storageQuota.limit > 0.9 ? '#dc2626' : '#134A7C', width: `${Math.min(100, (storageQuota.usage / storageQuota.limit) * 100).toFixed(1)}%` }} />
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          <div style={{
            padding: '8px 14px',
            fontSize: '11px',
            color: '#6b7280',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
          }}>
            {breadcrumb.map((b, i) => (
              <span key={b.id}>
                {i > 0 && <span style={{ margin: '0 2px' }}>/</span>}
                <button
                  onClick={() => navigateToBreadcrumb(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: i === breadcrumb.length - 1 ? '#134A7C' : '#6b7280',
                    fontWeight: i === breadcrumb.length - 1 ? 700 : 400,
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '11px',
                    fontFamily: 'inherit',
                  }}
                >
                  {b.name}
                </button>
              </span>
            ))}
          </div>

          {/* Folder List */}
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {loadingFolders ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                Loading...
              </div>
            ) : folders.length === 0 && sharedDrives.length === 0 && !isAtRoot ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                No subfolders
              </div>
            ) : (
              <>
                {/* My Drive folders */}
                {folders.map(f => (
                  <button
                    key={f.id}
                    onClick={() => navigateToFolder(f)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 14px',
                      border: 'none',
                      borderBottom: '1px solid #f3f4f6',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#2D2D2D',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>&#128193;</span>
                    {f.name}
                  </button>
                ))}

                {/* Shared Drives section (only at root) */}
                {isAtRoot && sharedDrives.length > 0 && (
                  <>
                    <div style={{
                      padding: '6px 14px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderTop: '1px solid #e5e7eb',
                      borderBottom: '1px solid #f3f4f6',
                      background: '#f9fafb',
                    }}>
                      Shared Drives
                    </div>
                    {sharedDrives.map(d => (
                      <button
                        key={d.id}
                        onClick={() => navigateToFolder(d)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 14px',
                          border: 'none',
                          borderBottom: '1px solid #f3f4f6',
                          background: '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          color: '#2D2D2D',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>&#128194;</span>
                        {d.name}
                      </button>
                    ))}
                  </>
                )}

                {/* Shared with me option (only at root) */}
                {isAtRoot && (
                  <>
                    <div style={{
                      padding: '6px 14px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderTop: '1px solid #e5e7eb',
                      borderBottom: '1px solid #f3f4f6',
                      background: '#f9fafb',
                    }}>
                      Other
                    </div>
                    <button
                      onClick={() => navigateToFolder({ id: 'sharedWithMe', name: 'Shared with me', source: 'sharedWithMe' })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 14px',
                        border: 'none',
                        borderBottom: '1px solid #f3f4f6',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#2D2D2D',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>&#128101;</span>
                      Shared with me
                    </button>
                  </>
                )}

                {/* Empty state when no folders at all */}
                {folders.length === 0 && sharedDrives.length === 0 && isAtRoot && (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                    No folders found
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
          }}>
            <button
              onClick={handleCreateFolder}
              style={{
                flex: 1,
                padding: '8px',
                background: '#f0f4f8',
                color: '#134A7C',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              + New Folder
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                padding: '8px',
                background: '#EE3227',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
                fontFamily: 'inherit',
              }}
            >
              {saving ? 'Saving...' : 'Save Here'}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          marginTop: '8px',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          background: result.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: result.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${result.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
        }}>
          {result.type === 'success' ? (
            <>
              Saved to Drive!{' '}
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#134A7C', fontWeight: 600 }}
              >
                Open in Drive
              </a>
            </>
          ) : result.message}
        </div>
      )}
    </div>
  );
}
