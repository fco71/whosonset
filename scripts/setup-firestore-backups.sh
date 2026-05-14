#!/usr/bin/env bash
#
# Configures native, managed Firestore backups for the WhosOnSet production
# database (`my-film-jobs`). Run this ONCE; the schedule then runs server-side
# in GCP and survives without anyone's laptop being on.
#
# What this does:
#   1. Enables Point-in-Time Recovery (PITR) — 7-day rolling window, any point
#      in time can be restored. Cheap insurance for "oops, I deleted a doc".
#   2. Creates a weekly scheduled backup with 14-week retention (the maximum
#      for weekly cadence). Backups run Sunday early-morning UTC.
#
# Requirements:
#   - `gcloud` CLI installed and authenticated as a user with
#     `roles/datastore.owner` (or equivalent) on the my-film-jobs project.
#   - Project must be on the Firebase Blaze (pay-as-you-go) plan. Managed
#     backups + PITR are paid features; pricing is per GB of storage and is
#     usually a few cents/month for a small DB.
#
# Safety:
#   - Idempotent: if PITR is already on or a weekly schedule already exists,
#     the script reports it and moves on without erroring.
#   - Read-only against actual Firestore data. Only touches DB configuration.
#
# To restore from a backup later:
#   gcloud firestore backups list --location=us-central1 --project=my-film-jobs
#   gcloud firestore databases restore \
#       --source-backup=<backup-name> \
#       --destination-database=<new-db-id> \
#       --project=my-film-jobs
#   (Restores to a NEW database, then you switch the app over. Never restores
#    in-place over a live DB.)

set -euo pipefail

PROJECT="my-film-jobs"
DATABASE="(default)"
LOCATION="${FIRESTORE_LOCATION:-us-central1}"   # override via env if your DB lives elsewhere

echo "=== WhosOnSet Firestore backup setup ==="
echo "Project: $PROJECT"
echo "Database: $DATABASE"
echo "Location: $LOCATION"
echo

if ! command -v gcloud >/dev/null 2>&1; then
  echo "ERROR: gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install" >&2
  exit 1
fi

active_account="$(gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null || true)"
if [ -z "$active_account" ]; then
  echo "ERROR: no active gcloud account. Run: gcloud auth login" >&2
  exit 1
fi
echo "Active gcloud account: $active_account"
echo

# --- Confirm the DB actually lives in $LOCATION ---
actual_location="$(gcloud firestore databases describe \
  --database="$DATABASE" \
  --project="$PROJECT" \
  --format='value(locationId)' 2>/dev/null || true)"

if [ -z "$actual_location" ]; then
  echo "ERROR: could not describe database '$DATABASE' in project '$PROJECT'." >&2
  echo "Check your gcloud auth and project access." >&2
  exit 1
fi

if [ "$actual_location" != "$LOCATION" ]; then
  echo "NOTE: database is in '$actual_location', not '$LOCATION'. Using actual location."
  LOCATION="$actual_location"
fi
echo "Confirmed database location: $LOCATION"
echo

# --- 1. Enable PITR (7-day rolling continuous recovery) ---
echo "[1/2] Enabling Point-in-Time Recovery..."
pitr_state="$(gcloud firestore databases describe \
  --database="$DATABASE" \
  --project="$PROJECT" \
  --format='value(pointInTimeRecoveryEnablement)' 2>/dev/null || true)"

if [ "$pitr_state" = "POINT_IN_TIME_RECOVERY_ENABLED" ]; then
  echo "    PITR already enabled. Skipping."
else
  gcloud firestore databases update \
    --database="$DATABASE" \
    --project="$PROJECT" \
    --enable-pitr
  echo "    PITR enabled."
fi
echo

# --- 2. Create weekly backup schedule (14-week retention, max for weekly) ---
echo "[2/2] Creating weekly backup schedule (14-week retention, Sundays)..."
existing_weekly="$(gcloud firestore backups schedules list \
  --database="$DATABASE" \
  --project="$PROJECT" \
  --format='value(name)' \
  --filter='weeklyRecurrence.day=SUNDAY' 2>/dev/null || true)"

if [ -n "$existing_weekly" ]; then
  echo "    Weekly Sunday schedule already exists: $existing_weekly"
  echo "    Skipping creation. To replace, delete it first with:"
  echo "      gcloud firestore backups schedules delete '$existing_weekly' --database='$DATABASE' --project='$PROJECT'"
else
  gcloud firestore backups schedules create \
    --database="$DATABASE" \
    --project="$PROJECT" \
    --recurrence=weekly \
    --retention=14w \
    --day-of-week=SUN
  echo "    Weekly schedule created."
fi
echo

echo "=== Done ==="
echo
echo "Verify with:"
echo "  gcloud firestore backups schedules list --database='$DATABASE' --project='$PROJECT'"
echo
echo "The first scheduled backup will appear on the next Sunday."
echo "You can also trigger an on-demand backup any time with:"
echo "  gcloud firestore backups create --database='$DATABASE' --project='$PROJECT' --retention=4w"
