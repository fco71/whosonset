import React, { Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Lazy load the EditCrewProfile component to improve initial load performance
const EditCrewProfile = React.lazy(() => import('../components/EditCrewProfile'));

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your professional information and build your resume
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading resume builder...</span>
            </div>
          }
        >
          {currentUser ? (
            <EditCrewProfile />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                Please sign in to edit your profile
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default EditProfilePage;
