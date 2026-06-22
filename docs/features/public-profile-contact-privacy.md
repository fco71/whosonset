# Spec: Get email/phone out of the public profile

**Status:** Planned, investigation done (2026-06). Ready to implement dev-first.

## Problem
`crewProfiles/{uid}` is world-readable when `isPublished == true` (`allow read: if signedIn() || isPublished == true`). Firestore rules are document-level, so the **whole doc** is exposed — including:
- a top-level `email` field (the account email, written by EditCrewProfile line ~979 "use auth email as primary"), and
- `contactInfo.email` / `contactInfo.phone`.

`emailPrivate` / `phonePrivate` only hide these in the ResumeView UI — the raw doc still serves them to any reader. So every published profile's email + phone are harvestable today.

## Blast radius (12 readers — CONTAINED)
**Email as a disposable display-name fallback (signed-in only) — just simplify, don't reroute:**
- `src/utilities/userUtils.ts` (~36, 113)
- `src/components/CollaborativeTasks/CollaborativeTasksHub.tsx` (~70)
- `src/components/CollaborativeTasks/EnhancedTasksHub.tsx` (~87)
- `src/pages/SocialPage.tsx` (~192, 339)
- `src/pages/ProjectManagement/ProjectCrewManagement.tsx` (~60)
→ fall back to `name`/`username`, drop the `.email` dependency.

**Email for notifications (Cloud Functions, Admin SDK — bypasses rules):**
- `src/components/Chat/ChatInterface.tsx` (~339) — chat notification target
- `functions/src/index.ts` (~79, 80, 132) — `resolveRegisteredRecipientEmail` / `getUserData`
→ read from the new auth-only contact doc (or `users/{uid}`).

**Phone for a job poster (signed-in):**
- `src/components/JobSearch/JobApplicantsPage.tsx` (~246)
- `src/components/JobSearch/ApplicationMessaging.tsx` (~127)
→ decide: carry applicant contact on the application doc, or let the poster read the new contact doc.

**Public exposure (the crux):**
- `src/components/ResumeView.tsx` (~600–605) — displays email/phone on the public resume.

## Target design
- New **auth-only** doc: `crewProfiles/{uid}/private/contact` (or `crewContact/{uid}`), holding `email`, `phone`. Rule: `allow read, write: if signedIn() && request.auth.uid == uid` (owner-only; Functions use Admin SDK).
- Public `crewProfiles` doc keeps only non-PII + pro links (`website`, `instagram`) + a new `showPublicContact: boolean` (default **false**). Email/phone are mirrored into the public doc **only** when `showPublicContact === true` AND the profile is not a student.
- `ResumeView`: show public email/phone only when present; otherwise a **"Message on My Film Jobs"** CTA → in-app messaging (requires sign-in).
- EditCrewProfile: opt-in toggle (default off, clear warning), **hidden for students** (`profileType === 'student'` / `isStudent`). Stop writing the top-level `email` to the public doc.
- Minor gate: client-side only in v1 — `profileType`/`isStudent` are user-writable so can't be rule-enforced. Real server-side gate is a follow-up (needs an age or admin-set student signal).

## Order of operations (lowest risk first)
1. **Client, no data/rule risk:** simplify the 5 fallback readers to name/username; ResumeView → CTA + gated contact; EditCrewProfile opt-in toggle + stop writing public email; relabel publish control. Typecheck + dev deploy + verify messaging/tasks still work.
2. **Rules:** add the owner-only private-contact location. Verify with the firestore rules **emulator** (`src/firestoreRules.emulator.test.ts`) before deploying — a bad rule blocks profile saves.
3. **Functions:** repoint Chat + `resolveRegisteredRecipientEmail`/`getUserData` to the new contact source. Dev deploy, send a test notification.
4. **Migration (LAST, with `--dry-run`):** for each `crewProfiles` doc, copy `email`/`contactInfo.email`/`contactInfo.phone` into the private contact doc, then remove them from the public doc. Set `showPublicContact` from the old flags (was-shown → stays opted-in). Dry-run prints every change; run for real only after reviewing. Back up the collection first.

## Test gates
- Public resume (logged out) shows **no** email/phone unless explicitly opted in.
- Raw doc check: `curl` the Firestore REST read of a published profile → no email/phone.
- Messaging + email notifications still fire (Functions read the new source).
- Tasks/social/project UIs still show names (fallback simplification didn't break display).
- Rules emulator: non-owner cannot read the private contact doc.

## Honest caveats
- The migration touches every profile — dry-run + backup are mandatory; do it when the emulator/migration can be verified, not rushed.
- Minor protection is client-side in v1.
- Job-poster phone access needs an explicit product decision.
