// src/components/Home.tsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';

interface Project {
  id: string;
  projectName: string;
  country: string;
  productionCompany: string;
  status: string;
  logline: string;
  synopsis: string;
  owner_uid: string;
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
      <h2>Home</h2>
      <div className="projects-container">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.projectName}</h3>
            <p>Country: {project.country}</p>
            <p>Production Company: {project.productionCompany}</p>
            <p>Status: {project.status}</p>
            <p>Logline: {project.logline}</p>
            <p>Synopsis: {project.synopsis}</p>
            {/* Display more project properties here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;