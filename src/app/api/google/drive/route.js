import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getDrive } from '@/lib/google-client';
import { withTimeout } from '@/lib/api-timeout';

export const dynamic = 'force-dynamic';

// List files/folders in Drive
export async function GET(request) {
  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const rawFolderId = searchParams.get('folderId') || 'root';
  const folderId = rawFolderId.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100) || 'root';
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || ''; // 'folder', 'sheet', 'doc', 'pdf'

  const drive = getDrive(auth.client);

  try {
    let q = `'${folderId}' in parents and trashed = false`;

    if (type === 'folder') q += " and mimeType = 'application/vnd.google-apps.folder'";
    else if (type === 'sheet') q += " and mimeType = 'application/vnd.google-apps.spreadsheet'";
    else if (type === 'doc') q += " and mimeType = 'application/vnd.google-apps.document'";
    else if (type === 'pdf') q += " and mimeType = 'application/pdf'";

    if (query) {
      const sanitized = query.replace(/[^a-zA-Z0-9\s\-_]/g, '').slice(0, 100);
      if (sanitized) q += ` and name contains '${sanitized}'`;
    }

    const res = await withTimeout(drive.files.list({
      q,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink, iconLink, parents)',
      orderBy: 'modifiedTime desc',
      pageSize: 50,
    }), 30000, 'Drive list');

    return NextResponse.json({ files: res.data.files || [] });
  } catch (err) {
    console.error('[Drive] List error:', err.message);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

// Create a file or folder in Drive
export async function POST(request) {
  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const drive = getDrive(auth.client);
  const body = await request.json();
  const { name, mimeType, folderId } = body;

  try {
    const fileMetadata = {
      name,
      mimeType: mimeType || 'application/vnd.google-apps.folder',
    };
    if (folderId) fileMetadata.parents = [folderId];

    const res = await withTimeout(drive.files.create({
      resource: fileMetadata,
      fields: 'id, name, mimeType, webViewLink',
    }), 30000, 'Drive create');

    return NextResponse.json({ file: res.data });
  } catch (err) {
    console.error('[Drive] Create error:', err.message);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}
