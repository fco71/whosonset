import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Task, TaskViewMode, TaskFilterOptions } from './types';
import TaskBoard from './views/TaskBoard';
import TaskForm from './components/TaskForm';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useProject } from '../../contexts/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';

interface TaskManagerProps {
  projectId: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<TaskViewMode>('kanban');
  const [filterOptions, setFilterOptions] = useState<TaskFilterOptions>({
    searchTerm: '',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    tags: [],
  });

  const { currentProject } = useProject();

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!projectId) return;

    setIsLoading(true);
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('projectId', '==', projectId));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasksList: Task[] = [];
        querySnapshot.forEach((doc) => {
          tasksList.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(tasksList);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError(err);
        setIsLoading(false);
        toast.error('Failed to load tasks');
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  // Filter tasks based on filter options
  const filteredTasks = useCallback(() => {
    return tasks.filter((task) => {
      // Filter by search term
      if (
        filterOptions.searchTerm &&
        !task.title.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (filterOptions.status && filterOptions.status !== 'all' && task.status !== filterOptions.status) {
        return false;
      }

      // Filter by priority
      if (filterOptions.priority && filterOptions.priority !== 'all' && task.priority !== filterOptions.priority) {
        return false;
      }

      // Filter by assignee
      if (filterOptions.assignee && filterOptions.assignee !== 'all') {
        if (!task.assignedTo?.includes(filterOptions.assignee)) {
          return false;
        }
      }

      // Filter by tags
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        const hasMatchingTag = task.tags?.some((tag) => filterOptions.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [tasks, filterOptions]);

  // Handle task updates
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const taskRef = doc(db, 'tasks', updatedTask.id);
      await updateDoc(taskRef, {
        ...updatedTask,
        updatedAt: serverTimestamp(),
      });
      toast.success('Task updated successfully');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Task deleted successfully');
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  // Handle task creation
  const handleTaskCreate = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!auth.currentUser) {
      toast.error('You must be logged in to create a task');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        projectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      });
      toast.success('Task created successfully');
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<TaskFilterOptions>) => {
    setFilterOptions((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterOptions({
      searchTerm: '',
      status: 'all',
      priority: 'all',
      assignee: 'all',
      tags: [],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentProject?.name || 'Project'} Tasks
          </h2>
          <p className="text-sm text-gray-500">
            Manage your project tasks and track progress
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <TaskBoard
          tasks={filteredTasks()}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskSelect={setSelectedTask}
          selectedTask={selectedTask}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Task Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <TaskForm
              task={selectedTask || undefined}
              onSubmit={selectedTask ? handleTaskUpdate : handleTaskCreate}
              onCancel={() => {
                setSelectedTask(null);
                setIsFormOpen(false);
              }}
              isSubmitting={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;
