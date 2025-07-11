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

type JobType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'temporary' | 'internship' | 'volunteer';
type ExperienceLevel = 'intern' | 'entry' | 'associate' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
type ProjectType = 'feature' | 'short' | 'tv' | 'commercial' | 'music_video' | 'corporate' | 'documentary' | 'other';

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
  const [isFormValid, setIsFormValid] = useState(false);
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
    
    // Clear previous error
    delete newErrors[fieldName];
    
    // Required fields validation
    if (['title', 'department', 'location', 'description', 'contactName', 'contactEmail'].includes(fieldName)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[fieldName] = 'This field is required';
      }
    }
    
    // Email validation
    if (fieldName === 'contactEmail' && value && !/\S+@\S+\.\S+/.test(value as string)) {
      newErrors[fieldName] = 'Please enter a valid email address';
    }
    
    // Numeric validation for salary
    if ((fieldName === 'salaryMin' || fieldName === 'salaryMax') && value) {
      const numValue = parseFloat(value as string);
      if (isNaN(numValue) || numValue < 0) {
        newErrors[fieldName] = 'Please enter a valid number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, errors]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, type } = e.target as HTMLInputElement;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof FormErrors];
      setErrors(newErrors);
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
  
  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Numeric validation for salary
    if (formData.salaryMin && isNaN(parseFloat(formData.salaryMin))) {
      newErrors.salaryMin = 'Please enter a valid number';
    }
    if (formData.salaryMax && isNaN(parseFloat(formData.salaryMax))) {
      newErrors.salaryMax = 'Please enter a valid number';
    }
    
    setErrors(newErrors);
    
    // Log validation errors for debugging
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle select changes - consolidated implementation
  const handleSelectChange = (name: keyof JobFormData) => (option: SingleValue<SelectOption>) => {
    if (option) {
      setFormData(prev => ({
        ...prev,
        [name]: option.value
      }));
    }
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to the first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    
    if (!currentUser) {
      const errorMsg = 'You must be logged in to post a job';
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!currentUser) {
      toast.error('You must be logged in to post a job');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Current user:', currentUser.uid);
      
      // Create job data object that matches JobPostingBase interface
      const jobData = {
        // Basic Info
        title: formData.title,
        department: formData.department,
        location: formData.location,
        jobType: formData.jobType as JobType,
        experienceLevel: formData.experienceLevel as ExperienceLevel,
        isRemote: formData.isRemote,
        
        // Details
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        benefits: formData.benefits,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        
        // Compensation
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : 0,
        salaryPeriod: 'year' as const, // Ensure type is 'year' literal
        showSalary: true, // Default value
        
        // Project Info
        projectName: formData.projectName,
        projectLink: formData.projectLink,
        projectType: formData.projectType as ProjectType,
        
        // Timeline
        startDate: new Date().toISOString().split('T')[0], // Today's date as default
        
        // Contact
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        
        // Additional
        isPaid: formData.isPaid,
        isUnion: formData.isUnion,
        visaSponsorship: formData.visaSponsorship,
        relocationAssistance: formData.relocationAssistance,
        
        // Metadata
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        status: 'active' as const
      };
      
      console.log('Job data prepared:', jobData);
      
      console.log('Calling createJobPosting API...');
      const jobId = await createJobPosting(jobData, '');
      
      if (!jobId) {
        throw new Error('Failed to get job ID after creation');
      }
      
      console.log('Job posted successfully with ID:', jobId);
      toast.success('Job posted successfully!');
      
      // Redirect to the job details page
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
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Publish Job'}
                  </Button>
                  {Object.keys(errors).length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      Please fix the errors in the form before submitting.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
