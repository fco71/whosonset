import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { computePageCount } from '../utilities/fountain';

/**
 * Screenplay version safety — a bounded, throttled revision ring that protects Fountain
 * content from accidental overwrite/deletion (autosave is last-write-wins on a single
 * `screenplays/{id}.fountainSource` field, so without this a blanked-then-autosaved
 * screenplay is unrecoverable except via admin-only PITR).
 *
 * Design goals (per product discussion):
 *  - FOOLPROOF against mass deletion: a save that dramatically shrinks the content always
 *    archives the prior version first (shrink guard), even if later autosaves blank it more.
 *  - MEMORY-EFFICIENT: do NOT snapshot every 1.5s autosave. Archive at most once per
 *    REVISION_MIN_INTERVAL_MS of editing, and keep only the last REVISION_CAP versions
 *    per screenplay (oldest pruned). Worst case ~REVISION_CAP * ~120KB per screenplay.
 *  - USER-RECOVERABLE: revisions are listable + restorable from the UI (preview before
 *    overwrite), not just admin PITR.
 *
 * Each revision archives the source that is ABOUT TO BE OVERWRITTEN (the prior good state);
 * the current state always lives in `screenplays/{id}.fountainSource`.
 */

const REVISIONS_COLLECTION = 'screenplayRevisions';

export const REVISION_MIN_INTERVAL_MS = 5 * 60 * 1000; // throttle: archive at most every 5 min
export const REVISION_CAP = 25;                          // bounded ring size per screenplay
const SHRINK_GUARD_RATIO = 0.5;     // new < 50% of previous length => suspicious deletion
const SHRINK_GUARD_MIN_PREV = 200;  // ...but only guard once there was real content to lose
const MAX_REVISION_BYTES = 1_000_000; // skip pathological sizes (Firestore 1MB doc ceiling)

export type RevisionReason = 'periodic' | 'shrink_guard' | 'manual' | 'pre_restore' | 'session_end';

export interface ScreenplayRevision {
  id: string;
  screenplayId: string;
  source: string;
  authorId: string;
  authorName: string | null;
  reason: RevisionReason;
  charCount: number;
  pageCount: number;
  createdAt: unknown;
}

/**
 * Decide whether a save warrants archiving the PREVIOUS (about-to-be-overwritten) source.
 * Pure function so it's unit-testable and cheap to call on every save.
 */
export function shouldSnapshot(opts: {
  previousSource: string;
  newSource: string;
  lastSnapshotAt: number; // ms epoch; 0 = never snapshotted this session
  now: number;
}): { snapshot: boolean; reason: RevisionReason } {
  const { previousSource, newSource, lastSnapshotAt, now } = opts;
  // Nothing meaningful to preserve.
  if (!previousSource || previousSource.length === 0) {
    return { snapshot: false, reason: 'periodic' };
  }
  // Anti-destruction guard: a big shrink from real content -> always preserve the prior
  // version immediately, regardless of throttle.
  if (
    previousSource.length >= SHRINK_GUARD_MIN_PREV &&
    newSource.length < previousSource.length * SHRINK_GUARD_RATIO
  ) {
    return { snapshot: true, reason: 'shrink_guard' };
  }
  // Throttled timeline snapshot.
  if (now - lastSnapshotAt >= REVISION_MIN_INTERVAL_MS) {
    return { snapshot: true, reason: 'periodic' };
  }
  return { snapshot: false, reason: 'periodic' };
}

/** Archive a source string as a revision. No-op for empty/oversized content. */
export async function writeRevision(opts: {
  screenplayId: string;
  source: string;
  authorId: string;
  authorName?: string | null;
  reason: RevisionReason;
}): Promise<void> {
  const { screenplayId, source, authorId, authorName, reason } = opts;
  if (!screenplayId || !authorId) return;
  if (!source || source.length === 0 || source.length > MAX_REVISION_BYTES) return;
  await addDoc(collection(db, REVISIONS_COLLECTION), {
    screenplayId,
    source,
    authorId,
    authorName: authorName || null,
    reason,
    charCount: source.length,
    pageCount: computePageCount(source),
    createdAt: serverTimestamp()
  });
}

/** Newest-first list of a screenplay's revisions (for the restore UI). */
export async function listRevisions(screenplayId: string, max = REVISION_CAP): Promise<ScreenplayRevision[]> {
  if (!screenplayId) return [];
  const q = query(
    collection(db, REVISIONS_COLLECTION),
    where('screenplayId', '==', screenplayId),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ScreenplayRevision, 'id'>) }));
}

/**
 * Keep only the newest `cap` revisions for a screenplay; delete the rest. Best-effort
 * (individual delete failures are swallowed). Cheap to call occasionally after a write.
 */
export async function pruneRevisions(screenplayId: string, cap = REVISION_CAP): Promise<void> {
  if (!screenplayId) return;
  const q = query(
    collection(db, REVISIONS_COLLECTION),
    where('screenplayId', '==', screenplayId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  if (snap.size <= cap) return;
  const stale = snap.docs.slice(cap);
  await Promise.all(stale.map(d => deleteDoc(doc(db, REVISIONS_COLLECTION, d.id)).catch(() => undefined)));
}
