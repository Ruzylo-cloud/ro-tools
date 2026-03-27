import { NextResponse } from 'next/server';
import { getSigningRequest, isExpired, completeSigningRequest } from '@/lib/signing';
import { rateLimit } from '@/lib/rate-limit';

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

  return NextResponse.json({
    success: true,
    signedAt,
    documentTitle: signingRequest.documentTitle,
    employeeName: signingRequest.employeeName,
  });
}
