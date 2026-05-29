---
title: WhosOnSet Project Overview
last_reviewed: 2026-05-28
status: current source of truth
---

## Source Of Truth

This file is the current operating overview for WhosOnSet / My Film Jobs as of 2026-05-28. Older documents under `docs/` are historical unless they explicitly say they were refreshed on 2026-05-28 or later.

Primary collaboration roadmap: [src/components/Collaboration/IMPLEMENTATION_ROADMAP.md](src/components/Collaboration/IMPLEMENTATION_ROADMAP.md)

## Production Targets

- Live site: `https://myfilmjobs.com`
- Firebase project: `my-film-jobs`
- Firebase CLI / Console account: `iam@myfilmjobs.com`
- Hosting sites: `myfilmjobs-com` and `my-film-jobs`
- Production Hosting live channel observed on 2026-05-28 at 22:21:34 local time for `myfilmjobs-com`
- Development Hosting live channel observed on 2026-05-28 at 22:21:34 local time for `my-film-jobs`

Do not deploy Firebase Hosting, Firestore, Storage, Functions, indexes, or secrets from any other Google account. If `firebase login:list` shows another active account, switch back to `iam@myfilmjobs.com` before running deploy commands.

## Stack

- Frontend: React 18, TypeScript 5.8, Webpack 5, TailwindCSS, SCSS modules
- Backend: Firebase Auth, Firestore, Storage, Hosting, Cloud Functions
- Email: Gmail SMTP through Cloud Functions
- Tests: Vitest
- PDF review: `react-pdf`
- Drag and drop: `@dnd-kit/core`

## Data Safety

This is a live production site with real user data. Do not run destructive Firestore operations, bulk deletes, schema migrations, or collection drops without explicit approval in the current conversation.

Current guardrails:

- Firestore PITR is enabled.
- Weekly Firestore backups are scheduled.
- Firestore database delete protection is enabled.
- The capital `Projects/` and lowercase `projects/` collections are both treated as live until a planned migration proves otherwise.
- Existing ad-hoc JSON backup scripts are not a backup of record because they do not cover every collection and subcollection.

## Collaboration Goal

Make the collaboration page strong enough for student project creation and teacher review:

- A student or creator can create a workspace, upload a PDF, or start a Fountain screenplay in any order.
- Inviting teachers, classmates, viewers, and collaborators is optional before upload and available later.
- Teachers can review screenplays with notes, tags, replies, resolved/open state, and a first-class review status.
- Creators can archive, restore, soft-delete, and permanently delete collaboration workspaces.
- Uploaded PDF review and in-browser Fountain writing should feel like one coherent workflow.

## Current Implementation State

- Collaboration workspaces persist in Firestore.
- Workspace discovery uses `workspaceMemberships`; workspace collection listing is blocked by rules.
- Workspace reads are member-scoped.
- Workspace details are editable by the creator: name, description, type, and settings.
- Workspace invitations can be sent before upload, during creation, or after upload.
- Workspace invitations use a pending Accept/Decline consent flow; accepted invitations update membership and screenplay access through Cloud Functions.
- Member search currently reads all `crewProfiles` client-side, ranks approved contacts first, and caches results briefly.
- Invite-before-upload is optional in UI copy.
- Uploaded screenplay drag/drop has been removed; screenplay upload is through the explicit upload button.
- PDF screenplay viewer renders readable white pages, fits modal width, and virtualizes visible pages.
- Fountain editor/viewer exists with toolbar, autosave, page count, live preview, PDF export, and page numbers.
- Screenplays have first-class review status: Draft, Submitted for review, Changes requested, Approved.
- Creators/students can submit screenplays for review or return them to draft.
- Teachers/supervisors can request changes or approve submitted screenplays.
- Teachers can self-promote to supervisor when their profile is marked `isTeacher` or `profileType: 'teacher'`.
- Supervisor and viewer roles are read-only for screenplay content; they can comment/annotate but cannot edit screenplay text.
- Workspace soft-delete recovery window is 7 days.
- Owners can permanently delete a soft-deleted workspace during the recovery window.
- Workspace activity feed exists through the `workspaceActivity` collection.
- Account deletion calls `cleanupUserWorkspaces` to clean collaboration membership/workspace state.
- `.specstory/`, `dist/`, and generated `bundle-analysis.html` are ignored and should not be tracked.

## Verification Snapshot

Latest local verification on 2026-05-28:

- `npx tsc --noEmit` passes.
- `npm run test:run -- --run` passes: 41 tests.
- `npm run build` passes with the known Webpack entrypoint-size warning (`main` about 1.06 MiB).
- `firebase login:list` shows the active account as `iam@myfilmjobs.com`.
- Legacy personal-account email and stale Firebase project identifiers have no matches in tracked source scope outside ignored build artifacts.

## Current Priorities

1. Live QA the teacher review status workflow across separate student and teacher accounts.
2. Replace client-side all-profile member search with a safer indexed search or callable search endpoint.
3. Upgrade Cloud Functions from Node.js 20 before Firebase decommission dates.
4. Consolidate the large duplicated `ScreenplayViewer.scss` rules.
5. Reduce the main bundle size.
6. Run a mobile QA pass for the collaboration hub.

## Completed In Current Pass: Teacher Review Status

- Added screenplay-level `reviewStatus` values: `draft`, `submitted`, `changes_requested`, `approved`.
- Creators/students can submit a screenplay for review.
- Teachers/supervisors can mark a submitted screenplay as changes requested or approved.
- Creators can move submitted, changes-requested, or approved work back to draft.
- Status is visible in screenplay lists and the viewer collaboration panel.
- Review metadata is stored on the screenplay document: updater, update timestamp, and note field.
- Firestore rules keep review-status writes field-scoped.

## Collaboration Acceptance Path

Manual QA should cover:

1. Student creates a workspace without inviting anyone.
2. Student uploads a screenplay through the upload button.
3. Student edits the workspace name/details from settings.
4. Student invites a classmate after upload; classmate accepts from notifications.
5. Student invites the teacher after upload; teacher accepts from notifications.
6. Teacher sees the workspace and screenplay.
7. Teacher self-promotes to supervisor.
8. Student submits a screenplay for teacher review.
9. Teacher marks it changes requested, then later approved.
10. Teacher adds notes/tags and resolves one item.
11. Student receives in-app notification and sees the review items.
12. Creator archives and restores the workspace.
13. Creator soft-deletes and restores the workspace.
14. Creator soft-deletes and permanently deletes a test workspace.
15. Non-owner does not see destructive workspace actions.

## Known Risks

- Member search currently scans all crew profiles client-side, which is acceptable for the current assignment but not a long-term production search design.
- Teacher review status needs live QA with separate student and teacher accounts before broader release confidence.
- Cloud Functions currently deploy on Node.js 20, which Firebase warns is deprecated for future deployments.
- The collaboration SCSS, especially `ScreenplayViewer.scss`, is too large and contains duplicated legacy rules.
- The main Webpack entrypoint is over the recommended 1 MiB limit.
- Cached alternate Firebase CLI accounts should be removed from developer machines to avoid accidental deploy confusion.
- `.husky/pre-commit` uses the deprecated husky v9 bootstrap lines that will hard-fail at husky v10 (warning prints on every commit). ~2-line fix pending.
- ~~Notifications render in the SENDER's locale.~~ **FIXED 2026-05-29** — see "Fixed in latest pass" below.
- **Invitation Accept can fail with "Could not respond to invitation".** Wiring is correct; the usual cause is the `respondToWorkspaceInvitation` Cloud Function not being deployed (`firebase deploy --only functions:respondToWorkspaceInvitation`). The client now surfaces the real callable error in the toast so the cause is visible.

## Fixed in latest pass (2026-05-28, later)

- Surfaced the real callable error on invitation Accept/Decline (was a generic toast) — [NotificationCenter.tsx](src/components/NotificationCenter.tsx).
- Hid the redundant "Act as supervisor" button when the user is already an owner-assigned supervisor (`member.role === 'supervisor'` but not self-elected). New `canToggleSupervisor` in [CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx): self-elected → "Step down"; assigned-supervisor → chip only, no toggle; plain-member teacher → "Act as supervisor". Clarifies the "You: Supervisor (assigned at invite)" vs "(self)" distinction.
- **Notification bell routed collaboration notifications to the wrong page** ("/social", felt like a jump to the start page) because its type-`switch` had no case for the new types. The bell now prefers `notification.link` (collaboration/supervisor/invite notifications all set `link:'/collaboration'`) before its legacy switch — [NotificationBell.tsx](src/components/Social/NotificationBell.tsx). The Notification Center already preferred `link`, so only the bell was affected. Clicking the notification row (not the blue dot — that's just an unread indicator) marks it read in both surfaces.

- **Notifications now render in the RECIPIENT's locale (2026-05-29).** Root cause: title/body were localized at write-time in the sender's language and stored as strings. Fix: notifications now also store `titleKey`/`bodyKey`/`i18nParams`; both the NotificationCenter and the header bell render via `t()` at read-time (helpers `getNotificationTitle`/`getNotificationBody` in [notificationHelpers.ts](src/utilities/notificationHelpers.ts)), falling back to the stored string for legacy/keyless notifications. `i18nParams` keys ending in `Key` (e.g. `roleKey`) are themselves resolved via `t()` (→ `role`), so even the localized sub-words (role names) come out in the reader's language. Writers updated: workspace invitations ([CollaborationHub.tsx](src/components/Collaboration/CollaborationHub.tsx)), supervisor comments/tags ([ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx)), and the accept/decline notifier ([functions/src/workspaceInvitations.ts](functions/src/workspaceInvitations.ts), needs functions redeploy). Old notifications written before this keep showing in the sender's language (no migration).

- **Review-status notifications (2026-05-29).** Closes the evaluation loop: when a supervisor sets `approved`/`changes_requested`, the screenplay **author** is notified; when a student `submits`, the workspace's **supervisors** (assigned + self-elected) are notified; return-to-draft notifies no one. Uses the recipient-locale notification infra (titleKey/bodyKey/i18nParams), best-effort. New `notifyReviewStatusChange` in [ScreenplayViewer.tsx](src/components/Collaboration/ScreenplayViewer.tsx); `screenplay.notifications.review{Submitted,ChangesRequested,Approved}` keys in en+es; `review_*` types routed + iconed in NotificationCenter.
- **Review-status notes (2026-05-29).** Clicking "Request changes" now opens an inline composer for an optional note (≤1000 chars). The note is persisted to `screenplays.reviewStatusNote`, shown to the student in an amber banner under the status description, and used as the notification body (`reviewChangesRequested.bodyWithNote`) when present — empty falls back to the generic body. Every other status transition still clears the note. Keys: `collaboration.reviewStatus.{cancel, noteLabel, notePromptLabel, notePlaceholder, actions.sendChangesRequested}` in en+es. Client-only — no rules/functions change.

### Confirmed already-enforced (no change needed)

- **Only the workspace/project creator can delete.** Workspace archive/soft-delete/permanent-delete all guard on `isWorkspaceCreator` in the UI and `ownerId == auth.uid` in firestore.rules; `projects` delete rule requires `createdBy == auth.uid`. A non-owner member cannot delete the workspace at either layer. (Screenplays: a member may delete only their OWN upload; deleting others' requires being the workspace creator. Open question for Francisco: restrict screenplay deletion to creator-only entirely?)
- **Review status** (`draft`/`submitted`/`changes_requested`/`approved`): new screenplays default to `draft`; `approved` only results from a supervisor pressing Approve. Two screenplays differing = one was approved during testing, not a bug.

## Shipped earlier this collaboration arc (recap — were dropped in a doc rewrite)

These are live in code (committed); listed here so the doc stays complete:

- **G5 workspace activity feed** — `workspaceActivity` collection (rules + composite index + guardrail test), `logWorkspaceActivity` service, emits on upload/create/delete/member-add/self-promote/annotation/tag, live "Recent activity" panel per selected workspace.
- **Account-deletion cascade** — callable `cleanupUserWorkspaces` ([functions/src/cleanupUserWorkspaces.ts](functions/src/cleanupUserWorkspaces.ts)); AuthContext calls it on delete (client soft-delete fallback). Replaced the old `collection('workspaces') where createdBy` query that broke under `list:false`.
- **7-day recovery window + permanent delete during the window** — `WORKSPACE_DELETE_RECOVERY_DAYS = 7`; a deleted workspace card shows Restore + "Delete permanently" (rule allows owner to hard-delete a `status=='deleted'` workspace at any time, not only after expiry). Membership cleanup on permanent delete is by constructed id (the `workspaceMemberships` list rule blocks querying by workspaceId).
- **PDF export page numbers** — exported Fountain PDFs stamp top-right "N." (page 1 unnumbered).

### Maintenance scripts (admin, run with `gcloud auth application-default login`)

- [scripts/backfill-workspace-memberships.cjs](scripts/backfill-workspace-memberships.cjs) — audit/backfill `workspaceMemberships` for workspaces created before the memberships migration. Dry-run by default; `--apply` to write.
- [scripts/cleanup-workspaces.cjs](scripts/cleanup-workspaces.cjs) — list/delete workspaces (test-data cleanup). `--owner <uid>` filters; `--ids a,b [--apply]`; `--with-screenplays` cascades. Dry-run by default.

## Deploy backlog (committed, NOT yet live)

Hosting CI auto-deploys client code on push; rules/indexes/functions are manual.

- `git push` → ships all client fixes (member search, invite/undefined-email, notification routing + recipient-locale rendering, supervisor toggle clarity, PDF page numbers, editor column, activity feed UI, 7-day delete UI).
- `firebase deploy --only firestore:rules,firestore:indexes` → during-window permanent delete rule, `workspaceActivity` collection rule + index.
- `firebase deploy --only functions` → `respondToWorkspaceInvitation` (Accept/Decline — currently failing if undeployed), `cleanupUserWorkspaces` (account-deletion cascade), and the localized accept/decline notifier.
- One-time: run the membership backfill audit; optionally `firebase firestore:indexes > firestore.indexes.json` to capture the 5 live indexes the last deploy flagged.
