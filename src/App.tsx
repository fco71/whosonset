// src/App.tsx
import React from 'react';
import ProjectList from './components/ProjectList';
import './index.css';

interface AppProps {
    name: string;
}

const App: React.FC<AppProps> = ({ name }) => {
    const projects = [
        { project_id: '1', project_name: 'Project A', logline: 'A thrilling adventure.' },
        { project_id: '2', project_name: 'Project B', logline: 'A heartwarming romance.' },
        { project_id: '3', project_name: 'Project C', logline: 'A hilarious comedy.' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello, {name}!</h1>
            <ProjectList projects={projects} />
        </div>
    );
};

export default App;