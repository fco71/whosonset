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

// Fetch highlighted projects: newest, most viewed, and featured projects
export async function getHighlightedProjects(): Promise<ProjectEntry[]> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const projectsRef = collection(db, 'Projects');

  try {
    // Get newest projects
    const newestQ = query(projectsRef, orderBy('createdAt', 'desc'), limit(4));
    const newestSnap = await getDocs(newestQ);
    const newest = newestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectEntry[];

    // Get most viewed projects in last 30 days
    const popularQ = query(
      projectsRef,
      where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('createdAt', 'desc'),
      orderBy('views', 'desc'),
      limit(4)
    );
    const popularSnap = await getDocs(popularQ);
    const popular = popularSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as ProjectEntry)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);

    // Get projects with high engagement (favorites, comments, etc.)
    const engagementQ = query(
      projectsRef,
      where('favoritesCount', '>', 0),
      orderBy('favoritesCount', 'desc'),
      limit(4)
    );
    const engagementSnap = await getDocs(engagementQ);
    const engagement = engagementSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectEntry[];

    // Get projects by major production companies
    const majorCompaniesQ = query(
      projectsRef,
      where('productionCompany', 'in', ['Warner Bros.', 'Disney', 'Netflix', 'Amazon Studios', 'Paramount', 'Universal']),
      orderBy('createdAt', 'desc'),
      limit(4)
    );
    const majorCompaniesSnap = await getDocs(majorCompaniesQ);
    const majorCompanies = majorCompaniesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectEntry[];

    // Merge all categories and deduplicate
    const allProjects = [...newest, ...popular, ...engagement, ...majorCompanies];
    const uniqueProjects = deduplicate(allProjects, 'id');

    // Sort by a combination of factors: recency, views, and engagement
    return uniqueProjects
      .sort((a, b) => {
        const aScore = (a.views || 0) + (a.favoritesCount || 0) * 10 + (new Date(a.createdAt).getTime() / 1000000);
        const bScore = (b.views || 0) + (b.favoritesCount || 0) * 10 + (new Date(b.createdAt).getTime() / 1000000);
        return bScore - aScore;
      })
      .slice(0, 6); // Return top 6 most engaging projects
  } catch (error) {
    console.error('Error fetching highlighted projects:', error);
    return [];
  }
}

// Fetch highlighted crew: newest, most followed, and featured professionals
export async function getHighlightedCrew(): Promise<CrewProfile[]> {
  const crewRef = collection(db, 'crewProfiles');

  try {
    // Get newest published profiles
    const newestQ = query(crewRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'), limit(4));
    const newestSnap = await getDocs(newestQ);
    const newest = newestSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as CrewProfile[];

    // Get most followed profiles
    const popularQ = query(crewRef, where('isPublished', '==', true), orderBy('followersCount', 'desc'), limit(4));
    const popularSnap = await getDocs(popularQ);
    const popular = popularSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as CrewProfile[];

    // Get available crew members
    const availableQ = query(
      crewRef, 
      where('isPublished', '==', true), 
      where('availability', '==', 'available'),
      limit(4)
    );
    const availableSnap = await getDocs(availableQ);
    const available = availableSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as CrewProfile[];

    // Get crew with high-profile experience (major companies) - using projects field
    const experiencedQ = query(
      crewRef,
      where('isPublished', '==', true),
      limit(8)
    );
    const experiencedSnap = await getDocs(experiencedQ);
    const experienced = experiencedSnap.docs
      .map(doc => ({ ...doc.data(), uid: doc.id }))
      .filter((crew: any) => crew.projects && crew.projects.some((project: any) => 
        ['Warner Bros.', 'Disney', 'Netflix', 'Amazon', 'Paramount', 'Universal'].some(company => 
          project.productionCompany?.includes(company)
        )
      )) as CrewProfile[];

    // Get crew with specific high-demand skills - using jobTitles
    const skilledQ = query(
      crewRef,
      where('isPublished', '==', true),
      limit(8)
    );
    const skilledSnap = await getDocs(skilledQ);
    const skilled = skilledSnap.docs
      .map(doc => ({ ...doc.data(), uid: doc.id }))
      .filter((crew: any) => crew.jobTitles && crew.jobTitles.some((job: any) => 
        ['Cinematography', 'Directing', 'Producing', 'Screenwriting', 'VFX', 'Sound Design'].some(skill => 
          job.title?.includes(skill) || job.department?.includes(skill)
        )
      )) as CrewProfile[];

    // Merge all categories and deduplicate
    const allCrew = [...newest, ...popular, ...available, ...experienced, ...skilled];
    const uniqueCrew = deduplicate(allCrew, 'uid');

    // Sort by a combination of factors: availability, project count, and recency
    return uniqueCrew
      .sort((a, b) => {
        const aScore = (a.availability === 'available' ? 50 : 0) + 
                      ((a.projects?.length || 0) * 10) + 
                      (a.jobTitles?.length || 0);
        const bScore = (b.availability === 'available' ? 50 : 0) + 
                      ((b.projects?.length || 0) * 10) + 
                      (b.jobTitles?.length || 0);
        return bScore - aScore;
      })
      .slice(0, 8); // Return top 8 most engaging crew members
  } catch (error) {
    console.error('Error fetching highlighted crew:', error);
    return [];
  }
}
