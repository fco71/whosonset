export interface JobSubcategories {
  [jobTitle: string]: string[];
}

// All available job titles that can be selected as subcategories (additional positions)
export const ALL_JOB_TITLES = [
  // Camera Department
  "Director of Photography (DP) / Cinematographer",
  "Camera Operator",
  "1st Assistant Camera (1st AC) / Focus Puller",
  "2nd Assistant Camera (2nd AC) / Clapper Loader",
  "Camera Technician",
  "Steadicam Operator",
  "Drone Operator",
  "Still Photographer",
  
  // Production Department
  "Executive Producer",
  "Producer",
  "Co-Producer",
  "Associate Producer",
  "Line Producer",
  "Production Manager",
  "Unit Production Manager (UPM)",
  "Production Coordinator",
  "Production Secretary",
  "Production Assistant (PA)",
  
  // Direction Department
  "Director",
  "Assistant Director (AD) - 1st AD, 2nd AD, 2nd 2nd AD",
  "Script Supervisor (Continuity)",
  
  // Writing Department
  "Writer",
  "Screenwriter",
  "Story Editor",
  
  // Sound Department
  "Production Sound Mixer",
  "Boom Operator",
  "Sound Assistant",
  "Sound Designer (Post-Production)",
  "Foley Artist (Post-Production)",
  "Foley Mixer (Post-Production)",
  
  // Grip & Electric Department
  "Gaffer (Chief Lighting Technician)",
  "Best Boy Electric (Assistant Chief Lighting Technician)",
  "Electrician",
  "Lighting Technician",
  "Key Grip",
  "Best Boy Grip (Assistant Key Grip)",
  "Grip",
  "Dolly Grip",
  
  // Art Department & Set Decoration
  "Production Designer",
  "Art Director",
  "Set Decorator",
  "Set Dresser",
  "Prop Master",
  "Prop Builder",
  "Scenic Artist",
  "Construction Coordinator",
  "Construction Foreman",
  
  // Costume & Wardrobe
  "Costume Designer",
  "Assistant Costume Designer",
  "Costume Supervisor",
  "Set Costumer",
  "Seamstress/Seamster",
  
  // Hair & Makeup
  "Makeup Artist (Key)",
  "Hair Stylist (Key)",
  "Makeup Artist",
  "Hair Stylist",
  "Special Effects Makeup Artist",
  
  // Post-Production
  "Editor",
  "Assistant Editor",
  "Colorist",
  "VFX Supervisor",
  "VFX Artist",
  "Compositor",
  
  // Music
  "Composer",
  "Music Supervisor",
  
  // Transportation
  "Transportation Coordinator",
  "Driver",
  
  // Stunts & Effects
  "Stunt Coordinator",
  "Stunt Performer",
  "Animal Handler",
  
  // Support & General Crew
  "Craft Service",
  "Catering",
  "Security Coordinator",
  "Security Guard",
  "Medic / On-Set Nurse",
  "Publicist",
  "Unit Publicist",
  "Interpreter",
  "COVID Compliance Officer",
  
  // Casting
  "Casting Director",
  "Casting Assistant",
  
  // Locations
  "Location Manager",
  "Assistant Location Manager",
  "Location Scout",
];

// For any job title, the subcategories are all other job titles (excluding the current one)
export const JOB_SUBCATEGORIES: JobSubcategories = {};

// Initialize the subcategories for each job title
ALL_JOB_TITLES.forEach(jobTitle => {
  JOB_SUBCATEGORIES[jobTitle] = ALL_JOB_TITLES.filter(title => title !== jobTitle);
}); 