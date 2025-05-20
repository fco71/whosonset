import React from 'react';
import ImageUploader from './ImageUploader';

interface ProjectFormProps {
  projectName: string;
  setProjectName: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
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
  location: string;
  setLocation: (value: string) => void;
  genre: string;
  setGenre: (value: string) => void;
  director: string;
  setDirector: (value: string) => void;
  producer: string;
  setProducer: (value: string) => void;
  coverImageUrl: string;
  setCoverImageUrl: (value: string) => void;
  posterImageUrl: string;
  setPosterImageUrl: (value: string) => void;
  projectWebsite: string;
  setProjectWebsite: (value: string) => void;
  productionBudget: string;
  setProductionBudget: (value: string) => void;
  productionCompanyContact: string;
  setProductionCompanyContact: (value: string) => void;
  isVerified: boolean;
  setIsVerified: (value: boolean) => void;
  handleCoverImageUploaded: (url: string) => void;
  handlePosterImageUploaded: (url: string) => void;
}

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="col-span-full text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4 mt-8">
    {title}
  </h3>
);

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-6 bg-gray-800 rounded-xl border border-gray-700">

      <SectionHeader title="General Info" />
      <Input label="Project Name" value={props.projectName} onChange={props.setProjectName} />
      <Input label="Country" value={props.country} onChange={props.setCountry} />
      <Input label="Production Company" value={props.productionCompany} onChange={props.setProductionCompany} />
      <Select
        label="Status"
        value={props.status}
        onChange={props.setStatus}
        options={["Pre-Production", "Filming", "Post-Production", "Completed", "Canceled"]}
      />

      <SectionHeader title="Creative Info" />
      <Textarea label="Logline" value={props.logline} onChange={props.setLogline} />
      <Textarea label="Synopsis" value={props.synopsis} onChange={props.setSynopsis} />
      <Input label="Genre" value={props.genre} onChange={props.setGenre} />
      <Input label="Director" value={props.director} onChange={props.setDirector} />
      <Input label="Producer" value={props.producer} onChange={props.setProducer} />

      <SectionHeader title="Schedule" />
      <Input label="Start Date" type="date" value={props.startDate} onChange={props.setStartDate} />
      <Input label="End Date" type="date" value={props.endDate} onChange={props.setEndDate} />
      <Input label="Location" value={props.location} onChange={props.setLocation} />

      <SectionHeader title="Images" />
      <div className="md:col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
          <ImageUploader onImageUploaded={props.handleCoverImageUploaded} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Poster Image</label>
          <ImageUploader onImageUploaded={props.handlePosterImageUploaded} />
        </div>
      </div>

      <SectionHeader title="Contact & Website" />
      <Input label="Project Website" value={props.projectWebsite} onChange={props.setProjectWebsite} />
      <Input label="Production Budget" value={props.productionBudget} onChange={props.setProductionBudget} />
      <Input label="Company Contact" value={props.productionCompanyContact} onChange={props.setProductionCompanyContact} />

      <SectionHeader title="Verification" />
      <div className="flex items-center space-x-2 md:col-span-2 mt-2">
        <input
          id="isVerified"
          type="checkbox"
          checked={props.isVerified}
          onChange={(e) => props.setIsVerified(e.target.checked)}
          className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
        />
        <label htmlFor="isVerified" className="text-sm text-gray-300">Is Verified</label>
      </div>
    </div>
  );
};

// Reusable Input
const Input = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-900 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Reusable Textarea
const Textarea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full bg-gray-900 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Reusable Select
const Select = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-900 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProjectForm;
