import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
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
  /** Optional hex color (e.g. "#34c759") for at-a-glance class identification. */
  color?: string;
  workspaceIds: string[];
  manualStudents: ManualStudent[];
  /**
   * Students removed from the roster individually even though their group is in
   * the class. Restorable from the roster's "Excluded" list — this is what makes
   * group-derived students behave like removable individuals.
   */
  excludedUids: string[];
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
  color: typeof data.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(data.color) ? data.color : undefined,
  workspaceIds: Array.isArray(data.workspaceIds) ? data.workspaceIds.filter((id: unknown): id is string => typeof id === 'string') : [],
  manualStudents: Array.isArray(data.manualStudents)
    ? data.manualStudents.filter((s: any) => s && typeof s.id === 'string' && typeof s.name === 'string')
    : [],
  excludedUids: Array.isArray(data.excludedUids)
    ? data.excludedUids.filter((id: unknown): id is string => typeof id === 'string')
    : [],
  studentChecks: data.studentChecks && typeof data.studentChecks === 'object' ? data.studentChecks : {},
  checklist: Array.isArray(data.checklist)
    ? data.checklist.filter((item: any) => item && typeof item.id === 'string' && typeof item.text === 'string')
    : [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

// Palette for class color-coding — small and distinct so classes are easy to tell apart
// at a glance; the picker offers exactly these.
export const CLASS_COLORS = ['#007aff', '#34c759', '#ff9500', '#af52de', '#ff2d55', '#00c7be', '#ffcc00', '#8e8e93'];

/** A class's display color: its stored color if set, else a stable pick from its id. */
export const getClassColor = (teacherClass: { id: string; color?: string | null }): string => {
  if (teacherClass.color && /^#[0-9a-fA-F]{6}$/.test(teacherClass.color)) return teacherClass.color;
  let hash = 0;
  for (let i = 0; i < teacherClass.id.length; i++) hash = (hash * 31 + teacherClass.id.charCodeAt(i)) >>> 0;
  return CLASS_COLORS[hash % CLASS_COLORS.length];
};

/** Readable text color (#fff or near-black) for a background hex, by luminance. */
export const getReadableTextColor = (hex: string): string => {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) return '#ffffff';
  const value = parseInt(match[1], 16);
  const r = (value >> 16) & 255, g = (value >> 8) & 255, b = value & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#1f2937' : '#ffffff';
};

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
  updates: Partial<Pick<TeacherClass, 'name' | 'color' | 'workspaceIds' | 'manualStudents' | 'studentChecks' | 'checklist'>>
): Promise<void> {
  await updateDoc(doc(db, 'teacherClasses', classId), {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

// Membership mutations use atomic array operators / field paths rather than
// read-modify-write of whole arrays: the group page and the class page can both
// be open (two tabs is the normal teacher flow), and full-array writes from a
// stale snapshot silently resurrect or drop entries.

export async function setWorkspaceInClass(classId: string, workspaceId: string, include: boolean): Promise<void> {
  await updateDoc(doc(db, 'teacherClasses', classId), {
    workspaceIds: include ? arrayUnion(workspaceId) : arrayRemove(workspaceId),
    updatedAt: serverTimestamp()
  });
}

export async function addWorkspacesToClass(classId: string, workspaceIds: string[]): Promise<void> {
  if (workspaceIds.length === 0) return;
  await updateDoc(doc(db, 'teacherClasses', classId), {
    workspaceIds: arrayUnion(...workspaceIds),
    updatedAt: serverTimestamp()
  });
}

export async function addManualStudentToClass(classId: string, student: ManualStudent): Promise<void> {
  await updateDoc(doc(db, 'teacherClasses', classId), {
    manualStudents: arrayUnion(student),
    updatedAt: serverTimestamp()
  });
}

/**
 * Remove one student from the roster, whatever their source(s): drops their
 * manual entry (arrayRemove matches by deep equality — pass the exact stored
 * object from the snapshot), excludes their uid when they also arrive via a
 * group, and clears their tick. One atomic write.
 */
export async function removeStudentFromRoster(
  classId: string,
  params: { manualStudent?: ManualStudent; excludeUid?: string; tickKey: string }
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    [`studentChecks.${params.tickKey}`]: deleteField(),
    updatedAt: serverTimestamp()
  };
  if (params.manualStudent) payload.manualStudents = arrayRemove(params.manualStudent);
  if (params.excludeUid) payload.excludedUids = arrayUnion(params.excludeUid);
  await updateDoc(doc(db, 'teacherClasses', classId), payload);
}

/** Undo an exclusion — the student reappears on the roster via their group. */
export async function restoreStudentToClass(classId: string, studentUid: string): Promise<void> {
  await updateDoc(doc(db, 'teacherClasses', classId), {
    excludedUids: arrayRemove(studentUid),
    updatedAt: serverTimestamp()
  });
}

export async function setStudentTick(classId: string, tickKey: string, ticked: boolean): Promise<void> {
  await updateDoc(doc(db, 'teacherClasses', classId), {
    [`studentChecks.${tickKey}`]: ticked ? true : deleteField(),
    updatedAt: serverTimestamp()
  });
}

export async function deleteTeacherClass(classId: string): Promise<void> {
  await deleteDoc(doc(db, 'teacherClasses', classId));
}
