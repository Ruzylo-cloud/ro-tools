#!/usr/bin/env node
/**
 * RO-Tools comm bus — thin launcher for the canonical session-comm bus.
 *
 * The canonical implementation now lives at:
 *   /Users/chris/projects/mc-operator/scripts/session-comm.js
 *
 * It is a superset of the original RO-Tools comm bus (same port 3001, same
 * file-claim and event endpoints, plus sessions/heartbeats, deploy coordination,
 * alerts, SSE event stream, durable state, and backward-compat aliases for the
 * old `{agent, path}` / `{from_session}` request shapes).
 *
 * This stub preserves the original entry point (`node comm-bus.js`) so any
 * existing startup scripts, systemd units, or launchd plists keep working
 * without modification. All real logic is in the canonical file — edit there,
 * not here.
 *
 * Override location via COMM_BUS_CANONICAL if you relocate the canonical file.
 */
const path = require('path');

const CANONICAL = process.env.COMM_BUS_CANONICAL
  || '/Users/chris/projects/mc-operator/scripts/session-comm.js';

try {
  require(path.resolve(CANONICAL));
} catch (err) {
  process.stderr.write(
    `[comm-bus] Failed to load canonical bus at ${CANONICAL}\n` +
    `[comm-bus] ${err.message}\n` +
    `[comm-bus] Set COMM_BUS_CANONICAL to point at the current location.\n`
  );
  process.exit(1);
}
