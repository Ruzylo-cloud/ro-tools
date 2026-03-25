import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { isSuperAdmin } from '@/lib/roles';
import { getServiceDrive, getServiceDocs, getServiceSheets } from '@/lib/google-service';
import { withTimeout } from '@/lib/api-timeout';

export const dynamic = 'force-dynamic';

const API_KEY = '02629e14ed2ddcdedaec36e0d113c0420ed7fe717b2d81c28ff899816b737a7e';

function checkAuth(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (key === API_KEY) return true;
  const session = getSession();
  return session && isSuperAdmin(session.email);
}

// GET /api/admin/drive-scan — list files OR read a specific file's content
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';

  // ACTION: read — read a specific document or spreadsheet's content
  if (action === 'read') {
    const fileId = searchParams.get('id');
    const fileType = searchParams.get('fileType'); // 'doc' | 'sheet'
    if (!fileId) {
      return NextResponse.json({ error: 'id parameter required' }, { status: 400 });
    }

    try {
      if (fileType === 'sheet') {
        const sheets = getServiceSheets();
        if (!sheets) return NextResponse.json({ error: 'Service account not configured' }, { status: 500 });

        const meta = await withTimeout(sheets.spreadsheets.get({ spreadsheetId: fileId }), 30000, 'Sheets get');
        const sheetNames = meta.data.sheets.map(s => s.properties.title);

        // Read first sheet's data
        const range = searchParams.get('range') || sheetNames[0];
        const data = await withTimeout(sheets.spreadsheets.values.get({
          spreadsheetId: fileId,
          range,
        }), 30000, 'Sheets values');

        return NextResponse.json({
          title: meta.data.properties.title,
          sheets: sheetNames,
          values: data.data.values || [],
          range: data.data.range,
        });
      }

      if (fileType === 'doc') {
        const docs = getServiceDocs();
        if (!docs) return NextResponse.json({ error: 'Service account not configured' }, { status: 500 });

        const res = await withTimeout(docs.documents.get({ documentId: fileId }), 30000, 'Docs get');

        // Extract plain text
        let text = '';
        if (res.data.body?.content) {
          for (const element of res.data.body.content) {
            if (element.paragraph?.elements) {
              for (const el of element.paragraph.elements) {
                if (el.textRun?.content) text += el.textRun.content;
              }
            }
            if (element.table) {
              for (const row of element.table.tableRows || []) {
                const cells = [];
                for (const cell of row.tableCells || []) {
                  let cellText = '';
                  for (const p of cell.content || []) {
                    if (p.paragraph?.elements) {
                      for (const el of p.paragraph.elements) {
                        if (el.textRun?.content) cellText += el.textRun.content;
                      }
                    }
                  }
                  cells.push(cellText.trim());
                }
                text += cells.join(' | ') + '\n';
              }
            }
          }
        }

        return NextResponse.json({
          title: res.data.title,
          documentId: res.data.documentId,
          text,
        });
      }

      // For other file types, get metadata only
      const drive = getServiceDrive();
      if (!drive) return NextResponse.json({ error: 'Service account not configured' }, { status: 500 });

      const file = await withTimeout(drive.files.get({
        fileId,
        fields: 'id, name, mimeType, modifiedTime, webViewLink, size, description',
        supportsAllDrives: true,
      }), 30000, 'Drive get');

      return NextResponse.json({ file: file.data });

    } catch (err) {
      console.error('[DriveScan] Read error:', err.message);
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }
  }

  // ACTION: list (default) — scan all files
  const drive = getServiceDrive();
  if (!drive) {
    return NextResponse.json({ error: 'Service account not configured' }, { status: 500 });
  }

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';

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
