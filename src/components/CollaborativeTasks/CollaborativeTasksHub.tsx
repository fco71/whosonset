import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { CollaborativeTask, TaskSubtask, TaskTeamMember, TaskReminder, TaskComment } from '../../types/ProjectManagement';
import TaskForm from './TaskForm';
import './CollaborativeTasksHub.scss';

interface CollaborativeTasksHubProps {
  projectId: string;
}

type ViewMode = 'list' | 'calendar' | 'kanban' | 'analytics';

const CollaborativeTasksHub: React.FC<CollaborativeTasksHubProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<CollaborativeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTask, setSelectedTask] = useState<CollaborativeTask | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const loadTasks = () => {
    setLoading(true);
    const tasksQuery = query(
      collection(db, 'collaborativeTasks'),
      where('projectId', '==', projectId),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollaborativeTask[];
      
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading tasks:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const handleCreateTask = async (taskData: Partial<CollaborativeTask>) => {
    try {
      const newTask: Partial<CollaborativeTask> = {
        ...taskData,
        projectId,
        createdBy: auth.currentUser?.uid || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
        assignedTeamMembers: [],
        subtasks: [],
        reminders: [],
        tags: [],
        attachments: [],
        comments: [],
        dependencies: []
      };

      await addDoc(collection(db, 'collaborativeTasks'), newTask);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<CollaborativeTask>) => {
    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'collaborativeTasks', taskId));
      setSelectedTask(null);
      setShowTaskDetails(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return t.status !== 'completed' && dueDate < today;
    }).length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;

    return { total, completed, overdue, inProgress };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="collaborative-tasks-hub">
      {/* Header */}
      <div className="tasks-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Collaborative Tasks</h1>
            <p className="header-subtitle">Manage team tasks, deadlines, and reminders</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Tasks</p>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{stats.completed}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon in-progress">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">In Progress</p>
              <p className="stat-value">{stats.inProgress}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon overdue">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Overdue</p>
              <p className="stat-value">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="tasks-controls">
        <div className="controls-left">
          <div className="view-mode-selector">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </button>
            <button
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kanban
            </button>
            <button
              className={`view-btn ${viewMode === 'analytics' ? 'active' : ''}`}
              onClick={() => setViewMode('analytics')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
          </div>
        </div>

        <div className="controls-right">
          <div className="search-box">
            <svg className="w-5 h-5 search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="pre_production">Pre-Production</option>
              <option value="production">Production</option>
              <option value="post_production">Post-Production</option>
              <option value="marketing">Marketing</option>
              <option value="distribution">Distribution</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="tasks-content">
        {viewMode === 'list' && (
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <svg className="w-16 h-16 empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="empty-title">No tasks found</h3>
                <p className="empty-description">Create your first task to get started</p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary"
                >
                  Create Task
                </button>
              </div>
            ) : (
              <div className="tasks-grid">
                {filteredTasks.map(task => (
                  <div key={task.id} className="task-card" onClick={() => {
                    setSelectedTask(task);
                    setShowTaskDetails(true);
                  }}>
                    <div className="task-header">
                      <h3 className="task-title">{task.title}</h3>
                      <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className={`task-status ${task.status}`}>{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="calendar-view">
            <p>Calendar view coming soon...</p>
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="kanban-board">
            <p>Kanban view coming soon...</p>
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="analytics-view">
            <p>Analytics view coming soon...</p>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button onClick={() => setShowTaskForm(false)} className="modal-close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <TaskForm 
                onSubmit={handleCreateTask}
                onCancel={() => setShowTaskForm(false)}
                projectId={projectId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedTask.title}</h2>
              <button onClick={() => {
                setShowTaskDetails(false);
                setSelectedTask(null);
              }} className="modal-close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Task details coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeTasksHub; 