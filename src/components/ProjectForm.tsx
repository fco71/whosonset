import React from 'react';
import ImageUploader from './ImageUploader';
import { FormInput, FormTextarea, FormSelect, FormFieldGroup } from './ui/Form';

interface ProjectFormProps {
  projectName: string;
  setProjectName: (value: string) => void;
  productionCompany: string;
  setProductionCompany: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  logline: string;
  setLogline: (value: string) => void;
  synopsis: string;
  setSynopsis: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  genre: string;
  setGenre: (value: string) => void;
  director: string;
  setDirector: (value: string) => void;
  producer: string;
  setProducer: (value: string) => void;
  coverImageUrl: string;
  setCoverImageUrl: (value: string) => void;
  projectWebsite: string;
  setProjectWebsite: (value: string) => void;
  productionBudget: string;
  setProductionBudget: (value: string) => void;
  productionCompanyContact: string;
  setProductionCompanyContact: (value: string) => void;
  handleCoverImageUploaded: (url: string) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  const statusOptions = [
    { value: "Development", label: "Development" },
    { value: "Pre-Production", label: "Pre-Production" },
    { value: "Filming", label: "Filming" },
    { value: "Post-Production", label: "Post-Production" },
    { value: "Completed", label: "Completed" },
    { value: "Canceled", label: "Canceled" }
  ];

  return (
    <div className="space-y-8">
      <FormFieldGroup 
        title="General Information" 
        description="Basic project details and company information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Project Name"
            value={props.projectName}
            onChange={(e) => props.setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />
          <FormInput
            label="Production Company"
            value={props.productionCompany}
            onChange={(e) => props.setProductionCompany(e.target.value)}
            placeholder="Enter production company"
            required
          />
          <FormSelect
            label="Status"
            value={props.status}
            onChange={props.setStatus}
            options={statusOptions}
            placeholder="Select project status"
            required
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup 
        title="Creative Information" 
        description="Story details and creative team"
      >
        <div className="space-y-6">
          <FormTextarea
            label="Logline"
            value={props.logline}
            onChange={(e) => props.setLogline(e.target.value)}
            placeholder="Brief one-sentence summary of the project"
            rows={3}
            helperText="A concise summary that captures the essence of your project"
          />
          <FormTextarea
            label="Synopsis"
            value={props.synopsis}
            onChange={(e) => props.setSynopsis(e.target.value)}
            placeholder="Detailed project description"
            rows={6}
            helperText="A comprehensive overview of your project's story and vision"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Genre"
              value={props.genre}
              onChange={(e) => props.setGenre(e.target.value)}
              placeholder="e.g., Drama, Comedy, Action"
            />
            <FormInput
              label="Director"
              value={props.director}
              onChange={(e) => props.setDirector(e.target.value)}
              placeholder="Director's name"
            />
            <FormInput
              label="Producer"
              value={props.producer}
              onChange={(e) => props.setProducer(e.target.value)}
              placeholder="Producer's name"
            />
          </div>
        </div>
      </FormFieldGroup>

      <FormFieldGroup 
        title="Schedule" 
        description="Project timeline and important dates"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Start Date"
            type="date"
            value={props.startDate}
            onChange={(e) => props.setStartDate(e.target.value)}
            helperText="When production is scheduled to begin"
          />
          <FormInput
            label="End Date"
            type="date"
            value={props.endDate}
            onChange={(e) => props.setEndDate(e.target.value)}
            helperText="Expected completion date"
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup 
        title="Media & Assets" 
        description="Visual content and project materials"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <ImageUploader onImageUploaded={props.handleCoverImageUploaded} />
            {props.coverImageUrl && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Cover image uploaded successfully
              </p>
            )}
          </div>
        </div>
      </FormFieldGroup>

      <FormFieldGroup 
        title="Contact & Additional Information" 
        description="Project website and contact details"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Project Website"
            value={props.projectWebsite}
            onChange={(e) => props.setProjectWebsite(e.target.value)}
            placeholder="https://project-website.com"
            helperText="Official project website or social media"
          />
          <FormInput
            label="Production Budget"
            value={props.productionBudget}
            onChange={(e) => props.setProductionBudget(e.target.value)}
            placeholder="e.g., $1M - $5M"
            helperText="Budget range or estimated cost"
          />
          <FormInput
            label="Company Contact"
            value={props.productionCompanyContact}
            onChange={(e) => props.setProductionCompanyContact(e.target.value)}
            placeholder="contact@company.com"
            helperText="Primary contact email for inquiries"
          />
        </div>
      </FormFieldGroup>
    </div>
  );
};

export default ProjectForm;