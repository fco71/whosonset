---
title: WhosOnSet Project Overview
last_reviewed: 2026-05-30
status: current operating summary
---

## Source Of Truth

This file is the current operating overview for WhosOnSet / My Film Jobs. Older files under `docs/` are historical unless they explicitly say they were refreshed on or after 2026-05-30.

Primary collaboration reference: [src/components/Collaboration/IMPLEMENTATION_ROADMAP.md](src/components/Collaboration/IMPLEMENTATION_ROADMAP.md)

## Production Targets

- Live site: `https://myfilmjobs.com`
- Firebase project: `my-film-jobs`
- Firebase CLI / Console account: `iam@myfilmjobs.com`
- Production Hosting site: `myfilmjobs-com`
- Secondary Hosting site: `my-film-jobs`

Do not deploy Firebase Hosting, Firestore, Storage, Functions, indexes, or secrets from any other Google account. If `firebase login:list` shows another active account, switch back to `iam@myfilmjobs.com` before deploying.

## Stack

- Frontend: React 18, TypeScript 5.8, Webpack 5, TailwindCSS, SCSS
- Backend: Firebase Auth, Firestore, Storage, Hosting, Cloud Functions v2
- Email: Gmail SMTP through Cloud Functions
- Tests: Vitest
- PDF review: `react-pdf`
- Drag and drop: `@dnd-kit/core`

## Data Safety

This is a live production site with real user data. Do not run destructive Firestore operations, bulk deletes, schema migrations, collection drops, or account/test-data cleanup without explicit approval in the current conversation.

Current guardrails:

- Firestore PITR is enabled.
- Weekly Firestore backups are scheduled.
- Firestore database delete protection is enabled.
- The capital `Projects/` and lowercase `projects/` collections are both treated as live until a planned migration proves otherwise.
- Existing ad-hoc JSON backup scripts are not a backup of record because they do not cover every collection and subcollection.

## Current Product State

- Existing email/password login now routes successful sign-ins directly into the app. Email verification is only forced during new email signup.
- New email/password signup sends verification email and routes to `/verify-email`.
- Google sign-in creates a missing crew profile only when needed and sends existing users into the app.
- Collaboration workspaces persist in Firestore and are discovered through `workspaceMemberships`; collection listing remains blocked by rules.
- Students can create a workspace, upload a PDF screenplay, or start a Fountain screenplay.
- Workspace invitations support member, supervisor, and viewer roles through the notification Accept/Decline flow.
- Teachers can self-promote to supervisor when their profile is marked `isTeacher` or `profileType: 'teacher'`.
- PDF and Fountain screenplays share the same review workflow: draft, submitted, changes requested, approved.
- Teachers can leave annotations, tags, replies, review-status notes, and @mentions.
- Teacher-authored annotations/tags are visually differentiated and can be filtered from peer notes.
- Students can mark individual teacher notes or all teacher notes addressed.
- Student acknowledgement writes workspace activity and auto-marks matching in-app note/mention notifications read.
- Workspace Recent activity and screenplay History show review progress.
- Supervisors and owners can export a workspace-level grading CSV.
- Screenplay deletion is gated to the screenplay uploader or workspace owner in both UI and Firestore rules.
- Production builds extract CSS into a separate `main.*.css` file and lazy-load the Spanish locale bundle.
- Chat email notifications honor the chat email preference and are throttled to one email per recipient/conversation every 30 minutes. In-app notifications still update per message.

## Deployment Snapshot

Verified on 2026-05-30:

- `firebase login:list` active account: `iam@myfilmjobs.com`.
- Production Hosting site `myfilmjobs-com` live release: 2026-05-30 13:15:43 America/Santo_Domingo, deployed by `github-action-whosonset@my-film-jobs.iam.gserviceaccount.com`.
- Live `https://myfilmjobs.com/` references extracted CSS (`main.30bb8bb6.css`) and split JS assets.
- Live extracted CSS asset returns HTTP 200.
- Cloud Functions list shows `notifyNewMessage` active on v2 / `nodejs20`, updated 2026-05-30 13:28:28 America/Santo_Domingo.
- Cloud Functions list includes the callable collaboration functions: `respondToWorkspaceInvitation`, `cleanupUserWorkspaces`, and `setWorkspaceSupervisorMode`.

## Verification Snapshot

Local checks on 2026-05-30:

- `npx tsc --noEmit` passes.
- `npm run test:run -- --run` passes: 41 tests.
- `npm run build` passes. Entrypoint `main` is 907 KiB and the previous Webpack 1 MiB warning is gone.
- `npm --prefix functions run build` passes.

Code-level recommendation checks reviewed on 2026-05-30:

- Login fix: confirmed in `LoginPage.tsx`; successful email/password login navigates to the app instead of `/verify-email`.
- New signup path: confirmed in `RegisterPage.tsx`; new email/password signup still routes to `/verify-email`.
- Language toggle: confirmed in `Navigation.tsx` + `i18n.ts`; EN/ES changes call the lazy-load wrapper before switching and preserve `?lang=`.
- Styling infrastructure: confirmed in Webpack config, local production build output, and live Hosting HTML/CSS responses.
- @mention typeahead: confirmed in `ScreenplayViewer.tsx`; annotation/tag inputs match workspace members and support click, Enter, Tab, arrows, and Escape.
- Notification read behavior: confirmed in `useNotifications`, `NotificationBell`, and `ScreenplayViewer`; clicking marks read, and acknowledging teacher notes marks related note/mention notifications read.
- Delete protection: confirmed in `CollaborationHub.tsx` and `firestore.rules`; non-owner members cannot delete someone else's screenplay.

Not verified from this environment:

- Existing-account live login, because no test credentials were provided.
- Fresh production signup, because creating a live account is a side effect that should be done intentionally.
- Full two-account student/teacher assignment loop.
- Visual browser checks for collaboration and screenplay viewer, because the in-app browser was unavailable in this session.
- Phone/mobile layout on a real device.
- Actual grading CSV contents from live data.

## Recommended Next Steps

1. Run the full two-account manual QA loop on production: student workspace creation, PDF/Fountain screenplay, teacher invite, annotation, tag, @mention, supervisor review note, student acknowledgement, activity/history confirmation, and grading CSV export.
2. Do the Tier 1 live account checks with known test accounts: existing login routes into the app; new signup routes to verification; EN/ES switch has no blank text; home/collaboration/viewer styling looks intact.
3. Run a real mobile screenplay-viewer check on a phone or narrow browser: PDF remains visible, side panel toggle works, and action buttons wrap cleanly.
4. Add lightweight automated tests around the highest-risk logic: review-status transitions, mention matching, notification auto-clear, and delete/supervisor permission gating.
5. Replace client-side all-profile member search with an indexed search or callable search endpoint before broader classroom-scale use.
6. Upgrade Cloud Functions from Node.js 20 before Firebase removes/deprecates Node 20 deployment support.
7. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is verified.

## Known Current Gaps

- Login/Register pages are still mostly English even when Spanish mode is selected.
- Most collaboration behavior is covered by manual QA rather than automated tests.
- Cloud Functions currently run on Node.js 20.
- Member search still scans all crew profiles client-side.
- Generated build artifacts such as `dist/`, `bundle-analysis.html`, and `.specstory/` should stay untracked.
