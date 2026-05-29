import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Verbs the activity feed understands. Each maps to a localized phrase
// (collaboration.activity.verbs.<verb>) in the translation files.
export type WorkspaceActivityVerb =
  | 'screenplay_uploaded'
  | 'screenplay_created'
  | 'screenplay_deleted'
  | 'review_submitted'
  | 'review_changes_requested'
  | 'review_approved'
  | 'review_returned_to_draft'
  | 'member_added'
  | 'member_self_promoted'
  | 'annotation_added'
  | 'tag_added'
  | 'supervisor_note_addressed'
  | 'supervisor_note_reopened';

export interface WorkspaceActivityInput {
  workspaceId: string | null | undefined;
  actorUid: string | null | undefined;
  actorName?: string | null;
  verb: WorkspaceActivityVerb;
  targetId?: string | null;
  targetName?: string | null;
  detail?: string | null;
}

/**
 * Append one event to a workspace's activity log. Best-effort: skips silently when there's
 * no workspaceId (personal/unscoped items) or no actor, and never throws — activity logging
 * must never block or fail the underlying action that triggered it.
 */
export async function logWorkspaceActivity(input: WorkspaceActivityInput): Promise<void> {
  const { workspaceId, actorUid, verb } = input;
  if (!workspaceId || !actorUid) return;
  try {
    await addDoc(collection(db, 'workspaceActivity'), {
      workspaceId,
      actorUid,
      actorName: input.actorName || 'Someone',
      verb,
      targetId: input.targetId || null,
      targetName: input.targetName || null,
      detail: input.detail || null,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('[workspaceActivity] failed to log activity (non-fatal):', err);
  }
}
