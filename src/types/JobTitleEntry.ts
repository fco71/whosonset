export interface JobTitleEntry {
  department: string;
  title: string;
  subcategories?: JobTitleEntry[]; // Additional job titles as nested JobTitleEntry objects
} 