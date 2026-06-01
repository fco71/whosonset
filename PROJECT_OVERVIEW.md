---
title: WhosOnSet Project Overview
last_reviewed: 2026-05-31
status: current operating summary
---

## Source Of Truth

This is the current handoff for WhosOnSet / My Film Jobs. Older files under `docs/` are historical unless they explicitly say they were refreshed on or after 2026-05-30.

Primary collaboration reference: `src/components/Collaboration/IMPLEMENTATION_ROADMAP.md`

Handoff rule: after meaningful code, rules, deploy, QA, or product-state changes, update this file before ending the session. Do not store real passwords, API keys, app passwords, or other secrets in tracked docs.

## Production Targets

- Live site: `https://myfilmjobs.com`
- Firebase project: `my-film-jobs`
- Firebase CLI / Console account: `iam@myfilmjobs.com`
- Production Hosting site: `myfilmjobs-com`
- Secondary Hosting site: `my-film-jobs`

Only deploy Firebase Hosting, Firestore, Storage, Functions, indexes, or secrets from `iam@myfilmjobs.com`.

## Stack

- Frontend: React 18, TypeScript 5.8, Webpack 5, TailwindCSS, SCSS
- Backend: Firebase Auth, Firestore, Storage, Hosting, Cloud Functions v2
- Functions runtime: Node.js 22 in production
- Email: Gmail SMTP through Cloud Functions
- Tests: Vitest
- PDF review: `react-pdf`

## Data Safety

This is a live production app with real user data. Do not run destructive Firestore operations, bulk deletes, schema migrations, collection drops, or account/test-data cleanup without explicit approval in the current conversation.

Current guardrails:

- Firestore PITR is enabled.
- Weekly Firestore backups are scheduled.
- Firestore database delete protection is enabled.
- Capital `Projects/` and lowercase `projects/` are both treated as live until a planned migration proves otherwise.
- Build artifacts such as `dist/`, `bundle-analysis.html`, and `.specstory/` should stay untracked.

## Current Product State

- Email/password signup requires verification for new accounts. New profiles get `emailVerificationRequired: true`, land on `/verify-email`, and cannot enter the app until Firebase reports `emailVerified`.
- Existing unmarked accounts and Google sign-in users can still enter normally.
- Login/Register/Verify Email pages are localized in EN/ES.
- Collaboration workspaces persist in Firestore and are discovered through `workspaceMemberships`; workspace collection listing remains blocked.
- Students can create workspaces, upload PDF screenplays, or start Fountain screenplays.
- Workspace invitations support member, supervisor, and viewer roles through the notification Accept/Decline flow.
- Teachers can self-promote to supervisor when their profile is marked `isTeacher` or `profileType: 'teacher'`.
- PDF and Fountain screenplays share review statuses: draft, submitted, changes requested, approved.
- Teachers can leave annotations, tags, replies, review-status notes, and @mentions.
- Teacher-authored annotations/tags are visually differentiated, filterable, and addressable by the screenplay manager/student.
- Students can mark individual teacher notes or all teacher notes addressed. This writes workspace activity and auto-marks matching note/mention notifications read.
- Workspace Recent activity and screenplay History show review progress.
- Supervisors and owners can export a workspace-level grading CSV.
- Screenplay deletion is gated to the screenplay uploader or workspace owner in both UI and Firestore rules.
- Screenplay tag updates/deletes now follow the same moderation model as annotations: ordinary participants cannot close/delete someone else's tag; managers can address supervisor notes; supervisors can moderate review notes.
- Chat email notifications honor the chat email preference and are throttled to one email per recipient/conversation every 30 minutes. In-app notifications still update per message.

## Latest Verification

Local checks on 2026-05-31:

- `npm run test:run` passes: 71 tests across 8 files.
- `npm run build` passes. Latest build emitted `main.b5ac00a7.js`, `717.0312b616.chunk.js`, and `717.c99762f6.css`.
- `firebase login:list` active account: `iam@myfilmjobs.com`.
- `firebase deploy --project my-film-jobs --only firestore:rules` succeeded after the screenplay-tag rules hardening.
- Commit `d2a13b45` (`Harden screenplay tag moderation`) was pushed to `main`; GitHub Actions run `26730813074` completed successfully and deployed production Hosting.

Live production QA on 2026-05-31:

- Auth sanity: fresh email/password signup is forced to `/verify-email`; direct `/` access redirects back while unverified; verified email/password login enters the app; Google sign-in button remains visible.
- Disposable auth QA accounts used during the latest checks were disabled or deleted after testing:
  - `codex.auth.1780276428623@example.com`
  - `codex.auth.full.1780276984832@example.com`
  - `codex.mobile.1780277652796@example.com`
- Mobile screenplay viewer smoke at 390px width passed against production: Fountain text rendered, the collaboration panel defaulted collapsed, the panel did not overlap the document, and there was no horizontal overflow. Temporary workspace/screenplay data for this check was cleaned up.
- Home, Collaboration, and Screenplay Viewer previously loaded with CSS intact after the production CSS extraction change.
- EN -> ES -> EN language toggle previously worked without blank text or client errors.

Last full student/teacher collaboration QA:

- Student account: `codex.qa.student.20260531-003504@example.com` / `Codex QA Student 2026-05-31`
- Teacher account: `codex.qa.teacher.20260531-003504@example.com` / `Codex QA Teacher 2026-05-31`
- Workspace: `qDc2q2bNvq6GU6Aet8gD`
- Fountain screenplay: `mZZxdF6yX5vDAD2jv7lh`
- Covered: workspace creation, invite accept, teacher self-promotion, annotation, tag, @mention, request-changes note, student address flow, delete protection, activity/history, and grading report path.
- Do not store their password in git. Reset in Firebase Auth or recreate accounts if another agent needs to reuse them.

Deployment status before this session:

- GitHub Actions Hosting deploy for commit `662dd199` succeeded and deployed the verification gate.
- GitHub Actions Functions deploy run `26719755692` succeeded from commit `86b576a4`.
- All 18 Gen 2 Cloud Functions were confirmed `ACTIVE` on `nodejs22`.
- GitHub workflow actions were upgraded to Node 24-compatible majors: `actions/checkout@v6`, `actions/setup-node@v6`, and `google-github-actions/auth@v3`.

## Recommended Next Steps

1. Manually verify the production grading CSV download from the UI and confirm rows show student, teacher notes, resolved state, and review note as expected.
2. Run a real-phone PDF screenplay viewer check: side panel toggle, visible document area, and action buttons.
3. Harden the broad project-management Firestore rules in a focused session. Current risky collections include `tasks`, `projectCrew`, `projectBudgets`, `projectTimelines`, `projectDocuments`, `projectMilestones`, `projectBudget`, `collaborativeTasks`, and `breakdownElements`.
4. Move arbitrary client-created top-level notifications toward server-side creation to reduce spam/phishing risk.
5. Replace client-side all-profile member search with an indexed search or callable search endpoint before larger classroom use.
6. Plan a separate `firebase-functions` package upgrade; deploy logs warn the current package is outdated and may have breaking changes when upgraded.
7. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is stable.

## Known Gaps

- Most collaboration behavior is still covered by manual QA rather than automated integration tests.
- Member search still scans all crew profiles client-side.
- The supplemental screenplay `teamMembers` collection subscription was removed because Firestore denied that broad list query; current collaboration loading relies on `uploadedBy` and workspace-scoped screenplay queries.
- Public `crewProfiles` reads and authenticated `users/{userId}` reads are intentional current behavior but should be reviewed before broader launch if contact info needs tighter privacy.
- A restore drill has not been performed against Firestore backups. Backups are configured, but a restore into a throwaway database would prove the process.
