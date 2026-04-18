# RO Tools Memory

Last updated: 2026-04-18

## Identity

- The `Ro-Tools` repo powers `ro-tools.app`.
- This repo is separate from `mission-control`, but the two systems share the same Google Cloud project and operational footprint.

## Production Topology

- Live service: Cloud Run `ro-tools`
- Project: `pcsbot-490004`
- Region: `us-central1`
- Persistent storage: `gs://pcsbot-490004-ro-tools-data`
- Mounted path in production: `/data`

## Persistence Model

- Server-side JSON state is stored in the GCS-mounted `/data` volume.
- Generated documents and other stored outputs also live in the mounted bucket.
- Secrets are injected from Secret Manager during deploy.
- The container filesystem is not durable and must not be treated as storage.

## Deploy Path

- Intended live deploy path is `.github/workflows/deploy.yml`.
- Push to `main` builds the image and deploys Cloud Run.
- Manual deploys are allowed only for emergencies and must be reflected back into Git immediately.

## Recovery Path

- Code recovery: private GitHub repo
- Data recovery: `gs://pcsbot-490004-ro-tools-data` or the 4-hour export snapshots in `gs://pcsbot-490004-platform-backups`
- Secret recovery: Secret Manager and GitHub Actions secrets

## External Dependencies

- Google OAuth client configuration
- Secret Manager values
- Cloud Run service configuration
- DNS / domain mapping for `ro-tools.app`
- Shared backup job that runs from the `mission-control` repo
