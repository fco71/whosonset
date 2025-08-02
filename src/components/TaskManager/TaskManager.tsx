import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Task, TaskViewMode, TaskFilterOptions } from './types';
import { CollaborativeTask } from '../../types/ProjectManagement';
import TaskBoard from './views/TaskBoard';
import TaskForm from './components/TaskForm';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Temporary ProjectContext mock - replace with actual implementation
const useProject = () => ({
  currentUser: { 
    uid: 'temp-user-id',
    activeProjectId: 'temp-project-id' 
  },
  currentProject: { 
    id: 'temp-project-id',
    name: 'Temporary Project',
    description: 'A temporary project for development',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'temp-user-id',
    members: []
  },
  setCurrentProject: () => {},
  isLoading: false,
  error: null
});

interface TaskManagerProps {
  projectId: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState<TaskViewMode>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null | undefined>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; avatar?: string }>>([]);
  const [filters, setFilters] = useState<TaskFilterOptions>({
    searchTerm: '',
    statuses: [],
    priorities: [],
    assignees: [],
    dueDate: { from: null, to: null },
    categories: [],
    tags: []
  });

  const { currentUser } = useProject();

  // Load tasks from Firestore
  useEffect(() => {
    if (!projectId) return;

    setIsLoading(true);
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('projectId', '==', projectId),
      where('deletedAt', '==', null)
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task));
        
        setTasks(tasksData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading tasks:', error);
        setError(error);
        setIsLoading(false);
        toast.error('Failed to load tasks');
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  // Load users
  useEffect(() => {
    // TODO: Load project members or users
    // This is a placeholder - replace with actual user loading logic
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }, [projectId]);

  const handleTaskUpdate = useCallback(async (task: Task) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        ...task,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.uid
      });
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  }, [currentUser?.uid]);

  const handleTaskCreate = useCallback(async (taskData: Partial<Task>) => {
    try {
      const newTask = {
        ...taskData,
        projectId,
        status: 'pending',
        priority: 'medium',
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.uid,
        assignees: [],
        comments: [],
        attachments: [],
        tags: [],
      };

      await addDoc(collection(db, 'tasks'), newTask);
      toast.success('Task created successfully');
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  }, [projectId, currentUser?.uid]);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return false;
    
    try {
      // Soft delete
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        deletedAt: serverTimestamp(),
        deletedBy: currentUser?.uid
      });
      
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  }, [currentUser?.uid]);

  const handleTaskSelect = useCallback((task: Task | null | undefined) => {
    setSelectedTask(task || null);
    setEditingTask(task || undefined);
    setShowTaskForm(true);
  }, []);

  const handleCreateNewTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task | null) => {
    setEditingTask(task || undefined);
    setShowTaskForm(true);
  };

  const handleFormSubmit = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await handleTaskUpdate({ ...editingTask, ...taskData } as Task);
      } else {
        await handleTaskCreate(taskData);
      }
      setShowTaskForm(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleFilterChange = (newFilters: Partial<TaskFilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const filteredTasks = tasks.filter(task => {
    // Apply filters here
    const matchesSearch = !filters.searchTerm || 
      task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.statuses.length === 0 || 
      filters.statuses.includes(task.status);
    
    const matchesPriority = filters.priorities.length === 0 || 
      filters.priorities.includes(task.priority);
    
    const matchesAssignee = filters.assignees.length === 0 || 
      (task.assignedTeamMembers || []).some(member => 
        member && filters.assignees.includes(member.userId)
      );
    
    // Check due date range
    const taskDueDate = task.dueDate ? new Date(task.dueDate).getTime() : null;
    const matchesDueDate = !filters.dueDate.from || !filters.dueDate.to || 
      (taskDueDate && 
        (!filters.dueDate.from || taskDueDate >= filters.dueDate.from.getTime()) &&
        (!filters.dueDate.to || taskDueDate <= filters.dueDate.to.getTime())
      );
    
    // Check tags
    const matchesTags = filters.tags.length === 0 || 
      (task.tags && filters.tags.some(tag => task.tags?.includes(tag)));
    
    return matchesSearch && matchesStatus && matchesPriority && 
           matchesAssignee && matchesDueDate && matchesTags;
  });

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading tasks: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <Button 
          onClick={handleCreateNewTask}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Task
        </Button>
      </div>

      <TaskBoard
        tasks={filteredTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskSelect={handleTaskSelect}
        selectedTask={selectedTask}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterOptions={filters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        error={error}
      />

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(undefined);
          }}
        />
      )}
    </div>
  );
};

export default TaskManager;
