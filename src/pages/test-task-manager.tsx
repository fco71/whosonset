import React from 'react';
// import { useRouter } from 'next/router';
import { TaskManager } from '../components/TaskManager';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const TestTaskManagerPage: React.FC = () => {
  // const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const { currentProject, isLoading: projectLoading } = useProject();

  // Redirect to login if not authenticated
  // React.useEffect(() => {
  //   if (!authLoading && !currentUser) {
  //     router.push('/login');
  //   }
  // }, [currentUser, authLoading, router]);

  if (authLoading || projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Project Selected</h1>
        <p className="text-gray-600 mb-6">Please select or create a project to manage tasks.</p>
        {/* <button
          onClick={() => router.push('/projects')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Projects
        </button> */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <TaskManager projectId={currentProject.id} />
    </div>
  );
};

export default TestTaskManagerPage;
