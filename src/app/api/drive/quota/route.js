import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getDrive } from '@/lib/google-client';

export const dynamic = 'force-dynamic';

// RT-181: Drive storage quota endpoint
export async function GET() {
  try {
    const auth = getAuthenticatedClient();
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const drive = getDrive(auth.client);
    const res = await drive.about.get({ fields: 'storageQuota' });
    const quota = res.data.storageQuota || {};

    return NextResponse.json({
      limit: parseInt(quota.limit || '0', 10),
      usage: parseInt(quota.usage || '0', 10),
      usageInDrive: parseInt(quota.usageInDrive || '0', 10),
    });
  } catch (e) {
    console.error('[drive/quota] Failed to fetch quota:', e);
    return NextResponse.json({ error: 'Failed to fetch quota' }, { status: 500 });
  }
}
