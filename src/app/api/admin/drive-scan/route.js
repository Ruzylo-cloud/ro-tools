import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isSuperAdmin } from '@/lib/roles';
import { getServiceDrive } from '@/lib/google-service';

export const dynamic = 'force-dynamic';

function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('ro_session');
  if (!session?.value) return null;
  try {
    return JSON.parse(Buffer.from(session.value, 'base64').toString());
  } catch {
    return null;
  }
}

// Scan all shared Drive files — admin only, read-only, never modifies source files
export async function GET(request) {
  const session = getSession();
  if (!session || !isSuperAdmin(session.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const drive = getServiceDrive();
  if (!drive) {
    return NextResponse.json({ error: 'Service account not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';

  // Build Drive query — no parent constraint, searches ALL shared files
  let q = 'trashed = false';

  if (query) {
    q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
  }

  if (type === 'folder') q += " and mimeType = 'application/vnd.google-apps.folder'";
  else if (type === 'sheet') q += " and mimeType = 'application/vnd.google-apps.spreadsheet'";
  else if (type === 'doc') q += " and mimeType = 'application/vnd.google-apps.document'";
  else if (type === 'pdf') q += " and mimeType = 'application/pdf'";

  try {
    const allFiles = [];
    let pageToken = null;

    // Paginate through all results
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
    } while (pageToken);

    return NextResponse.json({
      query: query || '(all files)',
      count: allFiles.length,
      files: allFiles,
    });
  } catch (err) {
    console.error('[DriveScan] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
