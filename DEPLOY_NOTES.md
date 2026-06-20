# Deploy notes — job lifecycle + screenplay batch (dev first)

Run these **in your terminal** (you're logged into Firebase there; the assistant's sandbox is not).
Verified before handoff: `tsc --noEmit` clean, `webpack --mode production` compiles successfully.

## 1. Build (must run before deploy)
The build also refreshes the prerender **fallback template** copied into `functions/`, so don't skip it.

```bash
cd /Users/fco/Documents/websites_local/whosonset
npm run build:prod
```

## 2. Deploy to DEV (function + dev site)
```bash
firebase deploy --project my-film-jobs --only "functions:prerender,hosting:development"
```
Dev site: the `my-film-jobs` hosting target (e.g. https://my-film-jobs.web.app).

## 3. Test on DEV before touching prod
Regression that broke last time — check first:
- [ ] As a **logged-out** visitor, open a **resume**, a **job**, and a **blog** page → they must render, **not blank**.

New job lifecycle:
- [ ] Open one of your jobs as the poster → **✓ Mark as Filled**. Apply card should switch to "This position has been filled"; the apply form should refuse a direct-link submit. **↩ Reopen** restores it. Job stays visible either way.
- [ ] **🗄 Archive** a test job → it disappears from `/jobs` and search; opening its link while logged out shows "This listing is no longer available." **↩ Unarchive** restores it. (You, the poster, can still open an archived job.)

Optional: paste a job/resume URL into WhatsApp or a link-preview debugger → should unfurl as a rich card.

## 4. If dev is clean, deploy PROD
The function is already live from step 2 (it's shared), so prod only needs hosting:
```bash
firebase deploy --project my-film-jobs --only "hosting:production"
```

## Important: the prerender function is shared by both sites
Cloud Functions are not per-hosting-target. The moment you run step 2, the new `prerender` function is live for **production's** rewrites too. It's hardened to never serve a blank page (fetches the live `index.html` first, falls back to a bundled copy), so this should be safe — but test dev immediately.

### Rollback (if prod ever looks wrong)
Fastest fix is to take prod off the function and back to the plain SPA — the same thing that fixed the previous outage:
1. In `firebase.json`, in the **`"target": "production"`** block, delete the three rewrites whose source is `jobs/**`, `blog/**`, `resume/**` (leave the two sitemap rewrites and the final `"**" -> /index.html`).
2. `firebase deploy --project my-film-jobs --only "hosting:production"`

---

# Security verification — archived/closed jobs do not leak (2026-06)

Traced every surface that lists jobs to a non-poster:

- **JobsPage (`/jobs`, the only routed public list)** — queries `where('status', 'in', ['published', 'active'])`. Archived/closed/draft excluded. ✅
- **jobMatchingService** — queries `where('status', '==', 'active')`. ✅
- **Prerender Cloud Function** — `isPublic = active || published`; anything else gets a noindex preview. ✅
- **JobDetailPage** — archived jobs show "no longer available" to non-posters (poster can still open to unarchive); closed jobs render but block applications. ✅

Hardening done in this pass:

- **`JobSearchPage.tsx` — neutralized.** It queried `jobPostings` with no status filter (would surface archived/closed/draft). It was dead code (zero importers, not in the router), so it was a latent leak only. Replaced its body with a redirect-to-`/jobs` stub so it cannot leak even if someone wires it up later. (Could not hard-delete the file — the sandbox can't unlink files in the mounted folder — so it's stubbed and clearly marked deprecated. **You may want to `git rm` it for real on your machine.**)
- **`/debug-jobs` — already gated.** router.tsx only registers it (and the other `*-test` pages) when `process.env.NODE_ENV === 'development'`; in a production build the route doesn't exist. No change needed — this already matches the codebase's env-flag pattern.

## Known follow-up (not closed in this pass)

- **AIJobRecommendations can show a stale card.** It hydrates job details by id without a status filter, and the render falls back to the recommendation's stored snapshot (`jobData?.title || recommendation.job.title`). So a job recommended while active but since archived/filled could still appear as a card. A status-check on the hydrate alone does NOT fix this (the fallback still renders); the real fix is to filter the `recommendations` list once statuses are hydrated, which has async-ordering edge cases — deferred. **Severity: low** — clicking such a card lands on the JobDetailPage, which already handles archived ("no longer available") and closed ("position filled") correctly.
