// src/models/Project.ts
export interface Project {
    project_id: string;
    project_name: string;
    country: string;
    production_company: string;
    status: string;
    logline: string;
    synopsis: string;
    start_date: Date | null;
    end_date: Date | null;
    location: string;
    genre: string;
    director: string;
    producer: string;
    crew_ids: string[];
    owner_uid: string;
    cover_image_url: string;
    poster_image_url: string;
    project_website: string;
    production_budget: number;
    production_company_contact: string;
    is_verified: boolean;
}