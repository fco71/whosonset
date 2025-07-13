import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { CrewProfile } from '../types/CrewProfile';

export interface ProjectEntry {
  id: string;
  projectName: string;
  createdAt: Date;
  views: number;
  [key: string]: any;
}

// Helper to deduplicate by key
function deduplicate<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

// Fetch highlighted projects: newest and most viewed in last 30 days
export async function getHighlightedProjects(): Promise<ProjectEntry[]> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const projectsRef = collection(db, 'Projects');

  // Newest
  const newestQ = query(projectsRef, orderBy('createdAt', 'desc'), limit(3));
  const newestSnap = await getDocs(newestQ);
  const newest = newestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectEntry[];

  // Most viewed in last 30 days
  const popularQ = query(
    projectsRef,
    where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)),
    orderBy('createdAt', 'desc'),
    orderBy('views', 'desc'),
    limit(6) // get more in case of overlap
  );
  const popularSnap = await getDocs(popularQ);
  const popular = (popularSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }) as ProjectEntry)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3));

  // Merge and deduplicate
  return deduplicate([...newest, ...popular], 'id');
}

// Fetch highlighted crew: newest and most followed
export async function getHighlightedCrew(): Promise<CrewProfile[]> {
  const crewRef = collection(db, 'crewProfiles');

  // Newest
  const newestQ = query(crewRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'), limit(3));
  const newestSnap = await getDocs(newestQ);
  const newest = newestSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as CrewProfile[];

  // Most followed
  const popularQ = query(crewRef, where('isPublished', '==', true), orderBy('followersCount', 'desc'), limit(6));
  const popularSnap = await getDocs(popularQ);
  const popular = popularSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as CrewProfile[];
  // Only top 3
  const topPopular = popular.slice(0, 3);

  // Merge and deduplicate
  return deduplicate([...newest, ...topPopular], 'uid');
}
