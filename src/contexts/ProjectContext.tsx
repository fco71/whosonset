import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface ProjectContextType {
  currentProject: any | null;
  currentUser: any | null;
  isLoading: boolean;
  error: Error | null;
  setCurrentProject: (project: any) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();

  // Load project data when projectId changes
  useEffect(() => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid, 'projects', currentUser.activeProjectId || ''),
      (doc) => {
        if (doc.exists()) {
          setCurrentProject({ id: doc.id, ...doc.data() });
        } else {
          setCurrentProject(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading project:', error);
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, currentUser?.activeProjectId]);

  const value = {
    currentProject,
    currentUser,
    isLoading,
    error,
    setCurrentProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;
