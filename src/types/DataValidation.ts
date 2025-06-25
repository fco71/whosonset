export interface DataConflict {
  id: string;
  entityType: 'project' | 'crew_profile' | 'job_posting';
  entityId: string;
  field: string;
  currentValue: any;
  proposedValue: any;
  proposedBy: string;
  proposedAt: any;
  status: 'pending' | 'approved' | 'rejected' | 'merged';
  reviewedBy?: string;
  reviewedAt?: any;
  reviewNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string[]; // URLs to supporting documents
}

export interface DataValidationRule {
  id: string;
  entityType: string;
  field: string;
  ruleType: 'required' | 'format' | 'range' | 'unique' | 'custom';
  ruleDefinition: any;
  errorMessage: string;
  severity: 'warning' | 'error' | 'critical';
  isActive: boolean;
}

export interface DataAuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'validate' | 'approve' | 'reject';
  performedBy: string;
  performedAt: any;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataQualityReport {
  id: string;
  entityType: string;
  entityId: string;
  score: number; // 0-100
  issues: {
    field: string;
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedFix?: string;
  }[];
  lastChecked: any;
  nextCheckDue: any;
} 