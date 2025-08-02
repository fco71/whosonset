export interface CrewAvailability {
  id: string;
  crewMemberId: string;
  startDate: string;
  endDate: string;
  status: 'available' | 'unavailable' | 'partially_available';
  reason?: string;
  location?: string;
  notes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface AvailabilityRequest {
  id: string;
  requesterId: string;
  crewMemberId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  role: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  respondedAt?: any;
  responseMessage?: string;
}

export interface AvailabilityConflict {
  id: string;
  crewMemberId: string;
  projectId: string;
  conflictingDates: {
    startDate: string;
    endDate: string;
  }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  resolvedAt?: any;
  resolvedBy?: string;
}

export interface AvailabilityCalendar {
  id: string;
  crewMemberId: string;
  year: number;
  month: number;
  availability: {
    [date: string]: 'available' | 'unavailable' | 'partially_available' | 'booked';
  };
  lastUpdated: any;
} 