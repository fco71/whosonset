// src/models/Project.ts
export interface Project {
    id: string;
    projectName: string;
    productionLocations: ProductionLocation[];
    productionCompany: string;
    status: 'development' | 'pre_production' | 'production' | 'post_production' | 'completed' | 'cancelled';
    logline: string;
    synopsis: string;
    startDate: string;
    endDate: string;
    genre: string;
    director: string;
    producer: string;
    coverImageUrl: string;
    projectWebsite: string;
    productionBudget: string;
    productionCompanyContact: string;
    owner_uid: string;
    createdAt?: any; // serverTimestamp
    genres?: string[];
    
    // New enhanced fields
    hierarchy: ProjectHierarchy;
    verificationStatus: 'pending' | 'verified' | 'rejected' | 'flagged';
    verifiedBy?: string;
    verifiedAt?: any;
    verificationNotes?: string;
    
    // Project management fields
    phases?: ProjectPhase[];
    budget?: ProjectBudget;
    documents?: ProjectDocument[];
    schedule?: ProjectSchedule[];
    
    // Access control
    accessLevel: 'public' | 'crew_only' | 'private';
    allowedViewers?: string[];
    isExclusive: boolean; // Paid tier feature
    
    // Metadata
    tags?: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    lastUpdated: any;
    updateCount: number;
}

export interface ProductionLocation {
    country: string;
    city?: string;
}

export interface ProjectHierarchy {
    level: 'junior' | 'mid' | 'senior' | 'executive';
    department: string;
    role: string;
    permissions: string[];
    canEdit: boolean;
    canApprove: boolean;
    canInvite: boolean;
}

export interface ProjectPhase {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'planned' | 'in_progress' | 'completed' | 'delayed';
    description: string;
    budget?: number;
    crewRequired?: string[];
    dependencies?: string[];
}

export interface ProjectBudget {
    totalBudget: number;
    spentBudget: number;
    categories: {
        [category: string]: {
            budgeted: number;
            spent: number;
            notes?: string;
        };
    };
    currency: string;
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
}

export interface ProjectSchedule {
    id: string;
    date: string;
    location: string;
    description: string;
    startTime: string;
    endTime: string;
    requiredCrew: string[];
    equipment?: string[];
    notes?: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}