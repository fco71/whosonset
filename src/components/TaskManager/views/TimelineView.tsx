import React from 'react';
import { format, isToday, isTomorrow, isThisWeek, isPast, parseISO } from 'date-fns';
import { Task, TaskTeamMember } from '../types';
import { cn } from '../../../lib/utils';

type DateLike = Date | string | { toDate: () => Date };

interface GroupedTasks {
  [key: string]: Task[];
}

interface TaskGroup {
  date: string;
  tasks: Task[];
}

interface TimelineViewProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  onTaskSelect,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const getFormattedDate = (dateInput: DateLike): string => {
    let date: Date;
    
    if (dateInput === null || dateInput === undefined) {
      return 'No date';
    }
    
    // Handle Firestore Timestamp
    if (typeof dateInput === 'object' && 'toDate' in dateInput) {
      date = dateInput.toDate();
    } 
    // Handle string dates
    else if (typeof dateInput === 'string') {
      date = parseISO(dateInput);
    } 
    // Already a Date object
    else {
      date = dateInput;
    }
    
    // Handle invalid dates
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d, yyyy');
  };

  const groupTasksByDate = (tasks: Task[]): GroupedTasks => {
    return tasks.reduce<GroupedTasks>((acc, task) => {
      if (!task.dueDate) {
        const key = 'No due date';
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
        return acc;
      }
      
      try {
        const date = task.dueDate;
        const key = getFormattedDate(date);
        
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(task);
      } catch (error) {
        console.error('Error processing task due date:', error);
        // Fallback for invalid dates
        const key = 'Invalid date';
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
      }
      
      return acc;
    }, {});
  };

  const groupedTasks = groupTasksByDate(tasks);
  // Type guard to check if a value is a Firestore Timestamp
  const isFirestoreTimestamp = (value: unknown): value is { toDate: () => Date } => {
    return value !== null && 
           typeof value === 'object' && 
           value !== undefined &&
           'toDate' in value && 
           typeof (value as { toDate: unknown }).toDate === 'function';
  };

  // Type guard to check if a value is a valid date
  const isValidDate = (date: unknown): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const getTaskDate = (task: Task): Date => {
    const dueDate = task.dueDate;
    if (!dueDate) return new Date(0);
    
    // Handle string dates
    if (typeof dueDate === 'string') {
      const parsedDate = parseISO(dueDate);
      return isValidDate(parsedDate) ? parsedDate : new Date(0);
    }
    
    // Handle Firestore Timestamp
    if (isFirestoreTimestamp(dueDate)) {
      const date = dueDate.toDate();
      return isValidDate(date) ? date : new Date(0);
    }
    
    // Already a Date object
    if (isValidDate(dueDate)) {
      return dueDate;
    }
    
    // Fallback for any other case
    return new Date(0);
  };

  // Convert grouped tasks to an array of TaskGroup objects and sort them
  const sortedGroups: TaskGroup[] = Object.entries(groupedTasks)
    .map(([date, taskList]): TaskGroup => ({
      date,
      tasks: [...taskList].sort((taskA: Task, taskB: Task) => {
        try {
          const dateA = getTaskDate(taskA);
          const dateB = getTaskDate(taskB);
          return dateA.getTime() - dateB.getTime();
        } catch (error) {
          console.error('Error sorting tasks by date:', error);
          return 0;
        }
      })
    }))
    .sort((a: TaskGroup, b: TaskGroup) => {
      if (a.date === 'No due date') return 1;
      if (b.date === 'No due date') return -1;
      if (a.date === 'Invalid date') return 1;
      if (b.date === 'Invalid date') return -1;
      
      try {
        const dateA = a.date.includes('-') ? parseISO(a.date) : new Date(a.date);
        const dateB = b.date.includes('-') ? parseISO(b.date) : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      } catch {
        return a.date.localeCompare(b.date);
      }
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'in-review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {sortedGroups.map((group: TaskGroup) => (
        <div key={group.date} className="relative">
          <div className="sticky top-0 z-10 bg-white pb-2">
            <h3 className="text-lg font-medium text-gray-900">{group.date}</h3>
            <div className="mt-1 h-0.5 bg-gray-200" />
          </div>
          
          <div className="mt-2 space-y-2">
            {group.tasks.map((task: Task) => {
              const getTaskDueDate = (dueDate: unknown): Date | null => {
                if (!dueDate) return null;
                
                if (typeof dueDate === 'string') {
                  return parseISO(dueDate);
                }
                
                if (isFirestoreTimestamp(dueDate)) {
                  return dueDate.toDate();
                }
                
                if (dueDate instanceof Date) {
                  return dueDate;
                }
                
                return null;
              };
              
              const taskDueDate = getTaskDueDate(task.dueDate);
              
              const isOverdue = taskDueDate && isPast(taskDueDate) && task.status !== 'completed';
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center p-4 rounded-lg border hover:shadow-md transition-shadow duration-200',
                    isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white',
                    'cursor-pointer',
                    'group'
                  )}
                  onClick={() => onTaskSelect(task)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={(e) => {
                        e.stopPropagation();
                        onTaskUpdate({
                          ...task,
                          status: e.target.checked ? 'completed' : 'pending',
                        });
                      }}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        'text-base font-medium',
                        task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900',
                        'truncate'
                      )}>
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {task.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            High
                          </span>
                        )}
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          getStatusColor(task.status)
                        )}>
                          {task.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    {(task.tags?.length > 0 || isOverdue) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {isOverdue && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                        {task.tags?.map((tag: string) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskDelete(task.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new task.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
