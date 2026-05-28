import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, app } from '../firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, writeBatch, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userProfile: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  confirmPasswordResetAction: (oobCode: string, newPassword: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (context === undefined) {
      console.error('useAuth must be used within an AuthProvider');
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  } catch (error) {
    console.error('Error in useAuth hook:', error);
    throw error;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  // Add debugging
  console.log('[AuthProvider] Initializing...');

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Attempting login for:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('[AuthContext] Login successful for:', email);
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<{ isNewUser: boolean }> => {
    try {
      console.log('[AuthContext] Starting Google sign-in process');
      
      // Check if Google Auth is available
      if (typeof GoogleAuthProvider === 'undefined') {
        throw new Error('Google authentication is not available. Please enable it in Firebase console.');
      }
      
      const provider = new GoogleAuthProvider();
      
      // Set custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('[AuthContext] Google sign-in successful for:', user.email);
      
      // Check if user profile exists, if not create it
      const isNewUser = await createUserProfileIfNeeded(user);
      
      return { isNewUser };
      
    } catch (error: any) {
      console.error('[AuthContext] Google sign-in error:', error);
      
      // Check if the error is due to provider not being enabled
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is not enabled. Please enable it in your Firebase console.');
      }
      
      throw error;
    }
  };

  const createUserProfileIfNeeded = async (user: User): Promise<boolean> => {
    try {
      // Check if crew profile already exists
      const crewProfileDoc = await getDoc(doc(db, 'crewProfiles', user.uid));
      
      if (!crewProfileDoc.exists()) {
        console.log('[AuthContext] Creating crew profile for OAuth user');
        
        // Create display name from user info or email fallback
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        
        // Create crew profile
        // TODO: type this against the CrewProfile interface
        const crewProfileData: any = {
          // Note: uid field is intentionally omitted since document ID should be the UID
          name: displayName,
          email: user.email,
          bio: '',
          profileImageUrl: '',
          username: user.email?.split('@')[0] || '',
          jobTitles: [],
          residences: [],
          contactInfo: {
            email: user.email || '',
            phone: '',
            website: '',
            instagram: ''
          },
          languages: [],
          projects: [],
          education: [],
          otherInfo: '',
          availability: 'available',
          isPublished: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'crewProfiles', user.uid), crewProfileData);
        console.log('[AuthContext] Crew profile created for OAuth user');
        
        // Create user collections document
        const userCollectionsData: any = {
          savedProjects: [],
          savedCrew: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'UserCollections', user.uid), userCollectionsData);
        console.log('[AuthContext] UserCollections document created for OAuth user');
        
        return true; // New user
      } else {
        console.log('[AuthContext] Crew profile already exists for OAuth user');
        return false; // Existing user
      }
    } catch (error) {
      console.error('[AuthContext] Error creating user profile for OAuth:', error);
      // Don't throw error here as the user is already signed in
      return false; // Assume existing user on error
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('[AuthContext] Starting signup process for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('[AuthContext] Firebase Auth user created with UID:', user.uid);
      
      // Send email verification
      await sendEmailVerification(user);
      console.log('[AuthContext] Email verification sent');
      
      // Create display name from first/last name or email fallback
      const displayName = (firstName && lastName) 
        ? `${firstName} ${lastName}`
        : user.email?.split('@')[0] || 'User';
      
      console.log('[AuthContext] Display name set to:', displayName);
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName
      });
      
      console.log('[AuthContext] Firebase Auth profile updated');
      
      // Create ONLY the crew profile (this is the single source of truth)
      // TODO: type this against the CrewProfile interface
      const crewProfileData: any = {
        // Note: uid field is intentionally omitted since document ID should be the UID
        name: displayName, // This will autopopulate the resume name
        email: user.email,
        bio: '',
        profileImageUrl: '/bust-avatar.svg', // This is what crewProfiles expects
        username: user.email?.split('@')[0] || '',
        jobTitles: [],
        residences: [],
        contactInfo: {
          email: user.email || '',
          phone: '',
          website: '',
          instagram: ''
        },
        languages: [],
        projects: [],
        education: [],
        otherInfo: '',
        availability: 'available',
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      console.log('[AuthContext] Creating crewProfiles document with data:', crewProfileData);
      
      await setDoc(doc(db, 'crewProfiles', user.uid), crewProfileData);
      
      console.log('[AuthContext] crewProfiles document created successfully');
      
      // Verify the document was created
      try {
        const verifyDoc = await getDoc(doc(db, 'crewProfiles', user.uid));
        if (verifyDoc.exists()) {
          console.log('[AuthContext] ✅ Verification: crewProfiles document exists in Firestore');
        } else {
          console.error('[AuthContext] ❌ Verification: crewProfiles document does not exist in Firestore');
        }
      } catch (verifyError) {
        console.error('[AuthContext] ❌ Verification failed:', verifyError);
      }
      
      // Create user collections document (for favorites, etc.)
      const userCollectionsData: any = {
        savedProjects: [],
        savedCrew: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      console.log('[AuthContext] Creating UserCollections document');
      
      await setDoc(doc(db, 'UserCollections', user.uid), userCollectionsData);
      
      console.log('[AuthContext] UserCollections document created successfully');
      console.log('[AuthContext] User created successfully with crewProfiles document only');
      
    } catch (error) {
      console.error('[AuthContext] Error during signup:', error);
      throw error;
    }
  };

  const sendEmailVerificationToUser = async () => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    if (currentUser.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    await sendEmailVerification(currentUser);
    console.log('[AuthContext] Email verification sent');
  };

  const sendPasswordReset = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    };
    
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log('[AuthContext] Password reset email sent');
  };

  const confirmPasswordResetAction = async (oobCode: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      console.log('[AuthContext] Password reset confirmed');
    } catch (error: any) {
      console.error('[AuthContext] Error confirming password reset:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    await sendEmailVerification(currentUser);
    console.log('[AuthContext] Verification email resent');
  };

  const logout = async () => {
    await signOut(auth);
  };

  const deleteAccount = async (password?: string) => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      console.log('[AuthContext] Starting account deletion for user:', currentUser.uid);
      
      // First, handle re-authentication if needed
      let userToDelete = currentUser;
      
      // Check if re-authentication is needed by trying to get fresh user data
      try {
        await currentUser.reload();
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          // Re-authentication required
          if (!password) {
            throw new Error('Re-authentication required. Please provide your password.');
          }
          
          console.log('[AuthContext] Re-authenticating user before deletion');
          // Re-authenticate with email and password
          const credential = EmailAuthProvider.credential(currentUser.email!, password);
          await reauthenticateWithCredential(currentUser, credential);
          
          // Get the updated user object after re-authentication
          const refreshedUser = auth.currentUser;
          if (!refreshedUser) {
            throw new Error('Failed to get current user after re-authentication');
          }
          userToDelete = refreshedUser;
          
          console.log('[AuthContext] Re-authentication successful, proceeding with deletion');
        } else {
          throw error;
        }
      }
      
      // IMPORTANT: Clean up all Firestore data BEFORE deleting the auth account
      console.log('[AuthContext] Cleaning up Firestore data before auth deletion');
      await cleanupUserData(userToDelete.uid, userToDelete.email || '');
      
      // Now delete the Firebase Auth account
      console.log('[AuthContext] Deleting Firebase Auth account');
      await deleteUser(userToDelete);
      
      console.log('[AuthContext] Account deleted successfully');
    } catch (error: any) {
      console.error('[AuthContext] Error deleting account:', error);
      
      // If the error is about the user not being found or already deleted, that's actually success
      if (error.code === 'auth/user-not-found' || error.code === 'auth/user-disabled') {
        console.log('[AuthContext] User already deleted or not found, considering deletion successful');
        return;
      }
      
      throw error;
    }
  };

  // Helper function to clean up all user data from Firestore
  // This function ensures complete removal of all user-related data from the database
  // Collections cleaned up:
  // 1. Main user documents: users, crewProfiles, UserCollections, userPreferences, emailTracking
  // 2. Subcollections: notifications, savedJobs, favoriteApplicants (under users and crewProfiles)
  // 3. Social data: notifications, followRequests, follows, activityFeed, likes, comments
  // 4. Job data: jobPostings, jobApplications (including subcollections: messages, interviews)
  // 5. Project data: Projects, projectCrew, projectBudgets, projectTimelines, projectDocuments, projectMilestones, projectBudget
  // 6. Collaboration data: collaborativeTasks, connections, collaborations, workspaces
  // 7. Other data: favorites, crewFavorites, directMessages, conversations, crewAvailability, breakdownElements, tasks
  // 8. Saved data: savedProjects, savedCrew subcollections
  // Total: 31 collections and subcollections
  const cleanupUserData = async (userId: string, userEmail: string) => {
    console.log('[AuthContext] Cleaning up user data for:', userId);
    
    try {
      const batch = writeBatch(db);
      
      // 1. Delete main user documents
      batch.delete(doc(db, 'users', userId));
      batch.delete(doc(db, 'crewProfiles', userId));
      batch.delete(doc(db, 'UserCollections', userId));
      
      // 2. Delete email tracking
      if (userEmail) {
        batch.delete(doc(db, 'emailTracking', userEmail));
      }
      
      // 3. Delete user preferences
      batch.delete(doc(db, 'userPreferences', userId));
      
      // Execute the first batch
      await batch.commit();
      console.log('[AuthContext] Main user documents deleted');
      
      // 4. Clean up subcollections (these need to be deleted individually)
      await cleanupSubcollections(userId);
      
      // 5. Clean up references in other collections
      await cleanupUserReferences(userId);
      
      console.log('[AuthContext] All user data cleaned up successfully');
    } catch (error) {
      console.error('[AuthContext] Error cleaning up user data:', error);
      throw error;
    }
  };

  // Helper function to clean up subcollections
  const cleanupSubcollections = async (userId: string) => {
    console.log('[AuthContext] Cleaning up subcollections for user:', userId);
    
    try {
      // Delete notifications subcollection
      const notificationsQuery = query(collection(db, 'users', userId, 'notifications'));
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsBatch = writeBatch(db);
      notificationsSnapshot.docs.forEach(doc => {
        notificationsBatch.delete(doc.ref);
      });
      await notificationsBatch.commit();
      console.log('[AuthContext] Deleted', notificationsSnapshot.size, 'notifications');
      
      // Delete saved jobs subcollection
      const savedJobsQuery = query(collection(db, 'users', userId, 'savedJobs'));
      const savedJobsSnapshot = await getDocs(savedJobsQuery);
      const savedJobsBatch = writeBatch(db);
      savedJobsSnapshot.docs.forEach(doc => {
        savedJobsBatch.delete(doc.ref);
      });
      await savedJobsBatch.commit();
      console.log('[AuthContext] Deleted', savedJobsSnapshot.size, 'saved jobs');
      
      // Delete favorite applicants subcollection
      const favoriteApplicantsQuery = query(collection(db, 'users', userId, 'favoriteApplicants'));
      const favoriteApplicantsSnapshot = await getDocs(favoriteApplicantsQuery);
      const favoriteApplicantsBatch = writeBatch(db);
      favoriteApplicantsSnapshot.docs.forEach(doc => {
        favoriteApplicantsBatch.delete(doc.ref);
      });
      await favoriteApplicantsBatch.commit();
      console.log('[AuthContext] Deleted', favoriteApplicantsSnapshot.size, 'favorite applicants');
      
      // Delete crew profile notifications subcollection
      const crewNotificationsQuery = query(collection(db, 'crewProfiles', userId, 'notifications'));
      const crewNotificationsSnapshot = await getDocs(crewNotificationsQuery);
      const crewNotificationsBatch = writeBatch(db);
      crewNotificationsSnapshot.docs.forEach(doc => {
        crewNotificationsBatch.delete(doc.ref);
      });
      await crewNotificationsBatch.commit();
      console.log('[AuthContext] Deleted', crewNotificationsSnapshot.size, 'crew notifications');
      
    } catch (error) {
      console.error('[AuthContext] Error cleaning up subcollections:', error);
      // Don't throw error here as some subcollections might not exist
    }
  };

  // Helper function to clean up user references in other collections
  const cleanupUserReferences = async (userId: string) => {
    console.log('[AuthContext] Cleaning up user references for:', userId);
    
    try {
      // 1. Delete notifications from main notifications collection
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId)
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsBatch = writeBatch(db);
      notificationsSnapshot.docs.forEach(doc => {
        notificationsBatch.delete(doc.ref);
      });
      await notificationsBatch.commit();
      console.log('[AuthContext] Deleted', notificationsSnapshot.size, 'main notifications');
      
      // 2. Delete follow requests where user is the requester or recipient
      const followRequestsQuery = query(
        collection(db, 'followRequests'),
        where('fromUserId', '==', userId)
      );
      const followRequestsSnapshot = await getDocs(followRequestsQuery);
      const followRequestsBatch = writeBatch(db);
      followRequestsSnapshot.docs.forEach(doc => {
        followRequestsBatch.delete(doc.ref);
      });
      await followRequestsBatch.commit();
      console.log('[AuthContext] Deleted', followRequestsSnapshot.size, 'outgoing follow requests');
      
      const followRequestsToQuery = query(
        collection(db, 'followRequests'),
        where('toUserId', '==', userId)
      );
      const followRequestsToSnapshot = await getDocs(followRequestsToQuery);
      const followRequestsToBatch = writeBatch(db);
      followRequestsToSnapshot.docs.forEach(doc => {
        followRequestsToBatch.delete(doc.ref);
      });
      await followRequestsToBatch.commit();
      console.log('[AuthContext] Deleted', followRequestsToSnapshot.size, 'incoming follow requests');
      
      // 3. Delete follows where user is the follower or following
      const followsQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', userId)
      );
      const followsSnapshot = await getDocs(followsQuery);
      const followsBatch = writeBatch(db);
      followsSnapshot.docs.forEach(doc => {
        followsBatch.delete(doc.ref);
      });
      await followsBatch.commit();
      console.log('[AuthContext] Deleted', followsSnapshot.size, 'outgoing follows');
      
      const followsToQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', userId)
      );
      const followsToSnapshot = await getDocs(followsToQuery);
      const followsToBatch = writeBatch(db);
      followsToSnapshot.docs.forEach(doc => {
        followsToBatch.delete(doc.ref);
      });
      await followsToBatch.commit();
      console.log('[AuthContext] Deleted', followsToSnapshot.size, 'incoming follows');
      
      // 4. Delete activity feed items by this user
      const activityFeedQuery = query(
        collection(db, 'activityFeed'),
        where('userId', '==', userId)
      );
      const activityFeedSnapshot = await getDocs(activityFeedQuery);
      const activityFeedBatch = writeBatch(db);
      activityFeedSnapshot.docs.forEach(doc => {
        activityFeedBatch.delete(doc.ref);
      });
      await activityFeedBatch.commit();
      console.log('[AuthContext] Deleted', activityFeedSnapshot.size, 'activity feed items');
      
      // 5. Delete likes by this user
      const likesQuery = query(
        collection(db, 'likes'),
        where('userId', '==', userId)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const likesBatch = writeBatch(db);
      likesSnapshot.docs.forEach(doc => {
        likesBatch.delete(doc.ref);
      });
      await likesBatch.commit();
      console.log('[AuthContext] Deleted', likesSnapshot.size, 'likes');
      
      // 6. Delete comments by this user
      const commentsQuery = query(
        collection(db, 'comments'),
        where('userId', '==', userId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsBatch = writeBatch(db);
      commentsSnapshot.docs.forEach(doc => {
        commentsBatch.delete(doc.ref);
      });
      await commentsBatch.commit();
      console.log('[AuthContext] Deleted', commentsSnapshot.size, 'comments');
      
      // 7. Delete job postings by this user
      const jobPostingsQuery = query(
        collection(db, 'jobPostings'),
        where('postedById', '==', userId)
      );
      const jobPostingsSnapshot = await getDocs(jobPostingsQuery);
      const jobPostingsBatch = writeBatch(db);
      jobPostingsSnapshot.docs.forEach(doc => {
        jobPostingsBatch.delete(doc.ref);
      });
      await jobPostingsBatch.commit();
      console.log('[AuthContext] Deleted', jobPostingsSnapshot.size, 'job postings');
      
      // 8. Delete job applications by this user
      const jobApplicationsQuery = query(
        collection(db, 'jobApplications'),
        where('applicantId', '==', userId)
      );
      const jobApplicationsSnapshot = await getDocs(jobApplicationsQuery);
      const jobApplicationsBatch = writeBatch(db);
      jobApplicationsSnapshot.docs.forEach(doc => {
        jobApplicationsBatch.delete(doc.ref);
      });
      await jobApplicationsBatch.commit();
      console.log('[AuthContext] Deleted', jobApplicationsSnapshot.size, 'job applications');
      
      // 9. Delete job applications where user is the poster
      const jobApplicationsPosterQuery = query(
        collection(db, 'jobApplications'),
        where('posterId', '==', userId)
      );
      const jobApplicationsPosterSnapshot = await getDocs(jobApplicationsPosterQuery);
      const jobApplicationsPosterBatch = writeBatch(db);
      jobApplicationsPosterSnapshot.docs.forEach(doc => {
        jobApplicationsPosterBatch.delete(doc.ref);
      });
      await jobApplicationsPosterBatch.commit();
      console.log('[AuthContext] Deleted', jobApplicationsPosterSnapshot.size, 'job applications as poster');
      
      // 10. Delete projects owned by this user
      const projectsQuery = query(
        collection(db, 'Projects'),
        where('owner_uid', '==', userId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsBatch = writeBatch(db);
      projectsSnapshot.docs.forEach(doc => {
        projectsBatch.delete(doc.ref);
      });
      await projectsBatch.commit();
      console.log('[AuthContext] Deleted', projectsSnapshot.size, 'projects');
      
      // 11. Delete favorites by this user
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favoritesBatch = writeBatch(db);
      favoritesSnapshot.docs.forEach(doc => {
        favoritesBatch.delete(doc.ref);
      });
      await favoritesBatch.commit();
      console.log('[AuthContext] Deleted', favoritesSnapshot.size, 'favorites');
      
      // 12. Delete crew favorites by this user
      const crewFavoritesQuery = query(
        collection(db, 'crewFavorites'),
        where('userId', '==', userId)
      );
      const crewFavoritesSnapshot = await getDocs(crewFavoritesQuery);
      const crewFavoritesBatch = writeBatch(db);
      crewFavoritesSnapshot.docs.forEach(doc => {
        crewFavoritesBatch.delete(doc.ref);
      });
      await crewFavoritesBatch.commit();
      console.log('[AuthContext] Deleted', crewFavoritesSnapshot.size, 'crew favorites');
      
      // 13. Delete direct messages by this user
      const directMessagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', '==', userId)
      );
      const directMessagesSnapshot = await getDocs(directMessagesQuery);
      const directMessagesBatch = writeBatch(db);
      directMessagesSnapshot.docs.forEach(doc => {
        directMessagesBatch.delete(doc.ref);
      });
      await directMessagesBatch.commit();
      console.log('[AuthContext] Deleted', directMessagesSnapshot.size, 'outgoing direct messages');
      
      const directMessagesToQuery = query(
        collection(db, 'directMessages'),
        where('receiverId', '==', userId)
      );
      const directMessagesToSnapshot = await getDocs(directMessagesToQuery);
      const directMessagesToBatch = writeBatch(db);
      directMessagesToSnapshot.docs.forEach(doc => {
        directMessagesToBatch.delete(doc.ref);
      });
      await directMessagesToBatch.commit();
      console.log('[AuthContext] Deleted', directMessagesToSnapshot.size, 'incoming direct messages');
      
      // 14. Delete conversations where user is a participant
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId)
      );
      const conversationsSnapshot = await getDocs(conversationsQuery);
      const conversationsBatch = writeBatch(db);
      conversationsSnapshot.docs.forEach(doc => {
        conversationsBatch.delete(doc.ref);
      });
      await conversationsBatch.commit();
      console.log('[AuthContext] Deleted', conversationsSnapshot.size, 'conversations');
      
      // 15. Delete project crew memberships
      const projectCrewQuery = query(
        collection(db, 'projectCrew'),
        where('userId', '==', userId)
      );
      const projectCrewSnapshot = await getDocs(projectCrewQuery);
      const projectCrewBatch = writeBatch(db);
      projectCrewSnapshot.docs.forEach(doc => {
        projectCrewBatch.delete(doc.ref);
      });
      await projectCrewBatch.commit();
      console.log('[AuthContext] Deleted', projectCrewSnapshot.size, 'project crew memberships');
      
      // 16. Delete project budgets created by this user
      const projectBudgetsQuery = query(
        collection(db, 'projectBudgets'),
        where('createdBy', '==', userId)
      );
      const projectBudgetsSnapshot = await getDocs(projectBudgetsQuery);
      const projectBudgetsBatch = writeBatch(db);
      projectBudgetsSnapshot.docs.forEach(doc => {
        projectBudgetsBatch.delete(doc.ref);
      });
      await projectBudgetsBatch.commit();
      console.log('[AuthContext] Deleted', projectBudgetsSnapshot.size, 'project budgets');
      
      // 17. Delete project timelines created by this user
      const projectTimelinesQuery = query(
        collection(db, 'projectTimelines'),
        where('createdBy', '==', userId)
      );
      const projectTimelinesSnapshot = await getDocs(projectTimelinesQuery);
      const projectTimelinesBatch = writeBatch(db);
      projectTimelinesSnapshot.docs.forEach(doc => {
        projectTimelinesBatch.delete(doc.ref);
      });
      await projectTimelinesBatch.commit();
      console.log('[AuthContext] Deleted', projectTimelinesSnapshot.size, 'project timelines');
      
      // 18. Delete project documents created by this user
      const projectDocumentsQuery = query(
        collection(db, 'projectDocuments'),
        where('createdBy', '==', userId)
      );
      const projectDocumentsSnapshot = await getDocs(projectDocumentsQuery);
      const projectDocumentsBatch = writeBatch(db);
      projectDocumentsSnapshot.docs.forEach(doc => {
        projectDocumentsBatch.delete(doc.ref);
      });
      await projectDocumentsBatch.commit();
      console.log('[AuthContext] Deleted', projectDocumentsSnapshot.size, 'project documents');
      
      // 19. Delete project milestones created by this user
      const projectMilestonesQuery = query(
        collection(db, 'projectMilestones'),
        where('createdBy', '==', userId)
      );
      const projectMilestonesSnapshot = await getDocs(projectMilestonesQuery);
      const projectMilestonesBatch = writeBatch(db);
      projectMilestonesSnapshot.docs.forEach(doc => {
        projectMilestonesBatch.delete(doc.ref);
      });
      await projectMilestonesBatch.commit();
      console.log('[AuthContext] Deleted', projectMilestonesSnapshot.size, 'project milestones');
      
      // 20. Delete project budget entries created by this user
      const projectBudgetQuery = query(
        collection(db, 'projectBudget'),
        where('createdBy', '==', userId)
      );
      const projectBudgetSnapshot = await getDocs(projectBudgetQuery);
      const projectBudgetBatch = writeBatch(db);
      projectBudgetSnapshot.docs.forEach(doc => {
        projectBudgetBatch.delete(doc.ref);
      });
      await projectBudgetBatch.commit();
      console.log('[AuthContext] Deleted', projectBudgetSnapshot.size, 'project budget entries');
      
      // 21. Delete crew availability data for this user
      const crewAvailabilityQuery = query(
        collection(db, 'crewAvailability'),
        where('userId', '==', userId)
      );
      const crewAvailabilitySnapshot = await getDocs(crewAvailabilityQuery);
      const crewAvailabilityBatch = writeBatch(db);
      crewAvailabilitySnapshot.docs.forEach(doc => {
        crewAvailabilityBatch.delete(doc.ref);
      });
      await crewAvailabilityBatch.commit();
      console.log('[AuthContext] Deleted', crewAvailabilitySnapshot.size, 'crew availability entries');
      
      // 22. Delete collaborative tasks created by this user
      const collaborativeTasksQuery = query(
        collection(db, 'collaborativeTasks'),
        where('createdBy', '==', userId)
      );
      const collaborativeTasksSnapshot = await getDocs(collaborativeTasksQuery);
      const collaborativeTasksBatch = writeBatch(db);
      collaborativeTasksSnapshot.docs.forEach(doc => {
        collaborativeTasksBatch.delete(doc.ref);
      });
      await collaborativeTasksBatch.commit();
      console.log('[AuthContext] Deleted', collaborativeTasksSnapshot.size, 'collaborative tasks');
      
      // 23. Delete collaborative tasks assigned to this user
      const collaborativeTasksAssignedQuery = query(
        collection(db, 'collaborativeTasks'),
        where('assignedTo', '==', userId)
      );
      const collaborativeTasksAssignedSnapshot = await getDocs(collaborativeTasksAssignedQuery);
      const collaborativeTasksAssignedBatch = writeBatch(db);
      collaborativeTasksAssignedSnapshot.docs.forEach(doc => {
        collaborativeTasksAssignedBatch.delete(doc.ref);
      });
      await collaborativeTasksAssignedBatch.commit();
      console.log('[AuthContext] Deleted', collaborativeTasksAssignedSnapshot.size, 'assigned collaborative tasks');
      
      // 24. Delete breakdown elements created by this user
      const breakdownElementsQuery = query(
        collection(db, 'breakdownElements'),
        where('createdBy', '==', userId)
      );
      const breakdownElementsSnapshot = await getDocs(breakdownElementsQuery);
      const breakdownElementsBatch = writeBatch(db);
      breakdownElementsSnapshot.docs.forEach(doc => {
        breakdownElementsBatch.delete(doc.ref);
      });
      await breakdownElementsBatch.commit();
      console.log('[AuthContext] Deleted', breakdownElementsSnapshot.size, 'breakdown elements');
      
      // 25. Clean up job application subcollections
      await cleanupJobApplicationSubcollections(userId);
      
      // 26. Clean up saved projects subcollection
      await cleanupSavedProjectsSubcollection(userId);
      
      // 27. Delete connections where user is the initiator or recipient
      const connectionsQuery = query(
        collection(db, 'connections'),
        where('userId', '==', userId)
      );
      const connectionsSnapshot = await getDocs(connectionsQuery);
      const connectionsBatch = writeBatch(db);
      connectionsSnapshot.docs.forEach(doc => {
        connectionsBatch.delete(doc.ref);
      });
      await connectionsBatch.commit();
      console.log('[AuthContext] Deleted', connectionsSnapshot.size, 'outgoing connections');
      
      const connectionsToQuery = query(
        collection(db, 'connections'),
        where('connectedUserId', '==', userId)
      );
      const connectionsToSnapshot = await getDocs(connectionsToQuery);
      const connectionsToBatch = writeBatch(db);
      connectionsToSnapshot.docs.forEach(doc => {
        connectionsToBatch.delete(doc.ref);
      });
      await connectionsToBatch.commit();
      console.log('[AuthContext] Deleted', connectionsToSnapshot.size, 'incoming connections');
      
      // 28. Delete collaborations where user is the initiator or participant
      const collaborationsQuery = query(
        collection(db, 'collaborations'),
        where('userId', '==', userId)
      );
      const collaborationsSnapshot = await getDocs(collaborationsQuery);
      const collaborationsBatch = writeBatch(db);
      collaborationsSnapshot.docs.forEach(doc => {
        collaborationsBatch.delete(doc.ref);
      });
      await collaborationsBatch.commit();
      console.log('[AuthContext] Deleted', collaborationsSnapshot.size, 'collaborations');
      
      // 29. Clean up the user's workspaces.
      // Preferred path: the admin Cloud Function `cleanupUserWorkspaces` does the FULL
      // cascade (removes the user from every workspace's arrays, deletes their membership
      // docs everywhere, hard-deletes workspaces they own) — things the client can't do
      // because membership delete is owner-only and workspace hard-delete is gated by the
      // 30-day recovery window.
      // Fallback (function not deployed / unreachable): a client-side soft-delete of the
      // workspaces the user OWNS, via the listable `workspaceMemberships` collection.
      // (The old `collection(db,'workspaces') where createdBy==userId` query is gone — it
      // used the wrong field and is now denied by `list: if false`.)
      // Whole step is non-fatal: a failure here must never abort account deletion.
      try {
        const functionsClient = getFunctions(app, 'us-central1');
        const cleanupUserWorkspaces = httpsCallable(functionsClient, 'cleanupUserWorkspaces');
        const result = await cleanupUserWorkspaces();
        console.log('[AuthContext] Workspace cascade via Cloud Function complete:', result.data);
      } catch (cloudFnError) {
        console.warn('[AuthContext] Cloud Function workspace cascade unavailable, falling back to client soft-delete:', cloudFnError);
        try {
          const membershipsSnapshot = await getDocs(query(
            collection(db, 'workspaceMemberships'),
            where('userId', '==', userId)
          ));
          const ownedMemberships = membershipsSnapshot.docs.filter(membershipDoc => {
            const data = membershipDoc.data();
            return data.ownerId === userId || data.role === 'owner';
          });
          if (ownedMemberships.length > 0) {
            const workspacesBatch = writeBatch(db);
            const recoverableUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day recovery window
            ownedMemberships.forEach(membershipDoc => {
              const workspaceId = membershipDoc.data().workspaceId;
              if (typeof workspaceId === 'string' && workspaceId) {
                workspacesBatch.update(doc(db, 'workspaces', workspaceId), {
                  status: 'deleted',
                  deletedAt: serverTimestamp(),
                  deleteRecoverableUntil: recoverableUntil,
                  updatedAt: serverTimestamp()
                });
              }
              workspacesBatch.delete(membershipDoc.ref);
            });
            await workspacesBatch.commit();
          }
          console.log('[AuthContext] Fallback soft-deleted', ownedMemberships.length, 'owned workspaces during account deletion');
        } catch (workspaceCleanupError) {
          console.warn('[AuthContext] Workspace cleanup during account deletion failed (non-fatal):', workspaceCleanupError);
        }
      }
      
      // 30. Delete tasks created by or assigned to this user
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('createdBy', '==', userId)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasksBatch = writeBatch(db);
      tasksSnapshot.docs.forEach(doc => {
        tasksBatch.delete(doc.ref);
      });
      await tasksBatch.commit();
      console.log('[AuthContext] Deleted', tasksSnapshot.size, 'tasks created by user');
      
      const tasksAssignedQuery = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', userId)
      );
      const tasksAssignedSnapshot = await getDocs(tasksAssignedQuery);
      const tasksAssignedBatch = writeBatch(db);
      tasksAssignedSnapshot.docs.forEach(doc => {
        tasksAssignedBatch.delete(doc.ref);
      });
      await tasksAssignedBatch.commit();
      console.log('[AuthContext] Deleted', tasksAssignedSnapshot.size, 'tasks assigned to user');
      
    } catch (error) {
      console.error('[AuthContext] Error cleaning up user references:', error);
      // Don't throw error here as some collections might not exist
    }
  };

  // Helper function to clean up job application subcollections
  const cleanupJobApplicationSubcollections = async (userId: string) => {
    console.log('[AuthContext] Cleaning up job application subcollections for user:', userId);
    
    try {
      // Get all job applications by this user
      const jobApplicationsQuery = query(
        collection(db, 'jobApplications'),
        where('applicantId', '==', userId)
      );
      const jobApplicationsSnapshot = await getDocs(jobApplicationsQuery);
      
      for (const applicationDoc of jobApplicationsSnapshot.docs) {
        const applicationId = applicationDoc.id;
        
        // Delete messages subcollection
        const messagesQuery = query(collection(db, 'jobApplications', applicationId, 'messages'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesBatch = writeBatch(db);
        messagesSnapshot.docs.forEach(doc => {
          messagesBatch.delete(doc.ref);
        });
        await messagesBatch.commit();
        console.log('[AuthContext] Deleted', messagesSnapshot.size, 'messages from application', applicationId);
        
        // Delete interviews subcollection
        const interviewsQuery = query(collection(db, 'jobApplications', applicationId, 'interviews'));
        const interviewsSnapshot = await getDocs(interviewsQuery);
        const interviewsBatch = writeBatch(db);
        interviewsSnapshot.docs.forEach(doc => {
          interviewsBatch.delete(doc.ref);
        });
        await interviewsBatch.commit();
        console.log('[AuthContext] Deleted', interviewsSnapshot.size, 'interviews from application', applicationId);
      }
      
      // Get all job applications where user is the poster
      const jobApplicationsPosterQuery = query(
        collection(db, 'jobApplications'),
        where('posterId', '==', userId)
      );
      const jobApplicationsPosterSnapshot = await getDocs(jobApplicationsPosterQuery);
      
      for (const applicationDoc of jobApplicationsPosterSnapshot.docs) {
        const applicationId = applicationDoc.id;
        
        // Delete messages subcollection
        const messagesQuery = query(collection(db, 'jobApplications', applicationId, 'messages'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesBatch = writeBatch(db);
        messagesSnapshot.docs.forEach(doc => {
          messagesBatch.delete(doc.ref);
        });
        await messagesBatch.commit();
        console.log('[AuthContext] Deleted', messagesSnapshot.size, 'messages from application', applicationId);
        
        // Delete interviews subcollection
        const interviewsQuery = query(collection(db, 'jobApplications', applicationId, 'interviews'));
        const interviewsSnapshot = await getDocs(interviewsQuery);
        const interviewsBatch = writeBatch(db);
        interviewsSnapshot.docs.forEach(doc => {
          interviewsBatch.delete(doc.ref);
        });
        await interviewsBatch.commit();
        console.log('[AuthContext] Deleted', interviewsSnapshot.size, 'interviews from application', applicationId);
      }
      
    } catch (error) {
      console.error('[AuthContext] Error cleaning up job application subcollections:', error);
    }
  };

  // Helper function to clean up saved projects subcollection
  const cleanupSavedProjectsSubcollection = async (userId: string) => {
    console.log('[AuthContext] Cleaning up saved projects subcollection for user:', userId);
    
    try {
      const savedProjectsQuery = query(collection(db, 'collections', userId, 'savedProjects'));
      const savedProjectsSnapshot = await getDocs(savedProjectsQuery);
      const savedProjectsBatch = writeBatch(db);
      savedProjectsSnapshot.docs.forEach(doc => {
        savedProjectsBatch.delete(doc.ref);
      });
      await savedProjectsBatch.commit();
      console.log('[AuthContext] Deleted', savedProjectsSnapshot.size, 'saved projects');
      
      // Also clean up saved crew subcollection
      const savedCrewQuery = query(collection(db, 'collections', userId, 'savedCrew'));
      const savedCrewSnapshot = await getDocs(savedCrewQuery);
      const savedCrewBatch = writeBatch(db);
      savedCrewSnapshot.docs.forEach(doc => {
        savedCrewBatch.delete(doc.ref);
      });
      await savedCrewBatch.commit();
      console.log('[AuthContext] Deleted', savedCrewSnapshot.size, 'saved crew profiles');
      
    } catch (error) {
      console.error('[AuthContext] Error cleaning up saved collections subcollections:', error);
    }
  };

  useEffect(() => {
    try {
      console.log('[AuthProvider] Setting up auth state listener...');
      
      const unsubscribe = auth.onAuthStateChanged((user) => {
        try {
          console.log('[AuthProvider] Auth state changed:', user ? 'User logged in' : 'No user');
          setCurrentUser(user);
          setLoading(false);
          
          // Mock user profile for analytics
          if (user) {
            setUserProfile({
              id: user.uid,
              email: user.email,
              displayName: user.displayName || 'User',
              photoURL: user.photoURL,
              role: 'crew_member', // Mock role
              department: 'production', // Mock department
              experience: 'intermediate', // Mock experience level
            });
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('[AuthProvider] Error in auth state change handler:', error);
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('[AuthProvider] Error setting up auth state listener:', error);
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    userProfile,
    login,
    signup,
    loginWithGoogle,
    logout,
    deleteAccount,
          sendEmailVerification: sendEmailVerificationToUser,
      sendPasswordReset,
      confirmPasswordResetAction,
      resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 