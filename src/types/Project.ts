export interface Project {
  id: string;
  projectName: string;
  productionCompany?: string;
  country?: string;
  productionLocations?: Array<{ country: string; city?: string }>;
  status: string;
  summary?: string;
  director?: string;
  producer?: string;
  genres?: string[];
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  isBookmarked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  budget?: number;
  budgetCurrency?: string;
  productionType?: string;
  language?: string;
  format?: string;
  logline?: string;
  keyCast?: Array<{
    name: string;
    role: string;
  }>;
  crew?: Array<{
    id: string;
    role: string;
    name: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  tags?: string[];
  isPublic?: boolean;
  isFeatured?: boolean;
  featuredUntil?: string;
  featuredOrder?: number;
  views?: number;
  applicationsCount?: number;
  isActive?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  metadata?: Record<string, any>;
}
