import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Project } from '../../models/Project';
import { ProjectCrew, ProjectTimeline, ProjectBudget } from '../../types/ProjectManagement';
import ProjectTimelineView from './ProjectTimelineView';
import ProjectCrewManagement from './ProjectCrewManagement';
import ProjectBudgetView from './ProjectBudgetView';
import ProjectDocuments from './ProjectDocuments';
import './ProjectDashboard.scss';

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
      case 'development': return '#FF6B35';
      case 'pre_production': return '#FFD93D';
      case 'production': return '#6BCF7F';
      case 'post_production': return '#4D96FF';
      case 'completed': return '#6BCF7F';
      case 'cancelled': return '#FF6B6B';
      default: return '#999';
    }
  };

  const getProjectProgress = () => {
    if (!timeline.length) return 0;
    const completed = timeline.filter(phase => phase.status === 'completed').length;
    return Math.round((completed / timeline.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="project-dashboard">
        <div className="loading">Loading project dashboard...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-dashboard">
        <div className="error">Project not found</div>
      </div>
    );
  }

  return (
    <div className="project-dashboard">
      <div className="dashboard-header">
        <div className="project-info">
          <h1>{project.projectName}</h1>
          <div className="project-meta">
            <span 
              className="status-badge"
              style={{ backgroundColor: getProjectStatusColor(project.status) }}
            >
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="production-company">{project.productionCompany}</span>
            <span className="location">{project.location}</span>
          </div>
        </div>
        
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-value">{crew.length}</span>
            <span className="stat-label">Crew Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{getProjectProgress()}%</span>
            <span className="stat-label">Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {budget ? `${budget.currency}${budget.spentBudget.toLocaleString()}` : 'N/A'}
            </span>
            <span className="stat-label">Spent</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'crew' ? 'active' : ''}`}
          onClick={() => setActiveTab('crew')}
        >
          Crew ({crew.length})
        </button>
        <button
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline ({timeline.length})
        </button>
        <button
          className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Project Summary</h3>
                <p className="logline">{project.logline}</p>
                <div className="project-details">
                  <div className="detail-row">
                    <span className="label">Director:</span>
                    <span className="value">{project.director}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Producer:</span>
                    <span className="value">{project.producer}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Genre:</span>
                    <span className="value">{project.genre}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Budget:</span>
                    <span className="value">{project.productionBudget}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>Timeline Overview</h3>
                <div className="timeline-summary">
                  <div className="timeline-item">
                    <span className="date">{new Date(project.startDate).toLocaleDateString()}</span>
                    <span className="label">Start Date</span>
                  </div>
                  <div className="timeline-item">
                    <span className="date">{new Date(project.endDate).toLocaleDateString()}</span>
                    <span className="label">End Date</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProjectProgress()}%` }}
                  ></div>
                </div>
                <span className="progress-text">{getProjectProgress()}% Complete</span>
              </div>

              <div className="overview-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {crew.slice(0, 3).map(member => (
                    <div key={member.id} className="activity-item">
                      <span className="activity-text">
                        {member.crewMemberId} joined as {member.role}
                      </span>
                      <span className="activity-date">
                        {new Date(member.addedAt).toLocaleDateString()}
                      </span>
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
              id: doc.id || '',
              projectId: projectId,
              fileName: doc.fileName || 'Untitled Document',
              fileUrl: doc.fileUrl || '',
              fileType: doc.fileType || 'application/octet-stream',
              category: doc.category || 'other',
              uploadedBy: doc.uploadedBy || 'Unknown',
              uploadedAt: doc.uploadedAt || new Date(),
              description: doc.description || '',
              isPublic: doc.isPublic || false
            }))}
            onDocumentsUpdate={loadProjectData}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard; 