// src/models/User.ts
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  roles: string[];
  country: string;
  phone_number?: string;
  user_type: string;
  bio?: string;
  resume_ids?: string[];
}