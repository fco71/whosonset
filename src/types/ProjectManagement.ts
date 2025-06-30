export interface ProjectCrew {
  id: string;
  projectId: string;
  crewMemberId: string;
  role: string;
  department: string;
  startDate: string;
  endDate?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  salary?: number;
  contractUrl?: string;
  notes?: string;
  addedBy: string;
  addedAt: any;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'delayed';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  notes?: string;
}

export interface ProjectTimeline {
  id: string;
  projectId: string;
  phase: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  description: string;
  dependencies?: string[]; // IDs of other phases this depends on
  assignedCrew?: string[]; // Crew member IDs
  budget?: number;
  notes?: string;
  milestones: ProjectMilestone[];
}

export interface ProjectBudget {
  id: string;
  projectId: string;
  totalBudget: number;
  spentBudget: number;
  currency: string;
  categories: {
    [category: string]: {
      budgeted: number;
      spent: number;
      notes?: string;
    };
  };
  lastUpdated: any;
}

export interface BreakdownTag {
  id: string;
  type: 'prop' | 'cast' | 'location' | 'costume' | 'vehicle' | 'equipment' | 'sound' | 'effect';
  name: string;
  description?: string;
  scene?: string;
  pageNumber?: number;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'acquired' | 'in_progress' | 'completed';
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  tags: string[];
  createdAt: any;
  createdBy: string;
  updatedAt: any;
}

export interface BreakdownElement {
  id: string;
  documentId: string;
  elementType: 'prop' | 'cast' | 'location' | 'costume' | 'vehicle' | 'equipment' | 'sound' | 'effect';
  name: string;
  description?: string;
  scene?: string;
  pageNumber?: number;
  lineNumber?: number;
  context?: string; // The surrounding text where this element appears
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'acquired' | 'in_progress' | 'completed';
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  tags: string[];
  createdAt: any;
  createdBy: string;
  updatedAt: any;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  category: 'script' | 'contract' | 'schedule' | 'budget' | 'other';
  uploadedBy: string;
  uploadedAt: any;
  description?: string;
  isPublic: boolean; // Whether crew members can see this
  version: string;
  createdAt: any;
  tags: string[];
  downloadURL: string;
  title: string;
  fileSize: number;
  notes?: string;
  // New fields for screenplay breakdown
  isScreenplay?: boolean;
  breakdownElements?: BreakdownElement[];
  totalScenes?: number;
  totalPages?: number;
  breakdownStatus?: 'not_started' | 'in_progress' | 'completed';
  lastBreakdownAt?: any;
}

export interface ProjectSchedule {
  id: string;
  projectId: string;
  date: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  requiredCrew: string[]; // Crew member IDs
  equipment?: string[];
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// Collaborative Tasks System
export interface CollaborativeTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  completedAt?: any;
  assignedTeamMembers: TaskTeamMember[];
  subtasks: TaskSubtask[];
  reminders: TaskReminder[];
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  dependencies: string[]; // IDs of other tasks this depends on
  estimatedHours?: number;
  actualHours?: number;
  category: 'pre_production' | 'production' | 'post_production' | 'marketing' | 'distribution' | 'other';
  location?: string;
  budget?: number;
  notes?: string;
}

export interface TaskTeamMember {
  userId: string;
  role: 'lead' | 'assistant' | 'reviewer' | 'contributor';
  assignedAt: any;
  assignedBy: string;
  status: 'assigned' | 'accepted' | 'declined' | 'completed';
  subtasks: string[]; // IDs of subtasks assigned to this member
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
}

export interface TaskSubtask {
  id: string;
  taskId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string; // User ID
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: any;
  updatedAt: any;
  completedAt?: any;
  notes?: string;
  attachments: string[];
  dependencies: string[]; // IDs of other subtasks this depends on
}

export interface TaskReminder {
  id: string;
  taskId: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  triggerTime: any; // When the reminder should be sent
  message: string;
  recipients: string[]; // User IDs
  isSent: boolean;
  sentAt?: any;
  createdAt: any;
  createdBy: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  type: 'comment' | 'status_update' | 'file_attachment' | 'time_log';
  attachments?: string[];
  createdAt: any;
  updatedAt?: any;
  isEdited: boolean;
  mentions: string[]; // User IDs mentioned in the comment
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: 'pre_production' | 'production' | 'post_production' | 'marketing' | 'distribution' | 'other';
  defaultPriority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  subtaskTemplates: SubtaskTemplate[];
  createdBy: string;
  createdAt: any;
  isPublic: boolean;
  tags: string[];
}

export interface SubtaskTemplate {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  requiredRole?: string;
  order: number;
}

export interface TaskReport {
  id: string;
  projectId: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  generatedBy: string;
  generatedAt: any;
  data: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    tasksByStatus: { [status: string]: number };
    tasksByPriority: { [priority: string]: number };
    tasksByCategory: { [category: string]: number };
    teamMemberWorkload: { [userId: string]: { assigned: number; completed: number; hours: number } };
    averageCompletionTime: number;
    topPerformers: string[];
    bottlenecks: string[];
  };
} 