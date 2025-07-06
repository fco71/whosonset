import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { Project } from '../../models/Project';
import { ProjectCrew, ProjectBudget, ProjectTimeline, ProjectDocument } from '../../types/ProjectManagement';
import ProjectCrewManagement from './ProjectCrewManagement';
import ProjectBudgetView from './ProjectBudgetView';
import ProjectTimelineView from './ProjectTimelineView';
import ProjectDocuments from './ProjectDocuments';
import CollaborativeTasksHub from '../../components/CollaborativeTasks/CollaborativeTasksHub';

interface ProjectDashboardProps {
  projectId: string;
}

type TabType = 'overview' | 'crew' | 'budget' | 'timeline' | 'documents' | 'tasks';

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [crew, setCrew] = useState<ProjectCrew[]>([]);
  const [budget, setBudget] = useState<ProjectBudget | null>(null);
  const [timeline, setTimeline] = useState<ProjectTimeline | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      // Load project details
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        setProject({ id: projectDoc.id, ...projectDoc.data() } as Project);
      }

      // Load crew data
      const crewQuery = query(collection(db, 'projectCrew'), where('projectId', '==', projectId));
      const crewSnapshot = await getDocs(crewQuery);
      const crewData = crewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectCrew));
      setCrew(crewData);

      // Load budget data
      const budgetQuery = query(collection(db, 'projectBudgets'), where('projectId', '==', projectId));
      const budgetSnapshot = await getDocs(budgetQuery);
      if (!budgetSnapshot.empty) {
        const budgetData = { id: budgetSnapshot.docs[0].id, ...budgetSnapshot.docs[0].data() } as ProjectBudget;
        setBudget(budgetData);
      }

      // Load timeline data
      const timelineQuery = query(collection(db, 'projectTimelines'), where('projectId', '==', projectId));
      const timelineSnapshot = await getDocs(timelineQuery);
      if (!timelineSnapshot.empty) {
        const timelineData = { id: timelineSnapshot.docs[0].id, ...timelineSnapshot.docs[0].data() } as ProjectTimeline;
        setTimeline(timelineData);
      }

      // Load documents
      const documentsQuery = query(collection(db, 'projectDocuments'), where('projectId', '==', projectId));
      const documentsSnapshot = await getDocs(documentsQuery);
      const documentsData = documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectDocument));
      setDocuments(documentsData);

    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = () => {
    if (!timeline?.phase || !project?.phases) return 0;
    const completed = project.phases.filter(p => p.status === 'completed').length;
    return Math.round((completed / project.phases.length) * 100);
  };

  const calculateBudgetUsage = () => {
    if (!budget) return 0;
    const totalSpent = Object.values(budget.categories || {}).reduce((acc, cat) => acc + (cat.spent || 0), 0);
    return Math.round((totalSpent / budget.totalBudget) * 100);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'crew', label: 'Crew', icon: '👥' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '✅' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p className="text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ color: '#fff', fontWeight: 700 }}>{project.projectName}</h1>
              <p className="text-gray-600 mt-1" style={{ color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{project.logline}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Created {new Date(project.createdAt?.toDate?.() || project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to={`/analytics/project/${projectId}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>📊</span>
                Analytics
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Edit Project
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Crew Members</p>
                    <p className="text-2xl font-semibold text-gray-900" style={{ color: '#fff', fontWeight: 600 }}>{crew.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Documents</p>
                    <p className="text-2xl font-semibold text-gray-900" style={{ color: '#fff', fontWeight: 600 }}>{documents.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Progress</p>
                    <p className="text-2xl font-semibold text-gray-900" style={{ color: '#fff', fontWeight: 600 }}>{calculateProgress()}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Budget Used</p>
                    <p className="text-2xl font-semibold text-gray-900" style={{ color: '#fff', fontWeight: 600 }}>{calculateBudgetUsage()}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#fff', fontWeight: 600 }}>Project Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Genre</dt>
                    <dd className="text-sm text-gray-900" style={{ color: '#fff' }}>{project.genre || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Location</dt>
                    <dd className="text-sm text-gray-900" style={{ color: '#fff' }}>
                      {project.productionLocations && project.productionLocations.length > 0 
                        ? `${project.productionLocations[0].city || ''} ${project.productionLocations[0].country}`.trim()
                        : 'Not specified'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Start Date</dt>
                    <dd className="text-sm text-gray-900" style={{ color: '#fff' }}>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>End Date</dt>
                    <dd className="text-sm text-gray-900" style={{ color: '#fff' }}>
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Budget</dt>
                    <dd className="text-sm text-gray-900" style={{ color: '#fff' }}>
                      {budget ? `$${budget.totalBudget?.toLocaleString()}` : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{doc.fileName} was uploaded</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt?.toDate?.() || doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#fff', fontWeight: 600 }}>Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('crew')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900" style={{ color: '#fff', fontWeight: 600 }}>Add Crew Member</p>
                    <p className="text-sm text-gray-500" style={{ color: 'rgba(255,255,255,0.7)' }}>Manage your team</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('timeline')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Add Milestone</p>
                    <p className="text-sm text-gray-500">Track progress</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Upload Document</p>
                    <p className="text-sm text-gray-500">Share files</p>
                  </div>
                </button>
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

        {activeTab === 'budget' && (
          <ProjectBudgetView
            projectId={projectId}
            budget={budget}
            onBudgetUpdate={loadProjectData}
          />
        )}

        {activeTab === 'timeline' && (
          <ProjectTimelineView
            projectId={projectId}
            timeline={timeline}
            onTimelineUpdate={loadProjectData}
          />
        )}

        {activeTab === 'documents' && (
          <ProjectDocuments
            projectId={projectId}
            documents={documents}
            onDocumentsUpdate={loadProjectData}
          />
        )}

        {activeTab === 'tasks' && (
          <CollaborativeTasksHub projectId={projectId} />
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard; 