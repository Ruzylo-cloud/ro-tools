/**
 * Employee Documents API — dual save to internal storage + Google Drive.
 * POST: saves a generated document for an employee
 * GET: lists documents for an employee
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { rateLimit } from '@/lib/rate-limit';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || '/data';
const DOCS_DIR = path.join(DATA_DIR, 'employee-documents');
const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch(e) { console.debug('[docs] mkdir failed (non-fatal):', e); }
}

export async function POST(request) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const { limited } = rateLimit('employee-documents', 60000, 20, request);
    if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const session = getSession(); // RT-150: was checking cookie existence only, never verifying token
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }); }
    const { employeeName, employeeId, documentType, fileName, content, metadata } = body;

    if (!documentType || !fileName) {
      return NextResponse.json({ error: 'documentType and fileName required' }, { status: 400 });
    }

    // RT-283: Sanitize all user-controlled path components to prevent path traversal
    const safeType = documentType.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');

    // 1. Save to internal storage (GCS volume)
    const safeName = (employeeName || '_general').slice(0, 100).replace(/[^a-zA-Z0-9_-]/g, '_');
    const empDir = path.join(DOCS_DIR, safeName);
    await ensureDir(empDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const internalFileName = `${safeType}_${timestamp}_${safeFileName}`;
    const filePath = path.join(empDir, internalFileName);

    // Save metadata
    const meta = {
      employeeName,
      employeeId: employeeId || null,
      documentType,
      fileName: internalFileName,
      originalFileName: fileName,
      createdAt: new Date().toISOString(),
      createdBy: metadata?.createdBy || 'unknown',
      storeNumber: metadata?.storeNumber || '',
      ...metadata,
    };

    await fs.writeFile(filePath + '.meta.json', JSON.stringify(meta, null, 2));
    if (content) {
      if (content.length > 27_000_000) {
        return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 413 });
      }
      await fs.writeFile(filePath, Buffer.from(content, 'base64'));
    }

    // 2. Also save reference to MC (if employee exists there)
    if (employeeId && typeof employeeId === 'string' && employeeId.length > 64) {
      return NextResponse.json({ error: 'employeeId too long' }, { status: 400 });
    }
    if (employeeId) {
      const apiKey = getMissionControlApiKey();
      try {
        if (apiKey) {
          await fetch(`${MC_URL}/api/internal/employee-documents`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey,
            },
            body: JSON.stringify({
              employee_id: employeeId,
              document_type: documentType,
              file_name: fileName,
              file_path: filePath,
              source: 'ro-tools',
              metadata: meta,
            }),
            signal: AbortSignal.timeout(10000),
          });
        }
      } catch (e) {
        console.error('[employees/documents] MC save failed (best-effort, internal save is primary):', e);
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Document saved',
      path: filePath,
      fileName: internalFileName,
    });
  } catch (err) {
    console.error('Document save error:', err);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = getSession(); // RT-150: proper token verification
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeName = searchParams.get('employee');

    await ensureDir(DOCS_DIR);

    if (employeeName) {
      // List docs for specific employee
      const safeName = employeeName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const empDir = path.join(DOCS_DIR, safeName);
      try {
        const files = await fs.readdir(empDir);
        const metaFiles = files.filter(f => f.endsWith('.meta.json'));
        const docs = await Promise.all(metaFiles.map(async f => {
          const content = await fs.readFile(path.join(empDir, f), 'utf8');
          return JSON.parse(content);
        }));
        docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        return NextResponse.json({ documents: docs });
      } catch (err) {
        console.error('[employees/documents] readdir error:', err);
        return NextResponse.json({ documents: [] });
      }
    }

    // List all employee folders
    const folders = await fs.readdir(DOCS_DIR).catch(() => []);
    const employees = [];
    for (const folder of folders) {
      const empDir = path.join(DOCS_DIR, folder);
      const stat = await fs.stat(empDir).catch(() => null);
      if (!stat?.isDirectory()) continue;
      const files = await fs.readdir(empDir).catch(() => []);
      const docCount = files.filter(f => f.endsWith('.meta.json')).length;
      if (docCount > 0) {
        employees.push({ name: folder.replace(/_/g, ' '), folder, documentCount: docCount });
      }
    }
    return NextResponse.json({ employees });
  } catch (err) {
    console.error('Document list error:', err);
    return NextResponse.json({ documents: [], employees: [] });
  }
}
