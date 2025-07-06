import { CollaborativeTask, TaskComment as BaseTaskComment, TaskReminder as BaseTaskReminder, TaskSubtask as BaseTaskSubtask, TaskTeamMember as BaseTaskTeamMember } from '../../../types/ProjectManagement';

// Re-export base types with any necessary extensions
export type TaskComment = BaseTaskComment;
export type TaskReminder = BaseTaskReminder;
export type TaskSubtask = BaseTaskSubtask;

export interface TaskTeamMember extends BaseTaskTeamMember {
  name?: string;
  avatar?: string;
  email?: string;
}

export type TaskViewMode = 'kanban' | 'list' | 'calendar' | 'timeline';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task extends Omit<CollaborativeTask, 'status' | 'priority' | 'comments' | 'assignedTeamMembers'> {
  status: TaskStatus;
  priority: TaskPriority;
  comments: TaskComment[];
  reminders: TaskReminder[];
  subtasks: TaskSubtask[];
  assignedTeamMembers: TaskTeamMember[];
  assignees: TaskTeamMember[]; // For backward compatibility
  isExpanded?: boolean;
  isSelected?: boolean;
}

export interface Column {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
  color: string;
  icon: string;
}

export interface TaskFilterOptions {
  searchTerm: string;
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  assignees: string[];
  dueDate: {
    from: Date | null;
    to: Date | null;
  };
  categories: string[];
  tags: string[];
}

export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
  icon?: string;
}

export interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskSelect: (task: Task) => void;
  selectedTask?: Task | null;
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
  filterOptions: TaskFilterOptions;
  onFilterChange: (filters: Partial<TaskFilterOptions>) => void;
  isLoading: boolean;
  error: Error | null;
}

export interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
  isSelected: boolean;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
  isOpen: boolean;
  projectId: string;
  users: Array<{ id: string; name: string; email: string; avatar?: string }>;
}

export interface TaskFiltersProps {
  filters: TaskFilterOptions;
  onFilterChange: (filters: Partial<TaskFilterOptions>) => void;
  onReset: () => void;
  users: Array<{ id: string; name: string; email: string; avatar?: string }>;
}

export interface TaskViewSwitcherProps {
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
}
