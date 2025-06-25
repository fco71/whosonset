import React from 'react';
import { Link } from 'react-router-dom';
import { JobPosting } from '../../types/JobApplication';
import './JobCard.scss';

interface JobCardProps {
  job: JobPosting;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Salary not specified';
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          {job.isUrgent && <span className="urgent-badge">Urgent</span>}
        </div>
        <div className="job-meta">
          <span className="department">{job.department}</span>
          <span className="location">{job.location}</span>
          {job.isRemote && <span className="remote-badge">Remote</span>}
        </div>
      </div>

      <div className="job-card-body">
        <p className="job-description">
          {job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description
          }
        </p>

        <div className="job-details">
          <div className="detail-item">
            <span className="detail-label">Salary:</span>
            <span className="detail-value">{formatSalary(job.salary)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">{new Date(job.startDate).toLocaleDateString()}</span>
          </div>

          {job.endDate && (
            <div className="detail-item">
              <span className="detail-label">End Date:</span>
              <span className="detail-value">{new Date(job.endDate).toLocaleDateString()}</span>
            </div>
          )}

          {job.deadline && (
            <div className="detail-item">
              <span className="detail-label">Application Deadline:</span>
              <span className="detail-value deadline">
                {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="job-tags">
          {job.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {job.tags.length > 3 && (
            <span className="tag more-tags">+{job.tags.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-stats">
          <span className="applications-count">
            {job.applicationsCount} application{job.applicationsCount !== 1 ? 's' : ''}
          </span>
          <span className="posted-date">Posted {formatDate(job.postedAt)}</span>
        </div>
        
        <div className="job-actions">
          <Link to={`/jobs/${job.id}`} className="view-job-btn">
            View Details
          </Link>
          <Link to={`/jobs/${job.id}/apply`} className="apply-job-btn">
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 