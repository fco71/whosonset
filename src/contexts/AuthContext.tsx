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
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, writeBatch } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userProfile: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
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
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
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
      await createUserProfileIfNeeded(user);
      
    } catch (error: any) {
      console.error('[AuthContext] Google sign-in error:', error);
      
      // Check if the error is due to provider not being enabled
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is not enabled. Please enable it in your Firebase console.');
      }
      
      throw error;
    }
  };

  const createUserProfileIfNeeded = async (user: User) => {
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
      } else {
        console.log('[AuthContext] Crew profile already exists for OAuth user');
      }
    } catch (error) {
      console.error('[AuthContext] Error creating user profile for OAuth:', error);
      // Don't throw error here as the user is already signed in
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('[AuthContext] Starting signup process for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('[AuthContext] Firebase Auth user created with UID:', user.uid);
      
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

  const logout = async () => {
    await signOut(auth);
  };

  const deleteAccount = async (password?: string) => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      // Check if re-authentication is required
      try {
        // Try to delete user directly first
        await deleteUser(currentUser);
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          // Re-authentication required
          if (!password) {
            throw new Error('Re-authentication required. Please provide your password.');
          }
          
          // Re-authenticate with email and password
          const credential = EmailAuthProvider.credential(currentUser.email!, password);
          await reauthenticateWithCredential(currentUser, credential);
          
          // Now try to delete user again
          await deleteUser(currentUser);
        } else {
          throw error;
        }
      }

      // Delete user data from Firestore
      const batch = writeBatch(db);
      
      // Delete user profile
      batch.delete(doc(db, 'users', currentUser.uid));
      
      // Delete crew profile
      batch.delete(doc(db, 'crewProfiles', currentUser.uid));
      
      // Delete user collections
      batch.delete(doc(db, 'UserCollections', currentUser.uid));
      
      // Delete email tracking
      batch.delete(doc(db, 'emailTracking', currentUser.email || ''));
      
      // Execute the batch
      await batch.commit();
      
      console.log('[AuthContext] Account deleted successfully');
    } catch (error) {
      console.error('[AuthContext] Error deleting account:', error);
      throw error;
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
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 