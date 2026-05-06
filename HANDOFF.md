# Project Handoff — myfilmjobs.com / whosonset

**Last updated:** May 6, 2026 (continuation — mobile redesign blocker added in §2K). Owner: Francisco Valdez (`iam@myfilmjobs.com` for Firebase, `franciscoadolfo@gmail.com` for personal).

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

### 2G. May 6 continuation — dev overlay cleanup + nav polish (uncommitted)

- `webpack.config.cjs` now sets `devServer.client.overlay.runtimeErrors = false` while keeping compile `errors: true`. This stops webpack-dev-server's own runtime `unhandledrejection` listener from showing the overlay for benign Firestore/Safari/extension timeouts.
- `src/App.tsx` duplicate global `console.error` error listeners removed. Global filtering remains centralized in `src/index.tsx` and `src/firebase.ts`.
- Removed tracked stale build artifacts from `public/`:
  - `public/*.bundle.js`
  - `public/*.bundle.js.map`
- Added those public bundle/hot-update patterns to `.gitignore` so build artifacts do not come back.
- `src/components/EditCrewProfile.tsx` sticky section navigator now has an active section indicator using `IntersectionObserver` and `aria-current="step"`.
- Verification done:
  - `npx tsc --noEmit` ✅
  - `npm run build` ✅
  - Restarted `localhost:8000` dev server in detached `screen` session ✅
  - In-app browser reload of `http://localhost:8000/login`: no overlay, no console errors. Only remaining warning is React Router's v7 future flag warning.

### 2H. May 6 continuation — mobile resume-builder formatting pass (uncommitted)

- `src/components/EditCrewProfile.tsx` mobile layout pass:
  - Form wrapper now uses phone-safe padding (`px-0` outer form, `p-4` card on mobile; larger padding restored on `sm/lg`).
  - Sticky builder toolbar now uses a mobile `<select>` for section jumps instead of cramming all pills horizontally; desktop/tablet still use the pill nav with active section state.
  - Save status + Save now button stack on phones; buttons become full width on narrow screens.
  - Profile-type selector stacks vertically on phones and remains segmented on larger screens.
  - Repeated rows (teacher classes, languages, share link, education current/end-year) now stack vertically on phones.
  - Education institution field changed from `col-span-2` to `md:col-span-2` to avoid creating an implicit second grid column on mobile.
  - Inputs/selects/textareas now share phone-safe `text-base`, `min-w-0`, and no `focus:scale` so iOS does not zoom or overflow fields.
  - Resume preview now sits inside a horizontal overflow wrapper so the fixed A4 preview cannot force the whole form wider than the viewport.
- Spanish/localization cleanup while touching the builder:
  - Replaced hardcoded builder labels for job titles, residences, education, profile photo, contact, publish/availability, and share controls with `resume.builder.*` keys.
  - `LocationSelector` now uses `react-i18next` for `Select Country` / `Select City` and removed mobile-hostile focus scaling.
  - Added matching English/Spanish translation keys, plus `common.remove`.
- Verification done:
  - `node` JSON parse for `src/locales/en/translation.json` and `src/locales/es/translation.json` ✅
  - Component i18n-key scan for `EditCrewProfile.tsx` and `LocationSelector.tsx`: all `t()` keys present in English and Spanish ✅
  - `npx tsc --noEmit` ✅
  - `npm run build` ✅ (only existing Browserslist database warning)
  - Dev server hot compile log: webpack compiled successfully ✅
  - In-app browser `http://localhost:8000/login`: no console errors ✅
  - In-app browser `http://localhost:8000/edit-profile`: redirects to `/login` in this unauthenticated automation tab, so authenticated/mobile visual QA still needs to be checked from a logged-in browser session.

### 2I. May 6 continuation — mobile sticky-toolbar correction (uncommitted)

- Owner reported mobile resume builder still looked messy and the autosave/save toolbar persisted during scroll, overlaying other fields.
- Deployment status: deployed to Firebase Hosting production on May 6, 2026 via `bash deploy-production.sh`.
- `src/components/EditCrewProfile.tsx` follow-up:
  - The autosave/section toolbar is now normal in-flow on mobile/tablet and only becomes sticky at `lg:` and up.
  - Removed the mobile translucent/backdrop styling from that toolbar so it no longer behaves like an overlay on phones.
  - Email and phone contact rows now stack the input and privacy icon on phones instead of compressing horizontally.
- Verification after this patch:
  - `npx tsc --noEmit` ✅
  - `npm run build` ✅ (only existing Browserslist database warning)
  - Dev server hot compile log: webpack compiled successfully ✅
  - In-app browser `http://localhost:8000/`: no console errors ✅
  - Production deploy completed successfully to `myfilmjobs-com` hosting target ✅
  - Live `https://myfilmjobs.com` returned HTTP 200; `https://myfilmjobs.com/healthz.json` returned `{"status":"ok"}` ✅

### 2J. May 6 continuation — production visibility/cache fix (deployed)

- Owner clarified the mobile preview is remote on iPhone, so local `localhost` changes are not visible until deployed.
- Production was deployed after the mobile sticky-toolbar correction, but live headers showed `main.bundle.js` and `/` were still cacheable for 1 hour.
- Root cause: `webpack.config.cjs` only detected production through `NODE_ENV=production`, while `deploy-production.sh` runs `webpack --mode production`. Production deploys were therefore still emitting stable dev-style filenames such as `main.bundle.js`.
- Fixes:
  - `webpack.config.cjs` now treats `--mode production` / `--mode=production` as production, so deploy builds emit content-hashed, minimized assets like `main.bd28b72f.js`.
  - `firebase.json` now applies `Cache-Control: no-cache` to all hosting paths for production and development targets. This prevents SPA routes like `/`, `/login`, and `/edit-profile` from keeping stale app shells.
- Final production deploy completed successfully via `bash deploy-production.sh`.
- Live verification:
  - `https://myfilmjobs.com/?v=mobile-cache-fix-20260506` returns `Cache-Control: no-cache` ✅
  - `https://myfilmjobs.com/edit-profile?v=mobile-cache-fix-20260506` returns `Cache-Control: no-cache` ✅
  - Live HTML references hashed scripts: `runtime.3e2ded02.js`, `vendor.firebase.65a4322e.js`, `main.bd28b72f.js` ✅
  - `https://myfilmjobs.com/healthz.json` returns `{"status":"ok"}` ✅
- For immediate iPhone testing after this deploy, use a cache-busted URL such as `https://myfilmjobs.com/?v=mobile-cache-fix-20260506` or open a private tab. Existing Safari tabs may still hold the old one-hour cached app shell from before this cache-header fix.

### 2K. May 6 continuation — VentoVault-inspired resume-builder visual pass (deployed)

- Owner asked the resume builder to emulate the look and feel of the local VentoVault wireframe app.
- Reference app inspected at `/Users/fco/Library/Mobile Documents/com~apple~CloudDocs/Documents/Fintech Projects/VentoVault/VentoVault - programming/ventovault-wireframe`.
- `src/styles/globals.css` now has a scoped `mfj-vv-*` visual layer for the resume builder:
  - Light cyan/white/orange app-shell background with subtle grid treatment.
  - Glassy topbar, hero, main panel, toolbar, cards, status chips, nav pills, buttons, and form fields.
  - Mobile-specific panel/card/button sizing so the form remains readable on iPhone-width screens.
- `src/components/EditCrewProfile.tsx` now applies those scoped classes to the builder shell, hero, autosave toolbar, profile-type segmented control, repeated form cards, publish/share controls, privacy icon buttons, save buttons, preview shell, and download button.
- `src/components/LocationSelector.tsx` now uses the same `mfj-vv-field` styling for country/city selects so positions/residences do not look like a separate older form system.
- Localization note: this pass added no new visible text; all changed UI labels continue to use existing `resume.builder.*` / `common.*` i18n keys.
- Verification:
  - `./node_modules/.bin/tsc --noEmit -p tsconfig.json` ✅
  - `npm run build` ✅ (only existing Browserslist age + entrypoint-size warnings)
  - Browser automation attempted on `/edit-profile`, but the automation tab redirected to `/login` because it was unauthenticated. Owner's in-app browser/iPhone session may still be authenticated, so real visual confirmation must happen there.
  - Production deploy completed via `bash deploy-production.sh` ✅
  - Live `https://myfilmjobs.com/edit-profile?v=ventovault-mobile-flat-20260506` returns `Cache-Control: no-cache` ✅
  - Live HTML references hashed `main.59f8bf2d.js` ✅
  - `https://myfilmjobs.com/healthz.json` returns `{"status":"ok"}` ✅

### 2L. May 6 continuation — mobile dark-bar fix targeting nested vv panel shadows (deployed)

**Investigation:** `/edit-profile` page nests 4–5 ventovault container classes (`mfj-vv-topbar`, `mfj-vv-hero`, `mfj-vv-panel`, `mfj-vv-toolbar`, `mfj-vv-card`) — each defined in `src/styles/globals.css:884–895` with the same `box-shadow: var(--mfj-vv-shadow)` (= `0 28px 64px -46px rgba(8, 25, 49, 0.58)`). On desktop with breathing room, the layered translucent panels read as elegant depth. On mobile (375–414px viewport), the cumulative drop shadows stack into thick dark horizontal bars between every container — exactly matching the owner's "thick dark bars present as a border around the form" report.

**Fix applied** (`src/styles/globals.css`, in the existing `@media (max-width: 639px)` block):
- Strip `border`, `box-shadow`, `backdrop-filter` from `.mfj-vv-topbar`, `.mfj-vv-hero`, `.mfj-vv-panel`, `.mfj-vv-toolbar`
- Replace layered translucent gradient with a simple solid-ish white background so each container reads as a clean flat content block separated by margin alone
- Reduced hero `::before` overlay opacity (0.72 → 0.45) so it doesn't darken
- `.mfj-vv-card` keeps rounded corners but loses shadow
- Section dividers inside the panel switched from white-translucent border to subtle navy `rgba(8,25,49,0.08)` — visible but won't read as another bar
- Buttons lose box-shadow

**What was NOT changed:**
- Desktop look (≥640px): untouched — the layered ventovault aesthetic is preserved.
- The `.mfj-vv-world` background grid pattern: kept.
- JSX structure of EditCrewProfile.tsx: not touched — this is a CSS-only fix.

**Verification done:**
- `tsc --noEmit -p tsconfig.json`: ✅ clean
- CSS brace balance check: ✅ 181/181
- Production deploy completed via `bash deploy-production.sh`: ✅
- Live cache-busted URL for owner verification: `https://myfilmjobs.com/edit-profile?v=ventovault-mobile-flat-20260506`

**Still needs owner-side visual confirmation:**
- Confirm on real iPhone that dark bars are gone.
- Confirm the form is still legible and not too washed out after removing mobile shadows.
- Confirm desktop view (≥640px) still keeps the layered translucent depth.

### 2M. Historical owner report — mobile resume builder still broken; VentoVault reference design (superseded by 2K/2L)

**Status update:** The open problem below is the issue addressed by §2K/§2L. Keep the diagnostic notes for future reference if owner still reports problems after the `ventovault-mobile-flat-20260506` deploy.

**Owner report (verbatim):** "I'm having issues with mobile screens, everything ends up compressed and nonsensical on vertical screens. I had asked for a review on ventovault wireframe clean design to emulate for visual improvements on the resume builder page. Keeping it lean and clean and functional. A good example of the bad design is the thick dark bars present as a border around the form."

**State of the problem:**
- Two prior mobile passes (§2H, §2I) shipped to production but the owner is still seeing compressed/messed-up rendering on a real iPhone (vertical viewport, ~375–428px wide).
- The cache fix in §2J is live, so this is NOT a stale-cache issue any more — what the owner is seeing is the *current* deployed CSS/markup.
- Owner specifically called out **"thick dark bars present as a border around the form"** as a bad-design smell that needs removing.
- Owner referenced a **"ventovault wireframe"** as the visual target — a clean, minimal design they want emulated. The reference was later found locally at `/Users/fco/Library/Mobile Documents/com~apple~CloudDocs/Documents/Fintech Projects/VentoVault/VentoVault - programming/ventovault-wireframe`; use that local app, not `ventovault.com`, for future visual comparisons.

**Likely culprits (to investigate, NOT yet confirmed):**
1. The outermost form/page wrapper still has a strong border + heavy padding that frames the whole form on mobile. Search `EditCrewProfile.tsx` and any parent layout (`Layout.tsx`, `App.tsx`) for `border-2`, `border-gray-900`, `ring-`, or any thick-border / dark-shadow utilities being applied to the form container.
2. The sticky toolbar's `<select>` for section jumps (added in §2H) may be expanding past the viewport on mobile due to long Spanish labels (`Información básica`, `Información de contacto`, etc.).
3. Profile-photo / avatar-upload widget might still have a fixed pixel width that pushes layout.
4. Section dividers (`border-t border-gray-200 pt-10`) repeat 9 times — on a narrow viewport, the visual noise from those plus the page border may be reading as "boxed in / dark bars."
5. Tailwind base `prose` or a third-party SCSS module may be injecting min-widths that don't collapse on phones.

**What an incoming agent should do (in this order):**
1. Use the local VentoVault wireframe path from §2K for visual comparison.
2. Take screenshots of the live `https://myfilmjobs.com/edit-profile` at 375px, 414px, and 768px widths in DevTools — identify EXACTLY which elements are "compressed" and which "dark bars" exist. Don't guess.
3. List the specific Tailwind/classes on each problem element. Compare to VentoVault's equivalent.
4. Make ONE targeted fix at a time, deploy with `bash deploy-production.sh`, ask owner to verify on iPhone, repeat. Do NOT batch multiple speculative changes — they may cancel each other out (this is what happened in §2H/2I).

**Verification checklist for any mobile fix:**
- View at 375×667 (iPhone SE), 390×844 (iPhone 14), 414×896 (iPhone 11 Pro Max) in DevTools responsive mode
- No horizontal scroll on any section
- No text wrapped to 1 character per line
- All inputs at minimum 16px font (prevents iOS zoom)
- Section dividers visible but subtle (not "thick dark bars")
- Sticky toolbar: either fully visible OR moves out of the way on scroll — not partially covering inputs
- Verify on real iPhone (owner's device) — DevTools responsive mode is approximate

### 2P. May 6 continuation — DARK MODE was the real culprit all along (uncommitted, NOT YET DEPLOYED)

**Owner provided a screenshot finally.** The "thick dark border around the resume form" turned out to be **`dark:bg-gray-800` (Tailwind's dark-mode variant) painting the EditProfilePage card wrapper navy-grey because the owner's iPhone is in dark mode**. Tailwind defaults `darkMode: 'media'` (no override in `tailwind.config.js`), so `dark:` variants activate on `prefers-color-scheme: dark` automatically.

Old code in `EditProfilePage.tsx` (BEFORE §2N's removal):
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <EditCrewProfile />
</div>
```
Light mode → white card on white-ish page → no visible "frame"
**Dark mode → `bg-gray-800` (#1f2937) card on light-mode page bg → very visible navy "frame"**

This is why prior mobile audits in §2H, §2I, §2L missed it: the bug literally doesn't manifest in light mode, and nobody had tested with the iPhone in dark mode.

**§2N's fix (already applied, unrelated motivation) accidentally fixes this too:** removing the entire `bg-white dark:bg-gray-800 ... p-6` wrapper in EditProfilePage.tsx kills the dark-mode variant along with the frame.

**Next agent — KEY LEARNINGS:**
1. Always test mobile in BOTH light AND dark mode. Tailwind's `dark:` variants are easy to miss because they only render under specific conditions.
2. The ventovault design system in `src/styles/globals.css` was built ONLY for light mode. Its translucent white panels and subtle navy tints look correct on a light page background. They were never designed for dark mode.
3. Owner's device IS in dark mode. After confirming the frame is gone, we need to decide:
   a. **Force light-mode rendering** for `mfj-vv-*` views (`color-scheme: only light` on the world wrapper, or wrap in a `<div>` with explicit light bg)
   b. **Build proper dark-mode variants** for the ventovault classes (more work, but respects user preference)
4. Audit other pages for `dark:bg-gray-800`, `dark:bg-gray-900`, etc. — `grep -rn "dark:bg-gray" src/` will find them all. Each one is a potential "ugly in dark mode" surprise.

**Status:** §2N + §2O fixes already in working tree, ready to deploy. Once deployed AND verified by owner on the iPhone (dark mode), the dark frame is fully resolved.

### 2O. May 6 continuation — full-bleed mobile escape for `<main>` gutter (uncommitted, NOT YET DEPLOYED)

**Owner reported after §2N deploy:** "are you sure? I keep seeing dark border around resume form"

**Real culprit (NOT what §2L, §2M, or §2N targeted):** `src/App.tsx` line 170:
```tsx
<main id="main-content" className="container mx-auto px-4 py-8 pt-24">
```
This `<main>` wraps EVERY page. The `px-4` adds 16px horizontal gutter. The wrapper one level up at line 164 is `<div className="min-h-screen bg-gray-50 ...">` — light gray. Inside the form, the `mfj-vv-world` paints its own `#eef5fa` (subtle blue-gray) background.

→ **The 16px gutter on each side leaks the page's gray-50 background through, which on a 375–414px iPhone reads as a visible "frame" of darker color around the bluish form.** That IS the "dark border" the owner kept seeing — it has nothing to do with shadows. It's a literal background-color difference between the page wrapper and the form's own world background.

**Fix applied:** `src/pages/EditProfilePage.tsx` outer wrapper now has `-mx-4 -mb-8 sm:mx-0 sm:mb-0`:
- On mobile: negative side margins escape `<main>`'s `px-4` so the ventovault world reaches the viewport edge
- On mobile: negative bottom margin closes the gap to the footer
- On `sm:` (≥640px) and up: restored to default (no negative margins) so the framed-card aesthetic returns on tablet/desktop where there's enough viewport real estate for it to look intentional

**Why this hadn't been spotted by previous mobile passes:** every prior pass focused on EditCrewProfile internals or its CSS. The gutter is created by the LAYOUT level — `App.tsx`'s `<main>` is the parent of `<Outlet />` which renders pages. None of the mobile audits in §2H, §2I, §2L, §2N opened `App.tsx` because there's no obvious "card" or "border" class there — just generic Tailwind layout utilities.

**Lesson for next agent:** when an owner says "border around the form" and you've removed every visible border + shadow inside the form, **check whether the body/page background and the form's own background are different colors**. The "frame" might just be the literal background-color contrast at the gutter. Use browser DevTools to inspect the actual pixel color at the suspected "border" — if it's a solid hex color (gray-50 = `#f9fafb`), it's a background leak, not a border/shadow.

**Verification done in sandbox:**
- `tsc --noEmit -p tsconfig.json`: ✅ clean
- Only file changed: `src/pages/EditProfilePage.tsx`

**Verification needed before claiming done:** owner inspects on real iPhone after deploy. If frame is finally gone: ship it. If STILL framed:
1. Worth checking that the deploy actually went out — Safari's CSS cache is sticky.
2. The next-likeliest remaining culprit is the `mfj-vv-world` background pattern itself (the 1px navy grid lines every 56px) being misperceived as a dark frame at the viewport edges. Could test by temporarily setting `mfj-vv-world { background-image: none }` in DevTools.

### 2N. May 6 continuation — REAL dark frame source identified & removed (uncommitted, NOT YET DEPLOYED)

**Owner reported after §2L deploy:** "the dark border is still present. in general it looks better now but this border around the resume builder takes much space physically and perceptually."

**Root cause discovered (NOT what §2L targeted):** `src/pages/EditProfilePage.tsx` — the page-level wrapper around `<EditCrewProfile />` was a Tailwind card:
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <EditCrewProfile />
</div>
```
That `shadow-md` + `p-6` painted a card-with-drop-shadow framing the entire resume builder. EditCrewProfile already renders its own full-bleed ventovault world background internally (`mfj-vv-world` on its outermost div), so this outer card was redundant AND added a visible dark frame on top of the inner panels — exactly the "border around the resume builder" the owner described.

It's a pre-ventovault leftover that survived the redesign because no one had grepped for `shadow-md` on the page wrapper.

**Fix applied:** `EditProfilePage.tsx` simplified to a bare wrapper:
- Removed the `bg-white shadow-md rounded-lg p-6` card div
- Removed the duplicate page title (`{t('resume.page.title')}`) — EditCrewProfile already shows its own title in the `mfj-vv-topbar`, so duplicating it was visual noise
- Removed the outer `max-w-6xl mx-auto px-4 py-8` so the inner ventovault world can render full-bleed
- Kept Suspense + auth check; signed-out empty state still gets a properly-padded message

**Why this matters for next agent:** the ventovault visual system in `src/styles/globals.css` is *complete* — all panel/card/toolbar classes are well-tuned. The bug was that wrapping any `mfj-vv-*` element in a generic Tailwind card cancels out the ventovault layering and adds extra dark shadows. **Audit other pages for the same pattern**: `grep -rn "bg-white.*shadow-md.*p-" src/pages/` before adding new pages.

**Verification done in sandbox:**
- `tsc --noEmit -p tsconfig.json`: ✅ clean
- Only file changed: `src/pages/EditProfilePage.tsx`

**Verification needed before claiming done:** owner must inspect on real iPhone after deploy. If the dark frame is finally gone, ship it; if there's STILL framing, the next likely culprit is the global `Layout.tsx` (already audited and confirmed clean: `Layout.scss` is just `.layout > .content` with no borders/shadows) — at that point start checking individual section dividers inside the panel.

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

### Priority 0 — Resume builder mobile redesign per ventovault reference (BLOCKER, see §2K)
The owner is actively blocked on this. Two prior mobile passes did not solve it. Do NOT attempt another speculative pass — instead:
1. Get the ventovault reference clarified (URL/image/Figma) before making aesthetic decisions.
2. Capture exact-pixel screenshots of the current live mobile rendering (375/390/414 px) and identify the SPECIFIC "dark bars" the owner means. They could be: form container border, section dividers, sticky-toolbar background, or a parent layout wrapper.
3. Make ONE targeted fix at a time, deploy, verify on owner's iPhone, repeat.
4. Full instructions and likely culprits in §2K above.

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
