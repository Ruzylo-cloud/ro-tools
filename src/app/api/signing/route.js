import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync } from '@/lib/data.js';

export const dynamic = 'force-dynamic';

const SIGNING_FILE = 'signing-requests.json';

/**
 * GET /api/signing — list all signing requests for the current manager.
 * Admins see all; ROs/DMs see only their own.
 */
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const data = await loadJsonFileAsync(SIGNING_FILE);
  const requests = Object.values(data.requests || {});

  // Filter: admins see all, others see only their own requests
  const isAdmin = session.role === 'admin' || session.role === 'administrator';
  const visible = isAdmin
    ? requests
    : requests.filter(r => r.managerEmail === session.email);

  // Sort newest first
  visible.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Strip signature image data from list view (keep metadata only)
  const result = visible.map(r => ({
    token: r.token,
    documentType: r.documentType,
    documentTitle: r.documentTitle,
    employeeName: r.employeeName,
    employeeEmail: r.employeeEmail,
    managerName: r.managerName,
    status: r.status,
    createdAt: r.createdAt,
    signedAt: r.signedAt,
    signerIP: r.signerIP,
  }));

  return NextResponse.json({ requests: result });
}
