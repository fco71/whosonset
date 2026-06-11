import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// A teacher's private class organizer (teacherClasses collection). Owner-only by
// rules; students never read these docs. A class references workspaces (groups)
// by id and carries a manual roster, per-student ticks, and a to-do checklist.

export interface ManualStudent {
  id: string;     // local key, manual-<random>
  name: string;
  /** Set when the entry was added from a real member row (links profile + work). */
  uid?: string | null;
}

export interface ClassChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TeacherClass {
  id: string;
  ownerId: string;
  name: string;
  workspaceIds: string[];
  manualStudents: ManualStudent[];
  /** Per-student tick, keyed by student uid (derived) or manual student id. */
  studentChecks: Record<string, boolean>;
  checklist: ClassChecklistItem[];
  createdAt?: any;
  updatedAt?: any;
}

export const normalizeTeacherClass = (classId: string, data: any): TeacherClass => ({
  id: classId,
  ownerId: data.ownerId || '',
  name: data.name || 'Untitled class',
  workspaceIds: Array.isArray(data.workspaceIds) ? data.workspaceIds.filter((id: unknown): id is string => typeof id === 'string') : [],
  manualStudents: Array.isArray(data.manualStudents)
    ? data.manualStudents.filter((s: any) => s && typeof s.id === 'string' && typeof s.name === 'string')
    : [],
  studentChecks: data.studentChecks && typeof data.studentChecks === 'object' ? data.studentChecks : {},
  checklist: Array.isArray(data.checklist)
    ? data.checklist.filter((item: any) => item && typeof item.id === 'string' && typeof item.text === 'string')
    : [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

export const newLocalId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export async function createTeacherClass(ownerId: string, name: string): Promise<string> {
  const ref = await addDoc(collection(db, 'teacherClasses'), {
    ownerId,
    name,
    workspaceIds: [],
    manualStudents: [],
    studentChecks: {},
    checklist: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

/** Shallow field update on a class doc (owner-only by rules). */
export async function updateTeacherClass(
  classId: string,
  updates: Partial<Pick<TeacherClass, 'name' | 'workspaceIds' | 'manualStudents' | 'studentChecks' | 'checklist'>>
): Promise<void> {
  await updateDoc(doc(db, 'teacherClasses', classId), {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteTeacherClass(classId: string): Promise<void> {
  await deleteDoc(doc(db, 'teacherClasses', classId));
}
