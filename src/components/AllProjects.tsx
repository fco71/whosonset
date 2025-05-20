import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Project {
  id: string;
  projectName: string;
  productionCompany: string;
  status: string;
  logline: string;
  director?: string;
  producer?: string;
  posterImageUrl?: string;
}

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Projects'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-white p-8">Loading projects...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <button className="bg-gray-700 px-4 py-2 rounded-full text-sm text-white hover:bg-gray-600">
          Add
        </button>
      </div>

      <div className="space-y-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="flex bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-500/30 hover:border-blue-500/60 transition duration-300"
          >
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-pink-400">{project.projectName}</h2>
                <p className="font-semibold text-white">{project.productionCompany}</p>
                {project.director && (
                  <p className="text-sm text-gray-300">
                    <strong>Director:</strong> {project.director}
                  </p>
                )}
                {project.producer && (
                  <p className="text-sm text-gray-300">
                    <strong>Producer:</strong> {project.producer}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                  {project.logline}
                </p>
              </div>
            </div>
            <div className="w-40 min-w-[160px] h-auto bg-black">
              <img
                src={project.posterImageUrl || '/my-icon.png'}
                alt={project.projectName}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/my-icon.png';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
