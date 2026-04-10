import { NextResponse } from 'next/server';
import { getSigningRequest, isExpired, completeSigningRequest } from '@/lib/signing';
import { rateLimit } from '@/lib/rate-limit';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/signing/[token]
 * Public endpoint — no auth required.
 * Returns signing request data for the signing page.
 */
export async function GET(request, { params }) {
  const { token } = params;

  const signingRequest = await getSigningRequest(token);
  if (!signingRequest) {
    return NextResponse.json({ error: 'Signing request not found' }, { status: 404 });
  }

  if (signingRequest.status === 'signed') {
    return NextResponse.json({
      error: 'This document has already been signed',
      signedAt: signingRequest.signedAt,
    }, { status: 410 });
  }

  if (isExpired(signingRequest)) {
    return NextResponse.json({ error: 'This signing link has expired' }, { status: 410 });
  }

  // Return only the data needed for the signing page (no signature data, no internal fields)
  return NextResponse.json({
    token: signingRequest.token,
    documentType: signingRequest.documentType,
    documentTitle: signingRequest.documentTitle,
    employeeName: signingRequest.employeeName,
    managerName: signingRequest.managerName,
    createdAt: signingRequest.createdAt,
  });
}

/**
 * POST /api/signing/[token]
 * Public endpoint — no auth required.
 * Submits an employee signature.
 */
export async function POST(request, { params }) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('signing-submit', 60000, 5, request);
  if (limited) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const { token } = params;

  const signingRequest = await getSigningRequest(token);
  if (!signingRequest) {
    return NextResponse.json({ error: 'Signing request not found' }, { status: 404 });
  }

  if (signingRequest.status === 'signed') {
    return NextResponse.json({
      error: 'This document has already been signed',
      signedAt: signingRequest.signedAt,
    }, { status: 410 });
  }

  if (isExpired(signingRequest)) {
    return NextResponse.json({ error: 'This signing link has expired' }, { status: 410 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { signatureDataUrl } = body;
  if (!signatureDataUrl || !signatureDataUrl.startsWith('data:image/png;base64,')) {
    return NextResponse.json({ error: 'Valid signature image (PNG data URL) is required' }, { status: 400 });
  }

  // Cap signature size at 500KB to prevent abuse
  if (signatureDataUrl.length > 500000) {
    return NextResponse.json({ error: 'Signature image too large' }, { status: 400 });
  }

  const signerIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const signedAt = new Date().toISOString();

  const completed = await completeSigningRequest(token, {
    signatureDataUrl,
    signedAt,
    signerIP,
  });

  if (!completed) {
    return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 });
  }

  // Notify manager that employee has signed
  if (signingRequest.managerEmail) {
    const host2 = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const protocol2 = host2.includes('localhost') ? 'http' : 'https';
    const signaturesUrl = `${protocol2}://${host2}/dashboard/signatures`;
    const notifyHtml = buildManagerNotificationEmail({
      employeeName: signingRequest.employeeName,
      documentTitle: signingRequest.documentTitle,
      signedAt: signedAt,
      managerName: signingRequest.managerName,
      signaturesUrl,
    });
    fetch(`${protocol2}://${host2}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: signingRequest.managerEmail,
        subject: `✅ ${signingRequest.employeeName} signed "${signingRequest.documentTitle}"`,
        htmlBody: notifyHtml,
      }),
      signal: AbortSignal.timeout(8000),
    })
      .then(res => { if (!res.ok) console.error(`[signing] Manager notification failed with status ${res.status}`); })
      .catch(err => console.error('Manager notification error:', err));
  }

  return NextResponse.json({
    success: true,
    signedAt,
    documentTitle: signingRequest.documentTitle,
    employeeName: signingRequest.employeeName,
  });
}

function buildManagerNotificationEmail({ employeeName, documentTitle, signedAt, managerName, signaturesUrl }) {
  const signedDate = new Date(signedAt).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
<tr><td style="background:#134A7C;padding:28px 40px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">✅ Document Signed</h1>
  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">JM Valley Group — RO Tools</p>
</td></tr>
<tr><td style="padding:36px 40px;">
  <p style="margin:0 0 16px;color:#2D2D2D;font-size:16px;">Hi ${managerName},</p>
  <p style="margin:0 0 24px;color:#2D2D2D;font-size:16px;line-height:1.6;">
    <strong>${employeeName}</strong> has signed <strong>"${documentTitle}"</strong>.
  </p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8f0;border:1px solid #c6e8c6;border-radius:8px;margin:0 0 28px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0 0 6px;color:#166534;font-size:13px;font-weight:600;">Signed on</p>
      <p style="margin:0;color:#166534;font-size:15px;font-weight:700;">${signedDate}</p>
    </td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:0 0 24px;">
      <a href="${signaturesUrl}" style="display:inline-block;background:#134A7C;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;">
        View Signatures Dashboard
      </a>
    </td></tr>
  </table>
  <p style="margin:0;color:#9ca3af;font-size:12px;">You can finalize and download the signed PDF from the Signatures page.</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
  <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">RO Tools — JM Valley Group</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
