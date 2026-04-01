/**
 * Employee Documents API — dual save to internal storage + Google Drive.
 * POST: saves a generated document for an employee
 * GET: lists documents for an employee
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || '/data';
const DOCS_DIR = path.join(DATA_DIR, 'employee-documents');
const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch(e) {}
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('ro_session');
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { employeeName, employeeId, documentType, fileName, content, metadata } = body;

    if (!employeeName || !documentType || !fileName) {
      return NextResponse.json({ error: 'employeeName, documentType, fileName required' }, { status: 400 });
    }

    // 1. Save to internal storage (GCS volume)
    const safeName = employeeName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const empDir = path.join(DOCS_DIR, safeName);
    await ensureDir(empDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const internalFileName = `${documentType}_${timestamp}_${fileName}`;
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
      await fs.writeFile(filePath, Buffer.from(content, 'base64'));
    }

    // 2. Also save reference to MC (if employee exists there)
    if (employeeId) {
      try {
        await fetch(`${MC_URL}/api/employee-documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Dev-Key': DEV_KEY,
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
      } catch {
        // MC save is best-effort — internal save is primary
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
    const cookieStore = await cookies();
    const session = cookieStore.get('ro_session');
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
      } catch {
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
