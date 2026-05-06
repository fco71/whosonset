# Project Handoff — myfilmjobs.com / whosonset

**Last updated:** May 5, 2026 (mid-session). Owner: Francisco Valdez (`iam@myfilmjobs.com` for Firebase, `franciscoadolfo@gmail.com` for personal).

This doc lets another agent pick up where we left off without re-asking the basics. Read it top-to-bottom before making changes. Delete it from the repo or `.gitignore` it before committing — it contains internal status notes.

---

## 1. Project at a glance

- **Live site:** `https://myfilmjobs.com` (Firebase Hosting, project `my-film-jobs`, hosting site `myfilmjobs-com`)
- **Stack:** React + TypeScript + webpack + Firebase (Auth, Firestore, Functions, Storage), Tailwind, react-router-dom, react-i18next (en/es)
- **Repo root:** `/Users/fco/Documents/websites_local/whosonset`
- **Build:** `npm run build` (webpack production + `node scripts/copy-static-seo-assets.cjs`)
- **Deploy script:** `bash deploy-production.sh` from repo root (runs build + `firebase deploy --only hosting:production`)
- **DNS:** GoDaddy nameservers (`ns69.domaincontrol.com`, `ns70.domaincontrol.com`). Apex points to Firebase IP `199.36.158.100`. **Cloudflare migration pending** (see §5).
- **Firestore collections used by the work below:** `crewProfiles`, `jobDepartments`

---

## 2. What was done this session (chronological)

### 2A. Site outage diagnosis & fix
- Client reported `myfilmjobs.com` showing Firebase "Site Not Found" page on mobile. Owner couldn't reproduce.
- Root causes identified:
  1. **`www.myfilmjobs.com` was never added as a custom domain in Firebase.** Anyone hitting the `www.` URL got 404. **Owner fixed manually in Firebase Console** (added `www` as a redirect-to-apex custom domain).
  2. Stale carrier DNS suspected for the original mobile complaint.
- Production redeploy was run and verified (`bash deploy-production.sh`).
- `myfilmjobs-com.web.app` confirmed loading, custom domain "Connected" status green.

### 2B. Monitoring & ops infrastructure (committed)

| File | Purpose |
|---|---|
| `public/healthz.json` | Static `{"status":"ok",...}` endpoint live at `https://myfilmjobs.com/healthz.json`. Verified live. |
| `scripts/copy-static-seo-assets.cjs` | Added `healthz.json` to the build copy list. |
| `.github/workflows/deploy-production.yml` | GitHub Actions workflow: auto-deploy on push to `main`, smoke-tests `/healthz.json` after deploy. **NOT YET ACTIVATED** — needs Firebase service-account JSON in GitHub Secret `FIREBASE_SERVICE_ACCOUNT_MY_FILM_JOBS`. See §5 step 3. |

### 2C. Dev console error cleanup (committed)
Three error categories were spamming the React dev overlay on `localhost`:
- `TimeoutError: operation timed out` (Firestore long-polling noise)
- `TypeError: Cannot call a class as a function` (React Fast Refresh artifact with class components)
- `Unknown promise rejection reason` (suppressors didn't handle bare/empty rejections)

Fixed in:
- `src/index.tsx` — global handlers now `event.preventDefault()` on benign patterns and use `console.warn` (not `console.error`) so the dev overlay doesn't fire. New `BENIGN_ERROR_PATTERNS` list at the top of the file.
- `src/firebase.ts` — `unhandledrejection` handler now also matches on `error.code` (Firestore errors often have `.code: 'unavailable'` with no `.message`).

These fixes are dev-mode quality-of-life only — production was never affected by these errors.

### 2D. Student/teacher feature additions (committed)

**Existing toggle audit:** `src/components/EditCrewProfile.tsx` already had a working `'professional' | 'student' | 'teacher'` toggle defaulting to `'professional'`. Backward-compatible with legacy `isStudent`/`isTeacher` flags. Working correctly — no changes needed to that toggle.

**New feature: per-class student enrollment**
- `src/types/CrewProfile.ts` — added `classes?: string[]` to `SelectedTeacherInfo` interface.
- `src/components/EditCrewProfile.tsx` — when a student checks a teacher box, that teacher's classes appear as nested checkboxes; student picks the ones they're enrolled in. New helper: `toggleStudentEnrolledClass(teacherUid, className, checked)`. Save logic preserves these enrollments through `selectedTeachers[].classes`.

**New page: My Students** (`src/pages/MyStudentsPage.tsx`)
- Route: `/my-students`, lazy-loaded, wrapped in `ProtectedRoute` (added in `src/router.tsx`)
- Behavior: Firestore query `where('selectedTeacherIds', 'array-contains', user.uid)` lists everyone who picked the current user as teacher. Groups them by class name (using the teacher's `teacherInfo.classes`). Has CSV export and student profile links.
- Access control: page itself checks `profileType === 'teacher'`; non-teachers see explanatory empty state.

**Nav link** (`src/components/Navigation.tsx`)
- "🎓 My Students" link added to the user dropdown — only shown when `crewProfiles/{uid}.profileType === 'teacher'` (or legacy `isTeacher === true`).
- Added `useEffect` that loads the user's profile on sign-in to determine teacher status (state `isTeacherUser`).

### 2E. Resume builder UI redesign — IN PROGRESS (uncommitted)

**Goal:** Make the form feel like a guided step-by-step process, not one giant scroll. Modern, minimalist, less spread out.

**What's done:**
1. Replaced the single sticky save bar with a **combined sticky bar** containing:
   - Section navigator (pill buttons that scroll to each section anchor)
   - Auto-save status + manual save button on the right
2. Each form section converted from heavy gray-card `<div>` to clean `<section>` with:
   - `id="section-XYZ"` for anchor scrolling
   - `scroll-mt-44` so anchors don't hide behind sticky bar
   - Numbered prefix (`Section 01`, `02`, ...) using i18n key `resume.builder.sectionNumberLabel`
   - Subtle `border-t border-gray-200 pt-10` divider between sections (instead of full card backgrounds)
   - Tighter `<h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">` headers
3. **9 sections** are now numbered:
   - 01 Profile Type
   - 02 Basic Information (Name + Bio) — NEW dedicated section
   - 03 Job Titles
   - 04 Languages
   - 05 Residences
   - 06 Projects
   - 07 Education
   - 08 Contact
   - 09 Publish (consolidates the old Publish toggle + Availability + Share Resume into one)
4. **Section labels** added to nav pills via i18n keys `resume.builder.sections.{profileType,basicInfo,jobTitles,languages,residences,projects,education,contact,publish}`.
5. **Institution input reverted** from strict `<select>` back to **combobox**: `<input list="...">` + `<datalist>` of registered teacher institutions. Free-typeable so non-students-of-yours can still use it; suggestion dropdown keeps wording consistent for those whose teacher IS registered. Hint text added below: `resume.builder.schoolInstitutionHint`.

**Current state:**
- TypeScript: ✅ 0 errors (`./node_modules/.bin/tsc --noEmit -p tsconfig.json`)
- All section IDs verified present (lines 1140, 1343, 1378, 1525, 1561, 1602, 1666, 1860, 2012)
- All numbered prefixes verified (01–09 in file order)

**What's NOT yet done in the redesign (next agent should consider):**
- **Active section indicator in nav:** currently all nav pills look the same. Adding `IntersectionObserver` to highlight the pill matching the section in viewport would complete the "step-by-step" feel.
- **Tighter input padding:** `p-4` (16px) on inputs is still chunky. Consider `py-2.5 px-3` for a more modern compact feel. ~30 inputs across the file — risky to touch in one shot, suggest a follow-up pass.
- **Mobile testing:** the sticky nav bar is horizontally scrollable but hasn't been tested on a narrow viewport. Verify pill nav doesn't overlap the save button on phones.
- **Class-name-as-combobox for students:** owner mentioned wanting students to also be able to free-type a class name (in addition to checking the teacher's existing classes). Currently students can ONLY check teacher-defined classes — they can't type a custom one. Future enhancement: add a "+ Add other class" input under each teacher's class list. Even further: pre-populate class dropdown from a future per-university course catalog (`universities/{slug}/courses` collection, doesn't exist yet).

### 2F. UptimeRobot monitoring (set up by owner, partially complete)
- Owner has a free UptimeRobot account.
- **Monitor #1 (apex):** ✅ created, monitoring `https://myfilmjobs.com` every 5 min, email alerts to `franciscoadolfo@gmail.com`.
- **Monitor #2 (www):** ✅ created — and immediately fired a real 404 alert that revealed the missing `www` custom domain (which the owner then fixed in Firebase Console).
- **Monitor #3 (healthz keyword check):** NOT YET CREATED. See §5 step 1.

---

## 3. Files modified or created this session

### Committed (in `main` already)
```
M  scripts/copy-static-seo-assets.cjs       (added healthz.json to copy list)
M  src/components/Navigation.tsx            (My Students nav link, teacher detection)
M  src/components/EditCrewProfile.tsx       (per-class enrollment, partial UI redesign)
M  src/firebase.ts                          (smarter unhandledrejection handler)
M  src/index.tsx                            (global error handler rewrite)
M  src/locales/en/translation.json          (~25 new keys)
M  src/locales/es/translation.json          (~25 new keys)
M  src/router.tsx                           (added /my-students route)
M  src/types/CrewProfile.ts                 (SelectedTeacherInfo.classes added)
A  .github/workflows/deploy-production.yml  (GH Actions workflow — NOT activated yet)
A  public/healthz.json                      (monitoring endpoint)
A  src/pages/MyStudentsPage.tsx             (new teacher-only page)
```

### Uncommitted (working tree, as of last check)
```
M  src/components/EditCrewProfile.tsx       (sticky nav bar + section refactor + combobox revert)
M  src/locales/en/translation.json          (sectionNumberLabel, sections.*, basicInformation, schoolInstitutionHint)
M  src/locales/es/translation.json          (same keys, Spanish)
?? .claude/                                  (agent metadata, ignore)
```

Last commits:
- `e98e78ee` Probando update para estudiantes, ahora mixto con claude v2
- `6697a716` añadiendo student option v1

---

## 4. Known gotchas & ops notes

### Git index lock keeps reappearing
- A stale `.git/index.lock` has appeared multiple times this session, blocking commits.
- Cause: VS Code source-control panel or another git tool starting an op and crashing.
- Fix: in Terminal, run `cd ~/Documents/websites_local/whosonset && rm -f .git/index.lock`.
- The Cowork sandbox CANNOT delete files inside `.git/` (permission denied) — owner must do it from Terminal.

### Husky pre-commit hook
- `.husky/pre-commit` greps staged files for API key patterns + blocks `.env` files. Should run in <1s.
- If commit feels stuck, the hook is probably scanning a huge accidentally-staged file (e.g. `dist/` or `node_modules/`). Use `git commit --no-verify -m "msg"` to bypass for one commit only.

### Firebase auth in CLI
- `firebase` CLI may be logged into the wrong Google account. `firebase logout && firebase login` and pick `iam@myfilmjobs.com` in the browser.
- For service-account-based deploys (GitHub Actions), use the Firebase Console → Project Settings → Service Accounts → "Generate new private key."

### Dev server errors on localhost
- Some `TimeoutError`/`Cannot call a class as a function`/`Unknown promise rejection reason` errors are EXPECTED in dev mode and are now silently suppressed (see §2C). They do NOT appear in production builds.

### Firestore long-polling
- `src/firebase.ts:46` uses `experimentalForceLongPolling: true`. This is more reliable across networks but slower. If dev sessions feel sluggish, swap to `experimentalAutoDetectLongPolling: true`.

---

## 5. Outstanding work (recommended next actions, in priority order)

### Priority 1 — Verify the resume builder redesign in browser
1. Restart dev server: `cd ~/Documents/websites_local/whosonset && npm run dev`
2. Open `http://localhost:8000/edit-profile`
3. Confirm:
   - Sticky bar at top shows 9 section pill buttons + autosave status + Save button
   - Clicking a pill smoothly scrolls to that section
   - Each section has "Section 0X" small label + clean h3 + subtle top border (no heavy gray cards)
   - Form still saves correctly
4. **As a student profile**, open Profile Type → Student → confirm institution input is a free-text field with autocomplete dropdown of registered teacher institutions (NOT a strict select)
5. If anything looks broken, check `EditCrewProfile.tsx` lines 1095–2150 for stray `<div>` wrappers that should have been removed

### Priority 2 — Commit the redesign
```
cd ~/Documents/websites_local/whosonset
rm -f .git/index.lock          # in case it's stuck again
git add src/components/EditCrewProfile.tsx src/locales/
git commit -m "Resume builder UI redesign: sectioned, sticky nav, modern minimalist"
git push
```

### Priority 3 — Add UptimeRobot Monitor #3 (healthz keyword check)
- Type: **Keyword**
- URL: `https://myfilmjobs.com/healthz.json`
- Keyword: `"status":"ok"`
- Alert when keyword: **Not Exists**
- Interval: 5 min
- Email + SMS alerts
- This is the most reliable monitor — catches "Site Not Found" pages that return wrong content

### Priority 4 — Activate GitHub Actions auto-deploy
1. Firebase Console → Project Settings → Service Accounts → "Generate new private key" (downloads JSON)
2. GitHub repo → Settings → Secrets and variables → Actions → "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT_MY_FILM_JOBS`
   - Value: paste entire JSON contents
3. Push any commit to `main` → workflow runs automatically
4. Workflow file: `.github/workflows/deploy-production.yml`

### Priority 5 — Cloudflare migration (eliminates DNS fragility forever)
- Owner has a Vercel account; Cloudflare is the recommended path for Firebase Hosting.
- Steps documented in earlier conversation but not yet executed:
  1. Sign up at `dash.cloudflare.com/sign-up` (free)
  2. Add `myfilmjobs.com`, choose Free plan
  3. Cloudflare imports DNS records — verify A record + MX records (email) carry over
  4. Change nameservers at GoDaddy to Cloudflare's two
  5. Once active, replace A record with CNAME `myfilmjobs.com → myfilmjobs-com.web.app` (orange-cloud proxy ON)
  6. Re-verify custom domain in Firebase Console
- Result: edge caching, no more apex-A-record fragility, free DDoS protection

### Priority 6 — Optional: complete UI redesign polish
See §2E "What's NOT yet done":
- Active section indicator in sticky nav (IntersectionObserver)
- Tighter input padding pass (`p-4` → `py-2.5 px-3`)
- Mobile sticky-bar test
- Class-name combobox for students (free-type custom class)

---

## 6. Useful commands cheat sheet

```bash
# Working dir
cd ~/Documents/websites_local/whosonset

# Local dev
npm run dev                        # webpack dev server on :8000

# Build + deploy production
bash deploy-production.sh

# TypeScript check (no emit)
./node_modules/.bin/tsc --noEmit -p tsconfig.json

# DNS sanity check
dig myfilmjobs.com A +short && dig www.myfilmjobs.com A +short && dig myfilmjobs.com NS +short

# Unstuck git
rm -f .git/index.lock

# Bypass husky pre-commit (rare)
git commit --no-verify -m "..."

# Switch firebase account
firebase logout && firebase login

# Live monitoring URL
https://myfilmjobs.com/healthz.json
```

---

## 7. Key code conventions

- **Imports:** absolute paths from `src/` not used; relative imports throughout.
- **Styling:** Tailwind utility classes inline in JSX. SCSS modules exist for some legacy components.
- **i18n:** All user-facing strings via `t('key')` from `useTranslation()`. EN + ES both maintained. Keys are dot-namespaced (e.g., `resume.builder.sections.profileType`).
- **Lazy loading:** New page routes use `React.lazy(() => import(...))` in `src/router.tsx`.
- **Error handling:** Don't add new `console.error` calls in user-flow code paths — the global handler in `src/index.tsx` will keep them out of the dev overlay only if the message matches a benign pattern. For real errors use a proper toast/banner instead.
- **Firestore reads in components:** prefer `useEffect` + `getDoc`/`getDocs` (modular SDK). Watch out for `experimentalForceLongPolling` adding latency.

---

## 8. Quick context for an LLM agent picking this up

If you're an AI agent starting fresh:
1. Read this whole file first.
2. Run `git status` and `git log --oneline -5` to see current state.
3. Run `./node_modules/.bin/tsc --noEmit -p tsconfig.json` to confirm clean compile.
4. Ask the user (Francisco) which Priority item from §5 they want to work on next — don't assume.
5. Use `TaskCreate`/`TaskUpdate` to track work as you go (the user appreciates visible progress).
6. Owner prefers commands shown in chat (not just clipboard) — clipboard recycles fast on his Mac.
7. The site IS in production with paying-attention users — verify changes locally before suggesting deploys.
