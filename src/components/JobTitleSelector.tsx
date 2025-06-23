// components/JobTitleSelector.tsx

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// --- (CHANGE 1) ---
// Define the interface for the props your component will receive from its parent.
interface JobTitleSelectorProps {
  selectedDepartment: string;
  selectedJobTitle: string;
  onDepartmentChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
}

interface Department {
  id: string;
  name: string;
  jobTitles: string[];
}

// --- (CHANGE 2) ---
// Apply the props interface to the component and destructure the props.
const JobTitleSelector: React.FC<JobTitleSelectorProps> = ({
  selectedDepartment,
  selectedJobTitle,
  onDepartmentChange,
  onJobTitleChange,
}) => {
  // We still keep the state for the data fetched from Firestore.
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  
  // --- (REMOVED) ---
  // The component no longer manages its own selection state.
  // const [selectedDept, setSelectedDept] = useState("");
  // const [selectedTitle, setSelectedTitle] = useState("");
  // const [customTitle, setCustomTitle] = useState("");

  const db = getFirestore();

  useEffect(() => {
    const fetchDepartments = async () => {
      const snapshot = await getDocs(collection(db, "jobDepartments"));
      const deptData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Department[];
      setDepartments(deptData);
    };
    fetchDepartments();
  }, [db]); // Added db to dependency array as a best practice.

  // --- (CHANGE 3) ---
  // When the selectedDepartment prop changes, update the available job titles.
  useEffect(() => {
    if (selectedDepartment && selectedDepartment !== "Other") {
      const dept = departments.find((d) => d.name === selectedDepartment);
      setJobTitles(dept?.jobTitles || []);
    } else {
      setJobTitles([]);
    }
  }, [selectedDepartment, departments]);

  // This function now calls the parent's functions instead of setting local state.
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDepartment = e.target.value;
    onDepartmentChange(newDepartment);
    onJobTitleChange(""); // Reset the job title when department changes
  };

  // The handleTitleChange now simply calls the parent's function.
  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onJobTitleChange(e.target.value);
  };

  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      {/* Department Dropdown */}
      <div>
        <label className="block text-sm font-medium">Department</label>
        {/* --- (CHANGE 4) --- Use props for value and the new handler for onChange */}
        <select
          value={selectedDepartment}
          onChange={handleDeptChange}
          className="mt-1 border px-3 py-2 rounded w-full"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Job Title Selector */}
      <div>
        <label className="block text-sm font-medium">Job Title</label>
        {/* --- (CHANGE 5) --- The "Other" input now uses the parent's state directly */}
        {selectedDepartment === "Other" ? (
          <input
            type="text"
            value={selectedJobTitle} // Use the job title prop for the value
            onChange={(e) => onJobTitleChange(e.target.value)} // Update parent state on change
            placeholder="Enter your job title"
            className="mt-1 border px-3 py-2 rounded w-full"
          />
        ) : (
          <select
            value={selectedJobTitle}
            onChange={handleTitleChange}
            className="mt-1 border px-3 py-2 rounded w-full"
            disabled={!selectedDepartment}
          >
            <option value="">Select Job Title</option>
            {jobTitles.map((title, idx) => (
              <option key={idx} value={title}>
                {title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default JobTitleSelector;