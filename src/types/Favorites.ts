export interface UserCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'crew_profiles' | 'projects' | 'mixed';
  isPublic: boolean;
  createdAt: any;
  updatedAt: any;
  itemCount: number;
  coverImageUrl?: string;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  itemId: string; // ID of the crew profile or project
  itemType: 'crew_profile' | 'project';
  addedAt: any;
  notes?: string;
  tags?: string[];
}

export interface UserFavorite {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'crew_profile' | 'project' | 'job_posting';
  addedAt: any;
  notes?: string;
}

export interface CollectionShare {
  id: string;
  collectionId: string;
  sharedBy: string;
  sharedWith: string;
  permission: 'view' | 'edit';
  sharedAt: any;
  expiresAt?: any;
} 