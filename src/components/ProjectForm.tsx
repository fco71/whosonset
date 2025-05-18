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

const ProjectForm: React.FC<ProjectFormProps> = ({
  projectName,
  setProjectName,
  country,
  setCountry,
  productionCompany,
  setProductionCompany,
  status,
  setStatus,
  logline,
  setLogline,
  synopsis,
  setSynopsis,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  location,
  setLocation,
  genre,
  setGenre,
  director,
  setDirector,
  producer,
  setProducer,
  coverImageUrl,
  setCoverImageUrl,
  posterImageUrl,
  setPosterImageUrl,
  projectWebsite,
  setProjectWebsite,
  productionBudget,
  setProductionBudget,
  productionCompanyContact,
  setProductionCompanyContact,
  isVerified,
  setIsVerified,
  handleCoverImageUploaded,
  handlePosterImageUploaded
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow">
      {/** Text Inputs */}
      <Input label="Project Name" value={projectName} onChange={setProjectName} />
      <Input label="Country" value={country} onChange={setCountry} />
      <Input label="Production Company" value={productionCompany} onChange={setProductionCompany} />
      <Select
        label="Status"
        value={status}
        onChange={setStatus}
        options={["Pre-Production", "Filming", "Post-Production", "Completed", "Canceled"]}
      />
      <Textarea label="Logline" value={logline} onChange={setLogline} />
      <Textarea label="Synopsis" value={synopsis} onChange={setSynopsis} />
      <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} />
      <Input label="End Date" type="date" value={endDate} onChange={setEndDate} />
      <Input label="Location" value={location} onChange={setLocation} />
      <Input label="Genre" value={genre} onChange={setGenre} />
      <Input label="Director" value={director} onChange={setDirector} />
      <Input label="Producer" value={producer} onChange={setProducer} />

      {/** Image Uploaders */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
        <ImageUploader onImageUploaded={handleCoverImageUploaded} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Poster Image</label>
        <ImageUploader onImageUploaded={handlePosterImageUploaded} />
      </div>

      {/** Remaining Inputs */}
      <Input label="Project Website" value={projectWebsite} onChange={setProjectWebsite} />
      <Input label="Production Budget" value={productionBudget} onChange={setProductionBudget} />
      <Input label="Company Contact" value={productionCompanyContact} onChange={setProductionCompanyContact} />

      <div className="flex items-center space-x-2 md:col-span-2">
        <input
          id="isVerified"
          type="checkbox"
          checked={isVerified}
          onChange={(e) => setIsVerified(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isVerified" className="text-sm text-gray-700">Is Verified</label>
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
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProjectForm;
