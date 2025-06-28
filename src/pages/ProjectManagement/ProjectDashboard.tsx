import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Project } from '../../models/Project';
import { ProjectCrew, ProjectTimeline, ProjectBudget, ProjectDocument } from '../../types/ProjectManagement';
import ProjectTimelineView from './ProjectTimelineView';
import ProjectCrewManagement from './ProjectCrewManagement';
import ProjectBudgetView from './ProjectBudgetView';
import ProjectDocuments from './ProjectDocuments';

interface ProjectDashboardProps {
  projectId: string;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [crew, setCrew] = useState<ProjectCrew[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimeline[]>([]);
  const [budget, setBudget] = useState<ProjectBudget | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'crew' | 'timeline' | 'budget' | 'documents'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    setIsLoading(true);
    try {
      // Load project details
      const projectQuery = query(
        collection(db, 'projects'),
        where('id', '==', projectId)
      );
      const projectSnapshot = await getDocs(projectQuery);
      if (!projectSnapshot.empty) {
        setProject({ id: projectSnapshot.docs[0].id, ...projectSnapshot.docs[0].data() } as Project);
      }

      // Load project crew
      const crewQuery = query(
        collection(db, 'projectCrew'),
        where('projectId', '==', projectId),
        orderBy('addedAt', 'desc')
      );
      const crewSnapshot = await getDocs(crewQuery);
      const crewData = crewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ProjectCrew));
      setCrew(crewData);

      // Load project timeline
      const timelineQuery = query(
        collection(db, 'projectTimeline'),
        where('projectId', '==', projectId),
        orderBy('startDate', 'asc')
      );
      const timelineSnapshot = await getDocs(timelineQuery);
      const timelineData = timelineSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ProjectTimeline));
      setTimeline(timelineData);

      // Load project budget
      const budgetQuery = query(
        collection(db, 'projectBudget'),
        where('projectId', '==', projectId)
      );
      const budgetSnapshot = await getDocs(budgetQuery);
      if (!budgetSnapshot.empty) {
        setBudget({ id: budgetSnapshot.docs[0].id, ...budgetSnapshot.docs[0].data() } as ProjectBudget);
      }

    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'development': return 'bg-orange-100 text-orange-800';
      case 'pre_production': return 'bg-yellow-100 text-yellow-800';
      case 'production': return 'bg-green-100 text-green-800';
      case 'post_production': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectProgress = () => {
    if (!timeline.length) return 0;
    const completed = timeline.filter(phase => phase.status === 'completed').length;
    return Math.round((completed / timeline.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading project dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Project not found</h2>
            <p className="text-lg font-light text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Dashboard Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
                {project.projectName}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium tracking-wider ${getProjectStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-sm font-light text-gray-600">
                  {project.productionCompany}
                </span>
                <span className="text-sm font-light text-gray-600">
                  {project.productionLocations && project.productionLocations.length > 0 
                    ? project.productionLocations[0].city 
                      ? `${project.productionLocations[0].city}, ${project.productionLocations[0].country}`
                      : project.productionLocations[0].country
                    : 'Location not specified'
                  }
                </span>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">{crew.length}</div>
                <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">Crew Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">{getProjectProgress()}%</div>
                <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {budget ? `${budget.currency}${budget.spentBudget.toLocaleString()}` : 'N/A'}
                </div>
                <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100">
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'overview' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'crew' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('crew')}
            >
              Crew ({crew.length})
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'timeline' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline ({timeline.length})
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'budget' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('budget')}
            >
              Budget
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'documents' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {activeTab === 'overview' && (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">Project Summary</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{project.logline}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Director:</span>
                      <span className="text-sm font-light text-gray-900">{project.director}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Producer:</span>
                      <span className="text-sm font-light text-gray-900">{project.producer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Genre:</span>
                      <span className="text-sm font-light text-gray-900">{project.genre}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">Recent Activity</h3>
                  <div className="space-y-4">
                    {crew.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.crewMemberId?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.crewMemberId}</p>
                          <p className="text-xs font-light text-gray-600">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crew' && (
            <ProjectCrewManagement 
              projectId={projectId} 
              crew={crew} 
              onCrewUpdate={loadProjectData} 
            />
          )}

          {activeTab === 'timeline' && (
            <ProjectTimelineView 
              projectId={projectId} 
              timeline={timeline} 
              onTimelineUpdate={loadProjectData} 
            />
          )}

          {activeTab === 'budget' && (
            <ProjectBudgetView 
              projectId={projectId} 
              budget={budget} 
              onBudgetUpdate={loadProjectData} 
            />
          )}

          {activeTab === 'documents' && (
            <ProjectDocuments 
              projectId={projectId} 
              documents={(project.documents || []).map(doc => ({
                id: doc.id,
                projectId: projectId,
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                fileType: doc.fileType,
                category: doc.category,
                uploadedBy: doc.uploadedBy,
                uploadedAt: doc.uploadedAt,
                description: doc.description,
                isPublic: doc.isPublic
              } as ProjectDocument))}
              onDocumentsUpdate={loadProjectData} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard; 