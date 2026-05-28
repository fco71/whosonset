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

---

# Plan — Collaboration page: student workflow + in-browser Fountain editor (drafted 2026-05-27)

> Owner: Francisco (instructor). Drafted by an agent so subsequent agents can pick up steps cold. **Do not skip the data-safety guardrail at the top of this doc** — every Firestore-touching step below must be confirmed in the current conversation before running. Code-only changes are fair game.

## Goal in one paragraph

Two changes to the collaboration page:

1. **Student group + supervisor evaluation flow.** A student creates a workspace ("group"). Group members **edit and comment** on each other's work. The instructor (Francisco) is invited to the workspace; once in, he becomes a *supervisor* — a role that can **read + comment + annotate but cannot edit any screenplay in the workspace**. The supervisor's annotations sit "on top of" the students' work for evaluation purposes; they never mutate the student's screenplay text. Two paths to becoming a supervisor (see A1.5): (a) the workspace creator/admin assigns the role at invite time, or (b) the invited member self-promotes if their crew profile is flagged as a teacher. Path (b) means students only need to "add Francisco to the collaboration" — Francisco then self-tags as supervisor, no special instructions to students required.
2. **In-browser Fountain editor.** A new "Write" mode inside a screenplay where the author types into a single textarea backed by a simplified Fountain markup. **Element-formatting toolbar** above the editor with buttons (Scene, Action, Character, Dialog, Parenthetical, Transition); each button has a visible keyboard-shortcut hint. Latest-input-wins, no real-time multi-cursor collaboration. View does NOT render visual page breaks, but the **top-right shows a live page count**. Supervisor and group members can comment on these in-browser drafts the same way as on uploaded PDFs.

## Revision from Francisco feedback (2026-05-27)

- **Invite-anytime is required.** Teachers/supervisors and student members must be inviteable during every phase: initial workspace creation, after the workspace exists, before upload, during upload, and after screenplays already exist. Implementation implication: adding a member to a workspace must also grant that user access to every existing screenplay in that workspace, not only future uploads.
- **Project archive/delete means collaboration workspace archive/delete in this slice.** The live `Projects/` and `projects/` collections remain out of scope unless Francisco explicitly asks to change those production project records. For the collaboration page, the workspace creator can archive a workspace, soft-delete it, restore it during a recovery window, and optionally permanently delete it later.
- **Recovery period default: 30 days.** Deleting a collaboration workspace sets `status: 'deleted'`, `deletedAt`, and `deleteRecoverableUntil`. It does not immediately remove the Firestore document. Restoring clears the deletion fields and returns the workspace to `active`.

## What already exists (verified 2026-05-27 by reading the files)

- [src/pages/CollaborationPage.tsx](src/pages/CollaborationPage.tsx) — thin wrapper that renders `<CollaborationHub />`.
- [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) — 1411 lines, three tabs: `workspaces`, `tasks`, `screenplays`.
- [src/types/Collaboration.ts](src/types/Collaboration.ts) — `CollaborationWorkspace`, `WorkspaceMember` (`role: 'owner' | 'admin' | 'member' | 'viewer'`), plus document/whiteboard types.
- [src/components/Collaboration/ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) — 2161 lines, PDF viewer with annotation/tag UI. **Reuse for comment threads; don't reinvent.**
- Firestore collections in use: `workspaces`, `screenplays`, `screenplayAnnotations`, `screenplayTags`, `screenplaySessions`, `collaborationSessions`, `crewProfiles`, `connections`.
- Firestore rules ([firestore.rules:393-451](firestore.rules)):
  - `screenplays/{id}`: read/write only if `uploadedBy == auth.uid` OR `auth.uid` is in `teamMembers` array.
  - `screenplayAnnotations/{id}`: read/write if the caller can access the parent screenplay.
  - `workspaces/{id}`: `allow read, write: if signedIn();` — **too permissive, tighten as part of this plan.**
- Storage rules ([storage.rules](storage.rules)): `screenplays/` is auth-only (already tightened 2026-05-14).
- **Known existing bug in CollaborationHub.tsx**: `handleCreateWorkspace` (around line 394) only calls `setWorkspaces(prev => [...prev, newWorkspace])`. **It never writes to Firestore.** New workspaces vanish on reload. This must be fixed in A2 below.

## Data-safety guardrail (recap for any agent picking this up)

- Live production data in `screenplays` and `crewProfiles`. PITR + weekly backups are in place (see top of this doc).
- The two project collections (`Projects/` and `projects/`) are **both** live. This plan does NOT touch them. If anything below seems to require touching project documents, **stop and ask the user**.
- Before any Firestore rule change is deployed, run a dry test with the Firebase emulator OR ask the user to verify in the rules playground. The `workspaces` rule tightening in A4 is the riskiest item — get explicit confirmation in-conversation before deploy.

---

## Workstream A — Student → supervisor commenting flow

Goal: a student creates a workspace, uploads a screenplay, invites Francisco as supervisor, Francisco logs in and can read + comment.

### A1. Promote `WorkspaceMember.role` to include `'supervisor'` and surface it in the UI [code-only]

- Edit [src/types/Collaboration.ts:19](src/types/Collaboration.ts) — extend the union: `'owner' | 'admin' | 'supervisor' | 'member' | 'viewer'`.
- Define permission semantics in a short comment on `WorkspaceMember` (confirmed 2026-05-27):
  - `owner`: creator; full rights including delete-workspace, settings, and assign/remove members.
  - `member`: read everything; **edit + comment/annotate** any screenplay in the workspace. Group editing is intentional.
  - `supervisor`: read + **comment/annotate only — no edit on any screenplay in the workspace, including their own** (the role is evaluative; if a teacher also wants to author screenplays here, they toggle back to `member` per A1.5). Every annotation a supervisor authors gets a denormalized `supervisor: true` flag so a future "evaluation report" view can cheaply filter "comments from the teacher" without joining against the workspace doc.
  - `viewer`: read-only (kept for completeness; not surfaced in the create UI initially).
- **Important inversion vs. earlier draft of this plan**: previously supervisor was described as having edit rights too. That was wrong — Francisco clarified 2026-05-27 that the whole point of the role is non-destructive evaluation. The Firestore rule in A4 must enforce no-edit-by-supervisor on `screenplays/{id}`, not just rely on the UI.
- In [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) workspace-creation modal and the Add Member modal, expose a role selector with these four options (default `member`).
- Acceptance: typecheck clean; UI renders a role dropdown; selecting "supervisor" stores it in `member.role`.

### A1.5. Teacher flag on crew profile + self-promotion to supervisor (confirmed 2026-05-27)

Goal: Francisco shouldn't have to instruct students on workspace roles. Students just add him to the workspace as a regular member; he flips his own role to `supervisor` from inside the workspace UI. Anyone else (a non-teacher) cannot self-promote — they'd have to be assigned the role by the workspace owner.

**Schema changes**:

- Add `isTeacher: boolean` (default `false`) to `crewProfiles/{uid}`. Already public-readable per existing rules ([firestore.rules:67-68](firestore.rules)), so no rule change needed for read.
- Surface a checkbox on the user's own crew-profile edit page: "I am a teacher / instructor". Help text: "Lets you tag yourself as a supervisor in any workspace you're invited to, for evaluation purposes."
- On the workspace document, add a denormalized field `selfElectedSupervisors: string[]` listing uids that have self-promoted. The UI computes effective role per member as: `effectiveRole = selfElectedSupervisors.includes(uid) ? 'supervisor' : member.role`.

**UI**:

- Inside a workspace, every member sees their own member-card. If `currentUser.isTeacher === true` AND they are not currently the owner, show a toggle: **"Act as supervisor"**. Toggling on writes `arrayUnion(currentUser.uid)` to `workspaces/{id}.selfElectedSupervisors`. Toggling off writes `arrayRemove(currentUser.uid)`.
- Non-teachers don't see the toggle.
- Owner can override: assign or revoke `member.role === 'supervisor'` directly via the existing add/edit-member modal. Owner-assigned supervisor is *not* removable by the assignee (only by the owner) — distinct from self-elected, which the user controls themselves.
- Effective role chip on each member-card reflects either source.

**Firestore rule for the toggle** (sketch — exact rule to be hardened by the implementing agent; this is non-trivial in Firestore rules language):

```
match /workspaces/{workspaceId} {
  allow update: if signedIn() && (
    // Owner can edit anything
    resource.data.ownerId == request.auth.uid
    ||
    // A teacher-flagged member can ONLY toggle their own uid in/out of selfElectedSupervisors
    (
      resource.data.memberIds.hasAny([request.auth.uid]) &&
      get(/databases/$(database)/documents/crewProfiles/$(request.auth.uid)).data.isTeacher == true &&
      request.resource.data.diff(resource.data).affectedKeys()
        .hasOnly(['selfElectedSupervisors', 'updatedAt']) &&
      // The change to selfElectedSupervisors is symmetric in request.auth.uid only —
      // i.e. they didn't add/remove anyone else's uid. The cleanest expression of this
      // is: the set-symmetric-difference between old and new selfElectedSupervisors
      // equals exactly {request.auth.uid}. Firestore rules don't have set-diff helpers,
      // so the implementing agent will need to express this via .toSet() and explicit
      // size+contains checks. Acceptance test required (see below).
      true
    )
  );
}
```

**Acceptance tests (rules playground)**:

1. Teacher A (isTeacher=true) in workspace W: can write `selfElectedSupervisors: arrayUnion(A.uid)` → ✅ allowed.
2. Teacher A: can write `selfElectedSupervisors: [A.uid, B.uid]` (sneaking B in) → ❌ denied.
3. Non-teacher C in workspace W: tries `selfElectedSupervisors: arrayUnion(C.uid)` → ❌ denied (their profile has isTeacher=false).
4. Outsider D (not in memberIds): tries any write → ❌ denied.
5. Owner: can write `members[*].role` to/from `supervisor` freely → ✅ allowed.

This step is independent of A2 and can be developed in parallel after A1 lands.

### A2. Persist workspaces to Firestore (fixes the existing bug — confirmed 2026-05-27)

> **Status**: confirmed by the user (Francisco) on 2026-05-27. The current behavior — workspaces vanish on reload because `handleCreateWorkspace` never calls Firestore — is unacceptable. All workspace data (and member changes, settings, etc.) must persist.

- In `handleCreateWorkspace`, after building `newWorkspace`, call `addDoc(collection(db, 'workspaces'), {...})` and use the returned `docRef.id` as the workspace ID (do not use `Date.now().toString()`).
- Store `ownerId: currentUser.uid` and `memberIds: members.map(m => m.userId)` as **denormalized top-level fields** — Firestore rules can't easily query nested arrays of objects, but they CAN check `array-contains` on a flat string array. `members` (rich objects) stays for the UI; `memberIds` (string[]) is the rules-friendly mirror.
- Schema (write this exactly, agents downstream must match):
  ```ts
  {
    name: string,
    description: string,
    type: 'project' | 'department' | 'general',
    projectId: string | null,
    ownerId: string,                // creator's uid
    memberIds: string[],            // flat uid list incl. owner — for rules + queries
    supervisorIds: string[],        // owner-assigned supervisors only
    viewerIds: string[],            // read-only viewers
    selfElectedSupervisors: string[],
    status: 'active' | 'archived' | 'deleted',
    archivedAt: Timestamp | null,
    deletedAt: Timestamp | null,
    deleteRecoverableUntil: Timestamp | null,
    members: WorkspaceMember[],     // rich shape for UI
    settings: WorkspaceSettings,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  ```
- Update `loadWorkspaces` query: instead of fetching all workspaces, query `where('memberIds', 'array-contains', currentUser.uid)`. This is also a **privacy fix** — today everyone sees every workspace.
- Update `addUserToWorkspace` and the add-member flow to also push the new member's uid into `memberIds` and to `updateDoc` the workspace.
- Acceptance: create a workspace → reload page → workspace still appears. Sign in as a non-member → workspace does not appear in their list.

### A3. Scope screenplays to a workspace, and let the supervisor in

- Add an optional `workspaceId?: string` field to the screenplay document at upload time (`handleScreenplayUpload` in CollaborationHub). If the upload happens with a workspace selected, store it.
- When uploading, pre-populate `teamMembers` with the workspace's `memberIds` so all current members (including the supervisor) inherit access.
- When a member or supervisor is added to a workspace after screenplays already exist, update every screenplay in that workspace so `teamMembers` includes the new workspace `memberIds`. This is required because Francisco confirmed invitations must work during any phase, including after upload.
- In the screenplays tab UI, group screenplays by workspace (a section per workspace the user belongs to, plus a "Personal / no workspace" section for legacy uploads).
- Acceptance: a screenplay uploaded inside Workspace X is readable by every member of X — verified by signing in as the supervisor.

### A4. Tighten the `workspaces` Firestore rule + enforce no-edit-by-supervisor on screenplays (⚠ deploy with care)

- Current rule ([firestore.rules:424-426](firestore.rules)):
  ```
  match /workspaces/{workspaceId} {
    allow read, write: if signedIn();
  }
  ```
- Replace with:
  ```
  match /workspaces/{workspaceId} {
    allow read: if signedIn() &&
      resource.data.memberIds is list &&
      resource.data.memberIds.hasAny([request.auth.uid]);
    allow create: if signedIn() &&
      request.resource.data.ownerId == request.auth.uid &&
      request.resource.data.memberIds is list &&
      request.resource.data.memberIds.hasAny([request.auth.uid]);
    allow update: if signedIn() &&
      resource.data.ownerId == request.auth.uid; // only owner can edit settings
    allow delete: if signedIn() &&
      resource.data.ownerId == request.auth.uid;
  }
  ```
- **Migration risk**: any pre-existing workspace doc without `memberIds`/`ownerId` will become inaccessible under this rule. Before deploying:
  1. Run a script (read-only first, in dry-run) to list all existing `workspaces` docs and report which are missing the new fields.
  2. If any exist with real owners, backfill `ownerId` and `memberIds` from the existing `members[].userId` shape **after explicit user approval**.
  3. Deploy the rule.
- Acceptance: the rules-playground test for "member reads own workspace" passes; "non-member reads workspace" denies; "owner deletes" passes; "member deletes" denies.

**Plus: enforce no-edit-by-supervisor on screenplays.** The supervisor role is meaningless if a malicious or careless supervisor can `updateDoc` a screenplay's `fountainSource` directly. The rule must check the caller's effective role inside the screenplay's workspace.

Legacy/personal screenplay guard: if `workspaceId` is missing or null, rules must fall back to the current `uploadedBy` / `teamMembers` access check and must not call `get()` on a missing workspace path.

Add to the screenplay doc (when created or moved into a workspace) a denormalized field `workspaceId`. The screenplay rule then needs:

```
match /screenplays/{screenplayId} {
  allow read: if isScreenplayMemberData(resource.data);

  // Create: caller must be a member and not an effective supervisor of the target workspace
  allow create: if isScreenplayMemberData(request.resource.data) &&
                   !isEffectiveSupervisor(request.resource.data.workspaceId, request.auth.uid);

  // Update / delete: same restriction
  allow update, delete: if isScreenplayMemberData(resource.data) &&
                           !isEffectiveSupervisor(resource.data.workspaceId, request.auth.uid);
}
```

…with a new helper:

```
function isEffectiveSupervisor(workspaceId, uid) {
  let ws = get(/databases/$(database)/documents/workspaces/$(workspaceId)).data;
  return (
    (ws.selfElectedSupervisors is list && ws.selfElectedSupervisors.hasAny([uid]))
    // OR uid's member entry has role 'supervisor' — but Firestore can't easily index
    // into the array-of-objects, so denormalize a `supervisorIds` field on the workspace
    // doc that the client keeps in sync alongside `members`.
    || (ws.supervisorIds is list && ws.supervisorIds.hasAny([uid]))
  );
}
```

This means the workspace doc carries **four** denormalized id-arrays (all sync'd by the client on member changes):
- `memberIds: string[]` — everyone in the group, used for read access.
- `supervisorIds: string[]` — owner-assigned supervisors only.
- `viewerIds: string[]` — read-only viewers.
- `selfElectedSupervisors: string[]` — self-promoted teachers (A1.5).

The "read-only participant" check is the union of `supervisorIds`, `viewerIds`, and `selfElectedSupervisors`.

`screenplayAnnotations` rule is unchanged — supervisors *can* write annotations because they pass `canAccessScreenplay` (they're in `teamMembers` of the screenplay). They cannot mutate the parent screenplay because of the new rule above. This is exactly the intended separation: comment freely, never touch the underlying work.

**Acceptance tests for this addition**:

1. Member (non-supervisor) updates `fountainSource` → ✅.
2. Owner-assigned supervisor updates `fountainSource` → ❌.
3. Self-elected supervisor updates `fountainSource` → ❌.
4. Same self-elected supervisor toggles themselves back to plain member (per A1.5) → then updates `fountainSource` → ✅.
5. Either kind of supervisor creates a new `screenplayAnnotation` on a workspace screenplay → ✅.

### A5. Comment threads on screenplays inside a workspace

- The annotation infrastructure already exists in [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) (`screenplayAnnotations` collection, anchored by `screenplayId`). Confirm that the existing annotation UI is visible to anyone in `teamMembers` — the rule `canAccessScreenplay` already allows this (firestore.rules:41-46).
- Add a small badge on each screenplay row in the list showing comment count (`getCountFromServer` against `screenplayAnnotations` filtered by `screenplayId`).
- Add a "Comment" quick-action that opens `ScreenplayViewer` directly into the comments side panel.
- Optional follow-up: email notification to the screenplay's `uploadedBy` when a supervisor comments. The email service already exists at [functions/src/emailService.ts](functions/src/emailService.ts).
- Acceptance: supervisor opens a student's screenplay, adds an annotation, student reloads and sees it.

### A6. Invite-by-email convenience (UX polish)

- Right now `UserAutocomplete` only suggests users from the `connections` (approved contacts) collection or all `crewProfiles`. Students may want to invite Francisco directly by entering his email.
- Add an "Invite by email" affordance: if the typed string matches an email pattern and no user is found, allow sending an invite. Two options:
  - **MVP**: look up the user in `crewProfiles` by email field; if exact match, add them as supervisor. If no match, show an error "User must first create an account at /signup". No email send required for MVP.
  - **Full**: write an `invitations` doc + send an email with a join link; on accept, add to `memberIds`. Defer this; it's its own workstream.
- Acceptance for MVP: Francisco signs up once → student types `franciscoadolfo@gmail.com` → finds him → adds as supervisor.

### A7. Archive, soft-delete, restore, and permanently delete collaboration workspaces

- Add workspace status fields: `status: 'active' | 'archived' | 'deleted'`, `archivedAt`, `deletedAt`, `deleteRecoverableUntil`.
- Only the workspace creator (`ownerId`) can archive, soft-delete, restore, or permanently delete a collaboration workspace.
- Archive keeps the workspace and its screenplays available but visually marks it as inactive. Restore returns it to `active`.
- Delete is a soft delete: set `status: 'deleted'`, `deletedAt: serverTimestamp()`, and `deleteRecoverableUntil` to now + 30 days. The UI must show deleted workspaces separately with a Restore action.
- Permanent delete removes the workspace document after the 30-day recovery window and a second confirmation. Screenplays are not removed in this slice; they keep their own docs/storage and can be handled by a future cleanup policy.
- Acceptance: creator archives/restores a workspace; creator deletes/restores within 30 days; non-creator does not see archive/delete controls.

---

## Workstream B — In-browser Fountain screenplay editor

Goal: a "Write" mode for a screenplay where the user types Fountain into a single textarea, the document saves to Firestore (latest-input wins), and the top-right shows a live page count. No page breaks rendered, no real-time co-editing.

### B1. Data model — new field, not new collection

- Reuse the existing `screenplays` collection (so all the existing rules, annotation infra, workspace scoping from A3 apply for free).
- Add three optional fields to a screenplay document:
  ```ts
  format: 'pdf' | 'fountain',     // default 'pdf' for legacy docs
  fountainSource: string,         // the raw Fountain markup (only when format === 'fountain')
  fountainUpdatedAt: Timestamp,   // last-write-wins timestamp
  ```
- Existing PDF-uploaded screenplays have no `format` field → treat as `'pdf'`. Don't backfill; resolve at read time with `format ?? 'pdf'`.
- A `'fountain'` screenplay has no Storage file; `url` is empty (or omitted). The UI must branch on `format`.
- Acceptance: TS types updated, lint clean.

### B2. New screenplay creation flow — "Start writing" button

- In the screenplays tab, add a "Start writing" button next to "Upload screenplay". Clicking it opens a small modal: title + (optional) workspace selector. Submitting creates a `screenplays` document with `format: 'fountain'`, `fountainSource: ''`, `uploadedBy: currentUser.uid`, `teamMembers: [currentUser.uid, ...workspaceMemberIds]`.
- Then the editor opens.
- Acceptance: creates the doc; doc shows up in the user's screenplay list immediately.

### B3. The editor component — single textarea, debounced save, format toolbar

- Create a new component `src/components/Collaboration/FountainEditor.tsx`.
- Layout (three regions, top-to-bottom):
  1. **Header bar**: title (editable, inline), Save status indicator ("Saved" / "Saving…" / "Error"), **page count badge in the top-right corner** (`{pages} pp.`), Close button.
  2. **Format toolbar** (B3a, below): six buttons — Scene, Action, Character, Parenthetical, Dialog, Transition. Each button shows its keyboard shortcut as a small chip next to its label (e.g., `Scene ⌥S`). Buttons act on the current line / current cursor position.
  3. **Editor body**: a single full-height `<textarea>` with monospace font (`Courier Prime` if available, else `Courier New`), generous line height (1.4), no auto-wrap styling. Just one big text area. Default text size ~14px.
- Save behavior:
  - On every keystroke, set local state.
  - Debounce 1500ms; after silence, write `{ fountainSource, fountainUpdatedAt: serverTimestamp(), lastEditedBy: currentUser.uid }` to the doc via `updateDoc`.
  - Save status reflects in-flight state. After 5s of failed writes, show a non-blocking toast.
  - **Last write wins**: no merge logic, no version field. Confirmed acceptable per spec; if two tabs are open, later save overwrites. The viewer subscribes via `onSnapshot` so readers do see edits live, but the editor itself does not subscribe.
- No real-time subscription to other users' edits inside the editor — read the doc once on mount via `getDoc`, then own local state until close. (Multi-user editing is explicitly out of scope.)
- Acceptance: type → wait → reload → text persisted. Open in two tabs, type in both, save in tab A then tab B → tab B's content wins.

### B3a. Format toolbar + keyboard shortcuts

> Goal stated by the user 2026-05-27: "buttons for Scene, Action, Dialog etc. and show the keyboard shortcut on the button so people can press the button OR use the shortcut. TAB is fine, anything that doesn't conflict with the browser — and during edit on this page we can claim ownership of shortcuts."

**How each button behaves** — inserts canonical Fountain markup at/around the current line and places the caret at the right spot:

| Button | Action on click / shortcut | What it inserts |
|--------|---------------------------|-----------------|
| Scene | Ensures current line starts with `INT. ` (uppercase scene heading), prefixed by a blank line if not already present. Cursor lands after the space, ready to type the location. | `\n\nINT. ` (or `EXT. ` — see below) |
| Action | Ensures current line is plain action (lowercased if currently caps; preserves user text). Adds blank line before if missing. | `\n\n` then user types normally |
| Character | Converts current line to UPPERCASE and treats it as a character cue. Adds blank line before. | `\n\n{LINE_UPPERCASED}` |
| Parenthetical | Wraps current line in `( )`. If line is empty, inserts `()` and parks caret inside. | `({line})` |
| Dialog | New line directly under a character cue, no blank line; lowercased. | `\n{cursor}` immediately under the cue |
| Transition | Uppercases current line; if it doesn't end in `TO:`, append it. Adds blank line before. | `\n\n{LINE_UPPERCASED} TO:` |

**INT. vs EXT.**: Scene button toggles `INT.` → `EXT.` → `INT./EXT.` → `INT.` on repeated presses, so a single button covers the common cases without cluttering the toolbar. Show the current state in a small label on the button (`Scene · INT.` etc.).

**Keyboard shortcuts** — using `Alt` (Windows/Linux) / `Option` (Mac) + letter, because:
- `Alt`/`Option` + letter is mostly free in browsers. Chrome/Firefox/Safari reserve `Cmd`+digits (tab switch), `Cmd`+letters (history, find, save, etc.), and the `F`-keys, but `Alt`/`Option`+letter is generally available **inside an input/textarea**.
- We do **not** need to claim ownership beyond what `preventDefault` on `keydown` already gives us when the textarea has focus. The browser's own `Alt`+letter menu shortcuts (e.g. `Alt+D` for address bar on Windows) only fire when the focus is *outside* an input. Once the textarea is focused and the editor's `onKeyDown` calls `preventDefault`, the browser never sees the event. This is the "claim ownership during edit" the user mentioned — it's free with standard event handling, no special API.

| Element | Shortcut | Shown on button as |
|---------|----------|--------------------|
| Scene | `Tab` (cycle types) and `Alt+S` (force Scene) | `⇥` and `⌥S` |
| Action | `Alt+A` | `⌥A` |
| Character | `Alt+C` | `⌥C` |
| Parenthetical | `Alt+P` | `⌥P` |
| Dialog | `Alt+D` | `⌥D` |
| Transition | `Alt+T` | `⌥T` |

**Tab key special behavior**: in screenplay editors `Tab` traditionally cycles element types of the current line: Action → Character → Dialog → Parenthetical → Transition → Scene → Action. We implement this. Pressing Tab inside the textarea calls `preventDefault` and applies the next type. `Shift+Tab` cycles backward. This is the most-used shortcut for screenplay typists, so it gets the prime key.

**Platform display**: render `⌥` on Mac, `Alt` on Windows/Linux. Use `navigator.platform` once at mount.

**Visual treatment**: each button is `~80px wide`, two-line layout — element name on top, shortcut chip in muted text below (e.g. `Scene` / `⇥ ⌥S`). Active element type (based on current line classification) gets a highlighted background so users can see "I'm currently in dialog mode" at a glance.

**Implementation notes for the agent**:
- Use a single `onKeyDown` handler on the textarea. Switch on `event.key`/`event.altKey`/`event.shiftKey`. Always `preventDefault` for our captured combos.
- Element-mutation logic lives in `src/utilities/fountain.ts` as a pure function `applyElementType(source: string, caret: number, type: ElementType): { source: string; caret: number }` so it's unit-testable without React.
- Avoid `Cmd`/`Ctrl` shortcuts entirely — every variant conflicts with something in at least one browser/OS combo.
- `Enter` behavior: pressing Enter on a Character line auto-promotes the next line to Dialog (no blank line, no caps). Pressing Enter on a Dialog line with an empty result drops back to Action. This is the auto-flow users expect from Final Draft/Highland.

**Acceptance for B3a**:
- Each button visibly inserts/transforms the expected markup. Caret ends up in a sensible place.
- Each shortcut fires the same handler.
- No shortcut leaks to the browser (e.g. `Alt+D` does not focus the address bar while the textarea is focused).
- Tab cycles element types forward; Shift+Tab cycles backward.
- Unit tests cover `applyElementType` for each (current-type → next-type) transition.

### B4. Page count heuristic

- The user explicitly said: no visual page breaks, but show a live running page count.
- Industry rule of thumb: standard screenplay page ≈ 55 lines at standard line width; ≈ 1 page per minute of screen time.
- Implementation plan:
  1. Parse `fountainSource` into element types using a thin Fountain tokenizer. Element types we'll recognize (subset):
     - **Scene heading**: line begins with `INT.`, `EXT.`, `EST.`, `INT./EXT.`, `I/E.`, OR a line starting with `.` and not `..`.
     - **Transition**: line in ALL CAPS ending in `TO:`, OR a line starting with `>`.
     - **Character cue**: a non-empty ALL-CAPS line followed by a non-blank line (and not a scene heading / transition).
     - **Parenthetical**: a line wrapped in `(...)` immediately after a character cue or dialogue.
     - **Dialogue**: line(s) immediately following a character cue (or parenthetical), until a blank line.
     - **Action**: everything else.
  2. For each element, compute "rendered lines" using element-specific character widths:
     - Action: wrap at **60** chars/line → `lines = max(1, ceil(charCount / 60))`.
     - Dialogue: wrap at **35** chars/line → `lines = max(1, ceil(charCount / 35))`.
     - Character/Parenthetical/Scene heading/Transition: typically 1 line each (no wrap in practice; if longer, ceil at their narrower widths — Character ~38 / Parenthetical ~25 / Scene heading ~60).
     - Add **1 blank line** before each new scene heading and before each character cue (Fountain convention).
  3. `totalLines = sum of element lines + blank-line separators`.
  4. `pageCount = max(1, ceil(totalLines / 55))`.
  5. Recompute on every keystroke (debounced 100ms is plenty — the parser is cheap on <100kB strings; only optimize if it shows up in a profile).
- Add a unit test for the heuristic in `src/components/Collaboration/__tests__/fountainPagination.test.ts` — feed in 3 known scripts (1 page, 5 pages, 30 pages, hand-counted) and assert within ±10%.
- Acceptance: typing visibly ticks the counter up roughly every 55 wrapped lines.

### B5. Read-only Fountain rendering for the supervisor

- Supervisors and viewers should not be editing — they should be reading and commenting. Student members, admins, and the owner can edit each other's workspace screenplays; group editing is intentional.
- Add a `FountainViewer.tsx` component that renders the parsed elements with standard screenplay formatting (scene headings ALL CAPS bold, dialogue indented ~35% from left and right, character cues centered, action full width, generous spacing).
- The viewer reuses the same parser from B4 — extract it to `src/utilities/fountain.ts` so both editor and viewer share it.
- Wire `ScreenplayViewer.tsx` to branch on `format`: if `'pdf'` → existing react-pdf path; if `'fountain'` → render `FountainViewer` + the existing annotation side panel.
- Acceptance: supervisor opens the script → sees properly formatted scenes/dialogue → can add annotations exactly like on a PDF.

### B6. Comments anchoring (MVP: doc-level; later: per-element)

- For MVP, annotations on a Fountain screenplay are doc-level (no per-line anchoring). The existing `screenplayAnnotations` schema already supports this (`page` and `scene` are optional).
- Follow-up (not in this plan): attach annotations to a specific scene or line. Would require stable element IDs derived from the parser. Defer.
- Acceptance: supervisor leaves a comment, student sees it next to the editor when they re-open the screenplay.

### B7. Export (deferred — confirm with user if wanted)

- Out of scope for the first cut. If wanted later, options are:
  - Client-side: pipe through a library like `fountain-js` + a print-CSS view → user "Print to PDF".
  - Server-side: a Cloud Function that runs `afterwriting` or similar.
- Acceptance: explicit user decision before implementing.

---

## Suggested sequencing

1. **A1 + A2** together — types + workspace persistence. Single PR, code-only except for the new write path (which only writes new docs, doesn't touch existing ones).
2. **A3 + A7** — workspace scoping for new/existing screenplay uploads, invite-anytime propagation, and archive/soft-delete recovery.
3. **A4** — workspaces rule tightening. **Pause for user confirmation + a rules-playground test before deploy.**
4. **A5** — comment counts + quick action.
5. **B1 + B2** — schema additions + creation flow (no editor yet; the new docs just sit there).
6. **B4 in isolation** — build the Fountain parser + page-count utility + unit tests against fixtures, *before* wiring the editor. This is the highest-risk piece and easiest to test in a vacuum.
7. **B3 + B5** — wire the editor and the viewer.
8. **B6** — annotations on Fountain docs.
9. **A6** — invite-by-email UX polish.

Each step ends with a runnable acceptance check. An agent picking up step N should run `npx tsc --noEmit`, the relevant Vitest tests, and the named manual smoke test before marking it done in this doc's session log.

---

## Where we are right now (pick-up pointer, 2026-05-27 late-night — after G6 in-app notifications)

**Last meaningful step**: G6 in-app notifications — when a supervisor leaves an annotation or tag, the screenplay author gets an instant notification (red-dot bell + dropdown entry). No email; Francisco explicitly wanted to avoid bombardment per individual input. Email digest deferred to a future Cloud-Function workstream.

Prior in the same evening: C1 (collaborator hydration fix), 3 chunked commits landed (0f245a03 + 87f5beef + cd8f26cc), G1+G2+G3+G4+S1–S10+i18n+CSV export.

### G6 — in-app notifications on supervisor comments

**Trigger**: `addAnnotation` and `addTag` in [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) — after the comment doc is written, IF `supervisorAtAuthorTime === true` AND the current user is NOT the screenplay's `uploadedBy`, write one notification doc.

**Schema** (matches existing AppNotification used by useNotifications + NotificationBell + NotificationCenter):
```ts
{
  userId: screenplayUploadedBy,
  type: 'supervisor_annotation' | 'supervisor_tag',
  title: "Francisco left a note on Scene 2.pdf",        // localized via i18n
  body: "Page 4: \"<first 80 chars of comment>…\"",     // localized
  message: <same>,                                       // legacy duality kept for older consumers
  isRead: false, read: false,                            // same
  createdAt: serverTimestamp(), timestamp: serverTimestamp(),
  senderId, senderName,
  relatedId: screenplayId,
  link: '/collaboration',                                // sensible fallback target
  metadata: { screenplayId, screenplayName, workspaceId, annotationId|tagId, pageNumber, kind }
}
```

**Guarded against**:
- Anonymous / no-author writes (no current user) — skipped.
- Self-notify (teacher comments on their own demo screenplay) — `uploadedBy === currentUser.uid` short-circuits.
- Missing `uploadedBy` (old screenplays with malformed data) — silent no-op.
- Notification write failures don't block the comment — wrapped in try/catch, logged, not propagated.

**No email path**: per Francisco's design decision 2026-05-27, NO email is sent here. Per-keystroke email = bombardment. Email is its own future workstream (a daily digest Cloud Function, opt-in via a user-profile setting). Logged separately as G6.5 / "later" below.

**NotificationCenter route mapping**: added cases for `supervisor_annotation` and `supervisor_tag` so clicking the notification routes to `/collaboration`. The viewer itself isn't routable yet (modal-only), so this is the best non-deep-link landing for now.

**i18n keys added**: `screenplay.notifications.supervisorAnnotation.{title,body}` and `…supervisorTag.{title,body}` plus `fallbackAuthor` / `fallbackScreenplay`. Both `en` and `es` translation JSONs updated.

**Files touched**:
- [src/components/Collaboration/ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) — added `screenplayUploadedBy` state, extended mount-time `getDoc` to capture it, new `writeSupervisorCommentNotification` helper, calls from `addAnnotation` and `addTag`.
- [src/components/NotificationCenter.tsx](src/components/NotificationCenter.tsx) — route mapping + 🎓 icon for the new types.
- [src/locales/en/translation.json](src/locales/en/translation.json) + [src/locales/es/translation.json](src/locales/es/translation.json) — new `screenplay.notifications.*` keys.

### Prior step: C1 collaborator hydration fix (committed cd8f26cc earlier this session)

Fixed the "Unknown" collaborator bug Francisco saw after deleting + re-uploading a screenplay. Collaborator listener now hydrates uid → crew-profile names; addCollaborator now writes uid strings instead of objects (aligning with the Firestore rule + the workspace-sync write path).

Earlier this evening: G1 (teacher self-tag) + G2 (real-time hub) + G3 (comment-count badges + filter chips) + G4 (supervisor provenance) + S1–S10 (annotation UX hardening) + S9 (popup drag-handle) + S10 (highlight coordinate-space) + i18n (en/es) + CSV report export. Three commits landed on `main` (0f245a03 + 87f5beef + c2e85902) plus the C1 fix below is still uncommitted on top.

### Roadmap items still to come — kept visible so they don't slip

The original two-workstream plan has Workstream A (collab + supervisor flow) largely landed, but **Workstream B — the in-browser Fountain screenplay editor — has not been started**. Spec is in this doc under "Workstream B" (B1–B7). Francisco asked specifically to keep that visible 2026-05-27.

| Item | Status | Notes |
|------|--------|-------|
| G6 — in-app notifications when a supervisor comments | ✅ done 2026-05-27 late-night | Spec in G6 section below. Email digest is its own future workstream (G6.5). |
| G7 — drag-and-drop multi-upload + first-run empty state | not started | Smallest polish win, ~30 min. |
| G5 — workspace activity feed | not started | "Maya uploaded X · 3m ago" timeline in workspace card. |
| G9 — mobile pass for the hub | not started | Students mostly work on phones. |
| G8 — workspace-level chat (non-spatial discussion) | not started | RealTimeCollaboration.tsx already exists, just needs wiring. |
| **B (Fountain editor)** — in-browser screenplay writer with format toolbar, page-count badge, simplified Fountain markup, no live multi-cursor | **NOT started** | Workstream B1–B7 in this doc. Francisco wants this. The Fountain parser + page-count heuristic (B4) is the highest-risk piece and should be built + unit-tested in isolation first. |
| C1 — collaborator hydration fix | ✅ done 2026-05-27 late, uncommitted | This commit |

### C1 — Collaborator "Unknown" bug (this fix)

**Bug**: After deleting + re-uploading a screenplay, the Collaborators side panel showed only "Unknown" entries instead of the workspace members who'd been added.

**Root cause**: two write paths populate `screenplays.teamMembers` with incompatible shapes:
1. `CollaborationHub.syncWorkspaceScreenplayAccess` (workspace member sync) writes **uid strings**.
2. Legacy `ScreenplayViewer.addCollaborator` wrote **rich objects** (`{id, name, email, ...}`).

The collaborator listener pulled `data.teamMembers` and set it directly as state, then the UI rendered `user.name || 'Unknown'`. For uid-string entries `.name` is undefined → "Unknown" for every workspace-synced member. Plus the Firestore rule `teamMembers.hasAny([request.auth.uid])` only matches uid strings, so the legacy object-write path was actually breaking rule-based access too.

**Fix** (in [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx)):
- **Listener**: normalize each entry to a uid (string-as-is OR `entry.id`/`entry.userId` from object form), batch-fetch `crewProfiles` in chunks of 10, shape into `{id, name, email, avatar, role}` objects. Missing crew profiles fall back to `Crew Member XXXX` using the last 4 chars of the uid — never "Unknown". Guarded against stale async with a `requestToken` counter.
- **Writer**: `addCollaborator` now writes `arrayUnion(user.id)` (just the uid). Optimistic local-state update still surfaces the rich profile so the UI doesn't flicker; the listener will reconcile within ~1s.
- **Old data with object entries** keeps working because the listener handles both shapes — no migration needed.

### Pre-existing pick-up pointer (smoke tests + deploy command)

### i18n + export pass (2026-05-27 night)

The collaboration page already had a `useTranslation()` skeleton with English + Spanish JSON files (`src/locales/{en,es}/translation.json`). Strings I'd added during G1/G3/G4/S-fixes were English-only — this pass extends both JSONs and replaces every hardcoded string with a `t()` call.

**New i18n keys** under `collaboration.*`:
- `personalNoWorkspace`, `uploadToWorkspace`, `uploadHelp`, `inviteMembersOptional`, `noScreenplaysYet`, `onlyCreatorCanInvite`
- `supervisor.*`: `actAs`, `stepDown`, `enabled`, `disabled`, `ownerCannot`, `toggleError`, `yourRole`, `selfTag`, `tooltipSelf`, `tooltipRole`
- `roles.*`: `member`/`memberDesc`, `supervisor`/`supervisorDesc`, `viewer`/`viewerDesc`
- `badges.*`: `unresolvedTooltip_one`/`_other`, `unresolvedSupervisorTooltip_one`/`_other` (i18next pluralization)

**New i18n keys** under `screenplay.*`:
- `popupHeader.dragToMove`
- `supervisorBadge.label`, `supervisorBadge.tooltip`
- `marker.annotation`, `marker.supervisorNote`, `marker.tag` (interpolated with `{{user}}` / `{{content}}`)
- `toasts.*`: `annotationAdded`, `supervisorNoteAdded`, `annotationFailed`, `tagAdded`, `tagFailed`, `annotationResolved`, `annotationReopened`, `tagResolved`, `tagReopened`, `updateFailed`
- `statusFilters.*`: `open`, `mine`, `fromTeacher`, `all` (interpolated with `{{count}}`)
- `export.*`: `button`, `buttonShort`, `success`, `failed`, `empty`, plus `columns.*` headers and `types.*` / `boolean.*` row values

**Component changes**:
- [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) — every G1/G3 hardcoded string replaced with `t()`. The `INVITABLE_WORKSPACE_ROLES` constant is now just `[{ value: 'member' }, ...]`; labels resolve via `t('collaboration.roles.<value>')` at render time so the invite dropdown stays in the active language.
- [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) — status filter chips, supervisor badge, marker tooltips, popup-header drag title, add/resolve toasts all use `t()`.

**Language switching**: `src/i18n.ts` already uses `i18next-browser-languagedetector` looking at `?lang=`, `localStorage`, and the browser `navigator.language`. Spanish students will get Spanish automatically if their browser is set to `es-*`. The existing `i18n.changeLanguage()` call in `src/App.tsx:119` (driven by the user's profile) also stays effective.

### CSV report export (2026-05-27 night)

Added an "Export report" button at the top of the viewer's annotation side panel. Behavior:

- Aggregates **annotations + tags** into one combined report.
- Columns (localized headers): Type, Category, Page, Content, Author, Supervisor, Resolved, Timestamp, Screenplay.
- Boolean cells render as localized "Yes"/"No" / "Sí"/"No".
- Tag categories rendered via `screenplay.categories.<key>` (already translated for all 30+ production-breakdown categories).
- Rows sorted by `page asc, timestamp asc` for readability.
- Output: UTF-8 with BOM so Excel opens accented characters correctly. CRLF line endings. Standard CSV escaping (every cell quoted, internal `"` doubled).
- Filename: `<screenplay-slug>-breakdown-<YYYY-MM-DD>.csv`. Slug strips extensions and non-`[a-z0-9-_]` chars; max 60 chars.
- Empty state: shows a toast "Nothing to export yet — add tags or annotations first." in the active language.
- Implemented as `exportTagReport()` in ScreenplayViewer.tsx; no new dependencies, plain `Blob` + anchor-click download.

Use case: instructor opens a student's screenplay, leaves tags + annotations, hits Export — gets a CSV the student can address line-by-line. Also usable as a production-breakdown deliverable for crew (script supervisor, AD, etc.).

### Status update on prior work

### Annotation UX audit + fixes (2026-05-27 late)

The teacher-evaluation use case (annotate + comment + tag PDFs without friction) is the heart of "great collaboration." Audited the full flow end-to-end in `ScreenplayViewer.tsx`; fixed the highest-impact issues:

| ID | Problem | Fix |
|---|---|---|
| **S1** | `startRealTimeSync` returned a cleanup function but the mount `useEffect` discarded it — annotation/tag `onSnapshot` listeners accumulated across each open/close of the viewer. After 10 opens, 10 sets of listeners fired per write. | Capture the cleanup; run it on unmount. |
| **S2** | While the popup was open composing an annotation, an accidental mouseup inside the PDF area would call `handleTextSelection`, find an empty `window.getSelection()`, and `setSelectionPage(null)` — silently breaking the Save button (early-returned in `createAnnotation`). | Added `popupTypeRef` and guarded the clearing path: if a popup is open, an empty selection event is ignored. |
| **S3** | Annotation/tag overlay rectangles had `pointerEvents: 'auto'` and click handlers, which caught clicks meant for the PDF text layer. Selecting text under or near an existing comment was blocked. | Overlay box now `pointerEvents: 'none'`; the small marker icon (already a separate element) carries `pointerEvents: 'auto'` and the click-to-open behavior. Also makes overlapping comments cleanly clickable. |
| **S4** | `handleVirtualizedScroll` hardcoded `pageHeight = 900`, but at scale 1.2 a US Letter PDF renders at ~1056px. Wrong pages were loaded/unloaded as you scrolled; annotations flickered. | Replaced with a measured `measuredPageHeight` state that the first rendered page sets from `node.offsetHeight` on `onRenderSuccess`. |
| **S5** | The placeholder for virtualized pages was 900px tall but visible pages rendered at the real height — toggling visibility on scroll shifted the scroll position. | `page-container` `minHeight` and placeholder height both use `measuredPageHeight` — visible/invisible pages now occupy identical vertical space. |
| **S6** | `(selectionRect as any).relativeX \|\| selectionRect.left/window.innerWidth` would drop a valid `0` (selection at the page's left edge) and substitute a window-relative coordinate. | Switched `\|\|` → `??` so only `null`/`undefined` triggers the fallback. |
| **S7** | The popup was placed once at selection time. Switching from the choice card (~120px) to the annotation textarea (~240px) could push it off the bottom of the viewport with no recovery. | Added a `useEffect` keyed on `popupType` that re-runs `calculatePopupPosition` with the actual content height. |
| **S8** | `loadAnnotations()` + `loadTags()` ran as one-shot `getDocs` immediately before the `onSnapshot` listeners were set up — brief race where the listener overwrote the one-shot result. Both functions also lingered as dead code consumers of `getDocs`. | Removed both one-shot loaders entirely; `onSnapshot` is the sole source of truth for annotations and tags now. |
| **S9** | **Tag popup unusable — sticks to cursor (reported by Francisco 2026-05-27 late).** The drag handler `onMouseDown={handlePopupMouseDown}` was wired on the OUTER popup div, so clicking the tag-type `<select>`, the text input, or any button started a drag. The popup followed the cursor and the click never reached the control — couldn't pick a tag, couldn't dismiss, couldn't save. The whole popup also had `cursor: 'grab'` and `userSelect: 'none'`, which made every input visually look draggable and broke text selection inside the textarea. | Moved `onMouseDown` to the header div only. Header gets `cursor: 'grab'` + `userSelect: 'none'` and a `⠿` drag-handle glyph for visual affordance. Body inherits default cursor so inputs/selects/buttons behave normally — the dropdown opens, you can type, you can save. |
| **S10** | **Highlight overlay drifts left of the actual selection (reported by Francisco 2026-05-27 late w/ screenshot).** Selection capture stored positions as fractions of `.react-pdf__Page`, but overlays rendered as % of `.page-container` — and the container is wider than the page (it's `display: flex; justify-content: center` so the page is centered with whitespace gutters on either side). Result: `50%` of the container ≠ `50%` of the page; the overlay drifts left by half the gutter and can wrap part of the word before the actual selection. Also: the `isSingleLine` decision used a hardcoded `pagePixelHeight = 900` (same out-of-date guess as S4), wrong for any non-Letter PDF or non-default zoom. | Wrapped `<Page>` + overlays in a `<div className="page-frame">` with `position: relative; display: inline-block; lineHeight: 0`. Inline-block shrinks the wrapper to the page's natural size, so `%` coordinates inside the wrapper refer to the same coordinate space as capture. The page-container still centers via flex. Also swapped the hardcoded `900` for `measuredPageHeight` so the single-line vertical-pad heuristic uses the live measurement. |

Also adopted while in there:
- **Optimistic resolve** in `toggleElementResolved` — the UI flips immediately instead of waiting for the `onSnapshot` round-trip; rolls back if the write fails.
- **Supervisor marker styling** — annotations created while in supervisor mode now render with a 🎓 amber marker (instead of the standard 💬 red). Reinforces the "teacher said something" signal visually on the page itself, not just in the side panel.

**Known issues not addressed in this pass** (logged for follow-up):
- `attachSelectionHandlers` re-runs on every page load with a 100ms timeout — wasteful but mostly benign. The cleanup it returns is still discarded. Worth tidying.
- `selection.getRangeAt(0)` is now guarded by a `rangeCount === 0` check, but the broader text-layer listener attach lifecycle could be tighter (attach once via event delegation on the scroll container, not per-page).
- Annotation panel still doesn't filter by "From teacher" per-page — only the global list filter chips do. Could add a per-page badge counter inside the page overlay.
- Drawing canvas overlay (separate feature, not used in the comment flow) is still present in the DOM but unused.

**Staged on `main`, NOT committed yet** (cumulative for the whole evening — G1→G4 + S1→S8):

**Staged on `main`, NOT committed yet** (entire G1→G4 set):
- [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) — G1: teacher self-tag state + toggle UI. G2: `onSnapshot` for workspaces + screenplays. G3: annotation-count subscriptions (`unresolvedCountByScreenplay`, `unresolvedFromTeacherCountByScreenplay`) + badges (💬 N · 🎓 N) on each screenplay row.
- [src/components/Collaboration/ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) — G4: fetches the screenplay's `workspaceId` on mount; `resolveSupervisorAtAuthorTime()` reads the workspace at write time; annotation/tag writes carry `supervisorAtAuthorTime: boolean`. G3: annotation panel gets filter chips (Open · Mine · From teacher · All) and a 🎓 supervisor badge per annotation.
- [firestore.rules](firestore.rules) — G1: `profileIsTeacher(uid)`, `isSelfSupervisorToggle(...)`, widened `workspaces` update rule. (G3/G4 don't need rule changes — they write to existing collections with existing rules.)
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) — this file (status table, G-series markers, this section).

**Critical manual step before the UI fully works in prod**:
```sh
firebase deploy --only firestore:rules
```
This affects G1 specifically — without it, the self-toggle button hits `permission-denied`. G2/G3/G4 all work against the already-deployed rules.

**Smoke test (G1 + G2 + G3 + G4)**:
1. Non-teacher account → workspace card shows "You: member", no toggle.
2. Teacher account in a workspace → "Act as supervisor" button appears; clicking flips chip to "You: supervisor (self)". *(needs rules deploy)*
3. As self-elected supervisor: deleting/updating a screenplay fails (rules deny). *(rules already enforce — verified at A4 stage)*
4. "Step down" reverts. *(needs rules deploy)*
5. Two browsers, same workspace → upload in one appears in the other within ~1s, no reload. *(G2 — should already work)*
6. Add an annotation while in supervisor mode → annotation panel shows 🎓 supervisor badge; hub row shows a 🎓 count badge. *(G3+G4)*
7. Toggle back to member, add another annotation → that one has no badge. Filter chips: "From teacher" shows the first annotation only.
8. Click "Resolve" on the supervisor-authored annotation → hub badge counts decrement; "Open" filter excludes it.

**Next step**: smoke-test the annotation flow against the S1–S8 fixes (the list below was the priority Francisco requested — verifying these come first before moving to G6). After that's confirmed smooth, G6 in-app notifications when a supervisor comments — a red dot on the user menu, optional email. Reuses the `users/{uid}/notifications` pattern (need to confirm `NotificationCenter.tsx` exists and its shape). Then G7 (drag-and-drop multi-upload + first-run empty state) is a small, satisfying win. Spec for both in the G-series below.

**Annotation smoke test (do this first)**:
1. Open the same PDF screenplay in two browsers as different workspace members. Add an annotation in one — appears in the other within ~1s (S1 — no leak means subscriptions don't stack).
2. Close the viewer, reopen it on a different screenplay, then back to the first — annotations don't double or duplicate (S1 again).
3. Select text. Click "Annotation". Click outside the popup, then click into the textarea — your selection is still saved (S2).
4. Drag-select text under an existing annotation overlay — selection works (S3); then click the 💬 marker — opens the panel (S3 marker still clickable).
5. Scroll fast through a 30-page PDF — pages load/unload smoothly, no scroll jumping, annotations stay anchored to their page (S4 + S5).
6. Zoom to 1.8× and scroll — same smooth behavior; first page render re-measures the height (S4 reacts to scale).
7. Select text exactly at the left edge of a page; create annotation; close + reopen — marker is at the correct x (S6).
8. Select a long passage spanning two lines; click "Annotation" — popup positioned in the visible viewport, even if the textarea is tall (S7).
9. Click "Resolve" on an annotation — the panel item visibly shifts to "resolved" state instantly (optimistic update); reload and confirm it persisted.
10. As the supervisor, create an annotation — the on-page marker is amber/🎓 instead of red/💬.

**Known risks to verify during smoke test**:
- The `.get('selfElectedSupervisors', [])` pattern in firestore.rules relies on Firestore-rules Map.get support — exists per docs, verify in the playground.
- `accessibleWorkspaceIdsKey` and `userScreenplaysKey` are derived in render; if they churn unnecessarily, the screenplay/annotation-count subscriptions tear down and rebuild on every render. Sanity-check via React DevTools profiler if you see network spam.
- `resolveSupervisorAtAuthorTime()` does one extra `getDoc` per write. Acceptable cost; only watch out if annotations are batch-added.

## "Great collaboration" roadmap — review of current state, 2026-05-27 (later in the day)

> Audit of the uncommitted work in this branch vs. the plan above. Goal stated by Francisco: *"I need for the collaboration with and among students to be great."*

### Status of plan items as-shipped (uncommitted on `main`)

| Plan step | Status | Evidence |
|---|---|---|
| A1 role union | ✅ done | `WorkspaceRole` in [src/types/Collaboration.ts:1](src/types/Collaboration.ts:1); `INVITABLE_WORKSPACE_ROLES` UI in [CollaborationHub.tsx:75](src/components/Collaboration/CollaborationHub.tsx:75) |
| A1.5 teacher self-tag | ✅ done (2026-05-27, later) | `isTeacher` loaded via `getDoc` in CollaborationHub; "Act as supervisor" toggle on each workspace card; firestore.rules helper `isSelfSupervisorToggle` permits the narrow self-toggle. Effective-role chip shows the resolved role. |
| A2 workspace persistence | ✅ done | `addDoc` at [CollaborationHub.tsx:637](src/components/Collaboration/CollaborationHub.tsx:637); `loadWorkspaces` queries by `memberIds` |
| A3 workspace-scoped screenplays | ✅ done | `workspaceId` on screenplay; [`syncWorkspaceScreenplayAccess`](src/components/Collaboration/CollaborationHub.tsx:491) fans out to `teamMembers` |
| A4 rules (workspaces + screenplays) | ✅ done | `canEditScreenplayData`, `keepsScreenplayOwnership`, `isWorkspaceReadOnlyParticipant` in [firestore.rules](firestore.rules). **Deploy still required** |
| A5 comment-count badges + quick action | ✅ done (2026-05-27, evening) — covered by G3 | unresolved + from-teacher count subscriptions in CollaborationHub; 💬 N and 🎓 N pills on each screenplay row |
| A6 invite-by-email | ❌ not built | UserAutocomplete still restricted to existing crew profiles |
| B (Fountain editor) | ❌ not started | no `FountainEditor.tsx`, no `fountain.ts` utility |
| **Beyond plan**: archive → soft-delete → 30-day recovery | ✅ done | [`handleArchiveWorkspace`](src/components/Collaboration/CollaborationHub.tsx:1037) etc.; rule branch on `deleteRecoverableUntil` in firestore.rules |
| **PDF viewer dark-grey/duplicate-text bug** | ✅ fixed | TextLayer.css + AnnotationLayer.css imports added in [ScreenplayViewer.tsx:4-5](src/components/Collaboration/ScreenplayViewer.tsx:4) |

### Live-data audit

The viewer is real-time (`onSnapshot` for annotations, tags, sessions, collaborators in [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx)). **The hub is now also live (2026-05-27, later)** — workspaces subscribed via `onSnapshot` keyed on `memberIds` array-contains; screenplays subscribed via three parallel onSnapshot queries (`uploadedBy`, `teamMembers array-contains`, `workspaceId in [...]`) with results merged client-side. New uploads, member changes, archive/restore, and screenplay deletions all appear without reload.

### What it takes to feel *great*, prioritized

For student↔teacher collaboration to feel great vs. just functional, the loop has to close in real time and the student has to *feel* the teacher's presence. Ordered by leverage; each one is a self-contained PR.

> **G1 + G2 + G3 + G4 all landed on 2026-05-27. Typecheck clean. firestore.rules diff (G1 only) is staged but not yet deployed — Francisco must run `firebase deploy --only firestore:rules` to activate the new helpers (`isSelfSupervisorToggle`, `profileIsTeacher`) and the widened `workspaces` update rule. Until that deploy, the self-toggle UI will hit a permission-denied write. G2 / G3 / G4 do NOT depend on the rules deploy and work today.**

#### G1. Teacher self-tag (`isTeacher` → `selfElectedSupervisors`) — ✅ DONE 2026-05-27

The plan step A1.5 in spec, never wired. Without it, students still need instructions on tagging the teacher.

- Read `crewProfiles/{currentUser.uid}.isTeacher` once on hub mount (already populated for teacher accounts).
- On the workspace details panel / member list, render a "Act as supervisor" toggle on the current user's own member chip — only if `isTeacher === true` AND they're not the owner.
- On toggle: `updateDoc(workspaceRef, { selfElectedSupervisors: arrayUnion/arrayRemove(currentUser.uid), updatedAt: serverTimestamp() })`.
- Compute effective role for UI display = `selfElectedSupervisors.includes(uid) ? 'supervisor' : member.role`.
- Confirm the rule in [firestore.rules](firestore.rules) allows this self-toggle. Current rule is `allow update: if … ownerId == request.auth.uid` — that **blocks** the teacher's self-toggle and must be widened with a narrow exception (see plan A1.5 rule sketch). Acceptance tests in A1.5 still apply.

**Files**: [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) (toggle UI + Firestore write), [firestore.rules](firestore.rules) (widen update rule), 5 rules-playground tests.

#### G2. Real-time hub (`getDocs` → `onSnapshot`) — ✅ DONE 2026-05-27

- Replace `getDocs` in [`loadWorkspaces`](src/components/Collaboration/CollaborationHub.tsx:368) with an `onSnapshot` subscription scoped to `where('memberIds', 'array-contains', currentUser.uid)`. Store the unsubscribe in a ref; tear down on unmount or user change.
- Same for the screenplay list (currently fetched in a `useEffect` against the screenplays collection — replace with `onSnapshot`).
- Watch out: the existing `normalizeWorkspace` step ([CollaborationHub.tsx:220](src/components/Collaboration/CollaborationHub.tsx:220)) must run inside the snapshot callback.
- Acceptance: open two browsers as different members. A uploads → B sees new row appear without reload. A renames workspace → B sees new title within seconds.

**Files**: [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) only.

#### G3. Comment-count badge + "open notes from teacher" filter — ✅ DONE 2026-05-27

- Each row in the screenplay list shows a count of unresolved annotations (`screenplayAnnotations` where `resolved !== true`). Use `getCountFromServer` once per row OR a single `onSnapshot` over the workspace's annotations grouped client-side (cheaper).
- A second pill shows count of unresolved annotations *authored by a supervisor* — that's the "teacher said something, you should look" signal. Drive off `annotation.supervisorAtAuthorTime === true` (a denormalized flag written at annotation creation; see G4 for where it gets written).
- Inside the viewer, the annotation side panel grows a status toggle (`open` / `addressed` / `resolved`) and a filter chip set ("Open · Mine · From teacher · All"). The `resolved` field already exists; just expose it.

**Files**: [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) (badges in screenplay list), [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) (status toggle + filters in annotation panel).

#### G4. Annotation provenance — denormalize `supervisorAtAuthorTime` — ✅ DONE 2026-05-27

Currently annotations store author info but not whether the author was acting as supervisor at the moment they commented. Without this, "from the teacher" filtering requires a join against the workspace's `supervisorIds`/`selfElectedSupervisors` at read time — expensive and stale.

- In `addAnnotation`/`addTag` (in [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx)), compute `const isSupervisor = workspaceSupervisorIds.includes(currentUser.uid) || workspaceSelfElected.includes(currentUser.uid)` and write `supervisorAtAuthorTime: isSupervisor` into the doc.
- Existing annotations get treated as `false` at read time (no backfill needed).
- Acceptance: an annotation Francisco creates while in supervisor mode shows up under the "From teacher" filter; toggling himself back to member and adding another annotation does NOT.

**Files**: [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) (annotation write paths).

#### G5. Activity feed in the workspace card — medium

The single feature that makes a workspace *feel alive*. Show the last 5–10 events in a small "Recent activity" strip on the selected workspace.

- Source of truth: a thin `workspaceActivity/{workspaceId}/events` subcollection, or a denormalized `recentActivity: ActivityEvent[]` array on the workspace doc (capped at 20, oldest dropped on push). Subcollection is cleaner; denorm is faster to read.
- Events to emit: `screenplay_uploaded`, `screenplay_deleted`, `annotation_created`, `member_added`, `member_self_promoted_supervisor`. Each carries `actorUid`, `actorName`, `screenplayId` (where relevant), `timestamp`, and a `verb`.
- Emission happens client-side at write time (no Cloud Function needed for v1).
- Display: side panel under the workspace's member list. "Maya uploaded Act1_v2.pdf · 3m ago" / "Francisco commented on Scene2.pdf · 1h ago" — names link to viewer at the right context.
- Acceptance: each emitting action lands a row within 2s for all subscribed clients.

**Files**: new `src/services/workspaceActivityService.ts`, [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) (display), [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) (emit on annotation create).

#### G6. Notifications on supervisor comments — medium

Students should know without checking. Two surfaces:

- **In-app**: a red dot on the user menu / a notification dropdown. Reuse the existing `NotificationCenter` ([src/components/NotificationCenter.tsx](src/components/NotificationCenter.tsx)) if it exists. Write a `users/{uid}/notifications/{nid}` doc on every supervisor-authored annotation (gated by `supervisorAtAuthorTime === true` from G4 so member-to-member chatter doesn't spam).
- **Email**: optional, behind a profile setting. Call the existing Cloud Function ([functions/src/emailService.ts](functions/src/emailService.ts)).

#### G7. Drag-and-drop multi-upload + first-run empty state — small/medium

- Replace the styled `<input type="file">` with a drop zone that also accepts the same input. Use the browser drag/drop events; no library needed.
- When a workspace has zero screenplays, render a friendly empty state with two CTAs: "Upload your first scene" and "Invite your teacher" (the latter only if the workspace lacks a supervisor).

#### G8. Workspace discussion thread (non-spatial) — medium

Annotations are pinned to PDF regions. For general messages ("Francisco, can you look at the climax?" / "I'm changing the opening, regenerate later") there's no surface. `RealTimeCollaboration.tsx` exists but isn't wired in.

- Wire `RealTimeCollaboration` as a tab inside the selected workspace (alongside Screenplays).
- Reuse `collaborationSessions` collection — schema and rules already exist.

#### G9. Mobile pass — small but important

Students use phones. The viewer has a `@media (max-width: 900px)` block (recently added); the hub doesn't. Audit and fix:

- Workspace cards: 1-up stack on narrow viewports.
- Modals: full-screen on narrow.
- Member list: avatar + name only, hide email until tapped.

#### G10. B-stream Fountain editor — separate workstream

Plan workstream B is untouched. After G1–G6 are in, B becomes the next "Wow" — a student can write a draft *in the page*, the teacher comments on it the same way as a PDF. The plan spec stands as-is.

### Suggested order

1. **G1 + G2** — pair these in one PR. G2 is mechanical; G1 unlocks your own workflow. Big payoff together.
2. **G4 + G3** — pair these. G4 is a one-line write, G3 is the consumer.
3. **G6** in-app notifications (drop email behind a setting for v2).
4. **G7** drag-drop + empty state. Quick polish.
5. **G5** activity feed.
6. **G9** mobile pass.
7. **G8** discussion thread.
8. **G10** Fountain editor (workstream B from the original plan).

### Things to remember at every step

- **Data safety**: still a live site, still PITR-backed, still gate any rule deploy on a rules-playground test. The current rules diff in [firestore.rules](firestore.rules) is ready but **not deployed** — confirm before pushing.
- **`npx tsc --noEmit`** is currently clean. Keep it that way every PR.
- **CORS** for Storage must include any new origin you serve from, otherwise PDF preview falls back to native open-in-tab.
- **No new collections without a rules entry.** G5 (`workspaceActivity`) and G6 (`users/{uid}/notifications`) both need explicit rules added in the same PR that introduces the writes.

## Resolved direction (confirmed 2026-05-27)

- ✅ **All workspace data must persist to Firestore.** The current behavior (in-memory only) is a bug, not a feature. A2 fixes it.
- ✅ **Group members edit + comment** on each other's work.
- ✅ **Supervisor = read + comment + annotate, NO edit.** Annotations they author carry a denormalized `supervisor: true` flag for evaluation-report filtering. The no-edit restriction is enforced both in UI and in Firestore rules — see A4.
- ✅ **Two paths to becoming a supervisor**: (a) owner/admin assigns the role when inviting / from member modal; (b) self-promotion by a member whose `crewProfiles/{uid}.isTeacher === true`. Spec in A1.5. This means students need no special instructions — they add the instructor as a normal member, and the instructor self-tags.
- ✅ **Editor toolbar with keyboard shortcuts** using `Alt`/`Option`+letter (free in browsers when textarea has focus + `preventDefault`); `Tab` cycles element types. Spec in B3a.
- ✅ **Invites must work at any phase**: creation, post-creation, upload, and after upload. Existing workspace screenplays must receive new workspace members in `teamMembers`.
- ✅ **Creator can archive/delete collaboration workspaces** with a 30-day soft-delete recovery period before permanent deletion.
- ✅ **PDF preview requires Storage CORS.** `cors.json` must include the active dev origin (`http://localhost:8000`) and production domains so PDF.js can fetch Firebase Storage screenplay files. Without that bucket-level CORS setting, the viewer falls back to the browser PDF preview.
- ✅ **PDF.js worker URL must resolve for the installed `pdfjs-dist` version.** `react-pdf` currently uses `pdfjs-dist@5.4.296`; cdnjs does not host that release, so the worker points at jsDelivr's npm package URL.

## Open questions still to confirm with Francisco

- **Are there real workspaces in production today?** A pre-step-A2 audit script should `getDocs(collection(db, 'workspaces'))` and report count + a sample doc shape. If the count is non-zero, A4's rule tightening needs a one-time backfill of `ownerId`/`memberIds`/`supervisorIds`/`viewerIds`/`selfElectedSupervisors`. Current evidence suggests count is 0 (the create handler never wrote) but verify before relying on it.
- **Email notifications on new comments — desired, or noisy?** A5 leaves this optional. Likely useful for students to be pinged when the teacher (supervisor-flagged annotation) commented; possibly noisy if all member-to-member comments trigger mail. One reasonable default: notify only when the comment author is a supervisor.
- **Fountain export to PDF — needed for MVP, or fine to defer?** B7 defers; confirm.

## Files an agent will touch (cheat-sheet)

| Step | File | Action |
|------|------|--------|
| A1 | [src/types/Collaboration.ts](src/types/Collaboration.ts) | Add `'supervisor'` to role union |
| A1 | [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) | Role dropdown in create + add-member modals |
| A2 | [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) | `addDoc` in handleCreateWorkspace; rewrite `loadWorkspaces` query; add `memberIds` to add-member writes |
| A3 | [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) | Add workspaceId to upload; group list by workspace |
| A4 | [firestore.rules](firestore.rules) | Replace workspaces match block |
| A5 | [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) + [src/components/Collaboration/ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) | Comment count badges; deep link into comments panel |
| A6 | [src/components/Collaboration/UserAutocomplete.tsx](src/components/Collaboration/UserAutocomplete.tsx) | Email lookup fallback |
| A7 | [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) + [src/types/Collaboration.ts](src/types/Collaboration.ts) | Workspace archive/delete/restore fields and UI |
| B1 | [src/types/Collaboration.ts](src/types/Collaboration.ts) (or a screenplay-specific types file) | Add `format`, `fountainSource`, `fountainUpdatedAt` |
| B2 | [src/components/Collaboration/CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx) | "Start writing" button + modal |
| B3 | new `src/components/Collaboration/FountainEditor.tsx` | Editor component |
| B4 | new `src/utilities/fountain.ts` + tests | Parser + page-count heuristic |
| B5 | new `src/components/Collaboration/FountainViewer.tsx` + [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) | Read-only renderer + branch on `format` |
| B6 | [src/components/Collaboration/ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx) | Wire annotation side panel for Fountain docs |
