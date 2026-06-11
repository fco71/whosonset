import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { CollaborationWorkspace } from '../types/Collaboration';
import { WorkspaceAssignment } from '../components/Collaboration/workspaceAccess';
import { logWorkspaceActivity } from './workspaceActivityService';
import { ActorInfo } from './screenplayService';

// Mutations for the workspaceAssignments collection (group assignments, v1).
// Callers gate with canCreateAssignment/canDeleteAssignment; firestore.rules
// enforces the same (owner or effective supervisor creates; creator or owner deletes).

/**
 * Create one assignment in each given group, as a single batch. Used both for
 * "post to this group" (one workspace) and the teacher's "post to all my groups".
 * Returns the created assignments. Activity logging is best-effort per group.
 */
export async function createAssignments(params: {
  title: string;
  description: string;
  workspaces: CollaborationWorkspace[];
  actor: ActorInfo;
}): Promise<WorkspaceAssignment[]> {
  const { title, description, workspaces, actor } = params;
  if (workspaces.length === 0) return [];

  const batch = writeBatch(db);
  const created: WorkspaceAssignment[] = [];
  workspaces.forEach(workspace => {
    const ref = doc(collection(db, 'workspaceAssignments'));
    batch.set(ref, {
      workspaceId: workspace.id,
      title,
      description,
      createdBy: actor.uid,
      createdByName: actor.displayName || '',
      createdAt: serverTimestamp()
    });
    created.push({
      id: ref.id,
      workspaceId: workspace.id,
      title,
      description,
      createdBy: actor.uid,
      createdByName: actor.displayName || '',
      createdAt: new Date()
    });
  });
  await batch.commit();

  created.forEach(assignment => {
    logWorkspaceActivity({
      workspaceId: assignment.workspaceId,
      actorUid: actor.uid,
      actorName: actor.displayName,
      verb: 'assignment_created',
      targetId: assignment.id,
      targetName: assignment.title
    });
  });
  return created;
}

export async function deleteAssignment(assignment: WorkspaceAssignment, actor: ActorInfo): Promise<void> {
  await deleteDoc(doc(db, 'workspaceAssignments', assignment.id));
  logWorkspaceActivity({
    workspaceId: assignment.workspaceId,
    actorUid: actor.uid,
    actorName: actor.displayName,
    verb: 'assignment_deleted',
    targetId: assignment.id,
    targetName: assignment.title
  });
}
