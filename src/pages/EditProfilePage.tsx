import React, { Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

// Lazy load the EditCrewProfile component to improve initial load performance
const EditCrewProfile = React.lazy(() => import('../components/EditCrewProfile'));

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('resume.page.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('resume.page.description')}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">{t('resume.builder.loadingBuilder')}</span>
            </div>
          }
        >
          {currentUser ? (
            <EditCrewProfile />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                {t('resume.builder.signInRequired')}
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default EditProfilePage;
