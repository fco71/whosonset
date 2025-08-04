import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
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
  sendPasswordResetEmail
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
        const crewProfileData = {
          uid: user.uid,
          name: displayName,
          email: user.email,
          bio: '',
          profileImageUrl: user.photoURL || '/bust-avatar.svg',
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
        const userCollectionsData = {
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
      const crewProfileData = {
        uid: user.uid,
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
      const userCollectionsData = {
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
    await sendPasswordResetEmail(auth, email);
    console.log('[AuthContext] Password reset email sent');
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
      
      try {
        // Try to delete user directly first
        await deleteUser(currentUser);
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
          userToDelete = auth.currentUser;
          if (!userToDelete) {
            throw new Error('Failed to get current user after re-authentication');
          }
          
          console.log('[AuthContext] Re-authentication successful, proceeding with deletion');
        } else {
          throw error;
        }
      }
      
      // Now clean up all Firestore data
      await cleanupUserData(userToDelete.uid, userToDelete.email || '');
      
      // Check if user is still authenticated before final deletion
      if (!auth.currentUser) {
        console.log('[AuthContext] User already signed out, deletion complete');
        return;
      }
      
      // Finally delete the auth account
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
      
    } catch (error) {
      console.error('[AuthContext] Error cleaning up user references:', error);
      // Don't throw error here as some collections might not exist
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
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 