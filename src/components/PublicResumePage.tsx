import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ResumeView from './ResumeView';

const PublicResumePage: React.FC = () => {
  const { uid } = useParams();
  const [data, setData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      if (!uid) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'crewProfiles', uid));
        if (!snap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const profile = snap.data();
        if (!profile.isPublished) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setData(profile);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resume:', error);
        setNotFound(true);
        setLoading(false);
      }
    };

    fetchResume();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Resume Not Available</h1>
          <p className="text-gray-300">
            This resume is either not published or doesn't exist. 
            Please check the link or contact the profile owner.
          </p>
        </div>
      </div>
    );
  }

  return <ResumeView profile={data} />;
};

export default PublicResumePage; 