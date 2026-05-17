---
title: WhosOnSet — Project Overview
last_reviewed: 2026-05-14
status: living document — all reviews and plans go here
---

## Session log

### 2026-05-14 (latest agent pass)

**Done this session** (all code-only, no Firestore writes — safe to commit as one batch):

1. **P0 functions/ cleanup.** Staged: `functions/fix-crew-photos.js` → `scripts/fix-crew-photos.js` (rename), `functions/test-email.js` (delete). The deleted file had a hardcoded Gmail app password — see ⚠️ rotation note below.
2. **P0 storage.rules verified** on disk (`screenplays/` and `project-documents/` are auth-only). **Not yet deployed** — `firebase` CLI is not in the sandbox; user must run `firebase deploy --only storage:rules` from their machine.
3. **P3 tsconfig pass 2 — `strictNullChecks: true`.** Recon said ~63 errors; reality was 13. All fixed across 7 files (ProjectDashboard, ChatTestPage, NotificationCenter, AuthContext, EmailVerificationPage, SavedCrewProfilesPage, ProjectCrewService, conversionTracking). Surface includes 3 real bugs (TS2783 duplicate-key overwrites). Full typecheck (`npx tsc --noEmit`) is clean.
4. **P3 tsconfig pass 3 — full `strict: true`.** Collapsed all granular flags to `strict: true`. `strictPropertyInitialization` surfaced 0 errors (functional-components codebase). **Strict-mode migration COMPLETE.**
5. **P3 `react-beautiful-dnd` → `@dnd-kit/core`.** Migrated all 3 call sites (`JobApplicantsPage`, `TaskManager/KanbanView`, `TaskManager/TaskCard`). Removed `react-beautiful-dnd` + types from `package.json`. Installed only `@dnd-kit/core` (sortable+utilities tried then uninstalled — unused). Found and **fixed a pre-existing latent bug** in `TaskManager/KanbanView`: cards were never actually draggable because `index` was never passed to `TaskCard`. Typecheck clean. **Needs a quick visual smoke test** — drag a card in JobApplicants Kanban and in a Project TaskManager Kanban.
6. **P1 `ChatTestPage` → `ChatPage` rename.** File, component identifier, default export, lazy import in `router.tsx`, and JSX usage all updated. `/chat` route handler now has a non-misleading name. Typecheck clean. **`socialService.v2.ts` reconcile remains deferred** — the two services use different profile types (`CrewProfile` vs `SocialUser`); merging is a design call, not a sweep. See P1 deferred section for details.
7. **P5 testing decision.** Prior agent's "both tests fail" claim was misleading. `socialService.test.ts` was not a real test — deleted. `TaskCard.test.tsx`: 1 of 5 assertions had a wrong Radix Tooltip query — fixed. Added `.claude/**` to vitest `exclude` so it stops running tests from throwaway worktrees. `npx vitest run` now passes **5/5**.
8. **P3 `react-pdf` v5 → v10, drop standalone `pdfjs-dist`.** Removed the version-skew root cause (project had `pdfjs-dist@2` while react-pdf@5 bundled `pdfjs-dist@2.12.313`). Now react-pdf@10 brings `pdfjs-dist@5` as a transitive dep, and nothing in `src/` imports `pdfjs-dist` directly. Worker URL switched to `.mjs` (v5 ESM-only). Typecheck + production build both clean. **Visual smoke test needed** — render a screenplay PDF + a project document PDF.
9. **P2 services consolidation.** Moved 11 `*Service.ts` files from `src/utilities/` to `src/services/`, rewrote 39 importers, fixed 3 cross-folder edges. Typecheck + tests + production build all clean. Affects ~52 files in one commit.
10. **Dead-code sweep.** Audited every file in `src/services/` and `src/utilities/` for both static and dynamic imports + string-name references in `src/`, `functions/`, `scripts/`, build configs. Deleted 4 files with zero references:
    - `src/services/userPreferencesService.ts`
    - `src/utilities/collectionsHelpers.ts`
    - `src/utilities/consoleFilter.ts` (plus the dead `// import './utilities/consoleFilter';` comment in `src/index.tsx`)
    - `src/utilities/notificationTriggers.ts`
    Typecheck + tests + production build all clean.

**Outstanding manual actions** (need human / Firebase console):

- Rotate the Firebase Web API key (P0 #2 follow-up — pre-existing).
- Rotate the leaked Gmail app password `[REDACTED_GMAIL_APP_PASSWORD]` on `iam@myfilmjobs.com` (new this session). Update `firebase functions:secrets:set GMAIL_APP_PASSWORD` and redeploy `functions`.
- Deploy storage rules: `firebase deploy --only storage:rules`.
- Review and commit staged changes from this session.

**Suggested next focus** (when picking up):

- **Visual smoke test** the dnd-kit migration: drag a card in JobApplicants Kanban (`/jobs/<jobId>/applicants` → Kanban tab) and in a project's TaskManager Kanban. Confirm cards reorder/restatus and Firestore writes happen.
- **socialService v1 vs v2 reconcile** (needs user decision on canonical profile type).
- **P2 Service/component reorganization**: pick one home for services (`src/services/` vs `src/utilities/`), regroup `src/components/` (67 flat files) by feature.
- **P3 upgrades**: `pdfjs-dist@^2.16.105` (2021) + `react-pdf@5` together; React 18 → 19.
- **P5 testing decision**: fix the two existing failing test files, or remove the Vitest scaffolding to stop the false signal.
- **P0 #6** dual-Projects-collection migration (multi-day; needs user decision on canonical schema first).

---

# WhosOnSet — Project Overview

A React 18 + TypeScript + Firebase social/jobs platform for the film industry. Bundled with Webpack, deployed to Firebase Hosting + Cloud Functions + Firestore + Storage.

## ⚠️ Before every local/manual build / fresh checkout

The `.env` file is not in git. It must exist on disk at the repo root before a local/manual `npm run build`, otherwise `dotenv-webpack` injects `undefined` for all `REACT_APP_FIREBASE_*` keys and the built site dies with `auth/invalid-api-key`. GitHub Actions production deploys write `.env` from repository secrets before building.

**Symptoms of a missing `.env`:**
- `dist/main.*.js` has no `AIzaSy...` string in it
- Deployed site throws `FirebaseError: Firebase: Error (auth/invalid-api-key)` on first load

**Procedure for any fresh checkout / new worktree / new machine running local builds:**
1. Copy `.env` over from a working install, or rebuild it from `env-template.txt`.
2. Verify with `grep -c AIza dist/main.*.js` after `npm run build` — should print `1`, not `0`.

**Incident 2026-05-14:** committing `git rm --cached .env` in a branch and then fast-forward merging it into `main` caused git to delete `.env` from `main`'s working tree (correct git behavior, since the file had been "tracked", became "deleted", and your local copy matched HEAD so git didn't preserve it). A subsequent prod deploy shipped a bundle with no API key. Resolution: copied `.env` back from the worktree, rebuilt, redeployed.

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

- ✅ **#5 `storage.rules` tightened**: `screenplays/` and `project-documents/` are now `read: if request.auth != null` (were `if true`). Verified consumers (`ScreenplayViewer`, `CollaborationPage`, `ProjectDocuments`, `ProjectDashboard`) are all behind `ProtectedRoute`, so no logged-out flow breaks. **Still needs deploy** — confirmed in `storage.rules` on disk 2026-05-14, but `firebase` CLI is not in the sandbox PATH, so the deploy must be run from your machine:
  ```sh
  firebase deploy --only storage:rules
  ```

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

- ✅ **`functions/` root clutter cleaned up 2026-05-14**:
  - `functions/fix-crew-photos.js` → moved to `scripts/fix-crew-photos.js` (staged, not yet committed). Useful as a reference for future Firestore REST scripts using the Firebase CLI's stored OAuth.
  - `functions/test-email.js` → **deleted** (staged, not yet committed). It was a standalone Nodemailer ping script with a **hardcoded Gmail app password** (`[REDACTED_GMAIL_APP_PASSWORD]`) for `iam@myfilmjobs.com`. The real implementation lives in `functions/src/emailService.ts`.
  - ⚠️ **Manual action required — rotate that Gmail app password.** It exists in git history. Steps: Google Account → Security → 2-Step Verification → App passwords → revoke the leaked one and generate a new one. Then update the Cloud Function secret (`firebase functions:secrets:set GMAIL_APP_PASSWORD`) and redeploy `functions`. Add to the same checklist as the Firebase Web API key rotation.

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
- ✅ **Mechanical rename done 2026-05-14**: `src/components/Chat/ChatTestPage.tsx` → `src/components/Chat/ChatPage.tsx`; component name + default export renamed; router import + JSX usage updated. Typecheck clean.
- ⏳ **`socialService.ts` vs `socialService.v2.ts` reconcile — still deferred.** On investigation in 2026-05-14 these are not just versions of the same code; they're two parallel implementations with **different type models**:
  - `socialService.ts` (1040 lines): comprehensive social features (follow requests, notifications, likes, comments, activity feed with its own cache + email-notification integration), returns `CrewProfile` types throughout.
  - `socialService.v2.ts` (492 lines): leaner; focused on follows with explicit `FollowStatus` typing and its own profile cache, returns `SocialUser` types. Adds a `getProfile(userId)` method that v1 does not have.
  - `ChatPage.tsx` uses exactly one method from v2: `SocialService.getProfile`. A safe merge requires deciding the canonical profile type (`SocialUser` vs `CrewProfile`) and migrating downstream consumers — it's a design call, not a sweep. **Out of scope for unsupervised refactoring.**
  - Recommended next step for this item: ask the user which type model is canonical going forward, then port `getProfile` (or its equivalent) into the canonical service and delete the other.

## P2 — Code organization

- ✅ **`src/services/` consolidation done 2026-05-14.** Moved 11 `*Service.ts` files from `src/utilities/` to `src/services/` via `git mv` (preserves history): `crewFavoritesService`, `emailNotificationService`, `favoritesService`, `fileUploadService`, `jobApplicationService`, `jobMatchingService`, `messagingService`, `savedJobsService`, `socialService`, `socialService.v2`, `userPreferencesService`. Bulk-rewrote 39 importer files (`from '…/utilities/<svc>'` → `from '…/services/<svc>'`) via per-service `sed`. Fixed 3 cross-folder edges that the bulk pass missed:
  - `services/socialService.ts`: `./userUtils` → `../utilities/userUtils`
  - `services/jobApplicationService.ts`: `./firebaseConnectionManager` → `../utilities/firebaseConnectionManager`
  - `utilities/notificationTriggers.ts`: `./emailNotificationService` → `../services/emailNotificationService`
  Verified clean: `npx tsc --noEmit` ✓, `npx vitest run` 5/5 ✓, `npm run build` ✓.
  Note: `userPreferencesService.ts` had 0 importers — possibly dead code, kept it (move, don't delete) so a follow-up can decide.
- **`src/components/` is 67 flat files** mixing page-level (`Home.tsx`, `Layout.tsx`, `Auth.tsx`, `LandingPage.tsx`) with leaf components. Suggestion: group by feature (the partial subfolders already hint at it) or by kind (`layout/`, `ui/`, `features/<name>/`).
- **`src/pages/` has 39 files** with multiple naming styles (PascalCase + `test-task-manager.tsx`). Consolidate.
- ✅ **Two toast libraries** (done 2026-05-14): `react-hot-toast` was used in 34 files vs `react-toastify` in 2 — kept the popular one. Migrated `ScreenplayViewer.tsx` and `PostJobPage.tsx` to `react-hot-toast`; removed `react-toastify` + `@types/react-toastify` from `package.json`. Discovered while migrating: **the two `react-toastify` call sites had been silently failing** because no `<ToastContainer />` was ever mounted in the app — those success/error toasts simply never appeared. After migration they actually render (via the existing `<Toaster />` in `App.tsx`). One `toast.info(...)` call in `ScreenplayViewer.tsx` was rewritten to `toast(...)` because react-hot-toast has no `.info` method.
- ✅ **Two icon libraries**: `lucide-react` (55 imports) + `react-icons` (2 imports). Done 2026-05-14: dropped `react-icons` from `package.json`; removed dead Fa-icon import in `CrewProfileCard.tsx`; swapped `FiChevronDown` → `ChevronDown` and `FiCheck` → `Check` (both from `lucide-react`) in `src/components/ui/Select.tsx`. Type-check clean.

## P3 — Build / config

- ✅ **Two Babel configs** (done 2026-05-14): `babel.config.json` was dead (Babel loads `.js` first), with plugins (`lodash`, `transform-react-remove-prop-types`, `plugin-transform-runtime`) that were never running. Deleted the JSON config and removed the three orphaned plugins from devDeps. `babel.config.js` (the active one) is unchanged.
- ✅ **Two test runners configured** (done 2026-05-14): deleted `jest.config.mjs` and the Jest-only devDeps (`jest`, `babel-jest`, `@types/jest`, `identity-obj-proxy`). Vitest remains as the sole runner. Note: the 2 existing test files (`socialService.test.ts`, `TaskCard.test.tsx`) **fail under Vitest already** — pre-existing issue, separate from this cleanup; logged under P5.
- ⏳ **`tsconfig.json` strict migration** — in progress, staged:
  - ✅ 2026-05-14 pass 1: enabled `alwaysStrict`, `noImplicitThis`, `strictBindCallApply`, `strictFunctionTypes`, `useUnknownInCatchVariables`, `noImplicitAny`. 35 errors found and fixed (mostly Firestore-write object literals annotated `: any` with `TODO` comments, plus a few callback parameter annotations).
  - ✅ 2026-05-14 pass 2: enabled `strictNullChecks`. Recon said ~63 errors; actual surface was **13** (the pass-1 cleanup must have eliminated most of the projected null-check issues). All 13 fixed:
    - `src/pages/ProjectManagement/ProjectDashboard.tsx` — added `|| !projectId` to the render guard so `projectId` (from `useParams`) narrows to `string` for the 5 child-component props.
    - `src/components/Chat/ChatTestPage.tsx` — `initialSelectedUser` (which is `string | null` from `URLSearchParams.get`) coerced with `?? undefined` to match the prop type.
    - `src/components/NotificationCenter.tsx` — `markConversationAsRead(currentUser?.uid, …)` was passing `string | undefined`. Now guarded with `&& currentUser?.uid` and the values are captured into local `const`s so TS doesn't widen them inside the dynamic-import `.then`.
    - `src/contexts/AuthContext.tsx` — `userToDelete = auth.currentUser` (which is `User | null`) was widening `userToDelete`. Captured into a local `const refreshedUser`, null-checked, then assigned to `userToDelete`.
    - `src/pages/EmailVerificationPage.tsx` — `handleCheckVerification` was using `currentUser` without local narrowing (the `useEffect` redirect doesn't narrow across renders). Added an explicit early-return guard at the top of the handler.
    - **Real bugs found**: three TS2783 "specified more than once" duplicate-key errors that strictNullChecks surfaced in `SavedCrewProfilesPage.tsx:46` (`{ uid: crewId, ...crewData }`), `ProjectCrewService.ts:156` (`{ id: doc.id, ...projectData }`), `conversionTracking.ts:44` (`{ event: eventName, ...payload }`). In each case the explicit field was being overwritten by the spread — the author's clear intent was the opposite. Fixed by swapping order (spread first, explicit field last).
  - ✅ 2026-05-14 pass 3: collapsed all granular flags to `strict: true` (kept explicit `useUnknownInCatchVariables: true` for documentation, though it's redundant under `strict`). `strictPropertyInitialization` (the only remaining strict flag not previously enabled) surfaced **0 errors** — the codebase is functional-components + hooks, so there are no class-field initialization sites. `tsconfig.json` is now 9 lines slimmer.
  - 🎉 **`tsconfig.json` strict migration is COMPLETE.**
  - **Note for follow-up agent**: changes to `tsconfig.json` and the 7 source files from pass 2 are not yet committed. They're code-only (no Firestore writes) so safe to commit as a batch with a message like "P3 tsconfig: full strict mode + fix 13 errors".
- ✅ **`react-pdf@5` + `pdfjs-dist@2` → `react-pdf@10` + `pdfjs-dist@5` (done 2026-05-14).** Root cause of the "fragile combo": project had a standalone `pdfjs-dist@^2.16.105` dep in `package.json`, while `react-pdf@^5.7.2` bundled its own `pdfjs-dist@2.12.313`. Two different pdfjs versions side-by-side. Fix:
  - Installed `react-pdf@^10.4.1` (latest stable). It bundles `pdfjs-dist@5.4.296` transitively.
  - **Removed the standalone `pdfjs-dist`** from `dependencies` — `grep "from 'pdfjs-dist'"` in `src/` returned zero hits, so nothing imported it directly. The two call sites import `pdfjs` from `react-pdf`, not from `pdfjs-dist`.
  - Updated worker URL from `.js` → `.mjs` in the two consumers (`src/components/Collaboration/ScreenplayViewer.tsx`, `src/pages/ProjectManagement/ProjectDocuments.tsx`). `pdfjs-dist@5` ships **only** the ESM worker bundle; cdnjs hosts it at `pdf.worker.min.mjs`. The `${pdfjs.version}` template still resolves correctly.
  - Verified with `npx tsc --noEmit` (clean) and `npm run build` (clean — Firebase API key correctly bundled, 1 pre-existing webpack performance warning about main bundle > 1 MiB, unrelated).
  - **Needs a visual smoke test** alongside the dnd-kit one — open a screenplay PDF in the Collaboration tab, and a project document PDF in the Project Documents tab. Confirm pages render and the worker loads. If the worker URL is wrong the console will show `Setting up fake worker failed`.
- ✅ **`react-beautiful-dnd` → `@dnd-kit/core` (done 2026-05-14).** All three call sites (`JobApplicantsPage.tsx`, `TaskManager/views/KanbanView.tsx`, `TaskManager/components/TaskCard.tsx`) migrated to `@dnd-kit/core`. `react-beautiful-dnd` + `@types/react-beautiful-dnd` removed from `package.json`. Tried `@dnd-kit/sortable` and `@dnd-kit/utilities` too but uninstalled them since the current call sites only need the basics from `@dnd-kit/core`. Migration notes:
  - **`JobApplicantsPage.tsx`**: kanban-by-status board with 6 columns. Replaced `<DragDropContext>` with `<DndContext>` (using `PointerSensor` with `distance: 5` activation constraint so card buttons remain clickable, plus `KeyboardSensor` for a11y) and `closestCorners` collision detection. The inline `<Draggable>` / `<Droppable>` render-prop blocks became two new sub-components in the same file (`KanbanCard` using `useDraggable`, `KanbanColumn` using `useDroppable`). Action buttons inside cards now call `stopPropagation` on `pointerDown` so the drag handler doesn't swallow clicks.
  - **`TaskManager/components/TaskCard.tsx`**: replaced the conditional `<Draggable>` wrapper with `useDraggable`. Added a new `draggable?: boolean` prop (legacy `index?: number` retained for backward compat). The hook is always called (React rules), but its outputs are only applied to the rendered DOM when `isDraggable` is true.
  - **`TaskManager/views/KanbanView.tsx`**: replaced `<DragDropContext>` / `<Droppable>` with `<DndContext>` / a new local `KanbanColumn` using `useDroppable`. **Fixed a pre-existing latent bug**: TaskCards were previously rendered without `index`, so the conditional `<Draggable>` wrapper never activated and the kanban looked draggable but cards weren't actually draggable. Now passes `draggable` to TaskCard so cards are real drop sources.
  - **Risk note for follow-up agent**: this is the change in this session most likely to need a quick visual smoke test. Open `/jobs/<jobId>/applicants` (or `/applicants`) → switch to Kanban view → drag a card across columns; the card's status should update via `handleStatusUpdate` (Firestore write + email notification). And open a project's TaskManager Kanban view → drag a task card; status should update via `onTaskUpdate`. Typecheck is clean but the runtime behavior was not exercised.
  - `src/components/TaskManager/README.md` also updated to point at `@dnd-kit/core`.

## P4 — Documentation ✅ done 2026-05-14

- ✅ **`README.md`** rewritten with stack, setup, commands, layout, data-safety pointer, and pointers to PROJECT_OVERVIEW.md / DESIGN_SYSTEM.md / docs/deployment/DEPLOYMENT_GUIDE.md.
- ✅ **Root cleaned up**: 26 stale top-level `*.md`/`*.txt` files relocated into `docs/` subgroups (`deployment/`, `email/`, `firebase/`, `features/`, `testing/`, `status/`, `handoffs/`, `misc/`). Root now keeps only `README.md`, `PROJECT_OVERVIEW.md`, `DESIGN_SYSTEM.md`, and `env-template.txt`.
- **`HANDOFF.md` (47 KB)** moved to `docs/handoffs/`. Not pruned — still stale and worth archiving with a date in the filename if you want history.

## P5 — Testing

- ✅ **P5 testing reality reconciled 2026-05-14**: prior agent's claim that "both fail" was misleading. The real story:
  - `socialService.test.ts` was **not a real test** — no `describe`/`it`/`expect`, just a manual debug helper exporting `testSocialService()`. Failed only because importing it pulled in `src/firebase.ts` which calls `getAuth()` without test-env config. **Deleted** (no consumers found).
  - `TaskCard.test.tsx` was **4/5 passing**; the failing assertion used `getByRole('button', { name: /Test User/ })` to find a Radix `TooltipTrigger` with `asChild`, which doesn't render a `<button>` — the child `<div>` becomes the trigger with `data-state` attribute. Replaced with a `closest('[data-state]')` check.
  - Also added `.claude/**` to vitest `exclude` config — vitest was running tests from the throwaway worktree at `.claude/worktrees/adoring-leakey-58f090/`, doubling runtime and reporting duplicate results.
  - **Result**: `npx vitest run` → 5/5 passing, 1 test file. Tests are no longer a false signal.
- ⏳ **If testing is a goal going forward**, the next step would be: add baseline smoke tests for the 5 critical paths (auth, project create, social follow, job apply, message send). Currently coverage is near zero on production code paths.

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
