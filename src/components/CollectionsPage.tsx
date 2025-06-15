import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import CrewProfileCard from '../components/CrewProfileCard';
import { useNavigate } from 'react-router-dom';

interface CrewProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

interface Project {
  id: string;
  projectName: string;
  coverImageUrl?: string;
  status: string;
  logline: string;
}

const CollectionsPage: React.FC = () => {
  const [savedCrew, setSavedCrew] = useState<CrewProfile[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const [crewSnap, projectSnap] = await Promise.all([
          getDocs(collection(db, `collections/${user.uid}/savedCrew`)),
          getDocs(collection(db, `collections/${user.uid}/savedProjects`)),
        ]);

        const crewData = crewSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as CrewProfile[];

        const projectData = projectSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        setSavedCrew(crewData);
        setSavedProjects(projectData);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Collections</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading collections...</div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Saved Crew Profiles</h2>
            {savedCrew.length === 0 ? (
              <p className="text-gray-400">No saved crew profiles.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {savedCrew.slice(0, 6).map(profile => (
                  <CrewProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/saved-crew')}
              className="mt-4 text-blue-400 hover:underline"
            >
              View all saved crew →
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Saved Projects</h2>
            {savedProjects.length === 0 ? (
              <p className="text-gray-400">No saved projects.</p>
            ) : (
              <div className="space-y-6">
                {savedProjects.slice(0, 3).map(project => (
                  <div
                    key={project.id}
                    className="flex bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
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
                      <h3 className="text-xl font-semibold">{project.projectName}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{project.logline}</p>
                      <span className="mt-2 inline-block px-2 py-1 text-xs bg-blue-700 rounded">{project.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/saved-projects')}
              className="mt-4 text-blue-400 hover:underline"
            >
              View all saved projects →
            </button>
          </section>
        </>
      )}
    </div>
  );
};

export default CollectionsPage;
