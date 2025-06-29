export interface UserAnalytics {
  userId: string;
  profileViews: number;
  profileViewsHistory: {
    date: string;
    views: number;
    uniqueVisitors: number;
  }[];
  projectEngagement: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    averageProjectRating: number;
  };
  networkingMetrics: {
    followers: number;
    following: number;
    connections: number;
    connectionRequests: number;
    messagesSent: number;
    messagesReceived: number;
  };
  jobMetrics: {
    applicationsSubmitted: number;
    applicationsAccepted: number;
    applicationsRejected: number;
    averageResponseTime: number;
    successRate: number;
  };
  availabilityMetrics: {
    totalDaysAvailable: number;
    totalDaysBooked: number;
    bookingRate: number;
    averageBookingDuration: number;
  };
  skillMetrics: {
    topSkills: {
      skill: string;
      endorsements: number;
      projects: number;
    }[];
    skillGrowth: {
      skill: string;
      growthRate: number;
      newEndorsements: number;
    }[];
  };
  earningsMetrics: {
    totalEarnings: number;
    averageRate: number;
    highestRate: number;
    earningsByMonth: {
      month: string;
      earnings: number;
      projects: number;
    }[];
  };
  lastUpdated: any;
}

export interface ProjectAnalytics {
  projectId: string;
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    applicationsReceived: number;
    crewMembersHired: number;
    budgetUtilization: number;
    timelineProgress: number;
  };
  engagementMetrics: {
    viewsByDay: {
      date: string;
      views: number;
      uniqueVisitors: number;
    }[];
    applicationsByDay: {
      date: string;
      applications: number;
      qualifiedApplications: number;
    }[];
    socialShares: number;
    bookmarks: number;
  };
  crewMetrics: {
    totalCrewMembers: number;
    crewByDepartment: {
      department: string;
      count: number;
      averageRate: number;
    }[];
    crewRetentionRate: number;
    averageCrewRating: number;
  };
  budgetMetrics: {
    totalBudget: number;
    spentBudget: number;
    remainingBudget: number;
    budgetByCategory: {
      category: string;
      budgeted: number;
      spent: number;
      variance: number;
    }[];
    costOverruns: number;
    savings: number;
  };
  timelineMetrics: {
    totalPhases: number;
    completedPhases: number;
    delayedPhases: number;
    averagePhaseDuration: number;
    criticalPathDelays: number;
    timelineEfficiency: number;
  };
  performanceMetrics: {
    onTimeDelivery: boolean;
    qualityScore: number;
    clientSatisfaction: number;
    teamProductivity: number;
    riskAssessment: 'low' | 'medium' | 'high' | 'critical';
  };
  lastUpdated: any;
}

export interface PlatformAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    activeProjects: number;
    totalJobs: number;
    activeJobs: number;
    totalConnections: number;
    totalMessages: number;
  };
  userGrowth: {
    newUsersByMonth: {
      month: string;
      newUsers: number;
      growthRate: number;
    }[];
    userRetention: {
      cohort: string;
      retentionRate: number;
      churnRate: number;
    }[];
  };
  projectMetrics: {
    projectsByStatus: {
      status: string;
      count: number;
      percentage: number;
    }[];
    projectsByGenre: {
      genre: string;
      count: number;
      averageBudget: number;
    }[];
    averageProjectDuration: number;
    projectSuccessRate: number;
  };
  jobMetrics: {
    jobsByDepartment: {
      department: string;
      count: number;
      averageSalary: number;
      fillRate: number;
    }[];
    applicationMetrics: {
      totalApplications: number;
      averageApplicationsPerJob: number;
      averageResponseTime: number;
      acceptanceRate: number;
    };
  };
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    revenueByMonth: {
      month: string;
      revenue: number;
      growthRate: number;
    }[];
    averageRevenuePerUser: number;
    premiumSubscriptions: number;
  };
  lastUpdated: any;
}

export interface AnalyticsReport {
  id: string;
  type: 'user' | 'project' | 'platform' | 'custom';
  title: string;
  description: string;
  data: any;
  filters: {
    dateRange: {
      start: string;
      end: string;
    };
    departments?: string[];
    locations?: string[];
    projectTypes?: string[];
    userTypes?: string[];
  };
  visualization: {
    type: 'chart' | 'table' | 'metric' | 'dashboard';
    config: any;
  };
  createdBy: string;
  createdAt: any;
  isPublic: boolean;
  sharedWith?: string[];
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  userId: string;
  widgets: {
    id: string;
    type: 'metric' | 'chart' | 'table' | 'list';
    title: string;
    config: any;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  layout: 'grid' | 'flexible';
  theme: 'light' | 'dark' | 'auto';
  isDefault: boolean;
  createdAt: any;
  lastModified: any;
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'alert';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'performance' | 'engagement' | 'financial' | 'operational';
  data: any;
  actionable: boolean;
  actionUrl?: string;
  createdAt: any;
  expiresAt?: any;
  dismissed: boolean;
  dismissedAt?: any;
  dismissedBy?: string;
} 