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
> These were refined across two rounds once the source turned out to be a full
> separate app (see Source assessment). **The rows below are the FINAL model.**

| Topic | Final decision |
|---|---|
| Integration shape | The tool stays a **separate app** (its own repo/build/stack). MyFilmJobs **does not render or bundle it**. A gated `/pro/coproduction` page in MyFilmJobs **links out** to it, opening in its own tab. |
| Tool data | Stays in the tool's **own `coproduction-tool` Firebase project**. MyFilmJobs Firestore is never connected to → constraint #1 guaranteed by construction. **No new collections are added to `my-film-jobs`.** |
| Identity ("one account") | MyFilmJobs is the single identity. **No second login** — a Phase-2 **auth bridge** (Cloud Function mints a `coproduction-tool` custom token from the MyFilmJobs session) signs the user in silently. |
| Access | **Open to anyone at `/copro`** (no MyFilmJobs gate at the URL). The tool's **own Google sign-in gates writes** — any create/edit prompts login/sign-up. (Keeps the direct link truly direct; leaves room to attract new users.) |
| Entry points | (1) A **"Pro"** entry in the MyFilmJobs top bar (`Navigation.tsx`) → same-tab to `/copro`. (2) The **direct URL `myfilmjobs.com/copro`** for people who know where they're going. No separate launchpad page. |
| MyFilmJobs-side look | None needed as a page — the "Pro" nav item links straight to the tool. Only the tool's own look applies, at its own path. |
| Hosting / URL | **Subpath on the main domain: `myfilmjobs.com/coproduction`** (NOT a subdomain). Achieved by building the tool with base path `/coproduction/` and placing its static `dist` under a `coproduction/` folder in the MyFilmJobs Hosting deploy, plus one **additive** rewrite in `firebase.json`. Same-origin, which also makes the Phase-2 SSO handoff simpler. |
| AI backend | **Not needed.** The Gemini pieces (`lib/gemini.ts`, `geminiServer.ts`, `api/generate.ts`) are AI-Studio scaffolding **not referenced by any UI component** — the tool is 100% client-side today. If AI is wired up later, add its endpoint then as a separate follow-up. |
| Return path | Not needed as a built control — the tool opens in its own tab; the user just closes it to return to MyFilmJobs. |

**Note — earlier assumptions now void:** the round-1 "mount as a sibling route
outside `<App/>`" and "add new collections to my-film-jobs" ideas are **dropped**.
Because the tool is a separate site opened in a new tab, the MyFilmJobs page is a
plain gated child route, and no MyFilmJobs Firestore changes are needed at all.

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

## Source assessment (2026-08-13) — `/Users/fco/antigravity/Coproduction-Reality-Check`

"Co-Production Reality Check" — a Google AI Studio–generated budget/co-production
financing calculator. **It is a full separate app, not a drop-in SPA.**

- **Stack:** React **19** + Vite + Tailwind **4** (`@tailwindcss/vite`) + Firebase **12**.
  Host app is React 18 + Webpack + Tailwind 3 + Firebase 11 → **major-version
  mismatches on every axis**; porting source into the host bundle = a rewrite.
- **Own Firebase project `coproduction-tool`** (config in
  `firebase-applet-config.json`, client init `src/lib/firebase.ts`). Auth =
  Google sign-in. Firestore collections: `users`, `projects`, `errors`.
  → **Physically isolated from `my-film-jobs` Firestore.** Constraint #1 is
  already satisfied unless we deliberately repoint it (see collision warning).
- **⚠️ Collision risk:** its `users` / `projects` collection names ALSO exist in
  `my-film-jobs`. Repointing the tool to `my-film-jobs` WITHOUT renaming would
  read/write existing MyFilmJobs docs — a direct violation of "never alter/merge."
  Keeping its own project avoids this entirely.
- **Backend dependency:** AI features call a serverless endpoint `api/generate.ts`
  (`@vercel/node`) → Gemini (`@google/genai`) with Upstash Redis rate-limiting;
  `server/index.ts` is the local Express equivalent. Needs `GEMINI_API_KEY` +
  optional Upstash creds. Non-AI features (calc, currency via exchangerate-api,
  jspdf PDF export, CSV import) are client-side.
- Already wired to deploy to its own Firebase Hosting site `fcocoproduction`
  (target in its `.firebaserc` / `firebase.json`, `public: dist`).

**Recommended approach:** keep the tool on its **own `coproduction-tool`
project**, deploy it as its own build, and **surface it from an auth-gated
`/pro/coproduction` route** in MyFilmJobs (link-out or iframe) — do NOT port the
source into the Webpack bundle. Preserves its look-and-feel, zero risk to
MyFilmJobs data, no version conflicts. Pending Francisco's decisions below.

## Integration plan (phased)

**Guiding principle:** the tool stays a separate app; MyFilmJobs links to it. No
MyFilmJobs Firestore/rules/index changes are required for this integration. The
only MyFilmJobs code change is an additive, gated launchpad page + a nav entry.

### Phase 0 — Prerequisites  ✅ mostly done
- [x] Locate source — `/Users/fco/antigravity/Coproduction-Reality-Check`.
- [x] Back up production Firestore (managed export, 2026-08-13 — confirm SUCCESSFUL).
      *NB: not strictly required since no MyFilmJobs data/rules change, but done as
      the requested safety snapshot.*
- [ ] Confirm the tool builds & runs locally (`npm install && npm run dev` in the
      tool repo); note whether AI features need `GEMINI_API_KEY` for the demo.

### Phase 1 — Serve the tool at `myfilmjobs.com/copro`, linked from a "Pro" nav item
Hosting shape: **Option A** — tool built as static files (Vite `base: '/copro/'`),
served from the MyFilmJobs Hosting site (`public: dist`) under `/copro`. The tool
has **no client-side router**, so only `/copro` → `/copro/index.html` is needed;
assets resolve directly under `/copro/`.

Mechanism for getting the tool's files into `dist/copro/` (mirrors the repo's
existing `copy-static-seo-assets.cjs` pattern — `public/` is NOT wholesale-copied,
only named assets/dirs):
- Tool's built output is committed into the MyFilmJobs repo at **`public/copro/`**.
- A build step copies `public/copro/` → `dist/copro/` (new script, or extend the
  existing copy script). Wired into `npm run build` after webpack.

Tool side (separate repo, low risk):
- [x] Set Vite `base: '/copro/'` in `vite.config.ts`; `npm run build`; verified
      `dist/index.html` references `/copro/assets/...`. ✅
MyFilmJobs side (additive, reversible; review + dev-site test before prod deploy):
- [x] Copy tool `dist/` → `public/copro/` (tracked). ✅
- [x] Add copy `public/copro/` → `dist/copro/` to the build —
      `scripts/copy-copro-app.cjs`, wired into `build` + `build:prod`. ✅
- [x] Add **one additive rewrite** to `firebase.json` hosting BEFORE the catch-all
      (added to BOTH production + development targets):
      `{ "source": "/copro", "destination": "/copro/index.html" }`. ✅
- [x] Add a **"Pro"** entry to `src/components/Navigation.tsx` (desktop + mobile),
      a real `<a href="/copro">` (Hosting-served, not a router route). i18n key
      `nav.pro` added to en + es. ✅
- [x] **Verified locally**: served `public/` and loaded `/copro/` — tool renders
      fully, assets resolve under `/copro/`, no console errors, "Sign in to save…"
      banner confirms writes are gated by the tool's own auth. ✅
- [ ] **Francisco:** dev-site deploy + smoke test, then review, commit, prod deploy
      under `iam@myfilmjobs.com` (see below).
Exit criteria: visiting `myfilmjobs.com/copro` (direct or via "Pro") loads the
tool; edits prompt the tool's login; MyFilmJobs data provably untouched.

### Phase 2 — Seamless single sign-on (no second login)
- [ ] Cloud Function (in `my-film-jobs` Functions) that verifies the caller's
      MyFilmJobs ID token and mints a **`coproduction-tool` custom token** for the
      same uid (needs a `coproduction-tool` service-account key stored as a secret).
- [ ] MyFilmJobs launchpad requests the token and hands it to the tool (short-lived,
      via a secure handoff — e.g. postMessage or one-time code, NOT a URL query per
      the privacy rule).
- [ ] Tool calls `signInWithCustomToken` on load when a handoff token is present;
      falls back to its own Google sign-in otherwise.
- [ ] Verify tool Firestore rules still key on `request.auth.uid` (they do) so data
      is per-user under the bridged identity.
Exit criteria: clicking into the tool from MyFilmJobs signs the user in silently;
no second login prompt.

### Housekeeping (optional, additive)
- [ ] Fix or delete the broken `backup-firestore*.sh` scripts (see backup note).

## Backup command (run under iam@myfilmjobs.com)

> ⚠️ The repo's `backup-firestore.sh` / `backup-firestore-desktop.sh` scripts are
> **broken** — they call `firebase firestore:export`, which is **not a real
> Firebase CLI command** (confirmed failing 2026-08-13). Use the gcloud managed
> export below instead. (TODO: fix or delete the stale scripts.)
>
> Note: **PITR is enabled** and **weekly Firestore backups are already
> scheduled** (per PROJECT_OVERVIEW), so a safety net already exists. The manual
> export is the extra pre-rules-change snapshot Francisco requested.

Run in an **interactive** terminal as `iam@myfilmjobs.com` (gcloud reauth cannot
happen from the non-interactive assistant shell — the known reauth quirk):

```bash
gcloud auth login                                                 # reauth iam@myfilmjobs.com
gcloud storage buckets list --project=my-film-jobs --format="value(name)"   # pick a bucket
gcloud firestore export gs://<BUCKET>/firestore-backup-$(date +%Y%m%d_%H%M%S) --project=my-film-jobs
```

The export is a server-side, read-only snapshot to GCS — it cannot modify or
delete live data.

## Step log

- **2026-08-13** — Surveyed existing architecture (router, App layout, auth,
  backup scripts, firebase project). Confirmed the four locked decisions with
  Francisco. Created this handoff doc. Authenticated firebase account observed as
  `franciscoadolfo@gmail.com` (backup must run under `iam@myfilmjobs.com`).
  **Blocked on:** location + stack of the coproduction tool source.
- **2026-08-13** — Attempted backup: repo scripts fail (`firestore:export` is not
  a Firebase command). Switched plan to gcloud managed export. gcloud active as
  `iam@myfilmjobs.com`/`my-film-jobs` but token needs interactive `gcloud auth
  login` (reauth quirk) — handed the corrected backup recipe to Francisco to run.
  Confirmed PITR + weekly scheduled backups already provide a safety net.
- **2026-08-13 23:14 (local)** — ✅ Manual pre-change backup started under
  `iam@myfilmjobs.com`. Managed export → `gs://my-film-jobs.appspot.com/firestore-backups/backup-20260813_231457`
  (operationState: PROCESSING at launch). Prerequisite B satisfied once export
  reports SUCCESSFUL.
- **2026-08-13** — Inspected the source; found it's a full separate React19/Vite/
  Tailwind4 app on its OWN Firebase project `coproduction-tool` with an AI backend.
  Finalized the model with Francisco over two decision rounds: **separate app,
  link-out from a gated `/pro/coproduction` page, tool data stays on its own
  project (no my-film-jobs Firestore changes), one MyFilmJobs identity via a
  Phase-2 auth bridge, branded subdomain.** Rewrote the decisions table + plan as a
  two-phase roadmap. Verified `ProtectedRoute` (AuthContext-based) can gate the
  launchpad. **Next:** build the Phase-1 MyFilmJobs launchpad page + route + nav
  entry (additive, pending Francisco's go-ahead), and Francisco to deploy the tool
  to the subdomain.

## Deploy & verify (Francisco, under iam@myfilmjobs.com)

Phase-1 code is staged in the working tree (not committed, not deployed). Suggested
order — **test on the dev hosting site first**, per the deploy rhythm:

```bash
# from repo root
npm run build                       # webpack + copies public/copro -> dist/copro
firebase deploy --only hosting:development   # dev site first
# smoke-test the dev URL: open <dev-site>/copro  and click the "Pro" nav item
firebase deploy --only hosting:production     # prod, once dev looks good
```

Notes:
- **No `firestore:rules` / `firestore:indexes` deploy is involved** — this change
  is Hosting-only. MyFilmJobs Firestore, rules, and indexes are untouched.
- `public/copro/` (~1.2 MB of the tool's built JS/CSS) is committed into the repo.
  To update the tool later: rebuild it (`base: '/copro/'`), copy its `dist/` into
  `public/copro/`, commit, redeploy Hosting.
- Files changed: `firebase.json`, `package.json`, `src/components/Navigation.tsx`,
  `src/locales/{en,es}/translation.json`, new `scripts/copy-copro-app.cjs`, new
  `public/copro/**`. (Plus this doc.)

## Open questions

1. Where is the coproduction tool source, and what is it built with?
2. What data does it store? (drives the new collection schema + rules)
3. Preferred collection naming (`coproductions/*`? something else?).
