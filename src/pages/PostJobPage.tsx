import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import Select, { SingleValue, ActionMeta } from 'react-select';
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../components/ui/Card';
import { createJobPosting } from '../services/api/jobService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface SelectOption {
  value: string;
  label: string;
}

// Define form data interface
interface JobFormData {
  // Basic Info
  title: string;
  department: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  isRemote: boolean;
  
  // Details
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  skills: string;
  
  // Compensation
  salaryMin: string;
  salaryMax: string;
  
  // Contact Info
  contactName: string;
  contactEmail: string;
  
  // Project Info
  projectName: string;
  projectLink: string;
  projectType: string;
  
  // Additional
  isPaid: boolean;
  isUnion: boolean;
  visaSponsorship: boolean;
  relocationAssistance: boolean;
}

// Define form errors interface
interface FormErrors {
  [key: string]: string | undefined;
}

// Type for the Select component's onChange handler
type SelectOnChange = (option: SelectOption | null) => void;

// Extend the Window interface to include the grecaptcha property
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const PostJobPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    // Basic Info
    title: '',
    department: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    isRemote: false,
    
    // Details
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    skills: '',
    
    // Compensation
    salaryMin: '',
    salaryMax: '',
    
    // Contact Info
    contactName: '',
    contactEmail: '',
    
    // Project Info
    projectName: '',
    projectLink: '',
    projectType: 'other',
    
    // Additional
    isPaid: true,
    isUnion: false,
    visaSponsorship: false,
    relocationAssistance: false,
  });

  // Form validation and handlers
  const validateField = useCallback((fieldName: keyof JobFormData): boolean => {
    const value = formData[fieldName];
    const newErrors = { ...errors };
    
    // Basic validation - require field if it's a required field
    const requiredFields: (keyof JobFormData)[] = ['title', 'description', 'requirements'];
    if (requiredFields.includes(fieldName) && !value) {
      newErrors[fieldName] = 'This field is required';
      setErrors(newErrors);
      return false;
    }
    
    // Clear any existing error for this field
    if (newErrors[fieldName]) {
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
    
    return true;
  }, [formData, errors]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target as HTMLInputElement;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSelectChange = (name: keyof JobFormData) => (option: SingleValue<SelectOption>) => {
    setFormData(prev => ({
      ...prev,
      [name]: option?.value || ''
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    validateField(name as keyof JobFormData);
  };
  
  // Select options
  const jobTypeOptions: SelectOption[] = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
  ];
  
  const experienceLevelOptions: SelectOption[] = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
  ];
  
  const departmentOptions: SelectOption[] = [
    { value: 'camera', label: 'Camera' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'sound', label: 'Sound' },
    { value: 'art', label: 'Art Department' },
    { value: 'wardrobe', label: 'Wardrobe' },
    { value: 'makeup', label: 'Hair & Makeup' },
    { value: 'production', label: 'Production' },
    { value: 'post', label: 'Post-Production' },
    { value: 'other', label: 'Other' },
  ];
  
  // Convert boolean to string for form fields
  const getFieldValue = (fieldName: keyof JobFormData): string => {
    const value = formData[fieldName];
    if (fieldName === 'isRemote' || fieldName === 'isPaid' || fieldName === 'isUnion' || 
        fieldName === 'visaSponsorship' || fieldName === 'relocationAssistance') {
      return value ? 'true' : 'false';
    }
    return String(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate form
    const isValid = Object.keys(formData).every(field => 
      validateField(field as keyof JobFormData)
    );
    
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    if (!currentUser) {
      toast.error('You must be logged in to post a job');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to post a job');
      }
      
      // Create job data object that matches JobPostingBase interface
      const jobData = {
        // Basic Info
        title: formData.title,
        department: formData.department,
        location: formData.location,
        jobType: formData.jobType as 'full_time' | 'part_time' | 'contract' | 'freelance' | 'temporary' | 'internship' | 'volunteer',
        experienceLevel: formData.experienceLevel as 'intern' | 'entry' | 'associate' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive',
        isRemote: formData.isRemote,
        
        // Details
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        benefits: formData.benefits,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        
        // Compensation
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : 0,
        salaryPeriod: 'year' as const, // Ensure type is 'year' literal
        showSalary: true, // Default value
        
        // Project Info
        projectName: formData.projectName,
        projectLink: formData.projectLink,
        projectType: formData.projectType as 'feature' | 'short' | 'tv' | 'commercial' | 'music_video' | 'corporate' | 'documentary' | 'other',
        
        // Timeline
        startDate: new Date().toISOString().split('T')[0], // Today's date as default
        
        // Contact
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        
        // Additional
        isPaid: formData.isPaid,
        isUnion: formData.isUnion,
        visaSponsorship: formData.visaSponsorship,
        relocationAssistance: formData.relocationAssistance
      };
      
      // Call the API to create the job posting
      // Note: The second parameter is for reCAPTCHA token which is optional
      const jobId = await createJobPosting(jobData, '');
      
      // Show success message and redirect
      toast.success('Job posted successfully!');
      navigate(`/jobs/${jobId}`);
      
    } catch (error: unknown) {
      console.error('Error posting job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to post job. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-sm text-gray-600">Fill out the form below to post a new job listing.</p>
        </div>
        
        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 text-center">{errors.submit}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="space-y-6">
              {/* Form fields will go here */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Posting...' : 'Publish Job'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
