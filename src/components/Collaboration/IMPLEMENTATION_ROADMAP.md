# Collaboration Page Implementation Roadmap

Last updated: 2026-05-28

This document tracks the practical next steps for the collaboration page, with emphasis on student project creation, teacher review, screenplay upload/writing, and workspace member management.

## Product Direction

The collaboration page should support a project from the first draft through teacher review without forcing users into one rigid order.

- A student or project creator can create a workspace before or after uploading/writing a screenplay.
- Teachers, supervisors, viewers, and collaborators can be invited at any point in the workflow.
- Invite before upload is optional, not mandatory.
- Uploaded PDFs and in-browser Fountain screenplays share the same collaboration surface as much as possible.
- Teachers can review, comment, tag, and resolve items without needing ownership of the project.
- Project/workspace creators can archive, restore, soft-delete, and permanently delete after a recovery window.

## Current Implementation

- Workspaces can be created from the collaboration page.
- Workspace roles include owner, supervisor, collaborator, and viewer.
- Screenplays can be uploaded to a workspace or kept personal/no workspace.
- Fountain screenplays can be created and edited in-browser.
- Uploaded PDFs open in the screenplay viewer with annotation and tag support.
- Workspace archive/delete/recover controls exist for the creator/owner path.
- Deletions use a recoverable soft-delete state before permanent deletion.
- Workspace listing now uses a `workspaceMemberships` index so rules can keep workspace list reads locked down.
- Invite controls are available from the workspace and screenplay upload area, and upload does not require inviting members first.

## Implemented In This Pass

- Made invite-before-upload explicitly optional in the UI copy.
- Fixed missing owner role translations in English and Spanish.
- Prevented the Fountain editor from overwriting a user's local edit when a delayed Firestore read returns.
- Tightened Firestore rules for workspace reads, screenplay content edits, screenplay access edits, annotations, and membership indexing.
- Added and backfilled `workspaceMemberships` for existing live workspaces.
- Deployed the updated Firestore rules for the live Firebase project.
- Removed generated/private artifacts from source control scope:
  - `.specstory/`
  - `bundle-analysis.html`
- Added `.specstory/` and `bundle-analysis.html` to `.gitignore`.
- Fixed the PDF viewer so the PDF document fills the modal instead of expanding to the height of every page.
- Changed PDF rendering to fit the available modal width by default and kept zoom controls functional.
- Restored PDF virtualization by giving hidden page placeholders reserved height.

## Next Implementation Steps

### 1. Teacher Review Flow

- Add a first-class "Teacher review" view filtered to open notes, teacher notes, unresolved tags, and replies.
- Add status transitions for a screenplay:
  - Draft
  - Submitted for review
  - Changes requested
  - Approved
- Store review status on the screenplay document and show it in the workspace screenplay list.
- Add a review summary panel with counts by open notes, resolved notes, teacher notes, and student replies.

### 2. Invite And Membership Flow

- Add a dedicated invite modal that can be opened from:
  - Empty workspace
  - Upload area
  - Screenplay row
  - PDF/Fountain viewer
  - Workspace settings
- Support invitations by connected user and by email.
- For email invites, create pending invitation docs and attach them to the workspace/screenplay when accepted.
- Keep role changes owner-only.
- Add explicit messaging for "You can invite people later" on all creation/upload paths.

### 3. Archive, Delete, And Recovery

- Make archive reversible from a clearly labeled archived workspace section.
- Keep soft-deleted workspaces visible only to the creator during the recovery window.
- Add copy showing the exact recovery deadline.
- Add a permanent delete action only after the recovery window expires.
- Add tests for:
  - Owner can archive.
  - Owner can restore archived.
  - Owner can soft-delete.
  - Non-owner cannot archive/delete.
  - Permanently delete is blocked until recovery expires.

### 4. PDF Review Quality

- Add desktop and mobile browser checks for:
  - PDF loads without falling back.
  - PDF pages are white/readable.
  - Virtualization only renders the visible page window.
  - Scrolling updates visible pages without repeated/dark placeholder artifacts.
  - Text selection still creates notes/tags in the correct position.
- Add a "Fit width" reset control next to zoom.
- Move collaboration sidebar behavior into a simpler responsive model:
  - Desktop: side panel.
  - Mobile: bottom drawer with a clear handle.

### 5. Security And Data Model

- Add unit coverage for the new `workspaceMemberships` rules.
- Add a migration/backfill script for membership index repair.
- Keep workspace document `memberIds` as the read authorization source.
- Treat `workspaceMemberships` as a query index, not the source of truth.
- Add server/admin path later for email invitation acceptance to avoid trusting client-only membership writes.

## QA Checklist Before Release

- Create a new workspace without inviting anyone.
- Upload a PDF to that workspace.
- Open the PDF and confirm it is readable.
- Invite a teacher after upload.
- Confirm the teacher can see the workspace and screenplay.
- Confirm the teacher can add a note/tag and resolve a note.
- Confirm a viewer can read but cannot edit screenplay content.
- Confirm the creator can archive and restore the workspace.
- Confirm the creator can soft-delete and recover the workspace.
- Confirm non-owners do not see destructive workspace actions.
- Run:
  - `npx tsc --noEmit`
  - `npm run test:run -- --run`
  - `npm run build`

## Known Risks

- The current PDF viewer SCSS has accumulated duplicate legacy rules. The stability overrides are scoped, but a later cleanup should consolidate the file so the viewer is easier to maintain.
- Email invitations need a trusted acceptance path before being treated as production-grade access control.
- The collaboration session presence model still writes active users as an array; that can produce stale entries and should eventually move to per-user presence documents.
