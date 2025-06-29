import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { CollaborativeTask, TaskSubtask, TaskTeamMember, TaskReminder, TaskComment } from '../../types/ProjectManagement';
import TaskForm from './TaskForm';
import './CollaborativeTasksHub.scss';
import { toast } from 'react-hot-toast';

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
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState<{[key: string]: {name: string, email: string, avatar?: string}}>({});

  // Add a helper for status options
  const statusOptions = [
    { value: 'pending', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'overdue', label: 'Overdue' },
  ];

  useEffect(() => {
    if (projectId) {
      loadTasks();
      loadUsers();
    }
  }, [projectId]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const loadUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const usersData: {[key: string]: {name: string, email: string, avatar?: string}} = {};
      snapshot.docs.forEach(doc => {
        const userData = doc.data();
        usersData[doc.id] = {
          name: userData.displayName || userData.email || 'Unknown User',
          email: userData.email || '',
          avatar: userData.photoURL || undefined
        };
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

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
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('You must be logged in to create tasks');
        return;
      }

      const newTask: CollaborativeTask = {
        id: Date.now().toString(),
        projectId,
        title: taskData.title || '',
        description: taskData.description || '',
        status: 'pending',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || '',
        createdBy: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTeamMembers: taskData.assignedTeamMembers || [],
        subtasks: taskData.subtasks || [],
        reminders: [],
        tags: taskData.tags || [],
        attachments: [],
        comments: [],
        dependencies: [],
        estimatedHours: taskData.estimatedHours,
        category: taskData.category || 'other',
        location: taskData.location,
        budget: taskData.budget,
        notes: taskData.notes
      };

      // Add to Firestore
      await addDoc(collection(db, 'collaborativeTasks'), newTask);
      
      // Send notifications to assigned team members
      const assignedMemberIds = newTask.assignedTeamMembers
        .filter(member => member.userId)
        .map(member => member.userId);
      
      if (assignedMemberIds.length > 0) {
        await sendTaskAssignmentNotification(newTask.id, assignedMemberIds);
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
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
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDoc(doc(db, 'collaborativeTasks', taskId));
        setSelectedTask(null);
        setShowTaskDetails(false);
        setExpandedTaskId(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again.');
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
      toast.error('Failed to complete task. Please try again.');
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
      toast.error('Failed to start task. Please try again.');
    }
  };

  const handleEditTask = (task: CollaborativeTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setShowTaskDetails(false);
    setExpandedTaskId(null);
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
      toast.error('Failed to restore task. Please try again.');
    }
  };

  const handleAddComment = async (taskId: string) => {
    if (!newComment.trim() || !auth.currentUser) return;

    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const comment: TaskComment = {
        id: Date.now().toString(),
        taskId,
        userId: auth.currentUser.uid,
        content: newComment.trim(),
        type: 'comment',
        createdAt: new Date(),
        isEdited: false,
        mentions: []
      };

      const updatedComments = [...(task.comments || []), comment];
      await updateDoc(taskRef, {
        comments: updatedComments,
        updatedAt: new Date()
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const overdue = tasks.filter(task => {
      if (task.status === 'completed' || !task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return { total, completed, inProgress, overdue };
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const activeTasks = filteredTasks.filter(task => task.status !== 'completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  const stats = getTaskStats();

  const getMemberAvatar = (userId: string) => {
    const user = users[userId];
    if (user?.avatar) {
      return (
        <img 
          src={user.avatar} 
          alt={user.name || 'User'} 
          className="member-avatar"
        />
      );
    }
    
    // Generate colored bubble with initials
    const name = user?.name || userId;
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    const colorIndex = userId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return (
      <div className="member-avatar-bubble" style={{ backgroundColor: colors[colorIndex] }}>
        {initials}
      </div>
    );
  };

  const getMemberName = (userId: string) => {
    const user = users[userId];
    return user?.name || userId;
  };

  // Notification system for task assignments
  const sendTaskAssignmentNotification = async (taskId: string, assignedMembers: string[]) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Create notifications for assigned members
      const notifications = assignedMembers.map(memberId => ({
        id: `${taskId}-${memberId}-${Date.now()}`,
        userId: memberId,
        type: 'task_assignment',
        title: 'New Task Assignment',
        message: `You have been assigned to task: ${task.title}`,
        taskId: taskId,
        projectId: projectId,
        createdAt: new Date(),
        isRead: false,
        priority: 'medium'
      }));

      // Here you would typically save notifications to Firestore
      console.log('Sending task assignment notifications:', notifications);
      
      // Show browser notifications if permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        notifications.forEach(notification => {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/my-icon.png',
            badge: '/my-icon.png',
            tag: notification.id,
            requireInteraction: false,
            silent: false
          });
        });
      } else if ('Notification' in window && Notification.permission === 'default') {
        // Request permission if not granted
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          notifications.forEach(notification => {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/my-icon.png'
            });
          });
        }
      }
    } catch (error) {
      console.error('Error sending task assignment notifications:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await handleUpdateTask(taskId, { status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue' });
  };

  if (loading) {
    return (
      <div className="collaborative-tasks-hub">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
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
          <div className="search-container">
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
      </div>

      {/* Content */}
      <div className="tasks-content">
        {viewMode === 'list' && (
          <div className="tasks-list">
            {activeTasks.length === 0 ? (
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
                  <div key={task.id} className={`task-card ${expandedTaskId === task.id ? 'expanded' : ''}`}>
                    <div className="task-header" onClick={() => toggleTaskExpansion(task.id)}>
                      <div className="task-title-section">
                        <h3 className="task-title">{task.title}</h3>
                        <div className="task-members">
                          {task.assignedTeamMembers && task.assignedTeamMembers.length > 0 ? (
                            <div className="members-avatars">
                              {task.assignedTeamMembers.slice(0, 3).map((member, index) => (
                                <div key={member.userId} className="member-avatar-container" title={getMemberName(member.userId)}>
                                  {getMemberAvatar(member.userId)}
                                </div>
                              ))}
                              {task.assignedTeamMembers.length > 3 && (
                                <div className="member-count" title={`${task.assignedTeamMembers.length - 3} more members`}>
                                  +{task.assignedTeamMembers.length - 3}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="no-members">No members assigned</span>
                          )}
                        </div>
                      </div>
                      <div className="task-actions">
                        <span className={`task-status ${task.status}`}>{task.status}</span>
                        <svg className={`expand-icon ${expandedTaskId === task.id ? 'expanded' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="task-preview">
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className="task-due-date">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </span>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <span className="subtasks-count">{task.subtasks.length} subtasks</span>
                        )}
                      </div>
                      <div className="task-quick-actions">
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue')}
                          className={`task-status-dropdown status-${task.status}`}
                          disabled={task.status === 'completed'}
                          title="Change task status"
                          style={{ minWidth: 120, borderRadius: 6, padding: '0.25rem 0.5rem', fontWeight: 500 }}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {task.status === 'completed' && (
                          <span className="task-status-badge completed" style={{ marginLeft: 8, color: '#10b981', fontWeight: 600 }}>✔ Completed</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                          className="btn-quick-action btn-edit"
                          title="Edit Task"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>

                    {/* Expanded Task Details */}
                    {expandedTaskId === task.id && (
                      <div className="task-expanded-details">
                        <div className="task-details-section">
                          <div className="task-info-grid">
                            <div className="info-item">
                              <span className="info-label">Priority:</span>
                              <span className={`info-value priority ${task.priority}`}>{task.priority}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Category:</span>
                              <span className="info-value">{task.category}</span>
                            </div>
                            {task.estimatedHours && (
                              <div className="info-item">
                                <span className="info-label">Estimated Hours:</span>
                                <span className="info-value">{task.estimatedHours}h</span>
                              </div>
                            )}
                            {task.location && (
                              <div className="info-item">
                                <span className="info-label">Location:</span>
                                <span className="info-value">{task.location}</span>
                              </div>
                            )}
                          </div>

                          {task.notes && (
                            <div className="task-notes">
                              <h4>Notes</h4>
                              <p>{task.notes}</p>
                            </div>
                          )}

                          {task.tags && task.tags.length > 0 && (
                            <div className="task-tags">
                              <h4>Tags</h4>
                              <div className="tags-list">
                                {task.tags.map((tag, index) => (
                                  <span key={index} className="tag">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {task.assignedTeamMembers && task.assignedTeamMembers.length > 0 && (
                            <div className="task-team">
                              <h4>Team Members</h4>
                              <div className="team-members-list">
                                {task.assignedTeamMembers.map((member, index) => (
                                  <div key={member.userId} className="team-member-item">
                                    <div className="member-info">
                                      {getMemberAvatar(member.userId)}
                                      <div className="member-details">
                                        <span className="member-name">{getMemberName(member.userId)}</span>
                                        <span className="member-role">{member.role}</span>
                                      </div>
                                    </div>
                                    {member.notes && <span className="member-notes">{member.notes}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="task-subtasks">
                              <h4>Subtasks ({task.subtasks.filter(st => st.status === 'completed').length}/{task.subtasks.length} completed)</h4>
                              <div className="subtasks-list">
                                {task.subtasks.map((subtask, index) => (
                                  <div key={subtask.id} className="subtask-item">
                                    <div className="subtask-header">
                                      <h5>{subtask.title}</h5>
                                      <span className={`subtask-status ${subtask.status}`}>{subtask.status}</span>
                                    </div>
                                    <p className="subtask-description">{subtask.description}</p>
                                    <div className="subtask-meta">
                                      <span className="subtask-due">
                                        Due: {subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString() : 'No due date'}
                                      </span>
                                      {subtask.estimatedHours && (
                                        <span className="subtask-hours">{subtask.estimatedHours}h</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Comments Section */}
                        <div className="task-comments-section">
                          <h4>Comments</h4>
                          <div className="comments-list">
                            {task.comments && task.comments.length > 0 ? (
                              task.comments.map((comment, index) => (
                                <div key={comment.id} className="comment-item">
                                  <div className="comment-header">
                                    <div className="comment-author">
                                      {getMemberAvatar(comment.userId)}
                                      <span className="author-name">{getMemberName(comment.userId)}</span>
                                    </div>
                                    <span className="comment-date">
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="comment-content">{comment.content}</p>
                                </div>
                              ))
                            ) : (
                              <p className="no-comments">No comments yet. Be the first to add one!</p>
                            )}
                          </div>
                          
                          <div className="add-comment">
                            <textarea
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="comment-input"
                              rows={3}
                            />
                            <div className="comment-actions">
                              <button
                                onClick={() => handleAddComment(task.id)}
                                disabled={!newComment.trim()}
                                className="btn-primary"
                              >
                                Add Comment
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Task Actions */}
                        <div className="task-expanded-actions">
                          <select
                            value={task.status}
                            onChange={e => handleStatusChange(task.id, e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue')}
                            className={`task-status-dropdown status-${task.status}`}
                            disabled={task.status === 'completed'}
                            title="Change task status"
                            style={{ minWidth: 120, borderRadius: 6, padding: '0.25rem 0.5rem', fontWeight: 500 }}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          {task.status === 'completed' && (
                            <span className="task-status-badge completed" style={{ marginLeft: 8, color: '#10b981', fontWeight: 600 }}>✔ Completed</span>
                          )}
                          <button
                            onClick={() => handleEditTask(task)}
                            className="btn-secondary"
                          >
                            Edit Task
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="btn-danger"
                          >
                            Delete Task
                          </button>
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