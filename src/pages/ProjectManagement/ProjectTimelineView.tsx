import React, { useState } from 'react';
import { ProjectTimeline } from '../../types/ProjectManagement';

interface ProjectTimelineViewProps {
  projectId: string;
  timeline: ProjectTimeline[];
  onTimelineUpdate: () => void;
}

const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({
  projectId,
  timeline,
  onTimelineUpdate
}) => {
  const [isAddingPhase, setIsAddingPhase] = useState(false);

  return (
    <div className="timeline-section">
      <div className="section-header">
        <h3>Project Timeline</h3>
        <button 
          className="add-phase"
          onClick={() => setIsAddingPhase(true)}
        >
          Add Phase
        </button>
      </div>
      
      <div className="timeline-container">
        {timeline.length === 0 ? (
          <div className="empty-state">
            <p>No timeline phases added yet.</p>
            <button 
              className="add-first-phase"
              onClick={() => setIsAddingPhase(true)}
            >
              Add First Phase
            </button>
          </div>
        ) : (
          <div className="timeline-phases">
            {timeline.map((phase) => (
              <div key={phase.id} className="timeline-phase">
                <div className="phase-header">
                  <h4>{phase.phase}</h4>
                  <span className={`status-badge ${phase.status}`}>
                    {phase.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="phase-dates">
                  {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                </div>
                <p className="phase-description">{phase.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimelineView; 