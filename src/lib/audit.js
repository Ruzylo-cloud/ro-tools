import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const AUDIT_FILE = path.join(DATA_DIR, 'audit-log.json');

/**
 * Log an admin action for compliance tracking.
 */
export function logAdminAction({ actor, action, target, details }) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    let log = [];
    try {
      if (fs.existsSync(AUDIT_FILE)) {
        log = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      }
    } catch {
      log = [];
    }

    log.push({
      timestamp: new Date().toISOString(),
      actor,
      action,
      target,
      details,
    });

    // Keep last 10,000 entries
    if (log.length > 10000) {
      log = log.slice(-10000);
    }

    fs.writeFileSync(AUDIT_FILE, JSON.stringify(log, null, 2));
  } catch (err) {
    console.error('[Audit] Failed to write audit log:', err.message);
  }
}
