import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Private contact details for a crew member.
 *
 * Stored at `crewProfiles/{uid}/private/contact` — an OWNER-ONLY subcollection
 * document (see firestore.rules). The public `crewProfiles/{uid}` doc is
 * world-readable when published, so email/phone must NOT live there unless the
 * user explicitly opts in. This private doc is the canonical home for the
 * account contact info; Cloud Functions read it via the Admin SDK (which
 * bypasses rules) when they need to reach a user (e.g. notifications).
 */
export interface PrivateContact {
  email?: string;
  phone?: string;
}

const PRIVATE_CONTACT_DOC_PATH = (uid: string): [string, string, string, string] =>
  ['crewProfiles', uid, 'private', 'contact'];

/**
 * Read the owner-only private contact doc for a user.
 * Returns null when the caller is not the owner (read denied) or the doc is absent.
 */
export async function getPrivateContact(uid: string): Promise<PrivateContact | null> {
  try {
    const [c0, c1, c2, c3] = PRIVATE_CONTACT_DOC_PATH(uid);
    const snap = await getDoc(doc(db, c0, c1, c2, c3));
    if (!snap.exists()) return null;
    const data = snap.data() as PrivateContact;
    return {
      email: typeof data.email === 'string' ? data.email : undefined,
      phone: typeof data.phone === 'string' ? data.phone : undefined,
    };
  } catch (error) {
    console.error('[contactService] Failed to read private contact:', error);
    return null;
  }
}

/**
 * Write (merge) the owner-only private contact doc for a user.
 * Only the owner may write (enforced by rules).
 */
export async function savePrivateContact(uid: string, data: PrivateContact): Promise<void> {
  const [c0, c1, c2, c3] = PRIVATE_CONTACT_DOC_PATH(uid);
  await setDoc(doc(db, c0, c1, c2, c3), data, { merge: true });
}
