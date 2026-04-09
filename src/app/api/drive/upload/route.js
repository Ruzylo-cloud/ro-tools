import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getDrive } from '@/lib/google-client';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

/**
 * POST /api/drive/upload
 * Upload a generated PDF to Google Drive.
 * Body: { fileName, pdfBase64, folderId? }
 * If folderId is not provided, uploads to root.
 */
export async function POST(request) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const auth = getAuthenticatedClient();
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { fileName, pdfBase64, folderId } = await request.json();

    if (!fileName || !pdfBase64) {
      return NextResponse.json({ error: 'fileName and pdfBase64 are required' }, { status: 400 });
    }

    const drive = getDrive(auth.client);

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // File metadata
    const fileMetadata = {
      name: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      mimeType: 'application/pdf',
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    // Upload
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: 'application/pdf',
        body: Readable.from(pdfBuffer),
      },
      fields: 'id, name, webViewLink',
    });

    return NextResponse.json({
      success: true,
      file: {
        id: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink,
      },
    });
  } catch (err) {
    console.error('Drive upload error:', err);
    return NextResponse.json({ error: 'Failed to upload to Drive' }, { status: 500 });
  }
}
