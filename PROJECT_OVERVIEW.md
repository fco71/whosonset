---
title: WhosOnSet Project Overview
last_reviewed: 2026-06-12
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

- Collaboration is group-centric (2026-06-11): `/collaboration` lists the user's groups (workspaces) plus a personal "My screenplays" tab and a supervisor review queue; each group has its own page at `/collaboration/:workspaceId` (`WorkspaceDetailPage`) with the group's screenplays, upload/start-writing, members, activity feed, invite (owner), supervisor self-toggle, and the grading CSV export. The old workspace-card "Open" button used to only show a fake "Successfully joined workspace" toast; it now navigates to the group page. Group uploads happen on the group page; the hub upload is personal-only. Visible nav/tab strings say "Groups"/"Grupos"; deeper strings (settings modal, invitation notifications) still say "workspace". No Firestore schema or rules changes — purely client navigation/IA.
- Shared collaboration modules: `workspaceAccess.ts` (pure role/capability helpers + normalizers, mirrors firestore.rules), `screenplayService.ts` (upload/fountain-create/delete/review-status/invitations/grading-CSV Firestore writes), `ScreenplayList.tsx` (row UI), `crewSearch.ts` (cached crewProfiles search). `CollaborationHub.tsx` and `WorkspaceDetailPage.tsx` both consume these; role semantics must be changed in `workspaceAccess.ts` only.
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

Local checks on 2026-06-11 (group-centric collaboration restructure):

- `npx tsc --noEmit` clean; `npx webpack --mode production` compiled successfully.
- `npx vitest run` passes: 77 tests across 8 files.
- Dev server: `/collaboration` and `/collaboration/:id` resolve and redirect to `/login` when signed out; no console errors.
- Deployed to the development hosting site (`npm run deploy:dev`, https://my-film-jobs.web.app) on 2026-06-11; Francisco click-tested the group-centric flows there against live data and approved, then pushed the change to `main` himself (commit `a8c5ce9a`). The production Actions deploy succeeded (run 27357596727) and https://myfilmjobs.com now serves the group-centric collaboration UI.
- Follow-up increment (2026-06-11, in production via `0d5386dc`): accepting a group invitation now navigates the student straight to the group page (NotificationCenter), and a wording pass moved user-visible collaboration strings from "workspace" to group/grupo (27 locale values per language + 22 hardcoded literals; i18n keys and Firestore fields unchanged). tsc clean, tests pass.
- Scene-feature review fixes (2026-06-12, deployed: tightened rules released after dry-run, dev hosting serving bundle main.79878614.js): a 7-angle review of the scene feature found and fixed: (1) parseSlugText bugs — "INTERROGATION ROOM" parsed as INT + "ERROGATION ROOM", hyphenated locations ("JEAN-PAUL'S APARTMENT", "DRIVE-IN") truncated at the hyphen; parser MOVED to src/utilities/fountain.ts (next to SCENE_PREFIXES), word-boundary prefix regex + spaced-dash split + forced-heading dot stripping, 6 unit tests added (86 total); sceneService re-exports it. (2) Scene marks now stamp supervisorAtAuthorTime (same provenance as annotations) so a student manager can't delete the teacher's marks; panel delete gating goes through canModerateScreenplayElement like annotations/tags (supervisors/owners can now moderate junk marks). (3) screenplayScenes rules tightened — create validates field types/sizes (location ≤200, synopsis ≤2000, note/selection ≤500, intExt enum, pageNumber number, position map); update additionally requires CURRENT canAccessScreenplay and affectedKeys ⊆ the 6 text fields (anchor immutable); guardrail test asserts both + no `||` — deployed 2026-06-12 after reauth (backward-compatible, current clients send all validated fields). (4) scene_removed now actually logged (viewer passes onSceneDeleted → activity feed). (5) sceneForPosition is scan-all (sorted-input contract removed); sceneCsvCell/sceneHeading shared by both CSV exports and the panel (inline duplicates deleted). (6) Selection choice-card height corrected (was clipping below the fold for bottom-of-page selections); scene-number prefill is position-aware; sceneNotes/scenesByPage memoized; scene-panel note clicks reuse navigateToElement (pulse highlight); jump queries scoped to the viewer's container; scenes subscription skipped for Fountain docs; orphaned scenes.expand/collapse locale keys removed.
- Scene feature in production (2026-06-12): Francisco approved and asked to commit+deploy; commit `ffb858f1` pushed, Actions run 27387348737 succeeded, myfilmjobs.com serves the scene navigator. Follow-up increment ON THE DEV SITE (uncommitted): scene markers now render on the PDF pages themselves (purple divider + "SC #" badge at each anchor, gated by the existing overlay toggle — Francisco's "identifiable in the pdf" requirement), and both CSV exports gained a Scene column (viewer breakdown export via sceneForPosition; the workspace grading CSV also fetches screenplayScenes per chunk). New shared sceneForPosition helper; ScenesPanel reuses it.
- Scene marks (2026-06-11, deployed to the dev site; rules released to the live project after dry-run): new `screenplayScenes` collection (anchored like annotations: pageNumber + relative position + selection text; fields sceneNumber/intExt/location/timeOfDay/note; rules mirror annotations — author-only edits keeping identity, moderation-model deletes; guardrail test added, 80 tests). The PDF selection popup now offers Scene alongside annotation/tag — the form prefills by parsing the selected slug ("INT. BAR - NIGHT" → INT/BAR/NIGHT via sceneService.parseSlugText) and suggests the next number. New ScenesPanel sidebar section (above Annotations) lists scenes in document order with jump-to-page navigation, per-scene expandable nesting of annotations/tags (assigned by page+y position; pre-first-scene notes in a "front matter" bucket), inline author edit, and delete. Fountain screenplays auto-derive their scene list from slug lines (parseFountain) with jump anchors (data-scene-line in FountainPages) — no manual marking needed there. Activity verbs scene_marked/scene_removed; EN/ES under screenplay.scenes. Reworked same day to match Francisco's reference screenshots (Final Draft Navigator + Movie Magic breakdown sheet): the panel is now a filterable TABLE (Pg | # | I/E | Location · time) with a selected-scene detail pane below (full heading, synopsis, note, the scene's notes — tags keep their category color — and author edit/delete). Scenes gained a `synopsis` field (no rules change needed; update rule already allows non-identity fields). Fountain rows reach full parity by parsing slug text into I/E + location columns.
- Roster exclusions (2026-06-11, deployed to the dev site): every roster row is now individually removable — manual entries are dropped, group-derived students get EXCLUDED via a new `teacherClasses.excludedUids` array (their group stays in the class), merged rows get both in one atomic write (`removeStudentFromRoster`). Excluded students appear in a strike-through "Excluded from this class" list with per-student restore (`restoreStudentToClass`), and the group page's "+ My classes" action restores an excluded student instead of duplicating. No rules change (owner-only doc). This completes Francisco's "add whole groups, manage students as individuals, undo mistakes" model: group add (both directions) + per-student remove + restore.
- Code-review consolidation pass (2026-06-11, deployed: rules released to the live project after dry-run, dev hosting updated after Francisco reauthed): a 7-angle review of the day's uncommitted diff found and fixed: (1) lost-update races on teacherClasses — membership writes now use atomic arrayUnion/arrayRemove + dot-path studentChecks updates via new classService ops (setWorkspaceInClass, addWorkspacesToClass, addManualStudentToClass, removeManualStudentFromClass [arrayRemove needs the exact stored object], setStudentTick); (2) uid-linked roster entries now MERGE into derived rows (unlink button via manualId) instead of being hidden un-removably; (3) per-class pending guard so a pending toggle on class A no longer swallows clicks on class B; (4) firestore.rules workspaceAssignments: description validated (string, ≤5000) on create+update, update additionally requires current canAccessWorkspace, stale "Immutable in v1" comment fixed — NEW RULES NOT YET DEPLOYED (backward-compatible with deployed clients: both always send string descriptions); (5) guardrail test hardened (update clause must stay a single conjunction — no `||`); (6) ClassDetailPage split into two effects (manual-roster edits no longer re-fetch the whole class ≈500 reads), render maps memoized, per-group counts derived from the one screenplay list, roster profile names from the cached fetchAllCrewProfiles instead of N getDocs; (7) new shared ScreenplayViewerModal replaces 3 copy-pasted viewer embeddings; shared isTurnedIn/TURNED_IN_STATUSES in workspaceAccess; student work panel now renders via shared ScreenplayList (read-only); CollaborationErrorBoundary localized via the i18n instance. tsc clean, 79 tests pass, prod build compiles. Deployed 2026-06-11 after reauth: rules released, dev hosting serving the fix batch + roster exclusions (bundle main.9621b454.js).
- Group→class send controls (2026-06-11, on the dev site, NOT yet committed/pushed): the group page (teacher-only, when classes exist) shows a "Your classes" box with a checkbox per class to put/remove THIS group in a class from where its members are visible, plus a per-member "+ My classes" action that adds that student to a chosen class roster as a uid-LINKED manualStudents entry ({id, name, uid}) — linked entries resolve live profile name/avatar, share the uid tick/work key with derived entries, dedupe automatically when the student's group later joins the class, and warn instead of duplicating (already-via-group / already-on-roster). The class page's add-groups picker now shows a member-name preview under each group (cached crewProfiles fetch). No rules changes (teacherClasses is owner-writable).
- Class roster work view + assignment editing (2026-06-11, on the dev site, NOT yet committed/pushed): roster rows on /collaboration/class/:classId show per-student works/turned-in chips and expand ("show work") into the student's screenplays across the class — group, review-status chip, assignment tag, and a View button that opens ScreenplayViewer in place. The class load now also fetches workspaceAssignments per group (chunked) for the chips. Assignments became editable: creator-only, title/description/updatedAt only (rules `update` changed from `false` to a constrained diff().affectedKeys() check — deployed to the live project after dry-run; workspaceId/createdBy immutable; guardrail test updated). Edit button appears on the group page only for the creator; cross-posted copies are separate docs, edited per group.
- Collaboration i18n completion pass (2026-06-11, on the dev site, NOT yet committed/pushed): 61 hardcoded English literals in CollaborationHub (toasts, window.confirm dialogs, card action buttons, archive/restore/delete lifecycle messages, add-member + settings modal labels, status chips, recovery notes) and 3 NotificationCenter invitation toasts now go through t() with new EN/ES keys (collaboration.auth/groupLifecycle/cardActions, additions under createWorkspaceModal/workspaceSettings/addMemberModal, notifications.invitation*). Several previously-unused keys (searching/noFriendsFound/startTyping/settings labels) are now wired. Remaining English: the CollaborationErrorBoundary crash strings (class component, rare path) and one unreachable default-case message — deliberate. tsc clean, 79 tests pass.
- ALL of the 2026-06-11 increments below are now LIVE IN PRODUCTION: Francisco pushed them himself as commit `0d5386dc` ("ongoing v1") after dev-site testing; Actions run 27364847071 deployed hosting successfully and myfilmjobs.com serves the bundle.
- Inviter-side notification deep link (2026-06-11): `respondToWorkspaceInvitation`'s notifyInviter now links accepted-invitation notifications to `/collaboration/:workspaceId` (declines keep `/collaboration`). Function compiled and deployed to production via `firebase deploy --only functions:respondToWorkspaceInvitation`. NOTE: this one-file functions change is deployed but was NOT yet committed — include `functions/src/workspaceInvitations.ts` in the next commit to keep the repo in sync with deployed code.
- Teacher classes layer (2026-06-11, in production via `0d5386dc`): private `teacherClasses` collection (owner-only rules, creation requires an admin-granted `teacherRoles` doc; rules deployed additively to the live project same day — zero removed lines, dry-run compiled first). Teachers get a "My classes" hub tab (gated on `teacherRoles`, deep-linkable via `/collaboration?tab=classes`) and a class page at `/collaboration/class/:classId` with: the class's groups (one-shot stats + refresh, open/remove), an add-groups picker over all their active groups, class-wide assignment posting (filters to groups where they may post, reports skipped), a student roster auto-derived from group members (minus the teacher) plus manual name-only entries, one tick per student with a clear-all (generic reusable tracker), and a per-class to-do checklist. Deleting a class never touches groups — it's an organizer overlay only. Students see none of it. EN/ES under collaboration.classes; guardrail test added (79 tests).
- Group assignments v1 (2026-06-11, in production via `0d5386dc`): new `workspaceAssignments` collection (title + optional instructions, no due dates). Owner or effective supervisor posts to a group; cross-posting uses a PER-GROUP PICKER of the teacher's other active postable groups (Francisco teaches multiple classes that accumulate over terms, so "post to all my groups" is deliberately NOT offered; archiving a class hides its groups from the picker). Assignments are an optional overlay on the verbal hand-in workflow: untagged uploads are first-class everywhere, the upload "for assignment" dropdown only renders when assignments exist, and students see no Assignments section in groups that have none. Group page lists assignments with works/turned-in rollups, uploads and Fountain creations can tag an assignment (`screenplays.assignmentId`, set at creation only), rows show an assignment chip, and the activity feed logs assignment_created/deleted. The ADDITIVE rules block for `workspaceAssignments` was dry-run compiled and DEPLOYED to the live project on 2026-06-11 (safe: no existing rules touched; production code doesn't reference the collection yet). securityRules.test.ts has a guardrail for the block (78 tests total). EN/ES strings under collaboration.assignments ("Tareas").

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
- DEPLOYED 2026-06-02 (see header above), but it NEVER WORKED until 2026-06-13. BUG: 1st-gen functions default to the **App Engine** service account (`my-film-jobs@appspot.gserviceaccount.com`), which on this project lacks Firestore access — every invocation died on its first `.get()` with `PERMISSION_DENIED` (Admin SDK bypasses rules, so that denial is IAM, not rules). The post-deploy verification had been left as a TODO, so it stayed hidden until the 2026-06-13 security test surfaced the error in the logs. FIX (2026-06-13): pinned the function to the **Compute Engine** SA the Gen-2 functions already use — `.runWith({ serviceAccount: "403346239424-compute@developer.gserviceaccount.com" })` in `functions/src/onAuthUserDeleted.ts`. No IAM grant; just runs as an identity that already has Firestore access. Redeployed (`firebase deploy --only functions:onAuthUserDeleted`, `✔ Successful update operation`).
- VERIFIED WORKING 2026-06-13: a throwaway script created a disposable account + `crewProfiles` doc, deleted the Auth account, and 12s later the `crewProfiles` doc read back `exists=false` — i.e. the trigger now runs as the Compute SA and deletes the profile. (Function logs lag a few minutes; the read-back is the definitive proof since only the trigger can delete that doc.)
- GENERAL RULE for any FUTURE 1st-gen function here: it MUST set `runWith({ serviceAccount: "403346239424-compute@developer.gserviceaccount.com" })` or it will hit the same Firestore `PERMISSION_DENIED`. Gen-2 functions get the Compute SA by default and are unaffected.

Teacher-escalation security audit (2026-06-13) — CLEAN. Ran `scripts/negative-test-teacher-escalation.cjs` (PASS — both the rules path and the `setWorkspaceSupervisorMode` callable deny a self-labeled student) and `scripts/audit-teacher-flags.cjs` (via refreshed ADC). Result: exactly **1** `teacherRoles` grant (Francisco, `ozfTOauw44ZAI9FvCBkcpvAr5sy2`); **no real student self-escalations**. The single flagged claimant/election is the known **Codex QA test teacher** (`SS2AATDwuPSRyt2c11IsUck7QCv2`) in the QA test workspace `qDc2q2bNvq6GU6Aet8gD` — test residue, not a live incident.

Notification Phase 2 (server-side notification creation) — FULLY LIVE 2026-06-14. Every active in-app notification flow now writes through Cloud Functions/Admin SDK, and client creation is denied for top-level `notifications`, `users/{uid}/notifications`, and `crewProfiles/{uid}/notifications`.
- Server writers cover job applications/status/messages, chat messages, workspace invitations/responses, review status, supervisor annotations/tags, @mentions, legacy + v2 follow requests/acceptance, interviews, and manual screenplay collaborator additions.
- Annotation/tag documents carry capped `mentionedUserIds`; the server filters recipients to current screenplay/workspace participants. Rules verify `supervisorAtAuthorTime` against the actual workspace supervisor state instead of trusting the client.
- Manual collaborator additions use authenticated callable `addScreenplayCollaborator`, avoiding the noisy teamMembers-diff approach that would notify once per screenplay when a workspace invitation is accepted.
- Notification sender names are resolved server-side from profiles. Chat recipients come from the authoritative conversation participant list, and interview recipients come from the parent application.
- Legacy dead client notification helpers and the unused application-message path were removed. Chat email remains server-throttled to at most one email per conversation/recipient per 30 minutes.
- Follow rules now require the target user to accept pending requests; the requester cannot manufacture an accepted notification.
- Behavioral rules coverage added with `@firebase/rules-unit-testing`: eleven emulator tests cover notification authority, follow acceptance, mention fields and supervisor provenance, verified-teacher self-election, conversation message ownership, screenplay access/deletion, and the supervisor/student scene-mark deletion matrix. The production Hosting workflow runs these tests before build/deploy.
- Release order completed directly with Firebase CLI as `iam@myfilmjobs.com`: Functions first (all seven new functions created successfully), Hosting second (`main.ac74234f.js`), then Firestore rules. Rules dry-run and release both compiled successfully.

Known inert test-data leftovers (Francisco to delete later, intentionally left in place 2026-06-13; all invisible to real users):
- `workspaces/codex_sec_ws_1781387004607` ("Sec Test WS") — orphan from the negative test; owner `wV5rm8n6BcX91aHM3HtvRWMvSk42` + member `ExYI082wT4ZwH2or5PTQwO4gwn72` are both deleted accounts. (The test script's cleanup bug that created it is now fixed — it soft-deletes before hard-deleting — so future runs won't orphan.)
- QA residue: `selfElectedSupervisors` entry for `SS2AATDwuPSRyt2c11IsUck7QCv2` in workspace `qDc2q2bNvq6GU6Aet8gD`, plus the `Codex QA` teacher/student profiles (`SS2AATDwuPSRyt2c11IsUck7QCv2`, `uSBIqpjvIZTa4oEToqfBG7zoLds2`). Kept for QA reuse per the QA note above; clean up if no longer needed.
- Note (pre-existing, not from this change): the deploy surfaced a `functions.config()` / Cloud Runtime Config DEPRECATION NOTICE — those APIs shut down March 2026 and any function still relying on `functions.config()` will fail to deploy after that. Fold into the deferred `firebase-functions` upgrade work (migrate to the `params` package; `firebase functions:config:export` assists).

Teacher-privilege hardening (2026-06-10) — CODE COMPLETE, NOT YET DEPLOYED:

- Vulnerability closed: supervisor self-election was gated on `crewProfiles.isTeacher` / `profileType == 'teacher'`, which are USER-WRITABLE fields (the profile editor at `EditCrewProfile.tsx` writes them) — any student could mark themselves a teacher and self-elect supervisor (grading CSV access, teacher-styled annotations).
- New privilege source of truth: `teacherRoles/{uid}` — existence == admin-verified teacher. Rules: self-read only, `allow write: if false` (Admin SDK only). `profileIsTeacher()` replaced with `isVerifiedTeacher()` checking that collection; `crewProfiles` teacher fields are now cosmetic/display-only and must never gate privileges again.
- Client: `CollaborationHub.tsx` teacher gate now reads `teacherRoles/{uid}` existence instead of profile flags.
- Admin scripts (ADC auth, dry-run by default): `scripts/audit-teacher-flags.cjs` (read-only: lists teacher claimants vs grants, plus `selfElectedSupervisors` entries lacking a grant) and `scripts/grant-teacher-role.cjs <uid> [--revoke] --apply`.
- Guard test added to `securityRules.test.ts` (locks `isVerifiedTeacher`/`teacherRoles` shape, forbids regression to crewProfiles-field gating). `vitest run` 74/74 green; `tsc --noEmit` clean.
- DEPLOY ORDER (not yet done): (1) run audit script, (2) grant `teacherRoles` to every legitimate teacher found, (3) `firebase deploy --only firestore:rules`, (4) deploy Hosting for the CollaborationHub change, (5) re-run audit; remove any ungranted `selfElectedSupervisors` entries. Granting BEFORE the rules deploy avoids locking real teachers out of self-promotion; the brief overlap window is no worse than the status quo.
- Residual (deliberate): students can still cosmetically label themselves "Teacher" in the directory (`crewProfiles` display fields stay user-writable so the existing profile-type UI keeps working). Locking that down is a product decision — e.g. hide the teacher option behind verification — tracked separately. Full review: `ROBUSTNESS_REVIEW.md`.

Review-workflow language de-escalation (2026-06-11) — locale-only, EN/ES:

- Product decision: the teacher enters workspaces as a collaborator/supervisor; evaluation happens outside the system. "Approved" risked reading as a grade/endorsement.
- All `reviewStatus` UI strings, activity verbs, and review notifications reworded: "Teacher review" → "Feedback", "Submitted for review" → "Shared for feedback", "Approve/Approved" → "Mark feedback complete / Feedback complete" (description explicitly says it is not a grade or endorsement). i18n KEYS and Firestore status values (`draft/submitted/changes_requested/approved`) are UNCHANGED — no code, rules, or data migration involved.
- Verified: both locale JSONs parse; `vitest run` 74/74 green.
- Also confirmed during this work: invitation acceptance (functions/src/workspaceInvitations.ts) writes no review status — a screenplay showing "approved" means a supervisor pressed the (then-named) Approve button; `reviewStatusUpdatedBy` records who.

Session handoff (2026-06-11) — open items, in priority order:

1. Pulp Fiction screenplay (workspace member Anny Polanco) is stuck at status `approved` ("Feedback complete") from a supervisor click on 2026-05-29. Supervisors CANNOT undo (UI + rules both restrict draft/submitted transitions to non-read-only members). Fix: uploader or workspace owner uses "Return to draft" → "Share for feedback". Note: the activity record `Francisco Valdez approved Pulp fiction` is a `review_approved` entry — only the review-status handler writes those; invitation acceptance writes none. The owner believes he was approving group membership; treat as the UX trap it is, not a data bug.
2. PROPOSED, NOT BUILT — supervisor "Reopen feedback" undo: add to `isScreenplayReviewStatusUpdate` a supervisor-only transition `changes_requested|approved → submitted`; mirror in `ScreenplayViewer.tsx` (`reviewerAllowed`) + a reopen button + EN/ES locale keys.
3. Unverified: the vulnerability negative test — confirm a student account with self-set teacher profile labels CANNOT self-elect supervisor in production (rules deployed 2026-06-11; teacherRoles grant exists for owner uid ozfTOauw44ZAI9FvCBkcpvAr5sy2).
4. Unexplained: `scripts/audit-teacher-flags.cjs` reportedly printed no output on the owner's machine while the grant script worked with the same ADC. Re-run and capture stdout/stderr.
5. CI is structurally blind: deploy-production.yml runs no typecheck/tests and its smoke test only warns on a static file — it went GREEN during the 2026-06-10 production outage (missing chunk 717). Add typecheck + vitest gates and a post-deploy bundle-integrity check (fetch live index.html, curl every referenced script, fail on non-200/HTML). Root cause of the mixed-release outage was never pinned; until the smoke check exists, manually verify chunks after every Actions deploy.
6. Security backlog (see ROBUSTNESS_REVIEW.md for file:line detail): Firebase App Check; privacy flag for public `crewProfiles` reads; cosmetic teacher self-labeling in profile editor is still possible (display-only since the teacherRoles hardening, but can mislead students). Notification authority, conversation message editing, and `emailSend` restrictions are now hardened.
7. Engineering backlog: continue adding emulator tests when a rule boundary changes; add Sentry, a staging project, a backup restore drill, ESLint, component decomposition for ScreenplayViewer/CollaborationHub, Firestore offline persistence, indexed member search, and the firebase-functions package upgrade.

Robustness pass (2026-06-11, evening) — CODE COMPLETE, NOT YET DEPLOYED. All local checks green: `tsc --noEmit` (app) clean, `functions` build clean, `vitest run` 77/77 (was 74; +3 guards). Production build compiles (verified to a temp dir; the sandbox cannot overwrite the committed `dist/`, but CI builds from a clean checkout). Nothing was deployed — deploy is owner-only from `iam@myfilmjobs.com`. Deploy order is at the end of this section.

1. **CRITICAL — teacher→supervisor self-election is STILL OPEN in production (now fixed in code).** The 2026-06-10/11 hardening fixed `firestore.rules` (`isVerifiedTeacher` → `teacherRoles/{uid}`) and the `CollaborationHub` UI gate, but the client self-elects through the **`setWorkspaceSupervisorMode` callable** (`CollaborationHub.tsx:531`), which runs with the **Admin SDK and bypasses Firestore rules**. The callable (`functions/src/workspaceSupervisors.ts`) still gated on `crewProfiles.isTeacher`/`profileType` — user-writable fields. So a student could self-label as teacher and call the function directly to self-elect (grading CSV access, teacher-styled notes). Confidence this was exploitable pre-fix: high (client uses the callable; callable uses Admin SDK; gate read user-writable fields — all confirmed in code). FIX: rewrote the callable's gate to `isVerifiedTeacher()` = existence of `teacherRoles/{uid}`, matching the rules. **This is the real closure of the vulnerability the prior handoff believed was already closed. It takes effect only after a Functions deploy** (`firebase deploy --only functions:setWorkspaceSupervisorMode`). Guard test added (`securityRules.test.ts`) so it cannot silently regress.
2. **Supervisor "Reopen feedback" undo — BUILT.** Unblocks the Pulp Fiction "Feedback complete" dead-end. Rules: `isScreenplayReviewStatusUpdate` gained a supervisor-only `changes_requested|approved → submitted` branch (supervisors still cannot set `draft`). Client: `ScreenplayViewer.tsx` `handleReviewStatusChange(..., isReopen)` + a "Reopen feedback" button shown to supervisors on finished states; notifies the author (`review_reopened`); activity verb `review_reopened`. Locale keys added EN/ES (`actions.reopen`, `toasts.reopened`, `verbs.review_reopened`, `notifications.reviewReopened`). Guard test added. NOTE: Pulp Fiction can be cleared either by the uploader/owner (Return to draft → Share for feedback) OR, once this deploys, by a supervisor clicking Reopen feedback.
3. **CI hardening — DONE** (`.github/workflows/deploy-production.yml`). Added `tsc --noEmit` + `npm run test:run` gates before the build, and a **failing** post-deploy "Verify deployed release integrity" step: it confirms the live `index.html` references the just-built `main.*.js` on both hostnames (retries for CDN), then curls every `dist/*.js|*.css` against production and fails on non-200 OR an HTML content-type (Firebase's SPA rewrite serves `index.html` for missing files, so the content-type check is what actually catches the 2026-06-10 missing-chunk class of outage). `healthz` smoke now fails instead of warning.
4. **Conversation message tampering — VERIFIED + FIXED.** `conversations/{id}/messages/{id}` `allow update` previously let any participant edit `content`/`fileUrl`/`messageType`. Split into a sender-only branch (those content fields) and a non-sender branch (reactions, read receipts, delete-for-me only). Guard test added. Legitimate flows (mark-read, reactions, delete-for-me, sender delete-for-everyone) preserved.
5. **Email HTML escaping — VERIFIED + FIXED.** Only `emailSend` (`functions/src/index.ts`) was vulnerable: it built HTML with template literals, so `senderName`/`message` (from any authed caller) were injected raw. Added an `escapeHtml()` helper and applied it to the HTML part (text part unchanged). The `EmailService` Handlebars templates use double-stache `{{ }}` (auto-escaped) and are safe. RESIDUAL (not fixed, bigger change): `emailSend` is `invoker:'public'` and accepts an arbitrary `to`/`subject`/`message` from any authenticated user — an email-relay/spoofing surface. Tighten by moving sends server-side or constraining recipients; tracked in the backlog.
6. **Audit script silent-run — RESOLVED by hardening.** `scripts/audit-teacher-flags.cjs` always printed headers, so a truly silent run almost certainly meant the Firestore reads hung on missing/unauthorized ADC while firebase-admin retried quietly (not >90% certain of the exact cause). Added a startup banner before any async work + a watchdog timeout that fails loudly with an auth fix-it message, so it can never run silently again.
7. **Negative security test — script written, live run handed off.** `scripts/negative-test-teacher-escalation.cjs` creates disposable accounts, self-labels as teacher, and asserts BOTH the direct-write (rules) and callable paths are denied, then cleans up (also exercising `onAuthUserDeleted`). I could NOT run it: the agent sandbox has no network route to `*.googleapis.com`, and it must run AFTER the Functions deploy or PATH 2 will (correctly) report the vuln as open. Run it locally with ADC/web config present.

DEPLOY ORDER for this pass (owner, from `iam@myfilmjobs.com`):
1. `firebase deploy --only firestore:rules` (reopen-feedback + message-tampering rule changes; dry-run compiles first).
2. `firebase deploy --only functions:setWorkspaceSupervisorMode,functions:emailSend` (closes the callable escalation; ships email escaping). Confirm both report ACTIVE.
3. Push to `main` so the hardened Actions workflow builds + deploys Hosting (ScreenplayViewer reopen UI + locales). The new release-integrity gate will fail the run if chunks are missing.
4. Run `node scripts/negative-test-teacher-escalation.cjs` → expect "PASS — both vectors denied."
5. Run `node scripts/audit-teacher-flags.cjs` (ADC) and capture output; remove any `selfElectedSupervisors` entries lacking a `teacherRoles` grant.

## Release — 2026-06-12

PRODUCTION RELEASE:

- Francisco approved the development state and requested commit + deploy. This release commits the scene-feature review fixes (shared/tested slug parser; `supervisorAtAuthorTime` scene-mark provenance; `scene_removed` activity logging; popup height, position-aware number prefill, memoization, precise note navigation, and scoped jumps), the "Your classes" Add/✓ pill UI, and ambient stylesheet declarations that remove editor-only TS2882 noise.
- The tightened `screenplayScenes` Firestore rules were already live after a dry-run deployment; this release brings the repository back in sync with production.
- Release gates passed immediately before commit: `npx tsc --noEmit`, 86/86 Vitest tests, and `npm run build`. Pushing `main` deploys production Hosting through the hardened GitHub Actions workflow and its live bundle-integrity checks.
- Useful production spot checks: hyphenated slug prefill (`EXT. DRIVE-IN - NIGHT` stays whole), supervisor can delete student scene marks but not vice versa, and the class Add/✓ pill rows behave correctly.
- Approved follow-up (2026-06-12, production deploy via `main` push): (1) `parseSlugText` now has an explicit separator contract — ASCII `-` separates location/time only when spaced, so `DRIVE-IN` and `DAY-FOR-NIGHT` remain whole; typographic en/em dashes from PDF extraction also work without spaces. Exact `EXT. DRIVE-IN - NIGHT`, unspaced em-dash, and non-breaking-hyphen tests added. (2) Scene-mark permissions now have an explicit test matrix: supervisor can delete a student mark, a student manager cannot delete a supervisor-authored mark, and authors can delete their own. UI and Firestore rules both use the same supervisor-at-author-time moderation model. (3) Class Add/✓ pills now track pending writes with a `Set<classId>` instead of one nullable ID, so toggling two classes cannot prematurely re-enable a still-pending pill. Verified: TypeScript clean, 88/88 tests, production build compiles; deployed to https://my-film-jobs.web.app with matching entry assets and no browser console errors (first CLI attempt stalled during a Cloud Functions rewrite lookup after upload; retry released normally).
- Safari console cleanup (2026-06-12, PRODUCTION via `1f87edcc`): removed routine `AuthProvider` initialization/listener/auth-state logs and the `AppContent` render log; render-level messages ran on normal state changes and made healthy auth startup look suspicious. Error logs remain. The reported `h1-main.js` `bgMessageCallback/noListeners` and unreturned-promise messages are not in the repo or deployed assets and are injected by Safari/extension tooling, so page code cannot fix them. Verified: TypeScript clean, 88/88 tests, production build compiles (`main.e52d1144.js`), a fresh browser session produced zero app logs/warnings/errors on startup, and production Actions run `27438667763` succeeded.
- Firestore Safari transport follow-up (2026-06-12, PRODUCTION via `1f87edcc`): replaced global `experimentalForceLongPolling` with `experimentalAutoDetectLongPolling`. Firebase has enabled auto-detection by default since SDK 9.22; forcing long polling degrades performance and creates more interruptible `Listen/channel` requests, which Safari reports as "due to access control checks" when navigation/privacy controls terminate one. Realtime listeners remain enabled and long polling is still selected automatically when the network requires it. Verified: TypeScript clean, 88/88 tests, production build compiles (`main.1fbdf95b.js`), and production Actions run `27438667763` succeeded. The Safari retest showed a valid WebChannel `noop`/`targetChange` checkpoint with a resume token immediately before the warning; this confirms Firestore received listener state before Safari interrupted the request. Treat it as cosmetic while live updates continue and investigate only if the listener stops reconnecting.
- Annotation/tag rule parity (2026-06-12, PRODUCTION via `26ab8893`; Firestore rules released directly first): `screenplayAnnotations` and `screenplayTags` creates now validate required/allowed keys, screenplay/user/project identifiers, timestamps, page/position anchors, author/avatar lengths, resolved/supervisor flags, body limits (annotation 5000, tag/reply 2000), tag category enum, and color length. Annotation reply updates are append-only: one capped, well-formed reply authored by the caller may be added, but a participant can no longer replace or erase reply history. Resolve updates require a boolean and retain the existing moderation gates. Matching client `maxLength` values added; the unused reply-removal path was deleted. Rules dry-run compiled and released successfully; production Actions run `27447963605` passed typecheck, 89 tests, build, bundle-integrity verification, and health smoke.
- Final Draft-style scene categories (2026-06-12, PRODUCTION via `26ab8893`): the selected PDF scene detail now has a three-pane breakdown view — Categories (scene/all counts), Scene Tags, and All Tags across the screenplay. Selecting a category filters both tag panes; tag color, resolved styling, page, and click-to-jump behavior remain intact. Annotations stay in their own scene section. No data migration/index required: `tagType` is passed into the existing in-memory scene-note model. EN/ES strings and a focused category-filter component test added. Production Actions run `27447963605` succeeded and myfilmjobs.com serves `main.f2b6b582.js`.
- Fountain live scene synchronization (2026-06-12, PRODUCTION via `24922b3a`): `FountainViewer` now publishes both its initial source and every Firestore source snapshot to `ScreenplayViewer`, so the scene navigator tracks live edits instead of continuing to parse the screenplay source captured when the modal opened. Switching screenplays also publishes the new initial source before the subscription responds, avoiding stale scene rows during the transition. Focused subscription test added. Verified: TypeScript clean, 90/90 tests, production build compiles, development Hosting/browser smoke clean, and production Actions run `27448157390` passed bundle integrity and health checks.
- Group invitation function wording (2026-06-12, FUNCTION LIVE): `respondToWorkspaceInvitation` keeps the existing i18n keys and Firestore field names but now uses "Group" instead of "Workspace" in its English notification fallbacks and callable errors; the missing-name fallback is now "group". Functions TypeScript build passed and the isolated Node.js 22 Gen 2 function deploy completed successfully.
- Fountain persistent scenes + Movie Magic metadata (2026-06-13, FULLY LIVE via `586041b6` / Actions run `27478840515`): the Fountain editor now has a live scene navigator that recognizes `INT.`/`EXT.` headings while typing. Debounced saves reconcile headings into stable `screenplayScenes` documents; exact anchors/headings/ordinal fallback preserve IDs and metadata across inserted lines or renamed headings, removed headings are retained as hidden orphan records, and untouched automatic scene numbers renumber while edited numbers remain fixed. PDF and Fountain scenes now share Script Day, Unit, Sequence, Est. Time, Synopsis, Note, and automatically estimated page eighths; every current screenplay participant can edit metadata, while only screenplay editors may update Fountain source anchors. Fountain INT/EXT/location/time stay source-controlled. Both CSV reports include the five production fields, and scene search includes their values. EN/ES strings and focused reconciliation/permission tests added.
- `emailSend` relay restriction (2026-06-13, FULLY LIVE: function Actions run `27478646547`, client Hosting run `27478840515`): the client now sends its Firebase ID token; the HTTP function accepts only authenticated callers, registered-account recipients, allowlisted notification templates, bounded payloads, and a server-side 1-second/50-per-day caller quota. Non-system sender names are derived from the verified token.
- Firestore release note (2026-06-13): local Firebase CLI credentials expired before the rules dry-run. A production-workflow rules step was tested, but the Hosting service account lacks Firebase Rules API permission (`403` on `firebaserules.googleapis.com:test`; run `27478643915`), so it was removed rather than leaving every Hosting release blocked. The new client is backward-compatible during this gap: Fountain source saves succeed and scene reconciliation logs a non-blocking error until the new rules are released. RESOLVED 2026-06-13: a `firebase deploy --only firestore:rules` (dry-run compiled clean, then released) reported `latest version of firestore.rules already up to date, skipping upload` — i.e. the committed scene-metadata ruleset was ALREADY LIVE in production; the deploy just re-confirmed it. No rules are pending.
- Verification for the 2026-06-13 scene/email increment: app TypeScript clean, Functions TypeScript clean, all 97 tests pass, production webpack build compiles, locale JSON parses, and production serves `main.4d10327a.js`. Actions run `27478840515` passed bundle integrity + both health checks; signed-out production `/collaboration` redirects correctly to `/login`. The browser session was signed out, so authenticated Fountain interaction remains a post-rules spot check.

WORKFLOW NOTES for the next agent:

- Process rhythm established with Francisco: build → `npm run deploy:dev` (https://my-film-jobs.web.app, same live Firebase backend) → he tests → HE usually commits+pushes himself (commit messages like "moviendo"/"ongoing v1"); push to `main` deploys production. Firestore rules deploy from CLI (`--dry-run` first); his CLI auth expires often — he must run `npx firebase login --reauth` (iam@myfilmjobs.com).
- Keep THIS file updated after every meaningful step (his standing instruction). EN + ES locales for every new string ("tú" form in Spanish; classes are "clases", assignments "tareas", groups "grupos").
- Run a /code-review consolidation pass before big production pushes — the two run this session each caught real bugs (races, parser bugs, rules gaps).

BACKLOG (Francisco-aligned, in rough priority order):

1. Scene feature depth, as the class uses it: (a) Final Draft-style Categories | Scene Tags | All Tags filtering — DONE in production 2026-06-12; (b) Movie Magic fields (Script Day, Unit, Sequence, Est. Time, automatic page-eighths) — CODE COMPLETE 2026-06-13; (c) editable metadata + stable persisted IDs for Fountain-derived scenes — CODE COMPLETE 2026-06-13; (d) `ScenesPanel`, `FountainPages`, and the editor navigator still invoke the same pure pagination utility separately — could share one parsed result only if performance becomes measurable.
2. ~~Harden screenplayAnnotations/screenplayTags rules with the field-type/size validation screenplayScenes now has~~ — DONE and rules deployed 2026-06-12; reply history was additionally made append-only.
3. ~~Cloud Function invitation fallback strings said "Workspace …" in English~~ — DONE and `respondToWorkspaceInvitation` deployed 2026-06-12; i18n keys/schema remain unchanged.
4. Class pages use one-shot loads + Refresh button; could go live-updating.

## Recommended Next Steps (older list, still valid)

1. ~~Notification hardening Phase 2~~ — DONE and fully live 2026-06-14. All active flows are server-side and every client notification-create path is denied by rules.
2. Replace client-side all-profile member search with an indexed search or callable search endpoint before larger classroom use.
3. Add lightweight automated tests around review-status transitions, @mention matching, supervisor permission gating, and grading CSV row generation.
4. Plan a separate `firebase-functions` package upgrade; deploy logs warn the current package is outdated and may have breaking changes when upgraded.
5. ~~Lower the screenplay/project-document upload cap~~ — DONE 2026-06-01 (`b3e83fb9`). `CollaborationHub` now uses `MAX_UPLOAD_BYTES` (25MB, = the Storage `isDocumentUpload` cap) for all default `maxFileSize` values, and `uploadSingleScreenplay` rejects oversized files up front with a localized `fileTooLarge` toast instead of letting them fail opaquely at Storage. Hosting-only (no rules change). Lower both `MAX_UPLOAD_MB` and storage.rules together if a tighter cap (e.g. 10MB) is later wanted.
6. Reduce long-term maintenance risk in `ScreenplayViewer.scss` and the large collaboration components after the assignment-critical flow is stable.

## Completed Plan - Phase 2: Server-Side Notification Creation

Completed and deployed 2026-06-14. The inventory below is retained as the implementation record; the server-only rule shown here is now live for every notification collection.

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

- Most collaboration UI behavior is still covered by manual QA. Core notification and permission behavior now has Firestore emulator coverage.
- Member search still scans all crew profiles client-side.
- The supplemental screenplay `teamMembers` collection subscription was removed because Firestore denied that broad list query; current collaboration loading relies on `uploadedBy` and workspace-scoped screenplay queries.
- Public `crewProfiles` reads and authenticated `users/{userId}` reads are intentional current behavior but should be reviewed before broader launch if contact info needs tighter privacy.
- A restore drill has not been performed against Firestore backups. Backups are configured, but a restore into a throwaway database would prove the process.
