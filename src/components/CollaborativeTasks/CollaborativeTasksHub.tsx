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
  const [editingTask, setEditingTask] = useState<CollaborativeTask | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const loadTasks = () => {
    setLoading(true);
    const tasksQuery = query(
      collection(db, 'collaborativeTasks'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollaborativeTask[];
      
      // Sort tasks in memory to handle optional dueDate
      tasksData.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      
      console.log('Loaded tasks:', tasksData);
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
      console.log('=== TASK CREATION DEBUG ===');
      console.log('Creating task with data:', taskData);
      console.log('Project ID:', projectId);
      console.log('Current user:', auth.currentUser?.uid);
      console.log('Auth state:', auth.currentUser ? 'Authenticated' : 'Not authenticated');
      
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        alert('You must be logged in to create tasks.');
        return;
      }
      
      if (!projectId) {
        console.error('No project ID provided');
        alert('Project ID is required to create tasks.');
        return;
      }
      
      const newTask: Partial<CollaborativeTask> = {
        ...taskData,
        projectId,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
        assignedTeamMembers: taskData.assignedTeamMembers || [],
        subtasks: taskData.subtasks || [],
        reminders: [],
        tags: taskData.tags || [],
        attachments: [],
        comments: [],
        dependencies: []
      };

      console.log('Final task object:', newTask);
      console.log('About to add document to Firestore...');
      
      const docRef = await addDoc(collection(db, 'collaborativeTasks'), newTask);
      console.log('✅ Task created successfully with ID:', docRef.id);
      
      setShowTaskForm(false);
      
      // Force reload tasks to show the new task
      console.log('Reloading tasks...');
      const tasksQuery = query(
        collection(db, 'collaborativeTasks'),
        where('projectId', '==', projectId)
      );
      
      const snapshot = await getDocs(tasksQuery);
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollaborativeTask[];
      
      console.log('Reloaded tasks:', tasksData);
      setTasks(tasksData);
      
    } catch (error) {
      console.error('❌ Error creating task:', error);
      console.error('Error details:', {
        code: (error as any).code,
        message: (error as any).message,
        stack: (error as any).stack
      });
      alert(`Failed to create task: ${(error as any).message}`);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<CollaborativeTask>) => {
    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDoc(doc(db, 'collaborativeTasks', taskId));
        setSelectedTask(null);
        setShowTaskDetails(false);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  const handleStartTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      await updateDoc(taskRef, {
        status: 'in_progress',
        startedAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error starting task:', error);
      alert('Failed to start task. Please try again.');
    }
  };

  const handleEditTask = (task: CollaborativeTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setShowTaskDetails(false);
  };

  const handleRestoreTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      await updateDoc(taskRef, {
        status: 'pending',
        completedAt: null,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error restoring task:', error);
      alert('Failed to restore task. Please try again.');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const activeTasks = filteredTasks.filter(task => task.status !== 'completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today;
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
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Task
            </button>
            
            {/* Debug button for testing task creation */}
            <button
              onClick={() => {
                console.log('=== TEST TASK CREATION ===');
                const testTask = {
                  title: 'Test Task ' + Date.now(),
                  description: 'This is a test task created for debugging',
                  priority: 'medium' as const,
                  category: 'other' as const,
                  dueDate: '',
                  estimatedHours: 2,
                  location: 'Test Location',
                  budget: 100,
                  tags: ['test', 'debug'],
                  assignedTeamMembers: [],
                  subtasks: []
                };
                handleCreateTask(testTask);
              }}
              className="btn-secondary ml-2"
            >
              Test Create Task
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
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                  className="btn-primary"
                >
                  Create Task
                </button>
              </div>
            ) : (
              <div className="tasks-grid">
                {activeTasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h3 className="task-title" onClick={() => {
                        setSelectedTask(task);
                        setShowTaskDetails(true);
                      }}>{task.title}</h3>
                      <div className="task-actions">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleStartTask(task.id)}
                            className="action-btn start"
                            title="Start Task"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="action-btn complete"
                            title="Complete Task"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleEditTask(task)}
                          className="action-btn edit"
                          title="Edit Task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="action-btn delete"
                          title="Delete Task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className="task-due-date">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                      <span className={`task-status ${task.status}`}>{task.status}</span>
                    </div>
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="task-subtasks">
                        <span className="subtasks-count">{task.subtasks.length} subtasks</span>
                        <div className="subtasks-progress">
                          <div 
                            className="progress-bar"
                            style={{ 
                              width: `${(task.subtasks.filter(st => st.status === 'completed').length / task.subtasks.length) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
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
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }} className="modal-close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <TaskForm 
                task={editingTask || undefined}
                onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                }}
                projectId={projectId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>{selectedTask.title}</h2>
              <div className="modal-actions">
                <button
                  onClick={() => handleEditTask(selectedTask)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button onClick={() => {
                  setShowTaskDetails(false);
                  setSelectedTask(null);
                }} className="modal-close">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="task-details">
                <div className="task-info">
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className={`info-value status ${selectedTask.status}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Due Date:</span>
                    <span className="info-value">
                      {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleString() : 'No due date'}
                    </span>
                  </div>
                  {selectedTask.estimatedHours && selectedTask.estimatedHours > 0 && (
                    <div className="info-row">
                      <span className="info-label">Estimated Hours:</span>
                      <span className="info-value">{selectedTask.estimatedHours}h</span>
                    </div>
                  )}
                  {selectedTask.location && (
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{selectedTask.location}</span>
                    </div>
                  )}
                  {selectedTask.budget && selectedTask.budget > 0 && (
                    <div className="info-row">
                      <span className="info-label">Budget:</span>
                      <span className="info-value">${selectedTask.budget.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="task-description-full">
                  <h3>Description</h3>
                  <p>{selectedTask.description}</p>
                </div>

                {selectedTask.notes && (
                  <div className="task-notes">
                    <h3>Notes</h3>
                    <p>{selectedTask.notes}</p>
                  </div>
                )}

                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div className="task-tags">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {selectedTask.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.assignedTeamMembers && selectedTask.assignedTeamMembers.length > 0 && (
                  <div className="task-team">
                    <h3>Team Members</h3>
                    <div className="team-members-list">
                      {selectedTask.assignedTeamMembers.map((member, index) => (
                        <div key={index} className="team-member">
                          <span className="member-role">{member.role}</span>
                          {member.notes && <span className="member-notes">{member.notes}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div className="task-subtasks-full">
                    <h3>Subtasks ({selectedTask.subtasks.filter(st => st.status === 'completed').length}/{selectedTask.subtasks.length} completed)</h3>
                    <div className="subtasks-list">
                      {selectedTask.subtasks.map((subtask, index) => (
                        <div key={subtask.id} className="subtask-item">
                          <div className="subtask-header">
                            <h4>{subtask.title}</h4>
                            <span className={`subtask-status ${subtask.status}`}>{subtask.status}</span>
                          </div>
                          <p className="subtask-description">{subtask.description}</p>
                          <div className="subtask-meta">
                            <span className="subtask-due">
                              Due: {subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString() : 'No due date'}
                            </span>
                            {subtask.estimatedHours && subtask.estimatedHours > 0 && (
                              <span className="subtask-hours">{subtask.estimatedHours}h</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="completed-tasks-section">
          <div className="section-header">
            <h3>Completed Tasks ({completedTasks.length})</h3>
            <button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="btn-toggle"
            >
              {showCompletedTasks ? 'Hide' : 'Show'} Completed
            </button>
          </div>
          
          {showCompletedTasks && (
            <div className="completed-tasks-grid">
              {completedTasks.map(task => (
                <div key={task.id} className="task-card completed">
                  <div className="task-header">
                    <h3 className="task-title completed">{task.title}</h3>
                    <div className="task-actions">
                      <button
                        onClick={() => handleRestoreTask(task.id)}
                        className="action-btn restore"
                        title="Restore Task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="action-btn delete"
                        title="Delete Task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="task-description completed">{task.description}</p>
                  <div className="task-meta">
                    <span className="task-completed-date">
                      Completed: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown'}
                    </span>
                    <span className="task-status completed">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborativeTasksHub; 