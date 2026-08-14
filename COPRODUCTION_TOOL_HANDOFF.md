---
title: Coproduction Tool — Integration Handoff
created: 2026-08-13
last_updated: 2026-08-13
status: IN PROGRESS — awaiting source location of the coproduction tool
owner: Francisco
---

## Purpose

Integrate a separately-developed single-page web app ("Coproduction Tool") into
MyFilmJobs / WhosOnSet as a new **`/pro`** section, without disturbing the
existing product, its look-and-feel, or (critically) its Firestore data.

## Non-negotiable constraints (from Francisco)

1. **Firestore for MyFilmJobs must not be altered.** All new data needs are
   **additive only** — brand-new top-level collections, new rules blocks, new
   indexes. **Never** modify, merge into, rename, or delete any existing
   collection, field, rule, or index.
2. **Back up the production database before any change** that could touch data
   or rules. Backup runs under `iam@myfilmjobs.com` (see command below).
3. **The tool keeps its own look and feel.** It is treated as a separate visual
   surface, isolated from MyFilmJobs styling.
4. **This handoff doc is kept current** — steps taken and steps to be taken.

## Locked decisions (confirmed 2026-08-13)

| Topic | Decision |
|---|---|
| Location in app | New section under **`/pro`**, tool route **`/pro/coproduction`** |
| Data storage | **Yes** — persists to **brand-new Firestore collections** (additive only) |
| Access | **Logged-in users only** ("pro") — auth-gated route |
| Style isolation | **Mount outside the `<App/>` layout** (sibling route) → no MyFilmJobs Navbar/Footer/theme; the tool renders full-page with its own look |
| Return path | Must include an **"Exit → back to MyFilmJobs"** control so the user can leave the tool and return to the normal app |

## Existing architecture (as surveyed 2026-08-13)

- React 18 + TypeScript + Webpack 5 + TailwindCSS/SCSS; Firebase (Auth,
  Firestore, Storage, Hosting, Functions v2). Firebase project `my-film-jobs`.
- Routing: `src/router.tsx`, React Router v6 `createBrowserRouter`. Every page is
  a lazy-loaded **child of `{ path: '/', element: <App/> }`**. `<App/>`
  (`src/App.tsx`) renders the shared shell — Navbar, `<Outlet/>`, `Footer` — and
  imposes the global theme (`bg-background text-foreground`, Inter font).
  → To give the tool its own look, add it as a **sibling top-level route**, NOT a
  child of `<App/>`.
- Auth gating today: `src/components/ProtectedRoute.tsx` (`ProtectedRoute` /
  `PublicRoute`). Reused/adapted for the `/pro` guard. [verify it does not depend
  on `<App/>` context before reuse]
- Backup scripts: `backup-firestore.sh` (local dir) and
  `backup-firestore-desktop.sh` (Desktop) — both call
  `firebase firestore:export … --project=my-film-jobs`.
- Deploy rhythm (from project memory): test on the **dev** hosting site first;
  Francisco self-commits; Firestore rules deployed via CLI **with dry-run**;
  reauth can be quirky; big pushes reviewed first.

## Integration plan

### A. Prerequisites (before any code/rules change)
- [ ] **Locate the coproduction tool source** — path/repo + stack (plain
      HTML/JS, React, Vite, Vue…). *← currently blocking.*
- [ ] **Back up production Firestore** under `iam@myfilmjobs.com`.

### B. Routing + shell
- [ ] Create `src/pro/coproduction/` housing the ported tool.
- [ ] Add a top-level route **sibling to `<App/>`** in `src/router.tsx`:
      `{ path: '/pro/coproduction', element: <ProAuthGuard><CoproductionApp/></ProAuthGuard> }`.
- [ ] Auth guard that redirects unauthenticated users to `/login` (reuse
      `ProtectedRoute` logic if it is layout-independent; else a small dedicated guard).
- [ ] Add an **"Exit to MyFilmJobs"** control inside the tool (e.g. link to `/`).

### C. Style isolation
- [ ] Port the tool's CSS scoped under a single wrapper class / CSS-module so it
      cannot leak into (or be overridden by) MyFilmJobs global styles. Exact
      method decided after inspecting the source.

### D. Data (additive-only Firestore)
- [ ] Define **new** top-level collection(s), e.g. `coproductions/*` (final names TBD).
- [ ] Add a **new rules block** to `firestore.rules` — no edits to existing blocks.
- [ ] Add any needed composite indexes to `firestore.indexes.json` — additions only.
- [ ] Deploy rules/indexes with **dry-run first**, AFTER the backup.

### E. Test & ship
- [ ] Build + test locally; typecheck.
- [ ] Deploy to **dev** hosting site, verify route, auth gate, styling isolation, exit path, and that a new-collection write succeeds and touches nothing existing.
- [ ] Deploy rules (dry-run → apply) and production hosting under `iam@myfilmjobs.com`.

## Backup command (run under iam@myfilmjobs.com)

```bash
# 1) switch to the prod account if needed
firebase login   # ensure iam@myfilmjobs.com is active
# 2) run the existing backup script
./backup-firestore.sh
```

## Step log

- **2026-08-13** — Surveyed existing architecture (router, App layout, auth,
  backup scripts, firebase project). Confirmed the four locked decisions with
  Francisco. Created this handoff doc. Authenticated firebase account observed as
  `franciscoadolfo@gmail.com` (backup must run under `iam@myfilmjobs.com`).
  **Blocked on:** location + stack of the coproduction tool source.

## Open questions

1. Where is the coproduction tool source, and what is it built with?
2. What data does it store? (drives the new collection schema + rules)
3. Preferred collection naming (`coproductions/*`? something else?).
