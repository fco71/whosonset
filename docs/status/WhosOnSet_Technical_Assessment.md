# WhosOnSet Technical Assessment And Improvement Plan

Date: 2026-05-28

This assessment reflects the current repository state as of May 28, 2026. It replaces prior dated assessment snapshots.

## Executive Summary

WhosOnSet is a live React/Firebase application with broad product surface: profiles, jobs, projects, messaging, notifications, and collaboration. The immediate technical priority is not a generic rebuild. It is to make the collaboration page reliable and polished for student project creation and teacher screenplay review.

The current collaboration implementation is functional enough for QA: workspaces load from Firestore, invite-before-upload is optional, PDFs render readably, Fountain writing exists, and role-based Firestore rules have been tightened. The next work should focus on review workflow clarity, invitation hardening, and maintainability cleanup around the PDF viewer.

## Current Architecture

- Frontend: React 18, TypeScript 5.8, Webpack 5.
- Styling: TailwindCSS and SCSS.
- Backend: Firebase Auth, Firestore, Storage, Hosting, Cloud Functions.
- Data access: Firebase client SDK 11.7.
- Testing: Vitest 3, React Testing Library.
- Internationalization: i18next with English and Spanish translation files.
- PDF review: `react-pdf` 10.
- Drag and drop: `@dnd-kit/core`.

## Current Quality Baseline

Latest local checks on 2026-05-28:

- TypeScript: `npx tsc --noEmit` passes.
- Unit tests: `npm run test:run -- --run` passes, 39 tests.
- Production build: `npm run build` passes with a known Webpack size warning.
- Browser smoke: `/collaboration` loads the workspace list and opens a readable uploaded PDF.

## Strengths

- The app has real production features and live Firebase integration.
- Collaboration now persists and refreshes through Firestore instead of relying on in-memory state.
- Firestore rules are more constrained than before for workspace list reads and screenplay mutations.
- The product has a clear student/teacher collaboration direction.
- English and Spanish localization are already wired.
- Data safety guardrails and Firestore backup posture are documented in the root overview.

## Current Technical Risks

1. PDF viewer maintainability

   `ScreenplayViewer.scss` has accumulated duplicate legacy rules. The latest PDF stability overrides are scoped and verified, but the file should be consolidated before adding much more behavior.

2. Invitation trust model

   Connected-user invites work inside the current app flow. Email invitations still need pending invitation docs and a trusted acceptance path before they should grant access automatically.

3. Collaboration presence

   Active users are stored in array-style session data. This can leave stale entries and is harder to reason about than per-user presence documents.

4. Bundle size

   The production build passes but still warns that the `main` entrypoint is above the recommended size.

5. Documentation drift

   Older docs exist under `docs/`. Files not updated on or after 2026-05-28 should be treated as historical unless explicitly refreshed.

## Recommended Next Work

### P0: Release QA And Deploy

- QA student/creator flow:
  - Create workspace without inviting anyone.
  - Upload PDF.
  - Open PDF.
  - Invite teacher/member after upload.
  - Archive, restore, soft-delete, and recover workspace.
- QA teacher/member flow:
  - Confirm workspace appears.
  - Confirm PDF opens and is readable.
  - Add/reply/resolve notes according to role.
  - Confirm viewer cannot edit screenplay content.
- Deploy staged UI/code changes after QA.

### P1: Teacher Review Workflow

- Add screenplay review status:
  - Draft
  - Submitted for review
  - Changes requested
  - Approved
- Add a teacher review panel filtered to open notes, teacher notes, unresolved tags, and replies.
- Add review summary counts on screenplay rows.
- Add Firestore rules/tests for who can change review status.

### P2: Invitation Flow Hardening

- Create a reusable invite modal available from workspace, upload, screenplay row, PDF/Fountain viewer, and settings.
- Support pending email invitations.
- Accept invitations through a trusted server/admin path.
- Keep role changes owner-only.

### P3: PDF Viewer Cleanup

- Consolidate duplicated SCSS.
- Add a fit-width reset control.
- Keep desktop side panel and mobile bottom drawer behavior explicit.
- Add browser checks for readable pages, virtualization, scrolling, and selection placement.

### P4: Performance

- Continue code splitting heavy collaboration/PDF routes.
- Review Firebase and PDF bundle contribution.
- Keep `bundle-analysis.html` generated locally but ignored by git.

## Acceptance Criteria For Collaboration Release

- Creator can complete workspace creation, upload/writing, invite, archive, delete, and recovery flows.
- Teacher can review and resolve student screenplay notes without needing ownership.
- Viewer can read but cannot edit content.
- PDF pages remain readable on desktop and mobile.
- `npx tsc --noEmit`, `npm run test:run -- --run`, and `npm run build` pass.
- Firestore rules for collaboration paths are deployed and documented.
