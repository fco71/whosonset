import React, { useState } from 'react';
import { ProjectCrew } from '../../types/ProjectManagement';

interface ProjectCrewManagementProps {
  projectId: string;
  crew: ProjectCrew[];
  onCrewUpdate: () => void;
}

const ProjectCrewManagement: React.FC<ProjectCrewManagementProps> = ({
  projectId,
  crew,
  onCrewUpdate
}) => {
  const [isAddingCrew, setIsAddingCrew] = useState(false);

  return (
    <div className="crew-section">
      <div className="section-header">
        <h3>Project Crew</h3>
        <button 
          className="add-crew"
          onClick={() => setIsAddingCrew(true)}
        >
          Add Crew Member
        </button>
      </div>
      
      <div className="crew-grid">
        {crew.length === 0 ? (
          <div className="empty-state">
            <p>No crew members added yet.</p>
            <button 
              className="add-first-crew"
              onClick={() => setIsAddingCrew(true)}
            >
              Add First Crew Member
            </button>
          </div>
        ) : (
          crew.map((member) => (
            <div key={member.id} className="crew-member-card">
              <div className="crew-header">
                <h4>{member.crewMemberId}</h4>
                <span className={`status-badge ${member.status}`}>
                  {member.status}
                </span>
              </div>
              <div className="crew-details">
                <div className="detail-row">
                  <span className="label">Role:</span>
                  <span className="value">{member.role}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Department:</span>
                  <span className="value">{member.department}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Dates:</span>
                  <span className="value">
                    {new Date(member.startDate).toLocaleDateString()}
                    {member.endDate && ` - ${new Date(member.endDate).toLocaleDateString()}`}
                  </span>
                </div>
                {member.salary && (
                  <div className="detail-row">
                    <span className="label">Salary:</span>
                    <span className="value">${member.salary.toLocaleString()}</span>
                  </div>
                )}
              </div>
              {member.notes && (
                <div className="crew-notes">
                  <p>{member.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectCrewManagement; 