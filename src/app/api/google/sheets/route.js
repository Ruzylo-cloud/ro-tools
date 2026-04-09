import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getSheets, getDrive } from '@/lib/google-client';
import { withTimeout } from '@/lib/api-timeout';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

// Get spreadsheet data
export async function GET(request) {
  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get('id');
  const range = searchParams.get('range') || 'Sheet1';

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Spreadsheet ID required' }, { status: 400 });
  }

  const sheets = getSheets(auth.client);

  try {
    // Get spreadsheet metadata
    const meta = await withTimeout(sheets.spreadsheets.get({ spreadsheetId }), 30000, 'Sheets get');

    // Get data from specified range
    const data = await withTimeout(sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }), 30000, 'Sheets values get');

    return NextResponse.json({
      title: meta.data.properties.title,
      sheets: meta.data.sheets.map(s => s.properties.title),
      values: data.data.values || [],
      range: data.data.range,
    });
  } catch (err) {
    console.error('[Sheets] Read error:', err.message);
    return NextResponse.json({ error: 'Sheets operation failed' }, { status: 500 });
  }
}

// Create a new spreadsheet or write data
export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const { action } = body;

  try {
    if (action === 'create') {
      // Create new spreadsheet
      const { title, folderId, data } = body;
      const sheets = getSheets(auth.client);

      const res = await withTimeout(sheets.spreadsheets.create({
        resource: {
          properties: { title: title || 'Untitled Spreadsheet' },
          sheets: data ? [{ data: [{ rowData: data.map(row => ({ values: row.map(cell => ({ userEnteredValue: { stringValue: String(cell) } })) })) }] }] : undefined,
        },
      }), 30000, 'Sheets create');

      // Move to folder if specified
      if (folderId) {
        const drive = getDrive(auth.client);
        await withTimeout(drive.files.update({
          fileId: res.data.spreadsheetId,
          addParents: folderId,
          fields: 'id, parents',
        }), 30000, 'Drive move');
      }

      return NextResponse.json({
        spreadsheetId: res.data.spreadsheetId,
        url: res.data.spreadsheetUrl,
        title: res.data.properties.title,
      });
    }

    if (action === 'write') {
      // Write data to existing spreadsheet
      const { spreadsheetId, range, values } = body;
      const sheets = getSheets(auth.client);

      const res = await withTimeout(sheets.spreadsheets.values.update({
        spreadsheetId,
        range: range || 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      }), 30000, 'Sheets write');

      return NextResponse.json({
        updatedCells: res.data.updatedCells,
        updatedRange: res.data.updatedRange,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[Sheets] Write error:', err.message);
    return NextResponse.json({ error: 'Sheets operation failed' }, { status: 500 });
  }
}
