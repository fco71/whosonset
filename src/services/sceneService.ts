import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import { parseSlugText, SlugIntExt } from '../utilities/fountain';

// Scene marks on a screenplay (the screenplayScenes collection). A scene is an
// anchored slug — page + position on PDFs — carrying the identifying fields a
// breakdown needs (number, INT/EXT, location, time of day). Fountain screenplays
// derive their scene list from the source text instead and only use these docs
// when a PDF anchor exists. Rules mirror screenplayAnnotations (see firestore.rules).

export type SceneIntExt = SlugIntExt;
export { parseSlugText };

/** The choices both scene forms (popup create + panel edit) offer. */
export const INT_EXT_OPTIONS: SceneIntExt[] = ['', 'INT', 'EXT', 'INT/EXT'];

export interface SceneMark {
  id: string;
  screenplayId: string;
  userId: string;
  userName: string;
  sceneNumber: string;
  intExt: SceneIntExt;
  location: string;
  timeOfDay: string;
  synopsis: string;
  note: string;
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
  selection: string;
  /** Whether the author was a workspace supervisor when marking — drives the
   * moderation rules (a student manager must not delete the teacher's marks). */
  supervisorAtAuthorTime?: boolean;
  timestamp?: any;
}

export const normalizeScene = (sceneId: string, data: any): SceneMark => ({
  id: sceneId,
  screenplayId: data.screenplayId || '',
  userId: data.userId || '',
  userName: data.userName || '',
  sceneNumber: typeof data.sceneNumber === 'string' ? data.sceneNumber : '',
  intExt: ['INT', 'EXT', 'INT/EXT'].includes(data.intExt) ? data.intExt : '',
  location: typeof data.location === 'string' ? data.location : '',
  timeOfDay: typeof data.timeOfDay === 'string' ? data.timeOfDay : '',
  synopsis: typeof data.synopsis === 'string' ? data.synopsis : '',
  note: typeof data.note === 'string' ? data.note : '',
  pageNumber: typeof data.pageNumber === 'number' ? data.pageNumber : 1,
  position: data.position && typeof data.position === 'object'
    ? data.position
    : { x: 0, y: 0, width: 0, height: 0 },
  selection: typeof data.selection === 'string' ? data.selection : '',
  supervisorAtAuthorTime: data.supervisorAtAuthorTime === true,
  timestamp: data.timestamp
});

/** Document-order key: page first, then vertical position within the page. */
export const sceneOrderKey = (item: { pageNumber: number; position: { y: number } }): number =>
  item.pageNumber * 10000 + (item.position?.y || 0) * 1000;

/**
 * The scene owning a document position: nearest scene anchor at or above it.
 * Scans the whole list (no sorted-input contract — callers sort for display only).
 */
export function sceneForPosition(
  scenes: SceneMark[],
  pageNumber: number,
  positionY: number
): SceneMark | null {
  const key = pageNumber * 10000 + positionY * 1000;
  let owner: SceneMark | null = null;
  let ownerKey = -Infinity;
  for (const scene of scenes) {
    const sceneKey = sceneOrderKey(scene);
    if (sceneKey <= key && sceneKey > ownerKey) {
      owner = scene;
      ownerKey = sceneKey;
    }
  }
  return owner;
}

export function subscribeScenes(
  screenplayId: string,
  onScenes: (scenes: SceneMark[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'screenplayScenes'), where('screenplayId', '==', screenplayId)),
    snapshot => {
      const scenes = snapshot.docs.map(d => normalizeScene(d.id, d.data()));
      scenes.sort((a, b) => sceneOrderKey(a) - sceneOrderKey(b));
      onScenes(scenes);
    },
    err => {
      console.error('Scene subscription error:', err);
      onError?.(err);
    }
  );
}

export async function addScene(params: {
  screenplayId: string;
  projectId: string;
  actor: { uid: string; displayName?: string | null };
  fields: { sceneNumber: string; intExt: SceneIntExt; location: string; timeOfDay: string; synopsis: string; note: string };
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
  selection: string;
  supervisorAtAuthorTime: boolean;
}): Promise<string> {
  const ref = await addDoc(collection(db, 'screenplayScenes'), {
    screenplayId: params.screenplayId,
    projectId: params.projectId,
    userId: params.actor.uid,
    userName: params.actor.displayName || 'Anonymous',
    sceneNumber: params.fields.sceneNumber,
    intExt: params.fields.intExt,
    location: params.fields.location,
    timeOfDay: params.fields.timeOfDay,
    synopsis: params.fields.synopsis,
    note: params.fields.note,
    pageNumber: params.pageNumber,
    position: params.position,
    selection: params.selection,
    supervisorAtAuthorTime: params.supervisorAtAuthorTime,
    timestamp: new Date()
  });
  return ref.id;
}

export async function updateScene(
  sceneId: string,
  fields: { sceneNumber: string; intExt: SceneIntExt; location: string; timeOfDay: string; synopsis: string; note: string }
): Promise<void> {
  await updateDoc(doc(db, 'screenplayScenes', sceneId), { ...fields });
}

export async function deleteScene(sceneId: string): Promise<void> {
  await deleteDoc(doc(db, 'screenplayScenes', sceneId));
}

/** Slug heading for a scene: "INT. BAR - NIGHT" (falls back to the selection text). */
export function sceneHeading(scene: Pick<SceneMark, 'intExt' | 'location' | 'timeOfDay' | 'selection'>): string {
  return [
    scene.intExt ? `${scene.intExt}.` : '',
    scene.location,
    scene.timeOfDay ? `- ${scene.timeOfDay}` : ''
  ].filter(Boolean).join(' ') || scene.selection || '';
}

/** Display label for a scene: "#3 · INT. BAR - NIGHT". */
export function sceneLabel(scene: Pick<SceneMark, 'sceneNumber' | 'intExt' | 'location' | 'timeOfDay' | 'selection'>): string {
  const body = sceneHeading(scene);
  return scene.sceneNumber ? `#${scene.sceneNumber} · ${body}` : body;
}

/** Scene cell for the CSV exports: "#3 INT. BAR" — shared so the viewer
 * breakdown export and the workspace grading export can't drift apart. */
export function sceneCsvCell(scenes: SceneMark[], pageNumber: number, positionY: number): string {
  const owner = sceneForPosition(scenes, pageNumber, positionY);
  if (!owner) return '';
  return [
    owner.sceneNumber ? `#${owner.sceneNumber}` : '',
    [owner.intExt ? `${owner.intExt}.` : '', owner.location].filter(Boolean).join(' ')
  ].filter(Boolean).join(' ');
}
