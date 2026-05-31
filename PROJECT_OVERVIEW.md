---
title: WhosOnSet Project Overview
last_reviewed: 2026-05-31
status: current operating summary
---

## Source Of Truth

This file is the current operating overview for WhosOnSet / My Film Jobs. Older files under `docs/` are historical unless they explicitly say they were refreshed on or after 2026-05-30.

Primary collaboration reference: [src/components/Collaboration/IMPLEMENTATION_ROADMAP.md](src/components/Collaboration/IMPLEMENTATION_ROADMAP.md)

Handoff rule: after meaningful code, rules, deploy, QA, or product-state changes, update this file before ending the session so another agent can resume without reconstructing chat history. Do not store real passwords, API keys, app passwords, or other secrets in this tracked document.

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

Verified on 2026-05-31:

- `firebase login:list` active account: `iam@myfilmjobs.com`.
- For the absolute latest push/deploy status, run `git status -sb` and `gh run list --branch main --limit 3`.
- Most recent product/test status commit verified in this review: `de372e6a docs: bump verified test count to 58 (password + notification unit tests)`.
- GitHub Actions run `26718637139` completed successfully for commit `de372e6a` and deployed production Hosting.
- GitHub Actions run `26718698162` completed successfully for doc-only commit `93eabe34` and deployed production Hosting.
- GitHub Actions run `26718760393` completed successfully for doc-only commit `8628cb8b` and deployed production Hosting.
- Firestore rules were also deployed directly with `firebase deploy --project my-film-jobs --only firestore:rules`.
- Live `https://myfilmjobs.com/` references extracted CSS (`main.30bb8bb6.css` in the current live app shell at verification time) and split JS assets.
- Live extracted CSS asset returns HTTP 200.
- Cloud Functions list shows `notifyNewMessage` active on v2 / `nodejs20`, updated 2026-05-30 13:28:28 America/Santo_Domingo.
- Cloud Functions list includes the callable collaboration functions: `respondToWorkspaceInvitation`, `cleanupUserWorkspaces`, and `setWorkspaceSupervisorMode`.
- GitHub Actions workflow actions were upgraded to Node 24-compatible majors on 2026-05-31: `actions/checkout@v6`, `actions/setup-node@v6`, and `google-github-actions/auth@v3`.
- Local `.claude/` worktrees are ignored and untracked so GitHub checkout cleanup does not treat them as malformed submodules.

## Verification Snapshot

Local checks on 2026-05-31:

- `npm run test:run` passes: 58 tests (added password-policy + notification-helper unit tests on 2026-05-31).
- `npm run build` passes. Entrypoint `main` is 907 KiB.
- Firestore rules compile and deploy successfully.

Live production QA on 2026-05-31:

- Existing unverified email/password login lands in the app, not `/verify-email`.
- Home, Collaboration, and Screenplay Viewer load with CSS intact.
- EN -> ES -> EN language toggle works without blank text or client errors.
- Fresh email/password signup lands on the verification screen.
- Student/teacher collaboration loop was exercised with disposable production accounts:
  - Student account: `codex.qa.student.20260531-003504@example.com` / `Codex QA Student 2026-05-31`
  - Teacher account: `codex.qa.teacher.20260531-003504@example.com` / `Codex QA Teacher 2026-05-31`
  - Do not store their password in git. Reset in Firebase Auth or recreate accounts if another agent needs to reuse them.
- Student created workspace `qDc2q2bNvq6GU6Aet8gD` and Fountain screenplay `mZZxdF6yX5vDAD2jv7lh`.
- Teacher accepted invite, self-promoted to supervisor, added an annotation, added a tag, included an @mention, and requested changes with a review note.
- Delete protection blocked teacher from deleting the student's screenplay.
- Student can now mark the teacher annotation addressed; teacher annotation content edits by the student remain denied.
- Workspace-scoped screenplay History query succeeds.
- Browser smoke after deploy showed no Firestore permission errors in the console.
- Mobile collaboration viewport smoke at 390px width showed no horizontal overflow.

Recommendation checks reviewed:

- Login fix: confirmed live and in `LoginPage.tsx`; successful email/password login navigates to the app instead of `/verify-email`.
- New signup path: confirmed live and in `RegisterPage.tsx`; new email/password signup still routes to `/verify-email`.
- Language toggle: confirmed live and in `Navigation.tsx` + `i18n.ts`; EN/ES changes call the lazy-load wrapper before switching and preserve `?lang=`.
- Styling infrastructure: confirmed in Webpack config, local production build output, and live Hosting HTML/CSS responses.
- @mention typeahead: confirmed in data path and `ScreenplayViewer.tsx`; annotation/tag inputs match workspace members.
- Notification read behavior: live data confirmed note/mention notifications can be cleared when notes are addressed.
- Delete protection: confirmed live, in `CollaborationHub.tsx`, and in `firestore.rules`; non-owner members cannot delete someone else's screenplay.

## Recommended Next Steps

1. Manually verify the actual grading CSV download from the production UI and confirm the rows show student, teacher notes, resolved state, and review note as expected.
2. Run a real phone check on a screenplay viewer, especially PDF mode: side panel toggle, visible document area, and action buttons.
3. Add lightweight automated tests around review-status transitions, @mention matching, notification auto-clear, and supervisor/delete permission gating.
4. Replace client-side all-profile member search with an indexed search or callable search endpoint before broader classroom-scale use.
5. Upgrade Cloud Functions away from Node.js 20 before forced platform migration deadlines.
6. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is stable.

## Known Current Gaps

- Login/Register/Verify-Email pages are now localized (en+es) via the `auth.*` namespace.
- Password policy is intentionally minimal (early adoption): a single 6-character minimum (`MIN_PASSWORD_LENGTH` in `utilities/passwordValidation.ts`, matching Firebase's floor). No complexity rules; the strength meter + requirements checklist were removed from Register + Reset-Password. This is signup/reset-only — login never checks complexity, so no existing user is locked out. (This also retired the earlier password-strength localization sub-gap — those strings no longer exist.)
- Most collaboration behavior is covered by manual QA rather than automated tests.
- Cloud Functions currently run on Node.js 20.
- Member search still scans all crew profiles client-side.
- The supplemental screenplay `teamMembers` collection subscription was removed because Firestore denied that broad list query; current collaboration loading relies on `uploadedBy` and workspace-scoped screenplay queries.
- Generated build artifacts such as `dist/`, `bundle-analysis.html`, and `.specstory/` should stay untracked.
