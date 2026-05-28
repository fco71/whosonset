# WhosOnSet System Status Summary

Last updated: 2026-05-28

This status file replaces older status snapshots. Treat older dated docs as historical context only.

## Overall Status

WhosOnSet is an active production Firebase application for film-industry networking, jobs, projects, collaboration, and screenplay review. The current engineering focus is the collaboration page for student project creation and teacher review.

The app is not "done" or generically production-complete. It is live, useful, and improving, with specific release work still required before the collaboration workflow should be considered polished.

## Current Stack

- Frontend: React 18, TypeScript 5.8, Webpack 5, TailwindCSS, SCSS.
- Backend: Firebase Auth, Firestore, Storage, Hosting, Cloud Functions.
- Firebase project: `my-film-jobs`.
- PDF review: `react-pdf` 10 with `pdfjs-dist` 5 via the transitive dependency.
- Drag and drop: `@dnd-kit/core`.
- Tests: Vitest 3.
- i18n: English and Spanish through i18next.

## Verified On 2026-05-28

- `npx tsc --noEmit` passes.
- `npm run test:run -- --run` passes: 39 tests.
- `npm run build` passes with an existing Webpack entrypoint-size warning.
- Browser smoke test on `/collaboration` confirms workspace load and readable PDF rendering.

## Current Collaboration State

- Workspace creation is persisted in Firestore.
- Workspace members can be invited after workspace creation and after screenplay upload.
- Inviting before upload is optional.
- Workspaces support owner, supervisor, collaborator/member, and viewer roles.
- Screenplays can be uploaded PDFs or in-browser Fountain documents.
- PDF viewer supports annotations, tags, replies, resolved state, and readable page rendering.
- Fountain editor supports writing, page count, formatting toolbar, autosave, and PDF export.
- Workspace archive, restore, soft-delete, and recovery-window concepts exist.
- Workspace querying now uses a `workspaceMemberships` index so Firestore rules can deny broad workspace listing.

## Security And Data Safety

- The site uses live Firestore production data. Do not run destructive Firestore actions without explicit scoped approval in the current conversation.
- Firestore PITR, scheduled backups, and delete protection are documented in [PROJECT_OVERVIEW.md](../../PROJECT_OVERVIEW.md).
- Firestore rules were tightened on 2026-05-28 for workspace reads, screenplay updates, annotation moderation, and membership indexing.
- Generated/private local artifacts are being removed from source control:
  - `.specstory/`
  - `bundle-analysis.html`

## Current Goals

1. Finish manual QA for the student/teacher collaboration loop.
2. Deploy the staged collaboration UI/code changes after QA.
3. Add a first-class teacher review workflow:
   - Draft
   - Submitted for review
   - Changes requested
   - Approved
4. Add review summary counts to screenplay rows and review panels.
5. Add pending email invitation acceptance through a trusted server/admin path.
6. Consolidate duplicated PDF viewer SCSS and reduce bundle size.

## Known Risks

- `ScreenplayViewer.scss` still contains duplicated legacy rules; current stability overrides work but the file should be consolidated.
- Email invitations are not yet a production-grade access path.
- Collaboration presence still uses array-based active users and can leave stale entries.
- The production build still emits a Webpack entrypoint-size warning.
- Older documentation may still describe historical implementation states; use files updated on or after 2026-05-28 as current.
