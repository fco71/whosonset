import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../components/ui/Card';
import { createJobPosting } from '../services/api/jobService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormErrors {
  [key: string]: string;
}

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState('basic');
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    department: '',
    location: '',
    jobType: 'full_time' as const,
    experienceLevel: 'mid' as const,
    isRemote: false,
    
    // Details
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    
    // Compensation
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'year' as const,
    showSalary: true,
    
    // Project Info
    projectName: '',
    projectLink: '',
    projectType: 'feature' as const,
    
    // Timeline
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: '',
    deadline: '',
    
    // Contact
    contactName: currentUser?.displayName || '',
    contactEmail: currentUser?.email || '',
    contactPhone: '',
    
    // Additional
    isPaid: true,
    isUnion: false,
    visaSponsorship: false,
    relocationAssistance: false
  });
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Basic Info validation - Only keep required fields
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    // Details validation - Make responsibilities and requirements optional
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    
    // Contact validation
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Salary validation if shown
    if (formData.showSalary) {
      // Only validate salary if at least one field is filled
      if (formData.salaryMin || formData.salaryMax) {
        if (formData.salaryMin && formData.salaryMax && parseFloat(formData.salaryMin) > parseFloat(formData.salaryMax)) {
          newErrors.salaryMax = 'Maximum salary must be greater than minimum salary';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    if (!currentUser) {
      toast.error('You must be logged in to post a job');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const jobData = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
        skills: selectedSkills,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };
      
      await createJobPosting(jobData, currentUser.uid);
      
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNextTab = (e: React.MouseEvent, nextTab: string) => {
    e.preventDefault();
    
    // Validate current tab before proceeding
    if (activeTab === 'basic') {
      const basicErrors: FormErrors = {};
      if (!formData.title.trim()) basicErrors.title = 'Job title is required';
      if (!formData.department) basicErrors.department = 'Department is required';
      if (!formData.location) basicErrors.location = 'Location is required';
      
      setErrors(basicErrors);
      
      if (Object.keys(basicErrors).length === 0) {
        setActiveTab(nextTab);
      } else {
        toast.error('Please fill in all required fields');
      }
    } else {
      setActiveTab(nextTab);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSkillAdd = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
      setSkillInput('');
      
      // Clear skills error if any
      if (errors.skills) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.skills;
          return newErrors;
        });
      }
    }
  };
  
  const handleSkillRemove = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleSkillAdd(skillInput.trim());
    }
  };

  const departments = [
    'Camera',
    'Sound',
    'Lighting',
    'Grip & Electric',
    'Art Department',
    'Costume',
    'Hair & Makeup',
    'Production',
    'Production Office',
    'Locations',
    'Transportation',
    'Post-Production',
    'VFX',
    'Stunts',
    'Casting',
    'Script',
    'Other'
  ];
  
  const projectTypes = [
    { value: 'feature', label: 'Feature Film' },
    { value: 'short', label: 'Short Film' },
    { value: 'tv', label: 'TV Show' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'music_video', label: 'Music Video' },
    { value: 'corporate', label: 'Corporate/Industrial' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'other', label: 'Other' },
  ];
  
  const salaryPeriods = [
    { value: 'year', label: 'per year' },
    { value: 'month', label: 'per month' },
    { value: 'week', label: 'per week' },
    { value: 'day', label: 'per day' },
    { value: 'hour', label: 'per hour' },
  ];
  
  const commonSkills = [
    'Cinematography', 'Lighting', 'Grip', 'Electric', 'Sound Mixing', 'Boom Operating',
    'Art Direction', 'Set Design', 'Props', 'Costume Design', 'Wardrobe', 'Hair Styling',
    'Makeup', 'Special FX Makeup', 'Producing', 'Production Coordinating', 'Location Scouting',
    'Script Supervision', 'Continuity', 'Editing', 'Color Grading', 'Visual Effects',
    'Sound Design', 'Foley', 'ADR', 'Stunt Coordination', 'Stunt Performing'
  ];

  const jobTypes = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  const experienceLevels = [
    { value: 'intern', label: 'Intern' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'associate', label: 'Associate' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'manager', label: 'Manager' },
    { value: 'director', label: 'Director' },
    { value: 'executive', label: 'Executive' },
  ];

  // Navigation tabs
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Job Details' },
    { id: 'project', label: 'Project' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'contact', label: 'Contact' },
    { id: 'review', label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to post your job listing. All fields are required unless marked as optional.
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center">
            <ol className="flex items-center space-x-4">
              {tabs.map((tab, index) => (
                <li key={tab.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center ${
                      activeTab === tab.id
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="ml-2 text-sm font-medium">{tab.label}</span>
                  </button>
                  {index < tabs.length - 1 && (
                    <svg
                      className="w-5 h-5 mx-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <Card className={activeTab !== 'basic' ? 'hidden' : ''}>
          <CardHeader>
            <CardTitle>1. Basic Information</CardTitle>
            <CardDescription>
              Tell us about the position you're hiring for
            </CardDescription>
          </CardHeader>
            <CardBody className="space-y-6">
              {/* Job Title & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Director of Photography"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <Select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    options={departments.map(dept => ({
                      value: dept,
                      label: dept
                    }))}
                    placeholder="Select a department"
                    variant="outline"
                    selectSize="md"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                    <span className="text-xs font-normal text-gray-500 ml-1">(City, State/Province, Country)</span>
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Los Angeles, CA or Remote"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <Select
                    id="jobType"
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    options={jobTypes}
                    placeholder="Select job type"
                    variant="outline"
                    selectSize="md"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <Select
                    id="experienceLevel"
                    name="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    options={experienceLevels}
                    placeholder="Select experience level"
                    variant="outline"
                    selectSize="md"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center h-10">
                    <input
                      id="isRemote"
                      name="isRemote"
                      type="checkbox"
                      checked={formData.isRemote}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-700">
                      Remote position available (optional)
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Compensation (optional)
                      </label>
                      <div className="flex items-center">
                        <input
                          id="showSalary"
                          name="showSalary"
                          type="checkbox"
                          checked={formData.showSalary}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showSalary" className="ml-2 block text-xs text-gray-600">
                          Show on listing (optional)
                        </label>
                      </div>
                    </div>
                    {formData.showSalary && (
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Input
                            name="salaryMin"
                            type="number"
                            placeholder="Min"
                            value={formData.salaryMin}
                            onChange={handleChange}
                            className="w-full"
                            min="0"
                            step="1000"
                            required={!!formData.salaryMax}
                            onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
                              if (formData.salaryMax) {
                                e.currentTarget.setCustomValidity('Please enter a minimum salary or clear the maximum salary');
                              } else {
                                e.currentTarget.setCustomValidity('');
                              }
                            }}
                          />
                        </div>
                        <span className="flex items-center text-sm text-gray-500">to</span>
                        <div className="flex-1">
                          <Input
                            name="salaryMax"
                            type="number"
                            placeholder="Max"
                            value={formData.salaryMax}
                            onChange={handleChange}
                            className="w-full"
                            min={formData.salaryMin || 0}
                            step="1000"
                            required={!!formData.salaryMin}
                            onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
                              if (formData.salaryMin) {
                                e.currentTarget.setCustomValidity('Please enter a maximum salary or clear the minimum salary');
                              } else {
                                e.currentTarget.setCustomValidity('');
                              }
                            }}
                          />
                        </div>
                        <div className="w-32">
                          <Select
                            name="salaryPeriod"
                            value={formData.salaryPeriod}
                            onChange={handleChange}
                            options={salaryPeriods}
                            variant="outline"
                            selectSize="md"
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description
                  <span className="text-xs font-normal text-gray-500 ml-1">(Provide a detailed overview of the role)</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the job responsibilities, day-to-day activities, and what makes this role exciting..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2">
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
                  Key Responsibilities *
                </label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows={4}
                  required
                  value={formData.responsibilities}
                  onChange={handleChange}
                  placeholder="List the main responsibilities and duties of this position..."
                  className="min-h-[100px]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate each responsibility with a new line
                </p>
              </div>

              {/* Requirements & Skills */}
              <div className="space-y-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Requirements & Skills *
                </label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  required
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="List the required skills, experience, and qualifications..."
                  className="min-h-[100px]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate each requirement with a new line
                </p>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Key Skills & Technologies
                  <span className="text-xs font-normal text-gray-500 ml-1">(Add relevant skills to help candidates find this job)</span>
                </label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md min-h-[42px]">
                  {selectedSkills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <span className="sr-only">Remove {skill}</span>
                        <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                          <path fillRule="evenodd" d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={() => skillInput.trim() && handleSkillAdd(skillInput.trim())}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 min-w-[150px] border-0 p-0 text-sm focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonSkills
                    .filter(skill => 
                      !selectedSkills.includes(skill) && 
                      skill.toLowerCase().includes(skillInput.toLowerCase())
                    )
                    .slice(0, 5)
                    .map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillAdd(skill)}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {skill} <span className="ml-1 text-gray-500">+</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
                  Benefits & Perks
                </label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="List any benefits, perks, or additional information that would make this position more attractive..."
                  className="min-h-[80px]"
                />
              </div>
            </CardBody>

            <CardFooter className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <div className="space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? 'Posting...' : 'Publish Job'}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Project Information Section */}
          <Card className={activeTab !== 'project' ? 'hidden' : ''}>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Tell us about the project this position is for
              </CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                    Project/Production Name
                  </label>
                  <Input
                    id="projectName"
                    name="projectName"
                    type="text"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="e.g. 'The Last Sunset' or 'Acme Corp Commercial'"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
                    Project Type
                  </label>
                  <Select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    options={projectTypes}
                    placeholder="Select project type"
                    variant="outline"
                    selectSize="md"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="projectLink" className="block text-sm font-medium text-gray-700">
                    Project Website or IMDB Link (optional)
                  </label>
                  <Input
                    id="projectLink"
                    name="projectLink"
                    type="url"
                    value={formData.projectLink}
                    onChange={handleChange}
                    placeholder="https://www.imdb.com/title/... or https://www.projectwebsite.com"
                    className="w-full"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Timeline Section */}
          <Card className={activeTab !== 'timeline' ? 'hidden' : ''}>
            <CardHeader>
              <CardTitle>Timeline & Availability</CardTitle>
              <CardDescription>
                When does this position start and what's the expected duration?
              </CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Expected Start Date *
                  </label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Expected End Date
                  </label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                    Application Deadline
                  </label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Contact Information Section */}
          <Card className={activeTab !== 'contact' ? 'hidden' : ''}>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How should candidates apply or contact you about this position?
              </CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Contact Name *
                  </label>
                  <Input
                    id="contactName"
                    name="contactName"
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Who should candidates contact?"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email *
                  </label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Contact Phone (optional)
                  </label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Additional Information Section */}
          <Card className={activeTab !== 'review' ? 'hidden' : ''}>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review your job posting before submitting
              </CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Job Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{formData.title}</h4>
                  <p className="text-gray-600">{formData.department} • {formData.location} {formData.isRemote ? '(Remote)' : ''}</p>
                  <p className="mt-2 text-sm text-gray-700">{formData.jobType} • {experienceLevels.find(l => l.value === formData.experienceLevel)?.label}</p>
                </div>
                
                <h4 className="font-medium mt-6">Job Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                  {formData.description || <span className="text-gray-400 italic">No description provided</span>}
                </div>
                
                <h4 className="font-medium mt-6">Requirements</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                  {formData.requirements || <span className="text-gray-400 italic">No requirements provided</span>}
                </div>
                
                <h4 className="font-medium mt-6">Project Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{formData.projectName || 'No project name provided'}</p>
                  <p className="text-gray-600">{projectTypes.find(p => p.value === formData.projectType)?.label || 'No project type specified'}</p>
                  {formData.projectLink && (
                    <a href={formData.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-1 block">
                      {formData.projectLink}
                    </a>
                  )}
                </div>
                
                <h4 className="font-medium mt-6">Contact Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{formData.contactName}</p>
                  <p className="text-gray-600">{formData.contactEmail}</p>
                  {formData.contactPhone && (
                    <p className="text-gray-600">{formData.contactPhone}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I confirm that this job posting is accurate and complies with our{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    terms of service
                  </a>.
                </label>
              </div>
            </CardBody>
          </Card>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
            <div>
              {activeTab !== 'basic' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3 items-center">
              {activeTab !== 'review' ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      handleNextTab(e, tabs[currentIndex + 1].id);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[180px] transition-all duration-200"
                  isLoading={isSubmitting}
                  loadingText="Publishing..."
                >
                  Publish Job
                </Button>
              )}
            </div>
          </div>
          
          {/* Additional Options Card */}
          <Card className="mt-6">
            <CardBody className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <input
                    id="isPaid"
                    name="isPaid"
                    type="checkbox"
                    checked={formData.isPaid}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                    This is a paid position
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isUnion"
                    name="isUnion"
                    type="checkbox"
                    checked={formData.isUnion}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isUnion" className="ml-2 block text-sm text-gray-700">
                    Union position
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="visaSponsorship"
                    name="visaSponsorship"
                    type="checkbox"
                    checked={formData.visaSponsorship}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="visaSponsorship" className="ml-2 block text-sm text-gray-700">
                    Visa sponsorship available
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="relocationAssistance"
                    name="relocationAssistance"
                    type="checkbox"
                    checked={formData.relocationAssistance}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="relocationAssistance" className="ml-2 block text-sm text-gray-700">
                    Relocation assistance available
                  </label>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Form Status */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Your job will be reviewed before going live. You can edit it anytime.
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
