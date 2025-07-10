import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../components/ui/Card';

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const departments = [
    'Camera',
    'Sound',
    'Lighting',
    'Art',
    'Costume',
    'Makeup & Hair',
    'Production',
    'Post-Production',
    'VFX',
    'Stunts',
    'Other'
  ];

  const jobTypes = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to post your job listing
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Provide information about the position you're hiring for
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Los Angeles, CA or Remote"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                    Job Type *
                  </label>
                  <Select
                    id="jobType"
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    options={jobTypes}
                    placeholder="Select job type"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                    Experience Level *
                  </label>
                  <Select
                    id="experienceLevel"
                    name="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    options={experienceLevels}
                    placeholder="Select experience level"
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
                      Remote position
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range (optional)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      name="salaryMin"
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <span className="flex items-center">to</span>
                    <Input
                      name="salaryMax"
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the job responsibilities and requirements..."
                />
              </div>

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
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate each requirement with a new line
                </p>
              </div>
            </CardBody>

            <CardFooter className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-end space-x-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
