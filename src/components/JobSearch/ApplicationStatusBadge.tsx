import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, Calendar, UserCheck } from 'lucide-react';

export interface ApplicationStatus {
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'withdrawn';
  lastUpdated?: Date;
  notes?: string;
  nextStep?: string;
  timeline?: {
    applied: Date;
    reviewed?: Date;
    shortlisted?: Date;
    interviewed?: Date;
    decision?: Date;
  };
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  showProgress?: boolean;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    progress: 0
  },
  reviewed: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle,
    progress: 25
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: UserCheck,
    progress: 50
  },
  interviewed: {
    label: 'Interviewing',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: MessageSquare,
    progress: 75
  },
  hired: {
    label: 'Hired',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    progress: 100
  },
  rejected: {
    label: 'Not Selected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    progress: 100
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
    progress: 100
  }
};

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ 
  status, 
  showProgress = true, 
  className = '' 
}) => {
  const config = statusConfig[status.status];
  const Icon = config.icon;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{config.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${config.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      {status.timeline && (
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Applied: {status.timeline.applied.toLocaleDateString()}</span>
          </div>
          {status.timeline.reviewed && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              <span>Reviewed: {status.timeline.reviewed.toLocaleDateString()}</span>
            </div>
          )}
          {status.timeline.shortlisted && (
            <div className="flex items-center gap-2">
              <UserCheck className="w-3 h-3" />
              <span>Shortlisted: {status.timeline.shortlisted.toLocaleDateString()}</span>
            </div>
          )}
          {status.timeline.interviewed && (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              <span>Interviewed: {status.timeline.interviewed.toLocaleDateString()}</span>
            </div>
          )}
          {status.timeline.decision && (
            <div className="flex items-center gap-2">
              {status.status === 'hired' ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : (
                <XCircle className="w-3 h-3 text-red-600" />
              )}
              <span>Decision: {status.timeline.decision.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Next Step */}
      {status.nextStep && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <strong>Next:</strong> {status.nextStep}
        </div>
      )}

      {/* Notes */}
      {status.notes && (
        <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
          {status.notes}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusBadge; 