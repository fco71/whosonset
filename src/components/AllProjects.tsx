// src/components/AllProjects.tsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Project {
  id: string;
  projectName: string;
  country?: string;
  logline?: string;
  posterImageUrl?: string;
}

const fallbackImage = '/my-icon.png';

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Projects'));
        const projectData: Project[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectName: data.projectName,
            country: data.country,
            logline: data.logline,
            posterImageUrl: data.posterImageUrl,
          };
        });
        setProjects(projectData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getSafeImageUrl = (url?: string): string => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return fallbackImage;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">All Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={getSafeImageUrl(project.posterImageUrl)}
              alt={project.projectName}
              onError={(e) => {
                if ((e.target as HTMLImageElement).src !== fallbackImage) {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }
              }}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-1">{project.projectName}</h2>
              <p className="text-sm text-gray-600">{project.country || 'Unknown Country'}</p>
              <p className="text-sm text-gray-700 mt-2">{project.logline || 'No logline provided.'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
