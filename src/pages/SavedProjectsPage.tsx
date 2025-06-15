import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  projectName: string;
  country: string;
  productionCompany: string;
  status: string;
  logline: string;
  coverImageUrl?: string;
}

const SavedProjectsPage: React.FC = () => {
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const savedProjectsRef = collection(db, `collections/${user.uid}/savedProjects`);
        const snapshot = await getDocs(savedProjectsRef);
        const projects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setSavedProjects(projects);
      } catch (error) {
        console.error('Error fetching saved projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Saved Projects</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading saved projects...</div>
      ) : savedProjects.length === 0 ? (
        <div className="text-center text-gray-400">No saved projects found.</div>
      ) : (
        <div className="space-y-6">
          {savedProjects.map(project => (
            <div
              key={project.id}
              className="flex bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {project.coverImageUrl && (
                <img
                  src={project.coverImageUrl}
                  alt={project.projectName}
                  className="w-1/3 object-cover"
                />
              )}
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{project.projectName}</h2>
                  <p className="text-sm text-gray-400">{project.productionCompany} • {project.country}</p>
                  <p className="mt-2 text-sm text-gray-300 line-clamp-3">{project.logline}</p>
                </div>
                <span className="mt-2 inline-block px-2 py-1 text-xs bg-blue-700 rounded">{project.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProjectsPage;
