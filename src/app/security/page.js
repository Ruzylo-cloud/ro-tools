'use client';

const BLUE = '#134A7C';
const RED = '#EE3227';
const NAVY = '#0d2d4a';

const VENDORS = [
  {
    name: 'Vantage Point',
    category: 'POS / Operations',
    risk: 'CRITICAL',
    color: '#c0392b',
    icon: '🖥️',
    findings: [
      {
        title: 'Third-Party Data Custody',
        severity: 'HIGH',
        detail: 'All sales, labor, and transaction data lives on Vantage Point servers. JMVG has no direct access to export or audit raw data. If the vendor changes pricing or shuts down, access is cut off immediately.',
      },
      {
        title: 'No Audit Trail Ownership',
        severity: 'HIGH',
        detail: 'Audit logs for register access, voids, and manager overrides are held by the vendor. In a dispute or investigation, JMVG must request records from a third party — delays can compromise legal timelines.',
      },
      {
        title: 'Vendor Lock-In',
        severity: 'MEDIUM',
        detail: 'Proprietary export formats make migration to another POS system costly and time-consuming. Historical data may not be fully portable.',
      },
      {
        title: 'Integration Surface Area',
        severity: 'MEDIUM',
        detail: 'API keys shared across 30 locations. A single compromised integration credential exposes the entire franchise network.',
      },
    ],
  },
  {
    name: 'Homebase',
    category: 'Scheduling / Timeclock',
    risk: 'HIGH',
    color: '#e67e22',
    icon: '🏠',
    findings: [
      {
        title: 'Employee PII on Third-Party Servers',
        severity: 'HIGH',
        detail: 'Employee names, phone numbers, email addresses, and schedules are stored on Homebase infrastructure. JMVG is not the data controller — Homebase is. This creates CCPA exposure for California employees.',
      },
      {
        title: 'No Custom Compliance Controls',
        severity: 'HIGH',
        detail: 'California §512 meal break waivers, §226.7 attestation corrections, and split-shift premiums require precise record-keeping. Homebase\'s generic time data does not integrate with CA-specific compliance workflows.',
      },
      {
        title: 'Clock-In Data Not Verified',
        severity: 'MEDIUM',
        detail: 'Homebase relies on employee self-reporting for mobile clock-ins. No PIN verification, no store-proximity enforcement, no manager confirmation — creating time fraud exposure.',
      },
      {
        title: 'Subscription Pricing Exposure',
        severity: 'MEDIUM',
        detail: 'Per-employee, per-location pricing model. At 30 locations with seasonal headcount swings, costs are unpredictable. Price increases require 30-day notice, but migration takes months.',
      },
      {
        title: 'No CA Break Attestation',
        severity: 'HIGH',
        detail: 'Homebase does not capture digitally signed meal break attestations at clock-out. Without these, JMVG cannot defend against missed-meal-premium claims. This is a $10,000+ per-incident liability gap.',
      },
    ],
  },
  {
    name: 'Jolt',
    category: 'Checklists / Training',
    risk: 'HIGH',
    color: '#e67e22',
    icon: '⚡',
    findings: [
      {
        title: 'Checklist Data Leaves JMVG Control',
        severity: 'HIGH',
        detail: 'Opening, mid-day, and closing checklist completions — including who completed them and when — are stored on Jolt servers. In a food safety incident, this documentation is critical and must be immediately accessible without vendor intermediation.',
      },
      {
        title: 'No Custom Document Generation',
        severity: 'MEDIUM',
        detail: 'Jolt cannot generate JMVG-branded compliance documents (written warnings, injury reports, meal break waivers). Staff still use manual Word/Google Docs, creating version drift and inconsistency across 30 stores.',
      },
      {
        title: 'Training Completion Records External',
        severity: 'HIGH',
        detail: 'Employee training completions and certifications are logged in Jolt\'s system. If JMVG is audited for OSHA compliance or faces a legal claim, records must be requested from the vendor. Response times are not guaranteed.',
      },
      {
        title: 'Redundant Platform Cost',
        severity: 'MEDIUM',
        detail: 'Jolt charges per-location. Combined with Homebase and Vantage Point fees across 30 stores, total SaaS spend can exceed $8,000–$15,000/month — for capabilities RO Tools replaces at $0.',
      },
    ],
  },
  {
    name: 'Google Drive',
    category: 'Document Storage',
    risk: 'MEDIUM',
    color: '#f39c12',
    icon: '📁',
    findings: [
      {
        title: 'No Access Revocation at Termination',
        severity: 'HIGH',
        detail: 'When an employee is terminated, their Google account may retain access to shared Drive folders unless manually removed — a step that is frequently missed. Former employees can access confidential HR documents, schedules, and financial data.',
      },
      {
        title: 'No Document Version Integrity',
        severity: 'HIGH',
        detail: 'Any authenticated user can edit shared documents. Warning letters, incident reports, and compliance forms can be modified after signing. There is no tamper-evident audit trail on Drive documents.',
      },
      {
        title: 'No Automatic Expiry or Archival',
        severity: 'MEDIUM',
        detail: 'Documents accumulate without lifecycle management. Sensitive HR files are retained indefinitely without deletion schedules, creating privacy risk and potential discovery liability.',
      },
      {
        title: 'No Watermarking or Traceability',
        severity: 'MEDIUM',
        detail: 'Copies of sensitive documents (termination letters, salary information) can be downloaded and distributed without any tracking. There is no way to know if a confidential document was leaked.',
      },
    ],
  },
  {
    name: 'Google Docs (HR Forms)',
    category: 'Document Creation',
    risk: 'MEDIUM',
    color: '#f39c12',
    icon: '📝',
    findings: [
      {
        title: 'Human Error in Critical Documents',
        severity: 'HIGH',
        detail: 'Manually typed termination letters, written warnings, and injury reports contain errors — wrong names, wrong dates, missing required fields. Courts and labor boards have rejected defective documents that did not meet CA legal standards.',
      },
      {
        title: 'No Automatic Legal Review',
        severity: 'HIGH',
        detail: 'Google Docs templates do not enforce California-specific requirements for meal break waivers (AB 1066), split-shift premiums, or termination notices (WARN Act thresholds). Non-compliant documents expose JMVG to DLSE claims.',
      },
      {
        title: 'No Digital Signature Enforcement',
        severity: 'HIGH',
        detail: 'Paper or emailed PDF signatures can be forged or disputed. Google Docs has no built-in legally defensible e-signature workflow with timestamping and identity verification.',
      },
      {
        title: 'No Centralized Document Registry',
        severity: 'MEDIUM',
        detail: 'HR documents are scattered across personal Drive accounts, store-level folders, and email attachments. There is no central registry of what was signed, by whom, and when — across 30 locations.',
      },
    ],
  },
];

const SEVERITY_COLOR = { HIGH: '#c0392b', MEDIUM: '#e67e22', LOW: '#27ae60' };
const RISK_BG = {
  CRITICAL: { bg: 'rgba(192,57,43,0.12)', border: '#c0392b', color: '#c0392b' },
  HIGH: { bg: 'rgba(230,126,34,0.12)', border: '#e67e22', color: '#e67e22' },
  MEDIUM: { bg: 'rgba(243,156,18,0.1)', border: '#f39c12', color: '#b7770d' },
};

const TOTAL_FINDINGS = VENDORS.reduce((n, v) => n + v.findings.length, 0);

export default function SecurityPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8fafc', color: '#1a1a2e', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, #1a0a0a 0%, #4a0f0a 50%, #c0392b 100%)`,
        padding: '80px 40px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,100,80,0.2)',
            border: '1px solid rgba(255,100,80,0.5)',
            borderRadius: 100,
            padding: '6px 22px',
            fontSize: 12, fontWeight: 700, letterSpacing: 2.5,
            textTransform: 'uppercase', color: '#ff9988', marginBottom: 28,
          }}>
            Internal Security Assessment · April 2026
          </div>
          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            color: '#fff', lineHeight: 1.05, margin: '0 0 20px', letterSpacing: -2,
          }}>
            Vendor Security <span style={{ color: '#ff8070' }}>Findings</span>
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(255,255,255,0.8)',
            maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.6,
          }}>
            Why Vantage Point, Homebase, Jolt, Google Drive, and Google Docs create unacceptable data risk, compliance gaps, and liability exposure for JM Valley Group.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ff8070', fontFamily: "'Playfair Display', serif" }}>{TOTAL_FINDINGS}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Security Findings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ff8070', fontFamily: "'Playfair Display', serif" }}>5</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Vendor Platforms</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ff8070', fontFamily: "'Playfair Display', serif" }}>30</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Exposed Stores</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ff8070', fontFamily: "'Playfair Display', serif" }}>$0</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>RO Tools Monthly Cost</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 32px 80px' }}>

        {/* EXECUTIVE SUMMARY */}
        <div style={{
          background: NAVY, borderRadius: 16, padding: '36px 40px', color: '#fff', marginBottom: 56,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Executive Summary</h2>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 15, marginBottom: 16 }}>
            JMVG currently relies on five third-party platforms for operations, scheduling, training, document creation, and storage. Each platform stores sensitive data outside JMVG infrastructure — creating vendor lock-in, compliance gaps under California labor law, and data access risk that JMVG cannot audit or control.
          </p>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 15, marginBottom: 0 }}>
            RO Tools replaces the compliance, document, and workforce management functions of all five platforms — running 100% within the JM Valley Group Google Cloud organization. Zero vendor contracts. Zero data leaving JMVG control. Zero monthly licensing cost.
          </p>
        </div>

        {/* VENDOR FINDINGS */}
        {VENDORS.map(vendor => {
          const risk = RISK_BG[vendor.risk] || RISK_BG.MEDIUM;
          const highCount = vendor.findings.filter(f => f.severity === 'HIGH').length;
          return (
            <div key={vendor.name} style={{ marginBottom: 48 }}>
              {/* Vendor Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '20px 24px',
                background: risk.bg,
                border: `1px solid ${risk.border}40`,
                borderLeft: `4px solid ${risk.border}`,
                borderRadius: '12px 12px 0 0',
              }}>
                <div style={{ fontSize: 28 }}>{vendor.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e' }}>{vendor.name}</div>
                  <div style={{ fontSize: 13, color: '#666', fontWeight: 500, marginTop: 2 }}>{vendor.category}</div>
                </div>
                <div style={{
                  background: risk.bg,
                  border: `1px solid ${risk.border}`,
                  color: risk.color,
                  borderRadius: 100, padding: '4px 14px',
                  fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  {vendor.risk} RISK
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#c0392b', fontFamily: "'Playfair Display', serif" }}>{highCount}</div>
                  <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>HIGH findings</div>
                </div>
              </div>

              {/* Findings */}
              <div style={{
                border: `1px solid ${risk.border}30`,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                overflow: 'hidden',
              }}>
                {vendor.findings.map((finding, i) => (
                  <div key={finding.title} style={{
                    padding: '20px 24px',
                    borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
                    background: '#fff',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      marginTop: 2,
                      background: SEVERITY_COLOR[finding.severity] + '15',
                      color: SEVERITY_COLOR[finding.severity],
                      borderRadius: 6, padding: '3px 10px',
                      fontSize: 10, fontWeight: 800, letterSpacing: 1,
                      textTransform: 'uppercase', flexShrink: 0, height: 'fit-content',
                    }}>
                      {finding.severity}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 6 }}>{finding.title}</div>
                      <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{finding.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* RO TOOLS SOLUTION */}
        <div style={{
          background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`,
          borderRadius: 16, padding: '44px 40px', color: '#fff', marginBottom: 56,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>How RO Tools Closes These Gaps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginTop: 28 }}>
            {[
              ['🔒', '100% JMVG Infrastructure', 'All data in your Google Cloud org. No vendor has access. No third-party contracts.'],
              ['📄', 'Legally Compliant Documents', '15 generators enforce CA labor law fields — signed, timestamped, tamper-evident.'],
              ['🕐', 'PIN-Verified Timeclock', 'Crew clock-in requires PIN at the kiosk. All punches are store-IP verified.'],
              ['✍️', 'Digital Signature Trail', 'Every signature is timestamped and stored immutably. Admissible in disputes.'],
              ['📊', 'Full Audit Log', 'Every action — logins, form submissions, edits — logged with user ID and timestamp.'],
              ['🍽️', 'CA Break Attestation', 'Crew attests to meal breaks at clock-out. Signed attestations stored per DLSE guidance.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '20px',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, opacity: 0.78, lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a href="/liability" style={{
            display: 'inline-block', background: BLUE, color: '#fff',
            padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15,
            textDecoration: 'none', marginRight: 12,
          }}>
            See Liability Protection →
          </a>
          <a href="/welcome" style={{
            display: 'inline-block', background: '#f0f4f8', color: NAVY,
            padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15,
            textDecoration: 'none',
          }}>
            Back to Overview
          </a>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 12, marginTop: 64 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: '#666' }}>JM Valley Group · Internal Security Assessment · April 2026</div>
          <div>Prepared by Christopher Ruzylo · Proprietary — not for external distribution</div>
        </div>
      </div>
    </div>
  );
}
