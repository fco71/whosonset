import React from 'react';
import ImageUploader from './ImageUploader';

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

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="col-span-full text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-8">
    {title}
  </h3>
);

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

      <SectionHeader title="General Info" />
      <Input label="Project Name" value={props.projectName} onChange={props.setProjectName} />
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

      <SectionHeader title="Images" />
      <div className="md:col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <ImageUploader onImageUploaded={props.handleCoverImageUploaded} />
        </div>
      </div>

      <SectionHeader title="Contact & Website" />
      <Input label="Project Website" value={props.projectWebsite} onChange={props.setProjectWebsite} />
      <Input label="Production Budget" value={props.productionBudget} onChange={props.setProductionBudget} />
      <Input label="Company Contact" value={props.productionCompanyContact} onChange={props.setProductionCompanyContact} />
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
      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProjectForm;