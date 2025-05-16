// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Project {
  id: string;
  projectName: string;
  country: string;
  productionCompany: string;
  status: string;
  logline: string;
  synopsis: string;
  startDate: string;
  endDate: string;
  location: string;
  genre: string;
  director: string;
  producer: string;
  coverImageUrl: string;
  posterImageUrl: string;
  projectWebsite: string;
  productionBudget: string;
  productionCompanyContact: string;
  isVerified: boolean;
  owner_uid: string;
}

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          const projectDocRef = doc(db, 'Projects', projectId);
          const projectDocSnapshot = await getDoc(projectDocRef);

          if (projectDocSnapshot.exists()) {
            setProject({
              ...projectDocSnapshot.data() as Project,
              id: projectDocSnapshot.id,
            });
          } else {
            setError('Project not found.');
          }
        } else {
          setError('Project ID is missing.');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div>
      <h2>Project Detail</h2>
      <h3>{project.projectName}</h3>
      <p>Country: {project.country}</p>
      <p>Production Company: {project.productionCompany}</p>
      <p>Status: {project.status}</p>
      <p>Logline: {project.logline}</p>
      <p>Synopsis: {project.synopsis}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
      <p>Location: {project.location}</p>
      <p>Genre: {project.genre}</p>
      <p>Director: {project.director}</p>
      <p>Producer: {project.producer}</p>
      <p>Cover Image URL: {project.coverImageUrl}</p>
      <p>Poster Image URL: {project.posterImageUrl}</p>
      <p>Project Website: {project.projectWebsite}</p>
      <p>Production Budget: {project.productionBudget}</p>
      <p>Production Company Contact: {project.productionCompanyContact}</p>
      <p>Is Verified: {project.isVerified ? 'Yes' : 'No'}</p>
      {/* Display other project properties here */}
    </div>
  );
};

export default ProjectDetail;