import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

/**
 * Shared data file utilities with write locking.
 * Prevents race conditions on concurrent file writes.
 */

const locks = new Map();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

export function loadJsonFile(filename) {
  ensureDataDir();
  const filePath = getFilePath(filename);
  try {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * Atomically update a JSON file using read-modify-write with a simple lock.
 * `updater` receives the current data and returns the new data.
 */
export async function updateJsonFile(filename, updater) {
  // Simple async lock per file
  while (locks.get(filename)) {
    await new Promise(r => setTimeout(r, 10));
  }
  locks.set(filename, true);
  try {
    ensureDataDir();
    const filePath = getFilePath(filename);
    let data = {};
    try {
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {
      data = {};
    }
    const updated = updater(data);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    return updated;
  } finally {
    locks.delete(filename);
  }
}
