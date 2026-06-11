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
- Commit `56866a2b` (`Harden project management Firestore rules`) was pushed to `main`; GitHub Actions run `26768768291` completed successfully and deployed production Hosting.

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

- GitHub Actions Hosting deploy for commit `56866a2b` succeeded and deployed the project-management rule hardening companion code.
- Firestore rules were deployed directly from local after project-management access hardening.
- GitHub Actions Functions deploy run `26719755692` succeeded from commit `86b576a4`.
- All 18 Gen 2 Cloud Functions were confirmed `ACTIVE` on `nodejs22`.
- GitHub workflow actions were upgraded to Node 24-compatible majors: `actions/checkout@v6`, `actions/setup-node@v6`, and `google-github-actions/auth@v3`.

Auth-deletion cleanup trigger (2026-06-02) — DEPLOYED to production (`onAuthUserDeleted(us-central1)`, Node.js 22 **1st Gen**, `✔ Successful create operation`; surgical `firebase deploy --only functions:onAuthUserDeleted` from `iam@myfilmjobs.com` after a `firebase login --reauth`):

- New module `functions/src/onAuthUserDeleted.ts`, exported from `functions/src/index.ts`. A **1st-gen** `functions.auth.user().onDelete` trigger (`firebase-functions/v1`; coexists with the Gen 2 functions). Fires on EVERY auth deletion path — Console, Admin SDK, and in-app self-delete — which is the durable fix for the "deleted-in-Auth user still shows in Crew" problem (Console deletes bypass the client cleanup; no auth trigger existed before).
- Purpose: when an Auth user is deleted, remove their web-app footprint so they stop appearing (e.g. the Crew directory backed by `crewProfiles`).
- DELIBERATELY CONSERVATIVE scope (runs automatically, no human confirming at delete-time). DELETES only unambiguously-personal data: `crewProfiles/{uid}` (the directory profile — core ask), `UserCollections/{uid}`, `users/{uid}` (+ its `notifications`/`savedJobs`/`favoriteApplicants` subcollections), `userPreferences/{uid}`, `emailTracking/{uid}`, the user's own `workspaceMemberships` docs, the user's own top-level `notifications`, and strips the uid from member arrays of workspaces they were a MEMBER of.
- PRESERVES shared/collaborative data: workspaces the deleted user OWNS (e.g. a teacher's workspace full of student screenplays) and all screenplays/annotations are LEFT IN PLACE; the trigger logs a warning with the owned workspace IDs for manual review instead of deleting them. This is intentionally more conservative than the in-app self-delete (`cleanupUserWorkspaces`, which hard-deletes owned workspaces) because that path is user-initiated with consent and this one is admin/console-initiated.
- Idempotent + best-effort (missing docs swallowed). `npm --prefix functions run build` passes; `lib/onAuthUserDeleted.js` emitted.
- DEPLOYED 2026-06-02 (see header above). Post-deploy verification still TODO: delete a DISPOSABLE test Auth account and confirm its `crewProfiles` doc disappears from Crew (do NOT test with a real account — the cleanup is a hard delete and irreversible). Check Cloud Functions logs for the `[onAuthUserDeleted] uid=... cleanup summary` line and any `owned ... workspace(s) ... PRESERVED` warning.
- Note (pre-existing, not from this change): the deploy surfaced a `functions.config()` / Cloud Runtime Config DEPRECATION NOTICE — those APIs shut down March 2026 and any function still relying on `functions.config()` will fail to deploy after that. Fold into the deferred `firebase-functions` upgrade work (migrate to the `params` package; `firebase functions:config:export` assists).

Teacher-privilege hardening (2026-06-10) — CODE COMPLETE, NOT YET DEPLOYED:

- Vulnerability closed: supervisor self-election was gated on `crewProfiles.isTeacher` / `profileType == 'teacher'`, which are USER-WRITABLE fields (the profile editor at `EditCrewProfile.tsx` writes them) — any student could mark themselves a teacher and self-elect supervisor (grading CSV access, teacher-styled annotations).
- New privilege source of truth: `teacherRoles/{uid}` — existence == admin-verified teacher. Rules: self-read only, `allow write: if false` (Admin SDK only). `profileIsTeacher()` replaced with `isVerifiedTeacher()` checking that collection; `crewProfiles` teacher fields are now cosmetic/display-only and must never gate privileges again.
- Client: `CollaborationHub.tsx` teacher gate now reads `teacherRoles/{uid}` existence instead of profile flags.
- Admin scripts (ADC auth, dry-run by default): `scripts/audit-teacher-flags.cjs` (read-only: lists teacher claimants vs grants, plus `selfElectedSupervisors` entries lacking a grant) and `scripts/grant-teacher-role.cjs <uid> [--revoke] --apply`.
- Guard test added to `securityRules.test.ts` (locks `isVerifiedTeacher`/`teacherRoles` shape, forbids regression to crewProfiles-field gating). `vitest run` 74/74 green; `tsc --noEmit` clean.
- DEPLOY ORDER (not yet done): (1) run audit script, (2) grant `teacherRoles` to every legitimate teacher found, (3) `firebase deploy --only firestore:rules`, (4) deploy Hosting for the CollaborationHub change, (5) re-run audit; remove any ungranted `selfElectedSupervisors` entries. Granting BEFORE the rules deploy avoids locking real teachers out of self-promotion; the brief overlap window is no worse than the status quo.
- Residual (deliberate): students can still cosmetically label themselves "Teacher" in the directory (`crewProfiles` display fields stay user-writable so the existing profile-type UI keeps working). Locking that down is a product decision — e.g. hide the teacher option behind verification — tracked separately. Full review: `ROBUSTNESS_REVIEW.md`.

## Recommended Next Steps

1. Notification hardening — **Phase 1 DONE 2026-06-01** (`a866d50c`, deployed via `firebase deploy --only firestore:rules`): the top-level `/notifications` create rule now requires `link` to be absent/empty/internal-relative (`^/([^/].*)?$`, <500 chars — blocks `javascript:`, `http(s)://`, `//host` phishing links) plus title<300 / body<2000 caps; `securityRules.test.ts` guards it. Client creation still allowed (audit showed writes are inconsistent — social uses `relatedUserId`, job/interview set no `senderId` — so `senderId`-based rules were NOT viable). All current writes verified compliant (links internal/absent/empty; `socialService.ts:428` uses `actionUrl || ''`, hence the empty-string allowance). **Phase 2 (deferred, post-assignment):** normalize the notification write schema (consistent `senderId`), move creation server-side one event type at a time (invitation, follow, chat, applicationMessages, interview, annotations/tags/mentions, review-status/collaborator-add), then flip to `create: if false`. Write sites: jobApplicationService, messagingService, socialService(.v2), CollaborationHub, ScreenplayViewer, InterviewScheduler.
2. Replace client-side all-profile member search with an indexed search or callable search endpoint before larger classroom use.
3. Add lightweight automated tests around review-status transitions, @mention matching, supervisor permission gating, and grading CSV row generation.
4. Plan a separate `firebase-functions` package upgrade; deploy logs warn the current package is outdated and may have breaking changes when upgraded.
5. ~~Lower the screenplay/project-document upload cap~~ — DONE 2026-06-01 (`b3e83fb9`). `CollaborationHub` now uses `MAX_UPLOAD_BYTES` (25MB, = the Storage `isDocumentUpload` cap) for all default `maxFileSize` values, and `uploadSingleScreenplay` rejects oversized files up front with a localized `fileTooLarge` toast instead of letting them fail opaquely at Storage. Hosting-only (no rules change). Lower both `MAX_UPLOAD_MB` and storage.rules together if a tighter cap (e.g. 10MB) is later wanted.
6. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is stable.

## Deferred Plan - Phase 2: Server-Side Notification Creation

Goal and end rule: make top-level notifications creatable only by Cloud Functions
using the Admin SDK, ending at this rule:

```rules
match /notifications/{notificationId} {
  allow read, update, delete: if ownsUserId(resource.data);
  allow create: if false;
}
```

This is the complete fix because clients can no longer create arbitrary
notification documents at all. Phase 1 reduced damage by blocking external links
and oversized payloads, but a signed-in client can still create spam or
impersonation-shaped notifications for any `userId`. `create: if false` closes
that vector; server triggers still work because the Admin SDK bypasses rules.

Prerequisite: normalize notification writes through one canonical doc builder
before migrating event types. Current client writes have schema drift: social uses
`relatedUserId`; job/interview writes often omit `senderId`; collaboration writes
`senderId`, `senderName`, `titleKey`, `bodyKey`, and `i18nParams`. The builder
should own the exact shape:

```ts
{
  userId,              // recipient uid
  type,
  title, body, message, // English fallback strings; message mirrors body
  titleKey, bodyKey, i18nParams,
  link, actionUrl,    // internal-relative only; actionUrl mirrors link
  relatedId,
  applicationId, relatedApplicationId,
  senderId, senderName,
  status,
  metadata,
  isRead: false,
  read: false,
  createdAt,
  timestamp
}
```

The keys+params/render-at-read design means triggers do not need server-side
i18n. Functions should write `titleKey`, `bodyKey`, `i18nParams`, plus English
fallback `title/body/message`; the recipient's client renders the final localized
text when the notification is read.

Per-event-type migration loop, repeated one notification type at a time:

1. Add or extend the Cloud Function trigger to write through the canonical
   builder. Keep the current client write in place for now.
2. Run `npm --prefix functions run build`, then deploy only the affected
   function(s).
3. Verify in production with logs plus the recipient's bell/inbox. Check the
   document shape, link, `read/isRead`, fallback text, and localized rendering.
4. Remove the client-side write for that event, run `npm run build`, push/deploy
   Hosting if frontend code changed.
5. Re-test that event for duplicates and missed notifications, then update this
   overview before moving to the next type.

Sequencing rule: deploy the trigger before removing the client write. A brief
duplicate-notification window is safer than a missed notification. Flip
`allow create` to `false` only after every event type below is migrated and
verified. Then update `src/securityRules.test.ts` from the Phase 1 link/cap guard
to an explicit `allow create: if false` guard.

Event inventory:

| Event | Client write refs | Server trigger status | Migration action |
| --- | --- | --- | --- |
| Chat message | `src/services/messagingService.ts:711` | `functions/src/index.ts:1768` `notifyNewMessage` exists for email only | Extend it to write in-app before email preference/cooldown early returns. |
| Legacy follow request | `src/services/socialService.ts:78`, helper writes at `src/services/socialService.ts:422` | `functions/src/index.ts:1718` `notifyFollowRequest` exists for email only | Extend create trigger to write in-app to `toUserId`. |
| Legacy follow accepted | `src/services/socialService.ts:186`, helper writes at `src/services/socialService.ts:422` | No accepted-update trigger | Add `followRequests/{requestId}` update trigger for `status: accepted`. |
| v2 follow request | `src/services/socialService.v2.ts:102`, helper writes at `src/services/socialService.v2.ts:429` | No `follows` create trigger | Add `follows/{followId}` create trigger for pending requests. |
| v2 follow accepted | `src/services/socialService.v2.ts:138`, helper writes at `src/services/socialService.v2.ts:429` | No `follows` accepted-update trigger | Add `follows/{followId}` update trigger for accepted requests. |
| Social collaboration request | `src/services/socialService.ts:952` | No trigger and no durable request collection confirmed | Confirm whether this path is still used. If used, migrate to a real request doc + trigger/callable; if unused, remove or disable. |
| Job application created/self-confirmation | `src/services/jobApplicationService.ts:397` | `functions/src/index.ts:1201` notifies job poster, not applicant self-confirmation | Decide whether applicant self-confirmation is still needed; if yes, add it to the create trigger. |
| Job application status | `src/services/jobApplicationService.ts:426` | `functions/src/index.ts:1240` already writes in-app for status changes | Remove stale client helper path after verifying current call sites use the trigger. |
| Job application message | `src/services/jobApplicationService.ts:447` | `functions/src/index.ts:1283` covers `jobApplications/{applicationId}/messages`, not top-level `applicationMessages` | Either add top-level `applicationMessages/{messageId}` trigger or migrate the service to the subcollection path. |
| Workspace invitation created | `src/components/Collaboration/CollaborationHub.tsx:434`, `src/components/Collaboration/CollaborationHub.tsx:450` | `functions/src/workspaceInvitations.ts:74` handles accept/decline only | Add `workspaceInvitations/{invitationId}` create trigger for invitee notification. |
| Interview scheduled | `src/components/JobSearch/InterviewScheduler.tsx:166` | No trigger | Add `interviews/{interviewId}` create trigger. |
| Supervisor annotation/tag | `src/components/Collaboration/ScreenplayViewer.tsx:961` | No trigger | Add `screenplayAnnotations/{annotationId}` and `screenplayTags/{tagId}` create triggers using `supervisorAtAuthorTime` and screenplay `uploadedBy`. |
| Annotation/tag @mentions | `src/components/Collaboration/ScreenplayViewer.tsx:1147` | No trigger | Reuse the annotation/tag create triggers to parse mentions and notify matching collaborators. |
| Collaborator added | `src/components/Collaboration/ScreenplayViewer.tsx:2115` | No trigger | Add `screenplays/{screenplayId}` update trigger comparing `teamMembers` before/after. |
| Review status changed | `src/components/Collaboration/ScreenplayViewer.tsx:2250`, `src/components/Collaboration/ScreenplayViewer.tsx:2266` | No trigger | Add `screenplays/{screenplayId}` update trigger comparing `reviewStatus`. |
| Manual social test notification | `src/components/Social/SocialTestPage.tsx:113` via `SocialService.createNotification` | No trigger | Remove this manual create path or replace it with a safe test of normal flows. |

Risks and gotchas:

- Silent gaps: if a client write is removed before the matching trigger is live,
  that notification type stops. Use logs plus recipient UI checks for every type.
- Duplicate window: trigger-before-client-removal can briefly produce duplicates.
  This is acceptable while migrating; verify and remove the client write quickly.
- Shape drift: off-shape docs can render blank or fail filters. The canonical
  builder and a test guard should lock the field list and defaults.
- Deploy coordination: Functions and Hosting deploy separately; deploy functions
  first, then frontend removal, then rules.
- `src/services/socialService.ts:428` currently writes `link: actionUrl || ''`.
  Keep the empty-string case working until that helper is removed, because Phase 1
  rules intentionally allowed empty links for this path.

## Known Gaps

- Most collaboration behavior is still covered by manual QA rather than automated integration tests.
- Member search still scans all crew profiles client-side.
- The supplemental screenplay `teamMembers` collection subscription was removed because Firestore denied that broad list query; current collaboration loading relies on `uploadedBy` and workspace-scoped screenplay queries.
- Public `crewProfiles` reads and authenticated `users/{userId}` reads are intentional current behavior but should be reviewed before broader launch if contact info needs tighter privacy.
- A restore drill has not been performed against Firestore backups. Backups are configured, but a restore into a throwaway database would prove the process.
