import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ResumeView from './ResumeView';

// Define a more specific type for the profile data
interface CrewProfile {
  isPublished: boolean;
  name: string;
  jobTitles: string[];
  [key: string]: any; // For other properties we might not know about
}

interface PublicResumePageProps {}

// Use enum-like object with uppercase keys for better type safety
const LOADING_STATES = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];

const PublicResumePage: React.FC<PublicResumePageProps> = () => {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<CrewProfile | null>(null);
  const [status, setStatus] = useState<LoadingState>(LOADING_STATES.LOADING);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!uid) {
        setStatus(LOADING_STATES.ERROR);
        setError('No user ID provided');
        return;
      }

      try {
        setStatus(LOADING_STATES.LOADING);
        const docRef = doc(db, 'crewProfiles', uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('Profile not found');
        }

        const profileData = docSnap.data() as CrewProfile;
        console.log('[PublicResumePage] Fetched profile data:', {
          hasProfileImage: !!profileData.profileImageUrl,
          profileImageUrl: profileData.profileImageUrl,
          isBlobUrl: profileData.profileImageUrl?.startsWith('blob:'),
          profileData: { ...profileData, profileImageUrl: '...' } // Don't log the full URL in case it's sensitive
        });

        if (!profileData.isPublished) {
          throw new Error('Profile is not published');
        }

        setProfile(profileData);
        setStatus(LOADING_STATES.SUCCESS);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStatus(LOADING_STATES.ERROR);
      }
    };

    fetchResume();
  }, [uid]);

  if (status === LOADING_STATES.LOADING) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"
            aria-label="Loading"
          />
          <p>Loading resume...</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-sm text-gray-400">
              <div>Loading profile data...</div>
              <div>User ID: {uid}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === LOADING_STATES.ERROR) {
    console.error('[PublicResumePage] Error loading profile:', { error, profile });
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4" role="img" aria-hidden="true">
            {error?.includes('not found') ? '🔍' : '🔒'}
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {error?.includes('not found') 
              ? 'Resume Not Found' 
              : 'Resume Not Available'}
          </h1>
          <p className="text-gray-300">
            {error || 'This resume is not available. Please check the link or contact the profile owner.'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-800 rounded text-left text-sm">
              <div className="font-mono text-red-400">Error Details:</div>
              <div className="mt-2 p-2 bg-black rounded overflow-auto max-h-40">
                {JSON.stringify(error, null, 2)}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                User ID: {uid}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Should be handled by error state, but TypeScript needs this check
  }

  // Log when we're about to render the ResumeView
  useEffect(() => {
    console.log('[PublicResumePage] Rendering ResumeView with profile:', {
      hasProfileImage: !!profile?.profileImageUrl,
      isBlobUrl: profile?.profileImageUrl?.startsWith('blob:'),
      profileId: uid
    });
  }, [profile, uid]);

  return (
    <>
      <ResumeView profile={profile as any} />
      
      {/* Debug info - only shown in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '320px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '300px',
          zIndex: 9998
        }}>
          <div><strong>Profile ID:</strong> {uid}</div>
          <div><strong>Has Image:</strong> {profile?.profileImageUrl ? 'Yes' : 'No'}</div>
          {profile?.profileImageUrl && (
            <div>
              <div><strong>Image Type:</strong> {profile.profileImageUrl.startsWith('blob:') ? 'Blob URL' : 'Regular URL'}</div>
              <div className="mt-2 text-xs overflow-hidden text-ellipsis">
                {profile.profileImageUrl.substring(0, 50)}...
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PublicResumePage; 