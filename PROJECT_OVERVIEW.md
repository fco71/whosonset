---
title: WhosOnSet — Project Overview
last_reviewed: 2026-05-14
status: living document — all reviews and plans go here
---

# WhosOnSet — Project Overview

A React 18 + TypeScript + Firebase social/jobs platform for the film industry. Bundled with Webpack, deployed to Firebase Hosting + Cloud Functions + Firestore + Storage.

## ⚠️ Data safety — read first

This is a **live production site with real personal user data in Firestore**. The owner has stated explicitly that lost data is irrecoverable. Treat this as a hard guardrail:

- **Never** run a destructive Firestore command (mass delete, schema migration, collection drop) without explicit, scoped approval *in the current conversation*.
- The two parallel project collections (`Projects/` capital P, `projects/` lowercase) are **both live with real readers** — see P0 #6 below. Treat both as untouchable until a proper migration plan is approved.
- Code-only changes (UI, services, build, docs, dead-code, route gating) are fair game without per-change approval — the guardrail is specifically about Firestore data.
- The existing JSON-dump backup scripts (`backup-firestore*.sh`, `scripts/backup-firestore-simple.cjs`) are **unsafe as a backup of record**: they only cover a hardcoded subset of collections and **miss `Projects/` capital-P, `jobPostings`, `blogPosts`, `directMessages`**, plus all subcollections. They are usable as ad-hoc snapshots but cannot be trusted to fully restore the database. Once the managed schedule below is set up, these should be archived or deleted.

### Backup setup — done 2026-05-14

Three layers of protection on the `my-film-jobs` Firestore `(default)` database, location `nam5`:

| Layer | What it covers | Status |
|-------|----------------|--------|
| **PITR** (Point-in-Time Recovery) | Continuous restore to any second within the last 7 days. Recovers from accidental writes/deletes. | ✅ enabled (`pointInTimeRecoveryEnablement: POINT_IN_TIME_RECOVERY_ENABLED`) |
| **Weekly scheduled backups** | Server-side snapshot every Sunday, 14-week retention. Survives DB deletion. | ✅ scheduled (Sunday weekly recurrence, retention 8467200s) |
| **Delete protection** | Prevents the database itself from being dropped. | ✅ enabled (`deleteProtectionState: DELETE_PROTECTION_ENABLED`) |

The setup ran via `scripts/setup-firestore-backups.sh` (idempotent — safe to re-run). The first weekly backup lands the next Sunday after 2026-05-14; PITR already covers everything up to right now.

**Note about on-demand backups:** `gcloud firestore backups create` does not exist; on-demand snapshots aren't available in the managed-backups API. If you ever need an extra ad-hoc backup, options are (a) wait for the next Sunday scheduled run, (b) add a daily schedule temporarily, or (c) use the older `gcloud firestore export` to dump to a GCS bucket. For most data-loss scenarios, PITR is the answer.

**To verify** later:

```sh
gcloud firestore backups schedules list --database='(default)' --project=my-film-jobs
```

**To trigger an on-demand backup** any time:

```sh
gcloud firestore backups create --database='(default)' --project=my-film-jobs --retention=4w
```

**To restore** from a backup (always restores to a NEW database, then you switch the app over — never in-place):

```sh
gcloud firestore backups list --location=<region> --project=my-film-jobs
gcloud firestore databases restore \
    --source-backup=<backup-name> \
    --destination-database=<new-db-id> \
    --project=my-film-jobs
```

## Stack snapshot

- **Frontend**: React 18.2, react-router 6.22, TailwindCSS 3.4 + SCSS modules, Framer Motion, i18next, react-toastify + react-hot-toast (two toast libs)
- **State / data**: Firebase JS SDK 11.7, react-firebase-hooks, React Context (`AuthContext`, `ProjectContext`)
- **Backend**: Firebase Cloud Functions (Node, v2 SDK) — `functions/src/` (3 source files + email service)
- **Storage / DB**: Firestore + Firebase Storage (rules in `firestore.rules`, `storage.rules`)
- **Build**: custom Webpack 5 (`webpack.config.cjs`) + Babel — no CRA / Vite app shell
- **Tests**: Vitest configured (`vitest.config.ts`); Jest also configured (`jest.config.mjs`); only ~2 actual test files exist
- **Auth**: Firebase Auth (email/password + reset flow)
- **Email**: Cloud Function calling Gmail SMTP (`functions/src/emailService.ts`)
- **Misc**: PDF rendering (react-pdf + pdfjs-dist), drag-and-drop (react-beautiful-dnd — unmaintained), Recharts, dual icon libs (lucide-react + react-icons)

## Top-level shape

```
src/
  components/     67 flat files, some feature subfolders (Chat, Collaboration, TaskManager, GanttChart, Analytics, Blog, JobSearch, Social, Networking, …)
  pages/          39 files including DebugJobsPage, *TestPage, test-task-manager
  contexts/       AuthContext, ProjectContext
  services/       3 files only (ProjectCrewService, blogService, api/jobService)
  utilities/      30+ files — mixes pure utils with full services (socialService, messagingService, emailNotificationService, jobApplicationService, …)
  hooks/          2 files (useBlobUrl, useNotifications)
  models/         Project, User
  router.tsx, firebase.ts, App.tsx
functions/        Cloud Functions (src/ + dist/ + lib/) + stray backup JSONs at root
scripts/          Seed / backfill / backup scripts (mix of .js, .ts, .cjs)
```

Documentation: 28 markdown files at repo root (HANDOFF.md alone is 47 KB).

---

# Review & Suggestions — 2026-05-14

> Findings only. Nothing has been implemented. Confirm the priorities you want before any changes are made.

## P0 — Repository hygiene & security

These are not stylistic; they cost the repo size, leak credentials, or pollute history.

### Done 2026-05-14

- ✅ **#1 `node_modules/` untracked.** `git rm --cached -r node_modules` removed 13,135 files from the index. `.gitignore` already covered it; files stay on disk. Devs must `npm install` (or `npm ci`) for a working environment. **Repo history still contains `node_modules`** — see "Open" below if you want to scrub history to shrink the clone.
- ✅ **#2 `.env` untracked** (live keys still on disk). **History is NOT scrubbed** — keys remain in past commits. See "Open" below.
- ✅ **#3 `.DS_Store` + `.fuse_hidden*` untracked**; `.gitignore` now lists `**/.DS_Store` and `.fuse_hidden*`.
- ✅ **#4 `.tsx.backup` files** — handled as part of P1.
- ✅ **#7 `functions/crewProfiles-backup-*.json` untracked**; `functions/.gitignore` now ignores `*-backup-*.json`.

### Done 2026-05-14 (continued)

- ✅ **#5 `storage.rules` tightened**: `screenplays/` and `project-documents/` are now `read: if request.auth != null` (were `if true`). Verified consumers (`ScreenplayViewer`, `CollaborationPage`, `ProjectDocuments`, `ProjectDashboard`) are all behind `ProtectedRoute`, so no logged-out flow breaks. **You still need to deploy the rules** (`firebase deploy --only storage:rules`) for this to take effect on production.

### Open — needs follow-up

- ⚠️ **#6 The two project collections are BOTH live, not a "legacy" duplicate.** This is a half-finished schema migration:
  - **`Projects/` (capital P)** — schema uses `owner_uid`. Read/written by the **core project flow**: `AllProjects.tsx`, `ProjectDetail.tsx`, `ProjectsPage.tsx`, `MyProjectsPage.tsx`, `AddProject.tsx`, `AuthContext.tsx`, `Home.tsx`, `highlightUtils.ts`. Rule at `firestore.rules:169`.
  - **`projects/` (lowercase)** — schema uses `createdBy`. Read/written by **newer modules**: `Networking/NetworkingHub.tsx`, `ProjectManagement/ProjectDashboard.tsx`. Rule at `firestore.rules:38`.
  - **Do not delete either rule** — both have live data and live readers. A proper migration needs: (1) decide canonical collection (lowercase is conventional Firestore), (2) backfill docs from one to the other unifying `owner_uid`/`createdBy`, (3) migrate code, (4) drop the old rule. **This is a multi-day project, not a cleanup.**

- ⚠️ **#2 follow-up — `.env` key rotation (manual action required).** Decision: rotate, leave history alone. Steps for you to run (I cannot do these — they need Firebase console access):
  1. Firebase Console → Project Settings → General → Web API key → regenerate.
  2. Update local `.env` with new keys.
  3. Update production secrets if they're stored anywhere else (Vercel/Firebase Hosting env, Cloud Function secrets via `firebase functions:secrets:set`).
  4. The old key in git history is now invalid even if someone finds it.
  5. (Optional later) restrict the new key to your domains in Google Cloud Console → Credentials.

- ℹ️ Other clutter still in `functions/` root (not blocking): `fix-crew-photos.js`, `test-email.js` — one-off scripts. Move to `scripts/` if still useful, else delete.

## P1 — Dead / duplicate code  ✅ done 2026-05-14

Burns mental load, hides bugs, inflates bundle.

**Deleted** (no callers anywhere in repo):
- `src/pages/SocialPage.new.tsx`, `src/pages/SocialPage.v2.tsx`
- `src/utilities/socialService.new.ts`
- `src/components/ProjectDetail.tsx.backup`, `src/components/Collaboration/CollaborationHub.tsx.backup`
- `src/pages/TestBanner.tsx`, `src/pages/test-task-manager.tsx`

**Gated to `NODE_ENV === 'development'`** in `router.tsx` (mirrors the existing `DebugJobsPage` pattern; routes no longer exist in production builds):
- `SimpleEmailTestPage` (`/email-test`)
- `EmailIntegrationTestPage` (`/email-integration-test`)
- `PasswordResetTestPage` (`/password-reset-test`)

**Deferred — needs follow-up work:**
- `src/utilities/socialService.v2.ts` is still referenced by `src/components/Chat/ChatTestPage.tsx`, which is the **production `/chat` route handler** despite the misleading filename. So `socialService.v2.ts` is NOT dead. Future cleanup: rename `ChatTestPage` → `ChatPage`, then diff `socialService.ts` vs `.v2` and either migrate `ChatTestPage` to the canonical service or rename `.v2` to be the canonical one. This is a non-trivial refactor; out of scope for the P1 hygiene sweep.

## P2 — Code organization

- **`src/services/` vs `src/utilities/` is inconsistent.** `src/services/` has 3 files; meanwhile `utilities/` contains `socialService.ts`, `messagingService.ts`, `emailNotificationService.ts`, `jobApplicationService.ts`, `savedJobsService.ts`, `userPreferencesService.ts`, `favoritesService.ts`, `crewFavoritesService.ts`, `jobMatchingService.ts`. Pick one home for services and move them.
- **`src/components/` is 67 flat files** mixing page-level (`Home.tsx`, `Layout.tsx`, `Auth.tsx`, `LandingPage.tsx`) with leaf components. Suggestion: group by feature (the partial subfolders already hint at it) or by kind (`layout/`, `ui/`, `features/<name>/`).
- **`src/pages/` has 39 files** with multiple naming styles (PascalCase + `test-task-manager.tsx`). Consolidate.
- ✅ **Two toast libraries** (done 2026-05-14): `react-hot-toast` was used in 34 files vs `react-toastify` in 2 — kept the popular one. Migrated `ScreenplayViewer.tsx` and `PostJobPage.tsx` to `react-hot-toast`; removed `react-toastify` + `@types/react-toastify` from `package.json`. Discovered while migrating: **the two `react-toastify` call sites had been silently failing** because no `<ToastContainer />` was ever mounted in the app — those success/error toasts simply never appeared. After migration they actually render (via the existing `<Toaster />` in `App.tsx`). One `toast.info(...)` call in `ScreenplayViewer.tsx` was rewritten to `toast(...)` because react-hot-toast has no `.info` method.
- ✅ **Two icon libraries**: `lucide-react` (55 imports) + `react-icons` (2 imports). Done 2026-05-14: dropped `react-icons` from `package.json`; removed dead Fa-icon import in `CrewProfileCard.tsx`; swapped `FiChevronDown` → `ChevronDown` and `FiCheck` → `Check` (both from `lucide-react`) in `src/components/ui/Select.tsx`. Type-check clean.

## P3 — Build / config

- ✅ **Two Babel configs** (done 2026-05-14): `babel.config.json` was dead (Babel loads `.js` first), with plugins (`lodash`, `transform-react-remove-prop-types`, `plugin-transform-runtime`) that were never running. Deleted the JSON config and removed the three orphaned plugins from devDeps. `babel.config.js` (the active one) is unchanged.
- ✅ **Two test runners configured** (done 2026-05-14): deleted `jest.config.mjs` and the Jest-only devDeps (`jest`, `babel-jest`, `@types/jest`, `identity-obj-proxy`). Vitest remains as the sole runner. Note: the 2 existing test files (`socialService.test.ts`, `TaskCard.test.tsx`) **fail under Vitest already** — pre-existing issue, separate from this cleanup; logged under P5.
- ⏳ **`tsconfig.json` strict migration** — in progress, staged:
  - ✅ 2026-05-14 pass 1: enabled `alwaysStrict`, `noImplicitThis`, `strictBindCallApply`, `strictFunctionTypes`, `useUnknownInCatchVariables`, `noImplicitAny`. 35 errors found and fixed (mostly Firestore-write object literals annotated `: any` with `TODO` comments, plus a few callback parameter annotations).
  - ⏳ pass 2 (pending): enable `strictNullChecks` — recon shows ~63 errors. Bigger lift; catches real null/undefined bugs.
  - ⏳ pass 3 (pending): enable full `strict: true` (adds `strictPropertyInitialization`, requires `strictNullChecks` first).
- **`pdfjs-dist@^2.16.105` is from 2021**. `react-pdf@5` + pdfjs-dist v2 is a known fragile combo. Either pin compatibility carefully or upgrade both together.
- **`react-beautiful-dnd@^13.1.1` is unmaintained** (since 2022). Used in `JobApplicantsPage.tsx`, `TaskManager/TaskCard.tsx`, `TaskManager/KanbanView.tsx`. Replace with `@dnd-kit/core` (modern, maintained) before it breaks against React 19.

## P4 — Documentation ✅ done 2026-05-14

- ✅ **`README.md`** rewritten with stack, setup, commands, layout, data-safety pointer, and pointers to PROJECT_OVERVIEW.md / DESIGN_SYSTEM.md / docs/deployment/DEPLOYMENT_GUIDE.md.
- ✅ **Root cleaned up**: 26 stale top-level `*.md`/`*.txt` files relocated into `docs/` subgroups (`deployment/`, `email/`, `firebase/`, `features/`, `testing/`, `status/`, `handoffs/`, `misc/`). Root now keeps only `README.md`, `PROJECT_OVERVIEW.md`, `DESIGN_SYSTEM.md`, and `env-template.txt`.
- **`HANDOFF.md` (47 KB)** moved to `docs/handoffs/`. Not pruned — still stale and worth archiving with a date in the filename if you want history.

## P5 — Testing

- Only ~2 test files in the repo (`socialService.test.ts`, `TaskCard.test.tsx`); coverage near zero. **Both fail under Vitest** (TaskCard: `useState` errors suggesting React/test-renderer mismatch; socialService: collection-level failure). Pre-existing — discovered during P3 verification on 2026-05-14.
- Decide: is testing a goal? If yes: (a) fix the two existing tests first, (b) then add baseline smoke tests for 5 critical paths (auth, project create, social follow, job apply, message send). If not, remove the test files + Vitest scaffolding so it isn't a false signal.

---

## Suggested order of attack (when you're ready)

1. **Hygiene sweep** (P0 #1–#4 + P1 dead files) — single PR, big repo-size + clarity win, low risk.
2. **Storage rules + duplicate Firestore collection** (P0 #5–#6) — needs data investigation; do this with intent before any UX change.
3. **Pick one toast lib + drop `react-icons`** (P2 small wins) — quick.
4. **Babel/Jest config cleanup** (P3) — quick.
5. **Replace `react-beautiful-dnd`** (P3) — bigger; do before React 19 upgrade.
6. **Service/component reorganization** (P2) — biggest churn; do after dead code is gone.
7. **Docs sweep + README rewrite** (P4) — last, once the shape is stable.

## Open questions for the user

- Is `Projects` (capital P) collection actively written to, or legacy from an old schema? Decides #6.
- Are `screenplays/` and `project-documents/` storage buckets meant to be public? Decides #5.
- Is Jest kept around for a specific reason (a tool that only runs against Jest)? Decides P3 test-runner cleanup.
- Are the `Debug*` / `*Test*` pages reachable from the deployed app, or only used locally?
