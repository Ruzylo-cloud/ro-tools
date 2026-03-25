import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getDocs, getDrive } from '@/lib/google-client';
import { withTimeout } from '@/lib/api-timeout';

export const dynamic = 'force-dynamic';

// Get document content
export async function GET(request) {
  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get('id');

  if (!documentId) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
  }

  const docs = getDocs(auth.client);

  try {
    const res = await withTimeout(docs.documents.get({ documentId }), 30000, 'Docs get');

    // Extract plain text from doc body
    let text = '';
    if (res.data.body?.content) {
      for (const element of res.data.body.content) {
        if (element.paragraph?.elements) {
          for (const el of element.paragraph.elements) {
            if (el.textRun?.content) text += el.textRun.content;
          }
        }
      }
    }

    return NextResponse.json({
      title: res.data.title,
      documentId: res.data.documentId,
      text,
      body: res.data.body,
    });
  } catch (err) {
    console.error('[Docs] Read error:', err.message);
    return NextResponse.json({ error: 'Docs operation failed' }, { status: 500 });
  }
}

// Create a new document
export async function POST(request) {
  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const { title, folderId, content } = body;

  const docs = getDocs(auth.client);

  try {
    const res = await withTimeout(docs.documents.create({
      resource: { title: title || 'Untitled Document' },
    }), 30000, 'Docs create');

    // Add content if provided
    if (content) {
      await withTimeout(docs.documents.batchUpdate({
        documentId: res.data.documentId,
        resource: {
          requests: [{
            insertText: {
              location: { index: 1 },
              text: String(content).slice(0, 100000),
            },
          }],
        },
      }), 30000, 'Docs batchUpdate');
    }

    // Move to folder if specified
    if (folderId) {
      const drive = getDrive(auth.client);
      await withTimeout(drive.files.update({
        fileId: res.data.documentId,
        addParents: folderId,
        fields: 'id, parents',
      }), 30000, 'Drive move');
    }

    return NextResponse.json({
      documentId: res.data.documentId,
      title: res.data.title,
      url: `https://docs.google.com/document/d/${res.data.documentId}/edit`,
    });
  } catch (err) {
    console.error('[Docs] Create error:', err.message);
    return NextResponse.json({ error: 'Docs operation failed' }, { status: 500 });
  }
}
