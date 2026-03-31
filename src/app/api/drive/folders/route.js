import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getDrive } from '@/lib/google-client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/drive/folders?parentId=xxx&source=sharedWithMe
 * List folders in the user's Google Drive.
 * If parentId is provided, lists subfolders of that folder.
 * Otherwise lists root-level folders + shared drives.
 * source=sharedWithMe lists folders shared with the user.
 */
export async function GET(request) {
  try {
    const auth = await getAuthenticatedClient();
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || 'root';
    const source = searchParams.get('source') || '';

    const drive = getDrive(auth.client);

    // Special case: "Shared with me" virtual folder at root
    if (source === 'sharedWithMe') {
      const response = await drive.files.list({
        q: `sharedWithMe = true and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name)',
        orderBy: 'name',
        pageSize: 100,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      return NextResponse.json({
        folders: (response.data.files || []).map(f => ({ ...f, shared: true })),
        parentId,
      });
    }

    if (parentId === 'root') {
      // Query 1: Root-level owned folders
      const ownedResponse = await drive.files.list({
        q: `'root' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name)',
        orderBy: 'name',
        pageSize: 100,
        corpora: 'user',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      // Query 2: Shared drives
      let sharedDrives = [];
      try {
        const drivesResponse = await drive.drives.list({
          pageSize: 100,
          fields: 'drives(id, name)',
        });
        sharedDrives = (drivesResponse.data.drives || []).map(d => ({
          id: d.id,
          name: d.name,
          shared: true,
          isSharedDrive: true,
        }));
      } catch (driveErr) {
        console.error('Error listing shared drives:', driveErr.message);
      }

      const ownedFolders = (ownedResponse.data.files || []).map(f => ({ ...f, shared: false }));

      return NextResponse.json({
        folders: ownedFolders,
        sharedDrives,
        parentId,
      });
    }

    // Non-root: could be a shared drive or a regular folder
    // Try with driveId first to see if parentId is a shared drive
    let response;
    try {
      response = await drive.files.list({
        q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name)',
        orderBy: 'name',
        pageSize: 100,
        corpora: 'drive',
        driveId: parentId,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });
    } catch {
      // Not a shared drive root — query as a regular folder across all drives
      response = await drive.files.list({
        q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name)',
        orderBy: 'name',
        pageSize: 100,
        corpora: 'allDrives',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });
    }

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
    const auth = await getAuthenticatedClient();
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
