// src/components/ProjectForm.tsx
import React, { useState } from 'react';
import { Project } from '../models/Project';

interface ProjectFormProps {}

const ProjectForm: React.FC<ProjectFormProps> = () => {
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState(''); // Consider using a date picker library
    const [principalPhotographyStartDate, setPrincipalPhotographyStartDate] = useState('');
    const [endOfPrincipalPhotographyDate, setEndOfPrincipalPhotographyDate] = useState('');
    const [castAndCrew, setCastAndCrew] = useState(''); // Consider using a more structured data type

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">
                    Project Name:
                </label>
                <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Start Date:
                </label>
                <input
                    type="text"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="principalPhotographyStartDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Principal Photography Start Date:
                </label>
                <input
                    type="text"
                    id="principalPhotographyStartDate"
                    value={principalPhotographyStartDate}
                    onChange={(e) => setPrincipalPhotographyStartDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="endOfPrincipalPhotographyDate" className="block text-gray-700 text-sm font-bold mb-2">
                    End of Principal Photography Date:
                </label>
                <input
                    type="text"
                    id="endOfPrincipalPhotographyDate"
                    value={endOfPrincipalPhotographyDate}
                    onChange={(e) => setEndOfPrincipalPhotographyDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="castAndCrew" className="block text-gray-700 text-sm font-bold mb-2">
                    Cast and Crew:
                </label>
                <input
                    type="text"
                    id="castAndCrew"
                    value={castAndCrew}
                    onChange={(e) => setCastAndCrew(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Project
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;