import React from 'react';
import { useParams } from 'react-router-dom';
import ApplicationStatusTracker from '../components/JobSearch/ApplicationStatusTracker';

const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();

  if (!applicationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Invalid Application</h2>
          <p className="text-gray-600">Application ID is required.</p>
        </div>
      </div>
    );
  }

  return <ApplicationStatusTracker applicationId={applicationId} />;
};

export default ApplicationDetailPage; 