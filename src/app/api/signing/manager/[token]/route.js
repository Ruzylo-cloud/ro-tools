import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSigningRequest } from '@/lib/signing';

export const dynamic = 'force-dynamic';

/**
 * GET /api/signing/manager/[token]
 * Authenticated — managers only. Returns full signing request including formData + signatureDataUrl.
 */
export async function GET(request, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { token } = params;
  const req = await getSigningRequest(token);
  if (!req) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only the manager who created it (or admin) can access full details
  const isAdmin = session.role === 'admin' || session.role === 'administrator';
  if (!isAdmin && req.managerEmail !== session.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    token: req.token,
    documentType: req.documentType,
    documentTitle: req.documentTitle,
    employeeName: req.employeeName,
    employeeEmail: req.employeeEmail,
    managerName: req.managerName,
    status: req.status,
    createdAt: req.createdAt,
    signedAt: req.signedAt,
    signerIP: req.signerIP,
    formData: req.formData || {},
    signatureDataUrl: req.signatureDataUrl || null,
  });
}
