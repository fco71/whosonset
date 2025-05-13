// src/components/ProjectList.tsx
import React from 'react';
import styles from './ProjectList.module.css';

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
        <div className={styles.container}>
            <h2 className={styles.heading}>Movie Projects</h2>
            <ul className={styles.list}>
                {projects.map(project => (
                    <li key={project.project_id} className={styles.listItem}>
                        <h3>{project.project_name}</h3>
                        <p>{project.logline}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;