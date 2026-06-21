# Backlog: Teacher → Student messaging / broadcast

**Status:** Not built (deliberately deferred). Captured 2026-06 after scoping.

## Why this is parked
It's class-admin convenience for an audience the teacher can already reach (WhatsApp/email),
not a growth lever. Build it ONLY if "win film educators → they bring their classes → students
stay as users" becomes a real growth channel. If so, it's legitimately core (the `teacherClasses`
roster infra already exists). Do it AFTER the current SEO/prerender batch ships and is measured.

## Decision already made
**Channel = in-app always + optional email** (chosen option). In-app is the reliable, free,
uncapped channel; email is a per-send opt-in. "Cap email later / move to a bigger provider as the
community grows" is the accepted plan.

## Proposed v1
- **Entry points:** a "Message students" action on `src/components/Collaboration/ClassDetailPage.tsx`
  (whole class) and `WorkspaceDetailPage.tsx` (one workgroup), plus a per-student option on each
  roster row.
- **Recipients:** one student, or the whole class roster.
- **Priority:** normal / important / urgent — styles the in-app message and prefixes the subject;
  "urgent" could force email regardless of the toggle.
- **Email toggle:** "also email" per send. Report back "emailed X of Y (Z opted out)" so the teacher
  is never guessing.

## Non-obvious constraints (the reason this needs real design, not a quick patch)
1. **Gmail SMTP daily cap.** Email sends via nodemailer/Gmail SMTP (`functions/src/emailService.ts`,
   `emailSend` in `functions/src/index.ts`, secrets `SMTP_USER`/`SMTP_PASS`). Free-tier has a daily
   cap the code already guards. Broadcasts must send **sequentially/throttled**; large or frequent
   blasts will hit it. Migrating to SendGrid/Resend/etc. is the scale path.
2. **Per-user throttle + opt-out will silently skip recipients.** `EmailNotificationService.canSendEmail`
   checks `notificationPreferences` + frequency and may return false → a student who got a similar
   email recently or disabled the template gets **nothing**. Wrong for an intentional teacher
   broadcast → need a **force-send path** that bypasses the frequency throttle but still honors a
   hard opt-out.
3. **In-app has none of these limits** — always deliver in-app; treat email as best-effort.

## Building blocks (already exist)
- **Roster:** `src/services/classService.ts` — a `teacherClasses` doc = `workspaceIds` (group
  members) + `manualStudents[]` (with optional `uid`) − `excludedUids`. Resolve student `uid` →
  `users/{uid}.email`. (Note: assembling workspace members into the roster happens in the class/
  workspace UI, not in classService — reuse that.)
- **In-app + email per recipient:** `src/services/messagingService.ts` `sendDirectMessage(...)`
  (in-app notification + already-throttled email).
- **Direct email:** `src/services/emailNotificationService.ts` `sendGeneralNotification(email,
  subject, message)` → `emailSend` Cloud Function.

## Effort estimate
Small service (roster→recipients + broadcast loop with force-send + reporting) + one compose
modal + two entry-point buttons + i18n strings. ~Half a day. Touches messaging/email surface, so
dev-first deploy + a real send test to a couple of throwaway accounts before using on a class.
