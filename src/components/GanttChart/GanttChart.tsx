import React, { useState, useEffect } from 'react';
import { ProjectTimeline } from '../../types/ProjectManagement';
import './GanttChart.scss';

interface GanttChartProps {
  timeline: ProjectTimeline[];
  projectStartDate: string;
  projectEndDate: string;
  height?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  timeline, 
  projectStartDate, 
  projectEndDate, 
  height = 400 
}) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const projectStart = new Date(projectStartDate);
  const projectEnd = new Date(projectEndDate);
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));

  const getTaskPosition = (task: ProjectTimeline) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const startOffset = Math.max(0, (taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskDuration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = (startOffset / totalDays) * 100;
    const width = (taskDuration / totalDays) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#6BCF7F';
      case 'in_progress': return '#4D96FF';
      case 'planned': return '#FFD93D';
      case 'delayed': return '#FF6B6B';
      default: return '#999';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayLabels = () => {
    const labels = [];
    const currentDate = new Date(projectStart);
    
    for (let i = 0; i <= totalDays; i += Math.max(1, Math.floor(totalDays / 10))) {
      labels.push({
        date: new Date(currentDate),
        position: (i / totalDays) * 100
      });
      currentDate.setDate(currentDate.getDate() + Math.max(1, Math.floor(totalDays / 10)));
    }
    
    return labels;
  };

  const dayLabels = getDayLabels();

  return (
    <div className="gantt-chart" style={{ height }}>
      <div className="gantt-header">
        <div className="task-labels">
          <div className="label-header">Tasks</div>
          {timeline.map(task => (
            <div key={task.id} className="task-label">
              {task.phase}
            </div>
          ))}
        </div>
        
        <div className="timeline-header">
          <div className="timeline-labels">
            {dayLabels.map((label, index) => (
              <div 
                key={index} 
                className="day-label"
                style={{ left: `${label.position}%` }}
              >
                {formatDate(label.date.toISOString())}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gantt-body">
        <div className="task-rows">
          {timeline.map((task, index) => {
            const position = getTaskPosition(task);
            const isHovered = hoveredTask === task.id;
            
            return (
              <div 
                key={task.id} 
                className="task-row"
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="task-bar-container">
                  <div
                    className={`task-bar ${task.status} ${isHovered ? 'hovered' : ''}`}
                    style={{
                      left: position.left,
                      width: position.width,
                      backgroundColor: getStatusColor(task.status)
                    }}
                    title={`${task.phase}: ${formatDate(task.startDate)} - ${formatDate(task.endDate)}`}
                  >
                    <div className="task-bar-content">
                      <span className="task-name">{task.phase}</span>
                      <span className="task-dates">
                        {formatDate(task.startDate)} - {formatDate(task.endDate)}
                      </span>
                    </div>
                  </div>
                  
                  {isHovered && (
                    <div className="task-tooltip">
                      <h4>{task.phase}</h4>
                      <p><strong>Status:</strong> {task.status.replace('_', ' ')}</p>
                      <p><strong>Duration:</strong> {Math.ceil((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                      <p><strong>Description:</strong> {task.description}</p>
                      {task.budget && <p><strong>Budget:</strong> ${task.budget.toLocaleString()}</p>}
                      {task.notes && <p><strong>Notes:</strong> {task.notes}</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="timeline-grid">
          {dayLabels.map((label, index) => (
            <div 
              key={index} 
              className="grid-line"
              style={{ left: `${label.position}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="gantt-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#6BCF7F' }}></div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4D96FF' }}></div>
          <span>In Progress</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD93D' }}></div>
          <span>Planned</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></div>
          <span>Delayed</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart; 