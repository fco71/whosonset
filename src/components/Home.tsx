import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link

interface Project {
    id: string;
    projectName: string;
    country: string;
    productionCompany: string;
    status: string;
    logline: string;
    synopsis: string;
    owner_uid: string;
    coverImageUrl: string;
    // Add more properties here to match your project data
}

const Home: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const projectsCollectionRef = collection(db, 'Projects');
            try {
                const querySnapshot = await getDocs(projectsCollectionRef);
                const projectsData: Project[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as Omit<Project, 'id'>,
                }));
                setProjects(projectsData);
            } catch (error: any) {
                console.error('Error fetching projects:', error.message);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <section className="hero">
                <h1>whosonset</h1>
                <p>Discover the latest movie productions and the talented crews behind them.</p>
                <Link to="/projects" className="btn-primary">Explore Projects</Link>
            </section>

            <h2>Recent Projects</h2>
            <div className="projects-container">
                {projects.map(project => (
                    <div key={project.id} className="project-card">
                        {project.coverImageUrl && (
                            <img src={project.coverImageUrl} alt={project.projectName} className="project-image" />
                        )}
                        <h3>
                            <Link to={`/projects/${project.id}`} className="project-link">{project.projectName}</Link>
                        </h3>
                        <p>Country: {project.country}</p>
                        <p>Status: {project.status}</p>
                        <p>Logline: {project.logline}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;