# RO Tools Deploy Pipeline Guide

Last updated: 2026-04-18

## Scope

This file covers the live deployment and recovery path for `ro-tools.app`.

## Source Of Truth

- Repo: `Ro-Tools`
- Live Cloud Run service: `ro-tools`
- Project: `pcsbot-490004`
- Region: `us-central1`
- Persistent data bucket: `gs://pcsbot-490004-ro-tools-data`

## Git To Live Flow

1. Make changes on a branch or worktree.
2. Commit and push to GitHub.
3. Merge to `main` only when the change is deployable.
4. GitHub Actions `.github/workflows/deploy.yml` runs on push to `main`.
5. The workflow authenticates to GCP, builds the Docker image, pushes it to GCR, and deploys Cloud Run.
6. Cloud Run creates a new revision and serves it behind `ro-tools.app`.

## What Persists Across Deploys

- GCS bucket contents in `pcsbot-490004-ro-tools-data`
- Secret Manager values used by the service
- Old Cloud Run revisions until they are cleaned up

## What Does Not Persist Inside The Container

- Anything written only to the container filesystem
- In-memory state
- Temporary files that were never copied to `/data`

## Backup Path

RO Tools data is included in the cross-platform backup job defined in the `mission-control` repo:

- Workflow: `mission-control/.github/workflows/platform-backups.yml`
- Output bucket: `gs://pcsbot-490004-platform-backups`
- Snapshot type: tarball export of `gs://pcsbot-490004-ro-tools-data`
- Retention: 72 hours

## Recovery And Migration

To move `ro-tools.app` to a new platform you need:

1. This repo
2. Google OAuth secrets
3. The RO Tools data bucket or one of its backup tarballs
4. DNS control for `ro-tools.app`
5. Equivalent runtime configuration for the new platform

GitHub alone is not enough because the live application data is intentionally stored in GCS, not in the repo.
