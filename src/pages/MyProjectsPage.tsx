import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { ProjectCrewService } from '../services/ProjectCrewService';
import { useTranslation } from 'react-i18next';

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
  owner_uid?: string;
  startDate?: string;
  endDate?: string;
}

const MyProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const [ownedProjects, setOwnedProjects] = useState<Project[]>([]);
  const [crewProjects, setCrewProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      if (!user) {
        setError(t('projects.mustBeLoggedIn'));
        setLoading(false);
        return;
      }
      try {
        // Fetch owned projects
        const ownedQuery = query(collection(db, 'Projects'), where('owner_uid', '==', user.uid));
        const ownedSnapshot = await getDocs(ownedQuery);
        const ownedData = ownedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setOwnedProjects(ownedData);

        // Fetch projects where user is a crew member
        const crewProjectsData = await ProjectCrewService.getProjectsForCrewMember(user.uid);
        setCrewProjects(crewProjectsData);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(t('projects.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [t]);

  const handleEdit = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm(t('projects.confirmDelete'))) return;
    try {
      await deleteDoc(doc(db, 'Projects', projectId));
      setOwnedProjects(projects => projects.filter(p => p.id !== projectId));
    } catch (err) {
      alert(t('projects.deleteFailed'));
    }
  };

  const allProjects = [...ownedProjects, ...crewProjects];
  const hasProjects = allProjects.length > 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('projects.loading')}</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-16 animate-fade">
            <h1 className="heading-primary mb-6 animate-slide">{t('myProjects.title')}</h1>
            <h2 className="heading-secondary mb-8 animate-slide">{t('myProjects.subtitle')}</h2>
            <p className="body-large max-w-2xl mx-auto animate-slide">
              {t('myProjects.description')}
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/projects/create')}
                className="btn-primary"
              >
                {t('projects.createNewProject')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="section-gray">
        <div className="container-base section-padding">
          {!hasProjects ? (
            <div className="text-center py-24 animate-fade">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
              <h3 className="heading-card mb-4">{t('myProjects.noProjects')}</h3>
              <p className="body-medium max-w-md mx-auto mb-8">{t('myProjects.createFirst')}</p>
              <button
                onClick={() => navigate('/projects/create')}
                className="btn-primary"
              >
                {t('projects.createNewProject')}
              </button>
            </div>
          ) : (
            <>
              {/* Owned Projects Section */}
              {ownedProjects.length > 0 && (
                <div className="mb-12">
                  <h3 className="heading-card mb-6 flex items-center gap-2">
                    <span className="text-blue-600">📁</span>
                    {t('myProjects.ownedProjects')} ({ownedProjects.length})
                  </h3>
                  <div className="grid-cards">
                    {ownedProjects.map((project, index) => (
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
                          startDate={project.startDate}
                          endDate={project.endDate}
                          showDetails={true}
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(project.id)}
                            className="btn-secondary px-3 py-1 text-xs"
                          >
                            {t('projects.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="btn-danger px-3 py-1 text-xs"
                          >
                            {t('projects.delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew Projects Section */}
              {crewProjects.length > 0 && (
                <div>
                  <h3 className="heading-card mb-6 flex items-center gap-2">
                    <span className="text-green-600">👥</span>
                    {t('myProjects.crewProjects')} ({crewProjects.length})
                  </h3>
                  <div className="grid-cards">
                    {crewProjects.map((project, index) => (
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
                          startDate={project.startDate}
                          endDate={project.endDate}
                          showDetails={true}
                        />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            Crew Member
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsPage; 