import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { isSuperAdmin } from '@/lib/roles';
import { getServiceDrive } from '@/lib/google-service';

export const dynamic = 'force-dynamic';

// Hardcoded API key for agent/automated access (read-only endpoint)
const API_KEY = '02629e14ed2ddcdedaec36e0d113c0420ed7fe717b2d81c28ff899816b737a7e';

// Scan all shared Drive files — read-only, never modifies source files
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Auth: either admin session OR API key
  const key = searchParams.get('key');
  if (key !== API_KEY) {
    const session = getSession();
    if (!session || !isSuperAdmin(session.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const drive = getServiceDrive();
  if (!drive) {
    return NextResponse.json({ error: 'Service account not configured' }, { status: 500 });
  }

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';

  // Build Drive query — no parent constraint, searches ALL shared files
  let q = 'trashed = false';

  if (query) {
    const sanitized = query.replace(/[^a-zA-Z0-9\s\-_]/g, '').slice(0, 100);
    if (sanitized) {
      q += ` and name contains '${sanitized}'`;
    }
  }

  if (type === 'folder') q += " and mimeType = 'application/vnd.google-apps.folder'";
  else if (type === 'sheet') q += " and mimeType = 'application/vnd.google-apps.spreadsheet'";
  else if (type === 'doc') q += " and mimeType = 'application/vnd.google-apps.document'";
  else if (type === 'pdf') q += " and mimeType = 'application/pdf'";

  try {
    const allFiles = [];
    let pageToken = null;
    const MAX_FILES = 5000;

    do {
      const res = await drive.files.list({
        q,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, webViewLink, size, parents)',
        orderBy: 'modifiedTime desc',
        pageSize: 100,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        ...(pageToken ? { pageToken } : {}),
      });

      if (res.data.files) {
        allFiles.push(...res.data.files);
      }
      pageToken = res.data.nextPageToken;
    } while (pageToken && allFiles.length < MAX_FILES);

    return NextResponse.json({
      query: query || '(all files)',
      count: allFiles.length,
      files: allFiles,
    });
  } catch (err) {
    console.error('[DriveScan] Error:', err.message);
    return NextResponse.json({ error: 'Drive scan failed' }, { status: 500 });
  }
}
