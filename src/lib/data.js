import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

/**
 * Shared data file utilities with write locking and async I/O.
 * Prevents race conditions on concurrent file writes.
 */

const locks = new Map();

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Already exists
  }
}

function getFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

export function loadJsonFile(filename) {
  const filePath = getFilePath(filename);
  try {
    if (!fsSync.existsSync(filePath)) return {};
    return JSON.parse(fsSync.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

export async function loadJsonFileAsync(filename) {
  await ensureDataDir();
  const filePath = getFilePath(filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

/**
 * Atomically update a JSON file using read-modify-write with a simple lock.
 * `updater` receives the current data and returns the new data.
 * Uses async I/O to avoid blocking the event loop.
 */
export async function updateJsonFile(filename, updater) {
  // Simple async lock per file
  while (locks.get(filename)) {
    await new Promise(r => setTimeout(r, 10));
  }
  locks.set(filename, true);
  try {
    await ensureDataDir();
    const filePath = getFilePath(filename);
    let data = {};
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(content);
    } catch {
      data = {};
    }
    const updated = updater(data);
    // Atomic write: write to temp file, then rename
    const tmpPath = filePath + '.tmp';
    await fs.writeFile(tmpPath, JSON.stringify(updated, null, 2));
    await fs.rename(tmpPath, filePath);
    return updated;
  } finally {
    locks.delete(filename);
  }
}
