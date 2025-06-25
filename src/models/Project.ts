// src/models/Project.ts
export interface Project {
    id: string;
    projectName: string;
    country: string;
    productionCompany: string;
    status: string;
    logline: string;
    synopsis: string;
    startDate: string;
    endDate: string;
    location: string;
    genre: string;
    director: string;
    producer: string;
    coverImageUrl: string;
    projectWebsite: string;
    productionBudget: string;
    productionCompanyContact: string;
    isVerified: boolean;
    owner_uid: string;
    createdAt?: any; // serverTimestamp
    genres?: string[];
}