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