// src/App.tsx
import React from 'react';
import styles from './App.module.css';
import ProjectList from './components/ProjectList';

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
        <div className={styles.container}>
            <h1 className={styles.heading}>Hello, {name}!</h1>
            <ProjectList projects={projects} />
        </div>
    );
};

export default App;