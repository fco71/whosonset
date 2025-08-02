import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export interface JobMatchScore {
  jobId: string;
  score: number;
  factors: {
    department: number;
    experience: number;
    location: number;
    skills: number;
    availability: number;
  };
  breakdown: {
    departmentMatch: boolean;
    experienceMatch: boolean;
    locationMatch: boolean;
    skillsMatch: number;
    availabilityMatch: boolean;
  };
}

export interface ApplicantProfile {
  uid: string;
  name: string;
  jobTitles: string[];
  experience: string;
  location: string;
  skills: string[];
  availability: string;
  bio: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  experience: string;
  location: string;
  requiredSkills: string[];
  contractType: string;
  salary?: {
    min: number;
    max: number;
  };
}

export class JobMatchingService {
  /**
   * Calculate match score between a job and an applicant
   */
  static calculateMatchScore(job: JobPosting, applicant: ApplicantProfile): JobMatchScore {
    const factors = {
      department: 0,
      experience: 0,
      location: 0,
      skills: 0,
      availability: 0
    };

    const breakdown = {
      departmentMatch: false,
      experienceMatch: false,
      locationMatch: false,
      skillsMatch: 0,
      availabilityMatch: false
    };

    // Department match (30% weight)
    const departmentMatch = applicant.jobTitles.some(title => 
      title.toLowerCase().includes(job.department.toLowerCase()) ||
      job.department.toLowerCase().includes(title.toLowerCase())
    );
    breakdown.departmentMatch = departmentMatch;
    factors.department = departmentMatch ? 30 : 0;

    // Experience level match (25% weight)
    const experienceMatch = this.compareExperienceLevels(job.experience, applicant.experience);
    breakdown.experienceMatch = experienceMatch;
    factors.experience = experienceMatch ? 25 : 0;

    // Location match (20% weight)
    const locationMatch = this.compareLocations(job.location, applicant.location);
    breakdown.locationMatch = locationMatch;
    factors.location = locationMatch ? 20 : 0;

    // Skills match (20% weight)
    const skillsMatch = this.calculateSkillsMatch(job.requiredSkills, applicant.skills);
    breakdown.skillsMatch = skillsMatch;
    factors.skills = skillsMatch * 20;

    // Availability match (5% weight)
    const availabilityMatch = this.compareAvailability(job.contractType, applicant.availability);
    breakdown.availabilityMatch = availabilityMatch;
    factors.availability = availabilityMatch ? 5 : 0;

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);

    return {
      jobId: job.id,
      score: Math.round(totalScore),
      factors,
      breakdown
    };
  }

  /**
   * Get top matching jobs for an applicant
   */
  static async getTopMatchingJobs(applicantId: string, limit: number = 10): Promise<JobMatchScore[]> {
    try {
      // Get applicant profile
      const applicantQuery = query(collection(db, 'crewProfiles'), where('uid', '==', applicantId));
      const applicantSnapshot = await getDocs(applicantQuery);
      
      if (applicantSnapshot.empty) {
        throw new Error('Applicant profile not found');
      }

      const applicantData = applicantSnapshot.docs[0].data() as ApplicantProfile;
      applicantData.uid = applicantId;

      // Get all active job postings
      const jobsQuery = query(
        collection(db, 'jobPostings'), 
        where('status', '==', 'active')
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      
      const jobs = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as JobPosting));

      // Calculate match scores for all jobs
      const matchScores = jobs.map(job => 
        this.calculateMatchScore(job, applicantData)
      );

      // Sort by score and return top matches
      return matchScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting matching jobs:', error);
      return [];
    }
  }

  /**
   * Get top matching applicants for a job
   */
  static async getTopMatchingApplicants(jobId: string, limit: number = 10): Promise<Array<JobMatchScore & { applicant: ApplicantProfile }>> {
    try {
      // Get job details
      const jobQuery = query(collection(db, 'jobPostings'), where('__name__', '==', jobId));
      const jobSnapshot = await getDocs(jobQuery);
      
      if (jobSnapshot.empty) {
        throw new Error('Job not found');
      }

      const jobData = jobSnapshot.docs[0].data() as JobPosting;
      jobData.id = jobId;

      // Get all crew profiles
      const applicantsQuery = query(collection(db, 'crewProfiles'));
      const applicantsSnapshot = await getDocs(applicantsQuery);
      
      const applicants = applicantsSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as ApplicantProfile));

      // Calculate match scores for all applicants
      const matchScores = applicants.map(applicant => ({
        ...this.calculateMatchScore(jobData, applicant),
        applicant
      }));

      // Sort by score and return top matches
      return matchScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting matching applicants:', error);
      return [];
    }
  }

  private static compareExperienceLevels(jobExperience: string, applicantExperience: string): boolean {
    const levels = ['entry', 'mid', 'senior', 'executive'];
    const jobLevel = levels.indexOf(jobExperience.toLowerCase());
    const applicantLevel = levels.indexOf(applicantExperience.toLowerCase());
    
    // Applicant should have at least the required level
    return applicantLevel >= jobLevel;
  }

  private static compareLocations(jobLocation: string, applicantLocation: string): boolean {
    // Simple location matching - can be enhanced with geocoding
    const jobLoc = jobLocation.toLowerCase();
    const applicantLoc = applicantLocation.toLowerCase();
    
    return jobLoc.includes(applicantLoc) || applicantLoc.includes(jobLoc);
  }

  private static calculateSkillsMatch(requiredSkills: string[], applicantSkills: string[]): number {
    if (!requiredSkills.length) return 1;
    
    const matchedSkills = requiredSkills.filter(skill =>
      applicantSkills.some(applicantSkill =>
        applicantSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(applicantSkill.toLowerCase())
      )
    );
    
    return matchedSkills.length / requiredSkills.length;
  }

  private static compareAvailability(jobContractType: string, applicantAvailability: string): boolean {
    // Simple availability matching
    const contract = jobContractType.toLowerCase();
    const availability = applicantAvailability.toLowerCase();
    
    if (contract.includes('full') && availability.includes('full')) return true;
    if (contract.includes('part') && availability.includes('part')) return true;
    if (contract.includes('freelance') && availability.includes('freelance')) return true;
    
    return false;
  }
} 