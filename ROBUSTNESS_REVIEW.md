# Robustness Review — WhosOnSet / My Film Jobs
Date: 2026-06-10. Scope: firestore.rules, storage.rules, functions/src, src/, CI, docs.
Confidence tags: (certain) = verified directly in code this session; (likely) = reported by audit pass, spot-checked but not line-verified.

## The headline problem

(certain) **Any student can promote themselves to supervisor.** The chain:

1. `crewProfiles/{uid}` update rule (firestore.rules:385-394) only constrains the `uid` field. A signed-in user can set `isTeacher: true` or `profileType: 'teacher'` on their own profile.
2. `profileIsTeacher()` (firestore.rules:325-329) reads exactly those two fields.
3. `isSelfSupervisorToggle()` (firestore.rules:332+) lets anyone passing `profileIsTeacher()` self-elect as supervisor in any workspace they're a member of.

A supervisor can moderate review notes, leave teacher-styled annotations, and export the grading CSV. For a tool whose value proposition to teachers is trustworthy review/grading, this is the one to fix first.

**Fix (proper):** move the teacher role to Firebase Auth custom claims, set only via Admin SDK (a small callable gated by an admin allowlist, or manually via a script). Rules then check `request.auth.token.isTeacher == true` — cheaper too, since it removes two `get()` calls per evaluation.
**Fix (quick stopgap):** in the `crewProfiles` update rule, add `!request.resource.data.diff(resource.data).affectedKeys().hasAny(['isTeacher', 'profileType'])`, and validate `create` similarly. Then backfill: audit existing profiles for self-set teacher flags.

## P0 — Security / trust

1. **Teacher role escalation** — above.
2. **RESOLVED 2026-06-14 — Client-creatable notifications.** All active notification flows now use Cloud Functions/Admin SDK. Top-level and both legacy notification subcollections use `allow create: if false`; behavioral emulator tests guard the lock.
3. (certain) **Public reads on `crewProfiles` and `projects`** (`allow read: if true`, firestore.rules:378, 404). Acceptable for a public crew directory; not acceptable by default for students. If student profiles carry contact info, this is an education-privacy problem (FERPA-adjacent if any US institution adopts it). Minimum: a per-profile `isPublic` flag honored in rules, default private for accounts created through a classroom flow.
4. (likely) **Conversation message tampering** — audit found participants (not just the sender) can edit messages. Verify and restrict update to `senderId == request.auth.uid`.
5. (likely) **Email function abuse surface** — unsanitized template variables in HTML email output and broad invoker/CORS settings on some HTTP functions. Verify `emailSend` is not callable beyond intended triggers; HTML-escape all user-supplied values in emails.
6. **No abuse controls.** Nothing stops a hostile student from scripted invite/notification/upload spam (your own audit notes this). Enable **Firebase App Check** (reCAPTCHA Enterprise) across Firestore/Storage/Functions — single highest-leverage abuse mitigation, mostly config not code.

## P1 — Engineering robustness

7. (certain) **Production deploys run zero checks.** `deploy-production.yml` and `deploy-functions.yml` build and ship — no `tsc --noEmit`, no tests, no lint. Pre-commit tests are commented out ("temporarily disabled due to Firebase configuration issues" — .husky/pre-commit:20). The post-deploy healthz smoke test is good but it's the only gate. Add to both workflows: typecheck → `vitest run` → build. Fail the deploy on any failure.
8. (certain) **No staging environment.** You deploy straight to the production project your students use. Create a second Firebase project (or at minimum use Hosting preview channels + the emulator suite for rules) and point a `deploy:staging` at it. PRs deploy to preview; `main` deploys to prod.
9. (certain) **No production error visibility.** ErrorBoundary logs to console only; no Sentry/equivalent. You cannot support students if you can't see their crashes. Sentry's free tier is enough; wire it into both ErrorBoundary and a global `onunhandledrejection` handler, with source maps uploaded at build (you already emit them).
10. **PARTIALLY RESOLVED 2026-06-14 — Rules tests.** `@firebase/rules-unit-testing` is now wired into CI with behavioral coverage for notification authority, follow acceptance, mention fields, and supervisor provenance. Continue expanding it to teacher-role escalation, screenplay deletion, and the rest of the trust model.
11. (certain) **Two god components**: ScreenplayViewer.tsx (3,747 lines) and CollaborationHub.tsx (3,135 lines) mix PDF rendering, Firestore listeners, permissions, and UI. Don't big-bang refactor mid-semester; extract one seam at a time (annotations data layer → custom hook, then review-status logic, then upload logic).
12. (certain) **No ESLint.** Strict TS is on (good, and near-zero `any`), but there's no lint script or config. Add eslint + typescript-eslint + react-hooks plugin; the hooks rules alone will catch listener-cleanup bugs in those large components.
13. (likely) **Client-side scans**: `getProjectsForCrewMember` fetches all projects and filters in JS; member search scans all crewProfiles client-side (acknowledged in PROJECT_OVERVIEW). Fine at 30 users, broken at 3,000. Use `where('crewMemberIds', 'array-contains', uid)` and an indexed/callable search before promoting wider adoption.
14. (certain, from your own docs) **Backup restore never drilled.** PITR + weekly backups exist, but an untested backup is a hope, not a plan. Do one restore into a throwaway project and write down the steps/timing.

## P2 — "Pro" polish

- **Offline tolerance:** enable Firestore offline persistence (`persistentLocalCache`) — film sets and classrooms have bad wifi; right now writes fail silently offline.
- **Monitoring:** Firebase Performance Monitoring + a Cloud Monitoring alert on function error rates and Firestore quota.
- **Lazy-load react-pdf** (route-level dynamic import) — it's a heavy dependency bundled for everyone, including users who never open a screenplay.
- **Dependency hygiene:** complete the planned `firebase-functions` package upgrade; repo cleanup (committed `dist/`, `bundle-analysis.html`, stray `--version/` dir, debug logs, empty sitemap files).
- **Coverage thresholds** in vitest config once tests exist, so coverage can only ratchet up.

## What's already solid (keep doing it)

PITR + weekly backups + delete protection; forced email verification; Phase 1 notification hardening; secrets via `defineSecret` (no `functions.config()` in code — (certain), grep-verified); strict TypeScript; contenthash builds with source maps and post-deploy smoke checks; and the PROJECT_OVERVIEW.md handoff discipline, which is better operational documentation than most professional teams maintain.

## Suggested order of attack

Week 1: teacher-flag rule stopgap + custom-claims plan; CI gates (typecheck/tests); Sentry.
Week 2: emulator-based rules tests for the trust model; App Check in monitoring mode.
Week 3: Notification Phase 2 migration begins; staging project; restore drill.
Then: profile privacy flag, indexed search, component decomposition, offline persistence.
