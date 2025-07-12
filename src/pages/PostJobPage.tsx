import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import Select, { SingleValue, ActionMeta } from 'react-select';
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../components/ui/Card';
import { createJobPosting, getJobPostingById } from '../services/api/jobService';
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
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  isRemote: boolean;
  
  // Details
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  skills: string; // Will be converted to string[]
  
  // Compensation
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: 'year' | 'month' | 'week' | 'day' | 'hour';
  showSalary: boolean;
  
  // Project Info
  projectName: string;
  projectLink: string;
  projectType: ProjectType;
  
  // Timeline
  startDate: string;

  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
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
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { state: { from: '/post-job' } });
    }
  }, [currentUser, navigate]);
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Initialize form state with default values
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    jobType: 'full_time',
    experienceLevel: 'entry',
    isRemote: false,
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    skills: '',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'year',
    showSalary: true,
    projectName: '',
    projectLink: '',
    projectType: 'other',
    startDate: new Date().toISOString().split('T')[0],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    isPaid: false,
    isUnion: false,
    visaSponsorship: false,
    relocationAssistance: false
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
  
  // Handle form field changes
  const handleChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'boolean' ? value : value.trimStart()
    }));
    
    // Clear error for this field if it exists
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

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
    
    // Required fields with more specific error messages
    if (!formData.title.trim()) newErrors.title = 'Please enter a job title';
    if (!formData.department.trim()) newErrors.department = 'Please select a department';
    if (!formData.location.trim()) newErrors.location = 'Please enter a location';
    if (!formData.description.trim()) newErrors.description = 'Please enter a job description';
    if (!formData.contactName.trim()) newErrors.contactName = 'Please enter a contact name';
    
    // Email validation with better error messages
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Please enter an email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
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
    
    // First validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
      // Find the first error and scroll to it
      const firstError = Object.keys(errors).find(key => errors[key as keyof FormErrors]);
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // If no specific field error but form is invalid, show general error
        toast.error('Please fill in all required fields');
      }
      return;
    }
    
    if (!currentUser) {
      const errorMsg = 'You must be logged in to post a job';
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Current user:', currentUser.uid);
      
      // Create job data object that matches JobPostingBase interface
      const jobData = {
        // Required fields from JobPostingBase
        title: formData.title,
        department: formData.department,
        location: formData.location,
        jobType: (formData.jobType || 'full_time') as 'full_time' | 'part_time' | 'contract' | 'freelance' | 'temporary' | 'internship' | 'volunteer',
        experienceLevel: (formData.experienceLevel || 'entry') as 'intern' | 'entry' | 'associate' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive',
        isRemote: formData.isRemote || false,
        
        // Details
        description: formData.description || '',
        requirements: formData.requirements || '',
        responsibilities: formData.responsibilities || '',
        benefits: formData.benefits || '',
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        
        // Compensation - ensure no undefined values for Firestore
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : 0,
        salaryPeriod: formData.salaryPeriod || 'year',
        showSalary: formData.showSalary !== undefined ? formData.showSalary : true,
        
        // Project Info
        projectName: formData.projectName || '',
        projectLink: formData.projectLink || '',
        projectType: (formData.projectType || 'other') as 'feature' | 'short' | 'tv' | 'commercial' | 'music_video' | 'corporate' | 'documentary' | 'other',
        
        // Timeline
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        
        // Contact
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || '',
        
        // Additional
        isPaid: formData.isPaid || false,
        isUnion: formData.isUnion || false,
        visaSponsorship: formData.visaSponsorship || false,
        relocationAssistance: formData.relocationAssistance || false,
        
        // System fields
        status: 'published' as const,
        postedById: currentUser.uid,
        createdBy: formData.contactName,
        applicationCount: 0,
        views: 0
      };
      
      console.log('Job data prepared:', JSON.stringify(jobData, null, 2));
      
      console.log('Calling createJobPosting API with user ID:', currentUser.uid);
      const jobId = await createJobPosting(jobData, currentUser.uid);
      
      if (!jobId) {
        throw new Error('Failed to create job: No job ID returned');
      }
      
      console.log('Job created successfully with ID:', jobId);
      
      // Verify the job was saved by fetching it back
      try {
        const savedJob = await getJobPostingById(jobId);
        console.log('Successfully retrieved saved job:', savedJob);
      } catch (fetchError) {
        console.error('Error fetching saved job:', fetchError);
      }
      
      toast.success('Job posted successfully!');
      
      // Redirect to the job details page
      navigate(`/jobs/${jobId}`);
      
    } catch (error: unknown) {
      console.error('Error in job posting flow:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete job posting process.';
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Gaffer, Key Grip, Production Designer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Los Angeles, CA or Remote"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Job Type */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={(e) => handleChange('jobType', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select job type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description *
              </label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Detailed description of the job"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <p className="mt-1 text-sm text-gray-500">How should applicants contact you?</p>
              
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Contact Name *
                  </label>
                  <Input
                    type="text"
                    name="contactName"
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email *
                  </label>
                  <Input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-5">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.department || !formData.location || !formData.description || !formData.contactName || !formData.contactEmail}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : 'Publish Job'}
                </Button>
              </div>
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-md">
                  <p className="text-sm text-red-600">
                    Please fix the errors in the form before submitting.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
