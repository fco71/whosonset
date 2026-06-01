---
title: WhosOnSet Project Overview
last_reviewed: 2026-06-01
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
- Supervisors and owners can export a workspace-level grading CSV with student, screenplay, review status, review note, annotation/tag details, author, supervisor flag, resolved state, and timestamp.
- Screenplay deletion is gated to the screenplay uploader or workspace owner in both UI and Firestore rules.
- Screenplay tag updates/deletes now follow the same moderation model as annotations: ordinary participants cannot close/delete someone else's tag; managers can address supervisor notes; supervisors can moderate review notes.
- Chat email notifications honor the chat email preference and are throttled to one email per recipient/conversation every 30 minutes. In-app notifications still update per message.
- Project-management collections (`tasks`, project crew/budget/timeline/document/milestone records, collaborative tasks, and breakdown elements) are now project-scoped in Firestore rules instead of readable/writable by any authenticated user. New legacy `Projects` records keep a `crewMemberIds` access list for rule checks.

## Latest Verification

Local checks on 2026-06-01:

- `npm run test:run` passes: 72 tests across 8 files.
- `npm run build` passes. Latest build emitted `main.5bf19c76.js`, `4381.502476a9.chunk.js`, `4287.91b132f0.chunk.js`, `4649.5fc1a464.chunk.js`, `6025.aafa9326.chunk.js`, and `runtime.9403c756.js`.
- Firebase CLI and `gcloud` are both authenticated as `iam@myfilmjobs.com`; `gcloud` project is `my-film-jobs`.
- `firebase deploy --project my-film-jobs --only firestore:rules` succeeded after project-management rule hardening. The rules dry run also compiled successfully before deploy.
- Commit `0a461f79` (`Include review notes in grading export`) was pushed to `main`; GitHub Actions run `26760811755` completed successfully and deployed production Hosting.

Live production QA on 2026-06-01:

- Auth sanity remains verified from the latest production pass: fresh email/password signup is forced to `/verify-email`; direct `/` access redirects back while unverified; verified email/password login enters the app; Google sign-in button remains visible.
- Home, Collaboration, and Screenplay Viewer loaded with CSS intact after the production CSS extraction change.
- EN -> ES -> EN language toggle worked without blank text or client errors.
- Production grading CSV export passed after `0a461f79`: the downloaded CSV included the student, screenplay, annotation, tag, teacher author, resolved `Yes` and `No` states, `Review status`, `Review note`, `Changes requested`, and the teacher review note text.
- Mobile PDF screenplay viewer smoke passed at 390px width against production: the PDF canvas rendered, the collaboration side panel defaulted collapsed, the panel did not cover the document, there was no horizontal overflow, and no console errors were observed.
- Successful disposable CSV/PDF QA data was cleaned up after testing:
  - `codex.csv.teacher.1780323486990@example.com`
  - `codex.csv.student.1780323486990@example.com`
  - `codex.csv.teacher.1780323846411@example.com`
  - `codex.csv.student.1780323846411@example.com`
- After Firebase CLI reauth, the earlier failed CSV attempt cleanup was completed by deleting the two orphan public `crewProfiles`, the two known first-run `workspaceMemberships`, and the two exact failed-test workspace IDs:
  - `crewProfiles/RDRa6IhS76dWBXQKIHWS5TiOO7s1`
  - `crewProfiles/w3yLq0lNmCeCrYbw37RqhfFHPxk2`
  - `workspaceMemberships/codex_csv_ws_1780323197646_RDRa6IhS76dWBXQKIHWS5TiOO7s1`
  - `workspaceMemberships/codex_csv_ws_1780323197646_w3yLq0lNmCeCrYbw37RqhfFHPxk2`
  - `workspaces/codex_csv_ws_1780323197646`
  - `workspaces/codex_csv_ws_1780323332157`
- Public `crewProfiles` queries now return no matches for the `codex.csv.*.1780323197646@example.com` and `codex.csv.*.1780323332157@example.com` disposable accounts.

Last full student/teacher collaboration QA:

- Student account: `codex.qa.student.20260531-003504@example.com` / `Codex QA Student 2026-05-31`
- Teacher account: `codex.qa.teacher.20260531-003504@example.com` / `Codex QA Teacher 2026-05-31`
- Workspace: `qDc2q2bNvq6GU6Aet8gD`
- Fountain screenplay: `mZZxdF6yX5vDAD2jv7lh`
- Covered: workspace creation, invite accept, teacher self-promotion, annotation, tag, @mention, request-changes note, student address flow, delete protection, activity/history, and grading report path.
- Do not store their password in git. Reset in Firebase Auth or recreate accounts if another agent needs to reuse them.

Deployment status:

- GitHub Actions Hosting deploy for commit `0a461f79` succeeded and deployed the grading CSV review-note fix.
- Firestore rules were deployed directly from local after project-management access hardening.
- GitHub Actions Functions deploy run `26719755692` succeeded from commit `86b576a4`.
- All 18 Gen 2 Cloud Functions were confirmed `ACTIVE` on `nodejs22`.
- GitHub workflow actions were upgraded to Node 24-compatible majors: `actions/checkout@v6`, `actions/setup-node@v6`, and `google-github-actions/auth@v3`.

## Recommended Next Steps

1. Move arbitrary client-created top-level notifications toward server-side creation to reduce spam/phishing risk.
2. Replace client-side all-profile member search with an indexed search or callable search endpoint before larger classroom use.
3. Add lightweight automated tests around review-status transitions, @mention matching, supervisor permission gating, and grading CSV row generation.
4. Plan a separate `firebase-functions` package upgrade; deploy logs warn the current package is outdated and may have breaking changes when upgraded.
5. Lower the screenplay/project-document upload cap and warning copy before broader classroom use. `CollaborationHub` still defaults workspace `maxFileSize` to `100MB`, while Storage document uploads are capped at `25MB`; both are higher than needed for screenplays.
6. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is stable.

## Known Gaps

- Most collaboration behavior is still covered by manual QA rather than automated integration tests.
- Member search still scans all crew profiles client-side.
- The supplemental screenplay `teamMembers` collection subscription was removed because Firestore denied that broad list query; current collaboration loading relies on `uploadedBy` and workspace-scoped screenplay queries.
- Public `crewProfiles` reads and authenticated `users/{userId}` reads are intentional current behavior but should be reviewed before broader launch if contact info needs tighter privacy.
- A restore drill has not been performed against Firestore backups. Backups are configured, but a restore into a throwaway database would prove the process.
