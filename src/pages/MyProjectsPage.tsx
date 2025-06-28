import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

interface Project {
  id: string;
  projectName: string;
  productionCompany: string;
  status: string;
  synopsis: string;
  director?: string;
  producer?: string;
  coverImageUrl?: string;
  genres?: string[];
  country?: string;
  productionLocations?: Array<{ country: string; city?: string }>;
}

const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to view your projects.');
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'Projects'), where('owner_uid', '==', user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(data);
      } catch (err: any) {
        setError('Error loading projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleEdit = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'Projects', projectId));
      setProjects(projects => projects.filter(p => p.id !== projectId));
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-16 animate-fade">
            <h1 className="heading-primary mb-6 animate-slide">My</h1>
            <h2 className="heading-secondary mb-8 animate-slide">Projects</h2>
            <p className="body-large max-w-2xl mx-auto animate-slide">
              View, edit, or delete your own film projects.
            </p>
          </div>
        </div>
      </div>
      <div className="section-gray">
        <div className="container-base section-padding">
          {projects.length === 0 ? (
            <div className="text-center py-24 animate-fade">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
              <h3 className="heading-card mb-4">No projects found</h3>
              <p className="body-medium max-w-md mx-auto">You haven't added any projects yet.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {projects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }} className="relative group">
                  <ProjectCard
                    id={project.id}
                    projectName={project.projectName}
                    productionCompany={project.productionCompany}
                    country={project.country}
                    productionLocations={project.productionLocations}
                    status={project.status}
                    summary={project.synopsis}
                    director={project.director}
                    producer={project.producer}
                    coverImageUrl={project.coverImageUrl}
                    genres={project.genres}
                    showDetails={true}
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(project.id)}
                      className="btn-secondary px-3 py-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-danger px-3 py-1 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsPage; 