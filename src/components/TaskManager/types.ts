export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskViewMode = 'kanban' | 'list' | 'calendar' | 'timeline';

export interface TaskTeamMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  createdAt: Date | any; // Firestore timestamp
  updatedAt: Date | any; // Firestore timestamp
  createdBy: string;
  updatedBy?: string;
  projectId: string;
  assignees?: TaskTeamMember[];
  tags?: string[];
  comments?: any[];
  attachments?: any[];
  deletedAt?: Date | null;
  deletedBy?: string;
  estimatedTime?: number; // in minutes
  timeSpent?: number; // in minutes
  parentTaskId?: string;
  subTasks?: string[];
  category?: string;
  labels?: string[];
  customFields?: Record<string, any>;
  assignedTeamMembers?: Array<{
    userId: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskFilterOptions {
  searchTerm: string;
  statuses: string[];
  priorities: string[];
  assignees: string[];
  dueDate: { from: Date | null; to: Date | null };
  categories: string[];
  tags: string[];
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

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  status: TaskStatus;
  color: string;
  icon: string;
  tasks: Task[]; // For runtime use in KanbanView
}

export interface KanbanBoardData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  assignedTo?: string[];
  tags?: string[];
}

export interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  isSelected?: boolean;
  className?: string;
}
