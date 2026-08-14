/**
 * Coproduction Tool — Single Sign-On bridge.
 *
 * The Coproduction tool (served at myfilmjobs.com/copro) is a SEPARATE app on its
 * OWN Firebase project `coproduction-tool`. To give MyFilmJobs users a seamless
 * "no second login" experience, this callable — running inside `my-film-jobs` —
 * verifies the caller's MyFilmJobs session and mints a matching **custom auth
 * token for the `coproduction-tool` project**, keyed to the SAME MyFilmJobs uid.
 * The browser then calls signInWithCustomToken() on the tool's project.
 *
 * This NEVER touches my-film-jobs Firestore. It only issues a coproduction-tool
 * credential for an already-authenticated MyFilmJobs user.
 *
 * Requires a coproduction-tool SERVICE ACCOUNT (admin) key, provided as the secret
 * COPRODUCTION_TOOL_SA (the full service-account JSON, as a string). Generate it in
 * the coproduction-tool Firebase console → Project settings → Service accounts →
 * Generate new private key, then:
 *   firebase functions:secrets:set COPRODUCTION_TOOL_SA   # paste the JSON
 * See COPRODUCTION_TOOL_HANDOFF.md.
 */
import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const COPRODUCTION_TOOL_SA = defineSecret("COPRODUCTION_TOOL_SA");

const COPRO_APP_NAME = "coproduction-tool";

/**
 * Lazily initialise (and cache) a SECONDARY admin app pointed at the
 * coproduction-tool project, using the service-account secret. Kept separate from
 * the default my-film-jobs admin app so the two projects never mix.
 */
function getCoproductionAuth(): admin.auth.Auth {
  const existing = admin.apps.find((a) => a?.name === COPRO_APP_NAME);
  if (existing) {
    return admin.auth(existing);
  }

  let serviceAccount: admin.ServiceAccount;
  try {
    serviceAccount = JSON.parse(COPRODUCTION_TOOL_SA.value());
  } catch {
    throw new HttpsError(
      "failed-precondition",
      "Coproduction SSO is not configured (invalid or missing service-account secret)."
    );
  }

  const app = admin.initializeApp(
    { credential: admin.credential.cert(serviceAccount) },
    COPRO_APP_NAME
  );
  return admin.auth(app);
}

/**
 * mintCoproductionToken — returns { token } (a coproduction-tool custom token) for
 * the authenticated MyFilmJobs caller. Client exchanges it via signInWithCustomToken
 * on the coproduction-tool app.
 */
export const mintCoproductionToken = onCall(
  { region: "us-central1", secrets: [COPRODUCTION_TOOL_SA] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError(
        "unauthenticated",
        "Must be signed in to MyFilmJobs to open the Coproduction tool."
      );
    }

    // Carry the MyFilmJobs email through as a claim so the tool can display it.
    // (Purely informational; the tool's Firestore rules key on request.auth.uid.)
    const email = request.auth?.token?.email;
    const claims = email ? { mfjEmail: email } : undefined;

    try {
      const token = await getCoproductionAuth().createCustomToken(uid, claims);
      return { token };
    } catch (err) {
      console.error("[mintCoproductionToken] failed to mint token", err);
      throw new HttpsError("internal", "Could not create a Coproduction session.");
    }
  }
);
