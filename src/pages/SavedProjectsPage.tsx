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

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
              Saved
            </h1>
            <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
              Projects
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
              Your curated collection of inspiring projects. 
              Keep track of the productions that inspire you.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          {savedProjects.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                No saved projects yet
              </h3>
              <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                Start exploring projects and save the ones that inspire you
              </p>
            </div>
          ) : (
            <>
              <div className="mb-12 animate-fade-in">
                <h3 className="text-3xl font-light text-gray-900 tracking-wide">
                  {savedProjects.length} {savedProjects.length === 1 ? 'Project' : 'Projects'} Saved
                </h3>
              </div>

              <div className="space-y-8">
                {savedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer animate-card-entrance hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {project.coverImageUrl && (
                        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                          <img
                            src={project.coverImageUrl}
                            alt={project.projectName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-8 flex flex-col justify-between flex-1">
                        <div>
                          <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
                            {project.projectName}
                          </h2>
                          <p className="text-sm font-medium text-gray-500 mb-4 tracking-wider uppercase">
                            {project.productionCompany} • {project.country}
                          </p>
                          <p className="text-lg font-light text-gray-600 leading-relaxed line-clamp-3">
                            {project.logline}
                          </p>
                        </div>
                        <div className="mt-6">
                          <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full tracking-wider ${
                            project.status === 'In Production' ? 'bg-green-100 text-green-800' :
                            project.status === 'Pre-Production' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'Post-Production' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-8 animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 bg-gray-200 rounded-lg mb-4 md:mb-0 md:mr-8"></div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="mt-6">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedProjectsPage;
