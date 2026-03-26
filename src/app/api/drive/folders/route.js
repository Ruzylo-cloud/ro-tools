import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getDrive } from '@/lib/google-client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/drive/folders?parentId=xxx
 * List folders in the user's Google Drive.
 * If parentId is provided, lists subfolders of that folder.
 * Otherwise lists root-level folders.
 */
export async function GET(request) {
  try {
    const auth = getAuthenticatedClient();
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || 'root';

    const drive = getDrive(auth.client);

    const response = await drive.files.list({
      q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
      orderBy: 'name',
      pageSize: 100,
    });

    return NextResponse.json({
      folders: response.data.files || [],
      parentId,
    });
  } catch (err) {
    console.error('Drive folders error:', err);
    return NextResponse.json({ error: 'Failed to list folders' }, { status: 500 });
  }
}

/**
 * POST /api/drive/folders
 * Create a new folder in Google Drive.
 * Body: { name, parentId? }
 */
export async function POST(request) {
  try {
    const auth = getAuthenticatedClient();
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, parentId } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const drive = getDrive(auth.client);

    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentId) {
      fileMetadata.parents = [parentId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name',
    });

    return NextResponse.json({
      folder: {
        id: response.data.id,
        name: response.data.name,
      },
    });
  } catch (err) {
    console.error('Drive create folder error:', err);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
