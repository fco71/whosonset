import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { JobPosting } from '../types/JobApplication';

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: any;
  notes?: string;
  jobData?: JobPosting; // Cached job data for quick access
}

export class SavedJobsService {
  // Save a job for a user
  static async saveJob(userId: string, jobId: string, notes?: string): Promise<string> {
    try {
      const savedJobData = {
        userId,
        jobId,
        notes,
        savedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'savedJobs'), savedJobData);
      console.log('[SavedJobsService] Job saved successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  // Remove a saved job
  static async removeSavedJob(savedJobId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'savedJobs', savedJobId));
      console.log('[SavedJobsService] Job removed from saved list');
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  }

  // Get all saved jobs for a user
  static async getSavedJobs(userId: string): Promise<SavedJob[]> {
    try {
      const savedJobsQuery = query(
        collection(db, 'savedJobs'),
        where('userId', '==', userId),
        orderBy('savedAt', 'desc')
      );

      const snapshot = await getDocs(savedJobsQuery);
      const savedJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedJob[];

      console.log('[SavedJobsService] Loaded saved jobs:', savedJobs.length);
      return savedJobs;
    } catch (error) {
      console.error('Error getting saved jobs:', error);
      throw error;
    }
  }

  // Get saved jobs with full job data
  static async getSavedJobsWithData(userId: string): Promise<SavedJob[]> {
    try {
      const savedJobs = await this.getSavedJobs(userId);
      
      // Fetch job data for each saved job
      const savedJobsWithData = await Promise.all(
        savedJobs.map(async (savedJob) => {
          try {
            const jobDoc = await getDocs(query(
              collection(db, 'jobPostings'),
              where('__name__', '==', savedJob.jobId)
            ));
            
            if (!jobDoc.empty) {
              const jobData = {
                id: jobDoc.docs[0].id,
                ...jobDoc.docs[0].data()
              } as JobPosting;
              
              return {
                ...savedJob,
                jobData
              };
            }
            
            return savedJob;
          } catch (error) {
            console.error('Error fetching job data for saved job:', error);
            return savedJob;
          }
        })
      );

      return savedJobsWithData;
    } catch (error) {
      console.error('Error getting saved jobs with data:', error);
      throw error;
    }
  }

  // Check if a job is saved by a user
  static async isJobSaved(userId: string, jobId: string): Promise<{ saved: boolean; savedJobId?: string }> {
    try {
      const savedJobsQuery = query(
        collection(db, 'savedJobs'),
        where('userId', '==', userId),
        where('jobId', '==', jobId)
      );

      const snapshot = await getDocs(savedJobsQuery);
      
      if (!snapshot.empty) {
        return {
          saved: true,
          savedJobId: snapshot.docs[0].id
        };
      }
      
      return { saved: false };
    } catch (error) {
      console.error('Error checking if job is saved:', error);
      return { saved: false };
    }
  }

  // Update notes for a saved job
  static async updateSavedJobNotes(savedJobId: string, notes: string): Promise<void> {
    try {
      const savedJobRef = doc(db, 'savedJobs', savedJobId);
      await updateDoc(savedJobRef, {
        notes,
        updatedAt: serverTimestamp()
      });
      console.log('[SavedJobsService] Saved job notes updated');
    } catch (error) {
      console.error('Error updating saved job notes:', error);
      throw error;
    }
  }

  // Subscribe to saved jobs changes
  static subscribeToSavedJobs(userId: string, callback: (savedJobs: SavedJob[]) => void) {
    try {
      const savedJobsQuery = query(
        collection(db, 'savedJobs'),
        where('userId', '==', userId),
        orderBy('savedAt', 'desc')
      );

      return onSnapshot(savedJobsQuery, (snapshot) => {
        const savedJobs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SavedJob[];
        callback(savedJobs);
      });
    } catch (error) {
      console.error('Error setting up saved jobs listener:', error);
      return () => {};
    }
  }

  // Subscribe to saved status for a specific job
  static subscribeToJobSaveStatus(userId: string, jobId: string, callback: (saved: boolean, savedJobId?: string) => void) {
    try {
      const savedJobsQuery = query(
        collection(db, 'savedJobs'),
        where('userId', '==', userId),
        where('jobId', '==', jobId)
      );

      return onSnapshot(savedJobsQuery, (snapshot) => {
        if (!snapshot.empty) {
          callback(true, snapshot.docs[0].id);
        } else {
          callback(false);
        }
      });
    } catch (error) {
      console.error('Error setting up job save status listener:', error);
      return () => {};
    }
  }

  // Get saved jobs count for a user
  static async getSavedJobsCount(userId: string): Promise<number> {
    try {
      const savedJobs = await this.getSavedJobs(userId);
      return savedJobs.length;
    } catch (error) {
      console.error('Error getting saved jobs count:', error);
      return 0;
    }
  }
} 