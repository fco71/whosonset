import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  getDocs, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { 
  CollaborativeTask, 
  TaskTeamMember
} from '../../types/ProjectManagement';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Plus, List, Calendar, LayoutGrid, BarChart2, Filter, Search, Loader2 } from 'lucide-react';
import TaskCard from '../TaskManager/components/TaskCard';
import TaskForm from './TaskForm';
import Select from '../ui/Select';
import { Input } from '../ui/Input';
// Tabs component not found, using a simple div with buttons for now
import Card from '../ui/Card';

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
type TaskCategory = 'pre_production' | 'production' | 'post_production' | 'marketing' | 'distribution' | 'other';

interface EnhancedTasksHubProps {
  projectId: string;
}

type ViewMode = 'list' | 'calendar' | 'kanban' | 'analytics';

interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  searchTerm: string;
  assignedToMe: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const EnhancedTasksHub: React.FC<EnhancedTasksHubProps> = ({ projectId }) => {
  // State
  const [tasks, setTasks] = useState<CollaborativeTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTask, setSelectedTask] = useState<CollaborativeTask | null>(null);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<CollaborativeTask | undefined>(undefined);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    searchTerm: '',
    assignedToMe: false
  });

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'));
        const snapshot = await getDocs(usersQuery);
        const usersData: Record<string, UserData> = {};
        
        snapshot.docs.forEach((doc: any) => {
          const userData = doc.data();
          usersData[doc.id] = {
            id: doc.id,
            name: userData.displayName || (userData.email ? userData.email.split('@')[0] : 'User'),
            email: userData.email || '',
            avatar: userData.photoURL
          };
        });
        
        setUsers(usersData);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      }
    };

    loadUsers();
  }, []);

  // Load tasks
  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const tasksQuery = query(
      collection(db, 'collaborativeTasks'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        try {
          const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamps to Date objects
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            dueDate: doc.data().dueDate?.toDate()
          })) as CollaborativeTask[];
          
          setTasks(tasksData);
          setError(null);
        } catch (err) {
          console.error('Error processing tasks:', err);
          setError('Failed to process tasks');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  // Filter tasks based on filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      
      // Category filter
      if (filters.category !== 'all' && task.category !== filters.category) {
        return false;
      }
      
      // Assigned to me filter
      if (filters.assignedToMe && auth.currentUser) {
        const isAssigned = task.assignedTeamMembers?.some(
          member => member.userId === auth.currentUser?.uid
        );
        if (!isAssigned) return false;
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower) || false;
        const matchesTags = task.tags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ) || false;
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, filters, auth.currentUser]);

  // Handle task creation
  const handleSubmit = useCallback(async (taskData: Partial<CollaborativeTask>) => {
    if (!auth.currentUser) return;
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('You must be logged in to create tasks');
        return;
      }

      const newTask: Omit<CollaborativeTask, 'id'> = {
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        status: 'pending',
        priority: taskData.priority || 'medium',
        category: taskData.category || 'other',
        projectId: projectId,
        createdBy: currentUser.uid,
        assignedTeamMembers: taskData.assignedTeamMembers || [],
        dueDate: taskData.dueDate || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: taskData.tags || [],
        // Add other default values as needed
      };

      await addDoc(collection(db, 'collaborativeTasks'), newTask);
      toast.success('Task created successfully');
      return true;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
      throw err;
    }
  }, [projectId]);

  // Handle task update
  const handleUpdateTask = useCallback(async (taskId: string, updates: Partial<CollaborativeTask>) => {
    try {
      const taskRef = doc(db, 'collaborativeTasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
      toast.success('Task updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      throw err;
    }
  }, []);

  // Handle task deletion
  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return false;
    
    try {
      await deleteDoc(doc(db, 'collaborativeTasks', taskId));
      toast.success('Task deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      throw err;
    }
  }, []);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (task: CollaborativeTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return handleUpdateTask(task.id, { status: newStatus });
  }, [handleUpdateTask]);

  // Render task list view
  const renderTaskListView = () => (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <div key={task.id} className="mb-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {task.status}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                  {task.priority}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTask(task);
                  setShowTaskForm(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Create your first task to get started!
        </div>
      )}
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Project Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your team's tasks in one place
          </p>
        </div>
        <Button onClick={() => {
          setEditingTask(undefined);
          setShowTaskForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Simple view mode selector since Tabs component is missing */}
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={viewMode === 'list' ? 'default' : 'outline'} 
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button 
          variant={viewMode === 'kanban' ? 'default' : 'outline'} 
          onClick={() => setViewMode('kanban')}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Kanban
        </Button>
        <Button 
          variant={viewMode === 'calendar' ? 'default' : 'outline'} 
          onClick={() => setViewMode('calendar')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Filters</h3>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value as TaskStatus | 'all'})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value as TaskPriority | 'all'})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value as TaskCategory | 'all'})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="pre_production">Pre-production</option>
                <option value="production">Production</option>
                <option value="post_production">Post-production</option>
                <option value="marketing">Marketing</option>
                <option value="distribution">Distribution</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search tasks..."
                  className="block w-full rounded-md border-gray-300 pl-8 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={filters.assignedToMe}
                onChange={(e) => setFilters({...filters, assignedToMe: e.target.checked})}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned to me</span>
            </label>
          </div>
        </div>
      </div>

      {/* Task List */}
      {viewMode === 'list' && renderTaskListView()}
      
      {/* Kanban View - Placeholder */}
      {viewMode === 'kanban' && (
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h3 className="font-medium mb-2">Kanban View</h3>
          <p className="text-muted-foreground text-sm">
            Kanban view is coming soon. For now, please use the list view.
          </p>
        </div>
      )}
      
      {/* Calendar View - Placeholder */}
      {viewMode === 'calendar' && (
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h3 className="font-medium mb-2">Calendar View</h3>
          <p className="text-muted-foreground text-sm">
            Calendar view is coming soon. For now, please use the list view.
          </p>
        </div>
      )}
      
      {/* Analytics View - Placeholder */}
      {viewMode === 'analytics' && (
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h3 className="font-medium mb-2">Analytics</h3>
          <p className="text-muted-foreground text-sm">
            Task analytics are coming soon. For now, please use the list view.
          </p>
        </div>
      )}
      
      {/* Task Form Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <TaskForm
              task={editingTask}
              onSubmit={async (data) => {
                try {
                  await handleSubmit(data);
                  setShowTaskForm(false);
                  setEditingTask(undefined);
                } catch (error) {
                  console.error('Error saving task:', error);
                  toast.error('Failed to save task');
                }
              }}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(undefined);
              }}
              projectId={projectId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTasksHub;
