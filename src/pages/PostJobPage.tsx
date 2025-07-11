import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../components/ui/Card';

// Define the expected option type for the Select component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Type definitions
interface JobFormData {
  title: string;
  department: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  description: string;
  requirements: string;
  isRemote: boolean;
  salaryMin: string;
  salaryMax: string;
}

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

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    jobType: 'full_time',
    experienceLevel: 'mid',
    description: '',
    requirements: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: ''
  });
  
  // Convert boolean to string for form fields
  const getFieldValue = (fieldName: keyof JobFormData) => {
    const value = formData[fieldName];
    if (fieldName === 'isRemote') {
      return value ? 'true' : 'false';
    }
    return value as string;
  };
  
  // Handle form field changes
  const handleFieldChange = (fieldName: keyof JobFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldName === 'isRemote' ? value === 'true' : value
    }));
  };
  
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error after a small delay to allow the DOM to update
      setTimeout(() => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const element = document.querySelector(`[name="${firstError}"]`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement job posting logic
      console.log('Submitting job:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate back to jobs page on success
      navigate('/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit job. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox inputs differently
    const fieldValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked.toString() 
      : value;
    
    handleFieldChange(
      name as keyof JobFormData, 
      fieldValue
    );
    
    // Clear error for the current field when user types
    if (errors[name as keyof JobFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle select changes from the custom Select component
  const handleSelectChange = (name: keyof JobFormData) => 
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for the current field when user selects an option
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    validateField(name);
  };
  
  const validateField = (fieldName: string): boolean => {
    const value = formData[fieldName as keyof JobFormData];
    let error = '';
    
    if (fieldName === 'title' && !value) {
      error = 'Job title is required';
    } else if (fieldName === 'department' && !value) {
      error = 'Please select a department';
    } else if (fieldName === 'location' && !formData.isRemote && !value) {
      error = 'Location is required for on-site jobs';
    } else if (fieldName === 'description' && !value) {
      error = 'Job description is required';
    } else if (fieldName === 'requirements' && !value) {
      error = 'Job requirements are required';
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
      return false;
    }
    
    return true;
  };
  
  const validateForm = (): boolean => {
    const requiredFields: Array<keyof JobFormData> = ['title', 'department', 'description', 'requirements'];
    let isValid = true;
    const newErrors: FormErrors = {};
    
    // Check required fields
    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        newErrors[field] = `${fieldName} is required`;
        isValid = false;
      }
    });
    
    // Validate location for on-site jobs
    if (!formData.isRemote && !formData.location) {
      newErrors.location = 'Location is required for on-site jobs';
      isValid = false;
    }
    
    // Validate salary range if provided
    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin);
      const max = parseFloat(formData.salaryMax);
      
      if (isNaN(min) || isNaN(max)) {
        newErrors.salaryMin = 'Please enter valid numbers for salary range';
        newErrors.salaryMax = 'Please enter valid numbers for salary range';
        isValid = false;
      } else if (min > max) {
        newErrors.salaryMin = 'Minimum salary cannot be greater than maximum';
        newErrors.salaryMax = 'Maximum salary cannot be less than minimum';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const departments: SelectOption[] = [
    { value: 'camera', label: 'Camera' },
    { value: 'sound', label: 'Sound' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'art', label: 'Art' },
    { value: 'costume', label: 'Costume' },
    { value: 'makeup_hair', label: 'Makeup & Hair' },
    { value: 'production', label: 'Production' },
    { value: 'post_production', label: 'Post-Production' },
    { value: 'vfx', label: 'VFX' },
    { value: 'stunts', label: 'Stunts' },
    { value: 'other', label: 'Other' }
  ];

  const jobTypes: SelectOption[] = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
  ];

  const experienceLevels: SelectOption[] = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' },
  ];



  // Get props for Select component
  const getSelectProps = (fieldName: keyof JobFormData, options: SelectOption[]) => {
    const selectedValue = getFieldValue(fieldName);
    const selectOptions = fieldName === 'isRemote' 
      ? [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ]
      : options;
    
    return {
      value: selectedValue,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        handleFieldChange(fieldName, value);
        
        if (errors[fieldName]) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: undefined
          }));
        }
      },
      options: selectOptions,
      className: errors[fieldName] ? 'border-red-300' : ''
    } as const;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to post your job listing
          </p>
        </div>

        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide information about the position you're hiring for
              </CardDescription>
            </CardHeader>

            <CardBody className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                    {errors.title && <span className="ml-2 text-sm text-red-600">{errors.title}</span>}
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Director of Photography"
                    className={errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                    {errors.department && <span className="ml-2 text-sm text-red-600">{errors.department}</span>}
                  </label>
                  <Select
                    id="department"
                    name="department"
                    placeholder="Select a department"
                    {...getSelectProps('department', departments)}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                    {errors.location && <span className="ml-2 text-sm text-red-600">{errors.location}</span>}
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Los Angeles, CA or Remote"
                    className={errors.location ? 'border-red-300' : ''}
                  />
                </div>

                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                    {errors.jobType && <span className="ml-2 text-sm text-red-600">{errors.jobType}</span>}
                  </label>
                  <Select
                    id="jobType"
                    name="jobType"
                    placeholder="Select job type"
                    {...getSelectProps('jobType', jobTypes)}
                  />
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                    {errors.experienceLevel && <span className="ml-2 text-sm text-red-600">{errors.experienceLevel}</span>}
                  </label>
                  <Select
                    id="experienceLevel"
                    name="experienceLevel"
                    placeholder="Select experience level"
                    {...getSelectProps('experienceLevel', experienceLevels)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range (optional)
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Input
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        min="0"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500">to</span>
                    </div>
                    <div className="flex-1">
                      <Input
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        min={formData.salaryMin || '0'}
                        value={formData.salaryMax}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                    {errors.description && <span className="ml-2 text-sm text-red-600">{errors.description}</span>}
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe the job responsibilities and requirements..."
                    className={errors.description ? 'border-red-300' : ''}
                  />
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements & Skills
                    {errors.requirements && <span className="ml-2 text-sm text-red-600">{errors.requirements}</span>}
                  </label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="List the required skills and experience..."
                    className={errors.requirements ? 'border-red-300' : ''}
                  />
                </div>
              </div>
            </CardBody>

            <CardFooter className="bg-gray-50 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Publish Job'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
