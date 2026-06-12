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

// Scene marks on a screenplay (the screenplayScenes collection). A scene is an
// anchored slug — page + position on PDFs — carrying the identifying fields a
// breakdown needs (number, INT/EXT, location, time of day). Fountain screenplays
// derive their scene list from the source text instead and only use these docs
// when a PDF anchor exists. Rules mirror screenplayAnnotations (see firestore.rules).

export type SceneIntExt = '' | 'INT' | 'EXT' | 'INT/EXT';

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
  timestamp: data.timestamp
});

/** Document-order key: page first, then vertical position within the page. */
export const sceneOrderKey = (item: { pageNumber: number; position: { y: number } }): number =>
  item.pageNumber * 10000 + (item.position?.y || 0) * 1000;

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

/**
 * Best-effort parse of a selected slug line ("INT. BAR - NIGHT") into form
 * prefills. Tolerates partial selections (just "BAR", or "EXT. ALLEY").
 */
export function parseSlugText(text: string): { intExt: SceneIntExt; location: string; timeOfDay: string } {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  let intExt: SceneIntExt = '';
  let rest = cleaned;

  const prefixMatch = cleaned.match(/^(INT\.?\s*\/\s*EXT|I\/E|INT|EXT|EST)\.?\s*/i);
  if (prefixMatch) {
    const raw = prefixMatch[1].toUpperCase().replace(/\s/g, '');
    intExt = raw.includes('/') || raw === 'I/E' ? 'INT/EXT' : raw === 'EXT' || raw === 'EST' ? 'EXT' : 'INT';
    rest = cleaned.slice(prefixMatch[0].length);
  }

  // "LOCATION - TIME OF DAY" (en/em dashes tolerated)
  const dashSplit = rest.split(/\s*[-–—]\s*/);
  const location = (dashSplit[0] || '').trim();
  const timeOfDay = dashSplit.length > 1 ? dashSplit.slice(1).join(' - ').trim() : '';
  return { intExt, location, timeOfDay };
}

/** Display label for a scene: "#3 · INT. BAR - NIGHT". */
export function sceneLabel(scene: Pick<SceneMark, 'sceneNumber' | 'intExt' | 'location' | 'timeOfDay' | 'selection'>): string {
  const slugParts = [
    scene.intExt ? `${scene.intExt}.` : '',
    scene.location,
    scene.timeOfDay ? `- ${scene.timeOfDay}` : ''
  ].filter(Boolean).join(' ');
  const body = slugParts || scene.selection || '';
  return scene.sceneNumber ? `#${scene.sceneNumber} · ${body}` : body;
}
