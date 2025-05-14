import React from 'react';

interface Project {
    project_id: string;
    project_name: string;
    logline: string;
}

interface ProjectListProps {
    projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-4/5">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Movie Projects</h2>
            <ul>
                {projects.map(project => (
                    <li key={project.project_id} className="border-b border-gray-200 py-2">
                        <h3 className="text-lg font-medium text-gray-600">{project.project_name}</h3>
                        <p className="text-gray-500">{project.logline}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;