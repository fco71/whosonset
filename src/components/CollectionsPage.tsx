import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import CrewProfileCard from '../components/CrewProfileCard';
import { useNavigate } from 'react-router-dom';
import { LegacyCrewProfile } from '../types/CrewProfile';

const CollectionsPage: React.FC = () => {
  const [savedCrew, setSavedCrew] = useState<LegacyCrewProfile[]>([]);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch saved crew profiles
        const crewSnapshot = await getDocs(
          collection(db, `collections/${user.uid}/savedCrew`)
        );
        const crewProfiles = crewSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LegacyCrewProfile[];
        setSavedCrew(crewProfiles);

        // Fetch saved projects
        const projectsSnapshot = await getDocs(
          collection(db, `collections/${user.uid}/savedProjects`)
        );
        const projects = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSavedProjects(projects);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-8">Loading Collections...</h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            My Collections
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
            Your saved crew profiles and projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Saved Crew Profiles */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                Crew Profiles ({savedCrew.length})
              </h2>
              <button
                onClick={() => navigate('/saved-crew-profiles')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                View All →
              </button>
            </div>
            
            {savedCrew.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No saved crew profiles yet</p>
                <button
                  onClick={() => navigate('/producer-view')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black transition-colors"
                >
                  Browse Crew
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedCrew.slice(0, 3).map((profile) => (
                  <div key={profile.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={profile.avatarUrl || '/bust-avatar.svg'}
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Projects */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                Projects ({savedProjects.length})
              </h2>
              <button
                onClick={() => navigate('/saved-projects')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                View All →
              </button>
            </div>
            
            {savedProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No saved projects yet</p>
                <button
                  onClick={() => navigate('/all-projects')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black transition-colors"
                >
                  Browse Projects
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">🎬</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.projectName}</h3>
                      <p className="text-sm text-gray-600">{project.productionCompany}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
