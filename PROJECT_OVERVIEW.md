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
- Production Hosting live channel observed on 2026-05-28 at 14:27:13 local time for `myfilmjobs-com`
- Development Hosting live channel observed on 2026-05-28 at 09:16:22 local time for `my-film-jobs`

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
- Teachers can review screenplays with notes, tags, replies, and resolved/open state.
- Creators can archive, restore, soft-delete, and permanently delete collaboration workspaces.
- Uploaded PDF review and in-browser Fountain writing should feel like one coherent workflow.

## Current Implementation State

- Collaboration workspaces persist in Firestore.
- Workspace discovery uses `workspaceMemberships`; workspace collection listing is blocked by rules.
- Workspace reads are member-scoped.
- Workspace members can be added after upload; existing workspace screenplays are updated so new members can access them.
- Member search currently reads all `crewProfiles` client-side, ranks approved contacts first, and caches results briefly.
- Add-member notifications are implemented as phase 1 of the consent flow.
- Full invitation consent with Accept/Decline is not implemented yet.
- Invite-before-upload is optional in UI copy.
- Uploaded screenplay drag/drop has been removed; screenplay upload is through the explicit upload button.
- PDF screenplay viewer renders readable white pages, fits modal width, and virtualizes visible pages.
- Fountain editor/viewer exists with toolbar, autosave, page count, live preview, PDF export, and page numbers.
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
- `npm run test:run -- --run` passes: 40 tests.
- `npm run build` passes with the known Webpack entrypoint-size warning (`main` about 1.06 MiB).
- `firebase login:list` shows the active account as `iam@myfilmjobs.com`.
- Legacy personal-account email and stale Firebase project identifiers have no matches in tracked source scope outside ignored build artifacts.

## Current Priorities

1. Clean stale year/date references in source code and UI.
2. Build full workspace invitation consent: pending invitations, Accept/Decline, and trusted server-side membership changes.
3. Add teacher review status workflow: Draft, Submitted for review, Changes requested, Approved.
4. Replace client-side all-profile member search with a safer indexed search or callable search endpoint.
5. Remove unused dependencies and stale code paths.
6. Consolidate the large duplicated `ScreenplayViewer.scss` rules.
7. Reduce the main bundle size.
8. Run a mobile QA pass for the collaboration hub.

## Collaboration Acceptance Path

Manual QA should cover:

1. Student creates a workspace without inviting anyone.
2. Student uploads a screenplay through the upload button.
3. Student adds a classmate after upload.
4. Student adds the teacher after upload.
5. Teacher sees the workspace and screenplay.
6. Teacher self-promotes to supervisor.
7. Teacher adds notes/tags and resolves one item.
8. Student receives in-app notification and sees the review items.
9. Creator archives and restores the workspace.
10. Creator soft-deletes and restores the workspace.
11. Creator soft-deletes and permanently deletes a test workspace.
12. Non-owner does not see destructive workspace actions.

## Known Risks

- Full invitation consent is not built yet; users are currently added immediately and notified.
- Member search currently scans all crew profiles client-side, which is acceptable for the current assignment but not a long-term production search design.
- Teacher review status is not first-class yet.
- The collaboration SCSS, especially `ScreenplayViewer.scss`, is too large and contains duplicated legacy rules.
- The main Webpack entrypoint is over the recommended 1 MiB limit.
- Cached alternate Firebase CLI accounts should be removed from developer machines to avoid accidental deploy confusion.
