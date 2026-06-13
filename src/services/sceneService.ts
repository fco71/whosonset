import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  describeFountainScenes,
  formatPageEighths,
  parseSlugText,
  reconcileFountainScenes,
  SlugIntExt
} from '../utilities/fountain';

// Scene marks on a screenplay (the screenplayScenes collection). A scene is an
// anchored slug — page + position on PDFs — carrying the identifying fields a
// breakdown needs (number, INT/EXT, location, time of day). Fountain headings are
// reconciled into the same collection so both formats share IDs, metadata, exports,
// permissions, and the scene navigator.

export type SceneIntExt = SlugIntExt;
export { parseSlugText, reconcileFountainScenes };

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
  sourceType: 'pdf' | 'fountain';
  sourceLineIndex?: number;
  sourceHeading?: string;
  sourceOrdinal?: number;
  sourceStatus?: 'active' | 'orphaned';
  sceneNumberAuto?: boolean;
  scriptDay: string;
  unit: string;
  sequence: string;
  estimatedTime: string;
  estimatedPageEighths?: number;
  /** Whether the author was a workspace supervisor when marking — drives the
   * moderation rules (a student manager must not delete the teacher's marks). */
  supervisorAtAuthorTime?: boolean;
  timestamp?: any;
  lastSyncedAt?: any;
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
  sourceType: data.sourceType === 'fountain' ? 'fountain' : 'pdf',
  sourceLineIndex: typeof data.sourceLineIndex === 'number' ? data.sourceLineIndex : undefined,
  sourceHeading: typeof data.sourceHeading === 'string' ? data.sourceHeading : undefined,
  sourceOrdinal: typeof data.sourceOrdinal === 'number' ? data.sourceOrdinal : undefined,
  sourceStatus: data.sourceStatus === 'orphaned' ? 'orphaned' : 'active',
  sceneNumberAuto: data.sceneNumberAuto === true,
  scriptDay: typeof data.scriptDay === 'string' ? data.scriptDay : '',
  unit: typeof data.unit === 'string' ? data.unit : '',
  sequence: typeof data.sequence === 'string' ? data.sequence : '',
  estimatedTime: typeof data.estimatedTime === 'string' ? data.estimatedTime : '',
  estimatedPageEighths: typeof data.estimatedPageEighths === 'number'
    ? data.estimatedPageEighths
    : undefined,
  supervisorAtAuthorTime: data.supervisorAtAuthorTime === true,
  timestamp: data.timestamp,
  lastSyncedAt: data.lastSyncedAt
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
      const scenes = snapshot.docs
        .map(d => normalizeScene(d.id, d.data()))
        .filter(scene => scene.sourceStatus !== 'orphaned');
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
    sourceType: 'pdf',
    sourceStatus: 'active',
    sceneNumberAuto: false,
    scriptDay: '',
    unit: '',
    sequence: '',
    estimatedTime: '',
    supervisorAtAuthorTime: params.supervisorAtAuthorTime,
    timestamp: new Date()
  });
  return ref.id;
}

export interface SceneMetadataFields {
  sceneNumber: string;
  intExt: SceneIntExt;
  location: string;
  timeOfDay: string;
  synopsis: string;
  note: string;
  scriptDay: string;
  unit: string;
  sequence: string;
  estimatedTime: string;
}

export async function updateScene(
  sceneId: string,
  fields: SceneMetadataFields,
  keepAutomaticSceneNumber = false
): Promise<void> {
  await updateDoc(doc(db, 'screenplayScenes', sceneId), {
    ...fields,
    sceneNumberAuto: keepAutomaticSceneNumber
  });
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

export function estimateScenePageEighths(
  scenes: SceneMark[],
  scene: SceneMark,
  documentPageCount?: number | null
): number {
  if (scene.estimatedPageEighths && scene.estimatedPageEighths > 0) {
    return Math.round(scene.estimatedPageEighths);
  }

  const ordered = [...scenes].sort((a, b) => sceneOrderKey(a) - sceneOrderKey(b));
  const index = ordered.findIndex(item => item.id === scene.id);
  const next = index >= 0 ? ordered[index + 1] : undefined;
  const start = (scene.pageNumber - 1) + Math.max(0, Math.min(1, scene.position?.y || 0));
  const end = next
    ? (next.pageNumber - 1) + Math.max(0, Math.min(1, next.position?.y || 0))
    : documentPageCount
      ? documentPageCount
      : start + 0.125;
  return Math.max(1, Math.ceil(Math.max(0.125, end - start) * 8));
}

export interface SceneCsvMetadata {
  scene: string;
  scriptDay: string;
  unit: string;
  sequence: string;
  estimatedTime: string;
  pageEighths: string;
}

export function sceneCsvMetadata(
  scenes: SceneMark[],
  pageNumber: number,
  positionY: number,
  documentPageCount?: number | null
): SceneCsvMetadata {
  const owner = sceneForPosition(scenes, pageNumber, positionY);
  if (!owner) {
    return {
      scene: '',
      scriptDay: '',
      unit: '',
      sequence: '',
      estimatedTime: '',
      pageEighths: ''
    };
  }
  return {
    scene: sceneCsvCell(scenes, pageNumber, positionY),
    scriptDay: owner.scriptDay,
    unit: owner.unit,
    sequence: owner.sequence,
    estimatedTime: owner.estimatedTime,
    pageEighths: formatPageEighths(
      estimateScenePageEighths(scenes, owner, documentPageCount)
    )
  };
}

export async function syncFountainScenes(params: {
  screenplayId: string;
  projectId: string;
  source: string;
  actor: { uid: string; displayName?: string | null };
}): Promise<void> {
  if (!params.actor.uid) return;

  const scenesCollection = collection(db, 'screenplayScenes');
  const snapshot = await getDocs(
    query(scenesCollection, where('screenplayId', '==', params.screenplayId))
  );
  const existing = snapshot.docs
    .map(item => normalizeScene(item.id, item.data()))
    .filter(scene => scene.sourceType === 'fountain');
  const descriptors = describeFountainScenes(params.source);
  const matches = reconcileFountainScenes(existing, descriptors);
  const matchedIds = new Set(matches.flatMap(match => match.scene ? [match.scene.id] : []));
  const batch = writeBatch(db);
  const now = new Date();

  matches.forEach(({ descriptor, scene }) => {
    const parsed = parseSlugText(descriptor.heading);
    const ref = scene
      ? doc(db, 'screenplayScenes', scene.id)
      : doc(scenesCollection);
    const derivedFields = {
      pageNumber: descriptor.page,
      position: {
        x: 0,
        y: descriptor.positionY,
        width: 1,
        height: 0
      },
      selection: descriptor.heading,
      sourceType: 'fountain' as const,
      sourceLineIndex: descriptor.lineIndex,
      sourceHeading: descriptor.heading,
      sourceOrdinal: descriptor.ordinal,
      sourceStatus: 'active' as const,
      intExt: parsed.intExt,
      location: parsed.location || descriptor.heading,
      timeOfDay: parsed.timeOfDay,
      estimatedPageEighths: descriptor.estimatedPageEighths,
      lastSyncedAt: now
    };

    if (scene) {
      batch.update(ref, {
        ...derivedFields,
        ...(scene.sceneNumberAuto ? { sceneNumber: String(descriptor.ordinal + 1) } : {})
      });
      return;
    }

    batch.set(ref, {
      ...derivedFields,
      screenplayId: params.screenplayId,
      projectId: params.projectId,
      userId: params.actor.uid,
      userName: params.actor.displayName || 'Anonymous',
      sceneNumber: String(descriptor.ordinal + 1),
      sceneNumberAuto: true,
      synopsis: '',
      note: '',
      scriptDay: '',
      unit: '',
      sequence: '',
      estimatedTime: '',
      supervisorAtAuthorTime: false,
      timestamp: now
    });
  });

  existing
    .filter(scene => !matchedIds.has(scene.id) && scene.sourceStatus !== 'orphaned')
    .forEach(scene => {
      batch.update(doc(db, 'screenplayScenes', scene.id), {
        sourceStatus: 'orphaned',
        lastSyncedAt: now
      });
    });

  await batch.commit();
}
