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

---

# SEO / growth-lever audit (2026-06)

Audited the acquisition machinery before deploy. Most of it is solid:

- **Sitemaps + robots** ✅ `robots.txt` → `sitemap.xml`, which is a proper **sitemap index** referencing `sitemap-static`, `sitemap-jobs`, `sitemap-blog`, `sitemap-directory`. Jobs/blog sitemaps are served by Cloud Functions (rewrites); static + directory are copied to `dist/` with fresh `lastmod` at build. No change needed.
- **JobPosting JSON-LD** ✅ All Google-required fields present (title, description, datePosted, employmentType, hiringOrganization, jobLocation / applicantLocationRequirements), gated on `isPublic && !expired` — so the new closed/archived jobs are correctly de-indexed and emit no JobPosting schema.
- **Per-entity prerender meta** ✅ Jobs/blog/resume each get unique title, description, canonical, OG, and JSON-LD. Resume prerender hard-returns `null` for unpublished profiles (privacy gate intact).
- **Directory pages** ✅ render unique content with an anti-doorway `noindex` guard until ≥3 crew, ItemList schema, and internal linking.

## FIXED this pass

- **Static homepage canonical was poisoning every non-prerendered route.** `public/index.html` hardcoded `<link rel="canonical" href="https://myfilmjobs.com/">`. That shell is served verbatim to crawlers for the homepage (correct) **and** for `/directorio/*` and the job/crew list pages (wrong — they all claimed the homepage as canonical until JS overwrote it, risking Google treating them as duplicates of the homepage). Removed the hardcoded tag; canonical is now set per-route (prerender for jobs/blog/resume, `setPageSeo` client-side elsewhere), and pre-JS each URL self-canonicalizes.
  - Confidence: ~98% this is safe (no build/runtime impact); ~80% it's net-positive for SEO. Tradeoff: homepage URL *parameter* variants (`/?utm=…`) lose pre-JS consolidation to `/`, but JS restores it and Google handles params. **Trivial to revert** (re-add one line) if you'd rather keep the explicit homepage canonical.

- **Directory pages are now server-rendered (prerendered).** Added `buildDirectory()` + `buildDirectoryHub()` to `prerender.ts` and `directorio` + `directorio/**` hosting rewrites (both targets). Crawlers and social unfurlers now get the correct per-page title/description/canonical, the ≥3-crew `noindex` threshold, and `ItemList` JSON-LD — server-side, no JS dependency. The taxonomy (`src/data/directoryTaxonomy.json`) is copied into the function at build (`copy-template-to-functions.cjs`), and the crew-match logic in `prerender.ts` mirrors `src/utilities/directory.ts` (a comment in both flags the duplication — keep in sync). Verified: functions `tsc` clean; matching logic unit-tested against the real taxonomy (national-region inclusivity, accent/case-insensitive department match, ≥3 threshold, thin→noindex all correct).

## Recommended follow-ups (NOT done — your call)

1. **Always emit `validThrough` on JobPosting** (default e.g. datePosted + 60 days when no deadline). Google may drop job listings that never expire. One-line addition in `buildJob`, low risk.
2. **Verify post-deploy** that `jobsSitemap` excludes `closed`/`archived` (consistency with the new lifecycle) — listed in the checklist below.

(The directory-prerender follow-up that was here is now DONE — see the FIXED section above.)

## Post-deploy growth verification (live-only — do after prod deploy)

- [ ] **GA4**: open Realtime, load the site in another tab, confirm your visit appears; confirm `page_view` events fire on route changes.
- [ ] **Search Console**: submit `https://myfilmjobs.com/sitemap.xml`; confirm it reads the 4 child sitemaps with no errors.
- [ ] **Rich result test** (search.google.com/test/rich-results): run a public job URL → JobPosting detected, 0 errors. Run a blog URL → Article. Run a directory URL with ≥3 crew → ItemList.
- [ ] **URL inspection**: inspect one `/directorio/{cat}/republica-dominicana` URL → "URL is on Google" or request indexing; check the rendered canonical is the directory URL (not the homepage).
- [ ] **Social unfurl**: paste a public **resume**, **job**, and **directory** URL (e.g. `/directorio/produccion/republica-dominicana`) into WhatsApp/Slack → each unfurls with its own title/description (confirms the prerender, directory pages now included).
- [ ] **Directory prerender**: `curl -A "facebookexternalhit" https://my-film-jobs.web.app/directorio/produccion/republica-dominicana` (on dev) → the returned HTML `<title>` should read "Producción en República Dominicana…", not the generic homepage title.
- [ ] **Jobs sitemap**: open `https://myfilmjobs.com/sitemap-jobs.xml` → confirm it lists only open jobs (no closed/archived).
