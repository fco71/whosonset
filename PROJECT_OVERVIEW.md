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

- Email/password login honors the verification gate: accounts marked `emailVerificationRequired` are forced to `/verify-email` until Firebase reports `emailVerified`; older unmarked accounts still sign in normally.
- New email/password signup marks the crew profile with `emailVerificationRequired: true`, attempts to send a verification email, and routes to `/verify-email`. If the initial send fails, signup still completes and the user can retry from the verification page; the app shell redirects marked unverified accounts away from public/protected app routes until verification is complete.
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
- GitHub Actions run `26719101266` completed successfully for commit `4a2c9b3a`; it deployed production Hosting with no Node.js 20 deprecation annotation and no checkout/submodule cleanup warning.
- Firestore rules were also deployed directly with `firebase deploy --project my-film-jobs --only firestore:rules`.
- Live `https://myfilmjobs.com/` references extracted CSS (`main.30bb8bb6.css` in the current live app shell at verification time) and split JS assets.
- Live extracted CSS asset returns HTTP 200.
- Cloud Functions production runtime is Node.js 22. `gcloud functions list --v2 --project=my-film-jobs --regions=us-central1` confirmed all 18 Gen 2 functions are `ACTIVE` on `nodejs22`, updated around 2026-05-31 17:40 UTC.
- Cloud Functions list includes the callable collaboration functions: `respondToWorkspaceInvitation`, `cleanupUserWorkspaces`, and `setWorkspaceSupervisorMode`.
- GitHub Actions workflow run `26719755692` completed successfully for `Deploy Firebase Functions` and deployed production Functions from commit `86b576a4`.
- GitHub Actions run `26728304221` completed successfully for commit `662dd199` and deployed the email-verification gate fix to production Hosting.
- The GitHub deploy service account `github-action-whosonset@my-film-jobs.iam.gserviceaccount.com` now has the extra deploy permissions Firebase CLI required for Functions: `roles/firebase.viewer`, `roles/secretmanager.viewer`, and `roles/cloudscheduler.admin` on project `my-film-jobs`; plus `roles/iam.serviceAccountUser` on `my-film-jobs@appspot.gserviceaccount.com` and `403346239424-compute@developer.gserviceaccount.com`.
- GitHub Actions workflow actions were upgraded to Node 24-compatible majors on 2026-05-31: `actions/checkout@v6`, `actions/setup-node@v6`, and `google-github-actions/auth@v3`.
- Local `.claude/` worktrees are ignored and untracked so GitHub checkout cleanup does not treat them as malformed submodules.

## Verification Snapshot

Local checks on 2026-05-31:

- `npm run test:run` passes: 62 tests (added email-verification gate unit tests on 2026-05-31).
- `npm run build` passes. Entrypoint `main` is 907 KiB.
- Firestore rules compile and deploy successfully.

Live production QA on 2026-05-31:

- Existing unmarked unverified email/password login lands in the app, not `/verify-email`; newly created email/password accounts are marked for verification and must stay on `/verify-email` until verified.
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
- Fresh production signup gate re-check after commit `662dd199`: disposable account `codex.verify.1780272276161@example.com` landed on `/verify-email`, and manually opening `/` redirected back to `/verify-email`. The account was disabled in Firebase Auth after the check; its orphaned `crewProfiles`/`UserCollections` docs may remain.

Recommendation checks reviewed:

- Login fix: `LoginPage.tsx` can request the intended route after sign-in, while the app-level verification gate redirects any marked unverified account back to `/verify-email`.
- New signup path: `RegisterPage.tsx`, legacy `Register`, and `RegisterForm` route email/password signup to `/verify-email`; `AuthContext` marks new email/password profiles with `emailVerificationRequired: true`.
- Language toggle: confirmed live and in `Navigation.tsx` + `i18n.ts`; EN/ES changes call the lazy-load wrapper before switching and preserve `?lang=`.
- Styling infrastructure: confirmed in Webpack config, local production build output, and live Hosting HTML/CSS responses.
- @mention typeahead: confirmed in data path and `ScreenplayViewer.tsx`; annotation/tag inputs match workspace members.
- Notification read behavior: live data confirmed note/mention notifications can be cleared when notes are addressed.
- Delete protection: confirmed live, in `CollaborationHub.tsx`, and in `firestore.rules`; non-owner members cannot delete someone else's screenplay.
- Live browser QA via a throwaway signup account (2026-05-31) found a verification-gate regression: a fresh signup could enter the app without completing email verification. Fixed and deployed: new email/password profiles are marked `emailVerificationRequired: true`, the app shell/route guards force marked unverified accounts back to `/verify-email`, initial verification-email send failure is non-fatal so the account is not left half-created, and the verification page's "Back to sign in" action now signs out first. Re-verified live after deploy with `codex.verify.1780272276161@example.com`: signup landed on `/verify-email` and `/` redirected back there before verification; the QA account was disabled. The same QA session also found and fixed the crewProfile display-name bug: names were resolved via `where('uid','in',...)` but those docs are keyed by doc-id with the `uid` field omitted at signup, so the grading-report **Student** column and viewer **collaborator/active-users** names fell back to "Crew Member <last4>". Fixed to doc-id `getDoc` lookups (commits `1b7632a6`, `09a167dc`), deployed, and re-verified live: Student column and active-users now show the real name ("QA Claude"). Throwaway account `qa.claude.0531b@example.com` (uid `BQxRlYvHMdQ0JkhynP9kCxiDghu2`) was DISABLED in Firebase Auth on 2026-05-31. Its orphaned Firestore docs remain (crewProfile, UserCollections, "QA Test Workspace", "QA Test Screenplay", one annotation, workspaceMembership) — harmless but the public crewProfile "QA Claude" may still list in the crew directory; delete those docs if a full scrub is wanted.
- Functions-backed paths spot-check via production logs (2026-05-31): all four healthy on `nodejs22`. `curateDailyBlogPosts` ran on schedule ("Stored 3 curated posts" at 07:41 UTC, correctly "Daily quota already reached" at 15:41). `respondToWorkspaceInvitation` shows callable verifications passing (auth VALID). `notifyNewMessage` is ACTIVE with SMTP_USER/SMTP_PASS/EMAIL_FROM secrets still bound after the redeploy (no recent sends in window). `setWorkspaceSupervisorMode` has no runtime errors. The ONLY error-severity entries were a transient deploy-time IAM failure at 17:37 UTC (`github-action-whosonset` missing `iam.serviceaccounts.actAs` on the compute SA) — already resolved by granting `roles/iam.serviceAccountUser`; the 17:40 redeploy succeeded. No function RUNTIME errors found.

## Recommended Next Steps

1. Manually verify the actual grading CSV download from the production UI and confirm the rows show student, teacher notes, resolved state, and review note as expected.
2. Run a real phone check on a screenplay viewer, especially PDF mode: side panel toggle, visible document area, and action buttons.
3. Add lightweight automated tests around review-status transitions, @mention matching, notification auto-clear, and supervisor/delete permission gating.
4. Replace client-side all-profile member search with an indexed search or callable search endpoint before broader classroom-scale use.
5. ~~Spot-check production Functions-backed paths after the Node.js 22 deploy~~ — DONE 2026-05-31 (see "Recommendation checks reviewed": all four functions healthy on nodejs22; only a transient, already-resolved deploy-time IAM error in logs).
6. Plan a separate `firebase-functions` package upgrade; deploy logs warn the current package is outdated and may have breaking changes when upgraded.
7. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is stable.

## Security Review (2026-05-31)

Holistic read of `firestore.rules` (832 lines) + `storage.rules` (104). Good baseline: both have a default-deny `if false` catch-all; reference data (countries/cities/jobDepartments/jobTitles) is read-only; the collaboration surface (workspaces, screenplays, annotations, tags, workspaceActivity, memberships, invitations) is properly scoped by ownership/membership.

Findings, by priority — **none fixed inline** (tightening needs schema work + careful testing on a live DB; do NOT change without a focused, gated session):

1. **TOP — over-broad project-management collections.** `tasks` (`if request.auth != null`) and `projectCrew, projectBudgets, projectTimelines, projectDocuments, projectMilestones, projectBudget, collaborativeTasks, breakdownElements` (all `read, write: if signedIn()`) let ANY authenticated user read/write/**delete** every doc in those collections. The rules file flags this as deliberate interim state ("still need project-member-level schema work"). Integrity risk is the real concern given the irrecoverable-data posture (a buggy/malicious client could wipe another project's budget/tasks). Fix requires a `projectId`/member field on the docs + membership checks in rules. `collaborativeTasks` is reachable from the Collaboration Tasks tab, so it's live attack surface for students. Schedule a focused hardening session.
2. **Medium — broad reads of personal data.** `users/{userId}` is readable by any authenticated user (comment: "messaging compatibility"); `crewProfiles` is `read: if true` (fully public, including `contactInfo` email/phone, even for unpublished profiles). Likely intentional for a public directory, but worth a conscious decision on whether email/phone should be world-readable.
3. **Low–medium — client-written notifications.** Top-level `notifications` `create` only requires `signedIn() && userId is string`, so any user can create a notification for any other user with arbitrary title/body/link — a spam/phishing vector. Hardening = move notification creation server-side (Cloud Functions).
4. **Low — Storage `signedIn()` read scope.** `chat-uploads/voice-messages/chat-images/chat-audio` and `project-documents` allow read by any authenticated user who has the (unguessable, token-bearing) path, not strictly conversation/project members. Common Firebase tradeoff; acceptable with unguessable paths.

Backup posture verified (read-only): PITR ENABLED, delete protection ENABLED, weekly Sunday backup schedule (~98-day retention), and 3 READY backups present (2026-05-17/24/31). **Not yet verified: an actual restore drill** — backups that have never been restored are unproven. Recommend a one-time restore into a throwaway database.

## Known Current Gaps

- Login/Register/Verify-Email pages are now localized (en+es) via the `auth.*` namespace.
- Password policy is intentionally minimal (early adoption): a single 6-character minimum (`MIN_PASSWORD_LENGTH` in `utilities/passwordValidation.ts`, matching Firebase's floor). No complexity rules; the strength meter + requirements checklist were removed from Register + Reset-Password. This is signup/reset-only — login never checks complexity, so no existing user is locked out. (This also retired the earlier password-strength localization sub-gap — those strings no longer exist.)
- Most collaboration behavior is covered by manual QA rather than automated tests.
- Cloud Functions deploys now work through the manual GitHub Actions workflow. Keep the workflow manual unless/until there is a deliberate reason to deploy Functions on every Hosting push.
- Member search still scans all crew profiles client-side.
- The supplemental screenplay `teamMembers` collection subscription was removed because Firestore denied that broad list query; current collaboration loading relies on `uploadedBy` and workspace-scoped screenplay queries.
- Generated build artifacts such as `dist/`, `bundle-analysis.html`, and `.specstory/` should stay untracked.
