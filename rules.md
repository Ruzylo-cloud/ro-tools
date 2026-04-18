# RO Tools Rules

Last updated: 2026-04-18

## Branch And Deploy Rules

1. `main` is the only branch that should be treated as deployable for `ro-tools.app`.
2. Do not deploy from a dirty worktree.
3. Any manual Cloud Run deploy must be reflected back into Git and merged to `main`.

## Data Rules

1. Live RO Tools data stays in `gs://pcsbot-490004-ro-tools-data`, not in Git.
2. Generated documents, JSON state, logs, and exports do not belong in the repo.
3. If a new storage path is added, the backup/export path must be updated in the same change.

## Secret Rules

1. Secret values belong in Secret Manager or GitHub Actions secrets.
2. Never commit Google OAuth secrets, service account JSON, or internal API keys.

## Documentation Rules

1. Keep `memory.md`, `rules.md`, and `deploypipelineguide.md` current when deployment or storage changes.
2. If a restore would require an external credential or cloud resource, document it.
