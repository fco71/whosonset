import React, { useState } from 'react';
import { ProjectDocument } from '../../types/ProjectManagement';

interface ProjectDocumentsProps {
  projectId: string;
  documents: ProjectDocument[];
  onDocumentsUpdate: () => void;
}

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({
  projectId,
  documents,
  onDocumentsUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📎';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'script': return '#3b82f6';
      case 'contract': return '#10b981';
      case 'schedule': return '#f59e0b';
      case 'budget': return '#8b5cf6';
      case 'other': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="documents-section">
      <div className="section-header">
        <h3>Project Documents</h3>
        <button 
          className="upload-document"
          onClick={() => setIsUploading(true)}
        >
          Upload Document
        </button>
      </div>
      
      <div className="documents-grid">
        {documents.length === 0 ? (
          <div className="empty-state">
            <p>No documents uploaded yet.</p>
            <button 
              className="upload-first-document"
              onClick={() => setIsUploading(true)}
            >
              Upload First Document
            </button>
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="document-card">
              <div className="document-header">
                <span className="file-icon">{getFileIcon(document.fileType)}</span>
                <div className="document-info">
                  <h4 className="document-name">{document.fileName}</h4>
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(document.category) }}
                  >
                    {document.category}
                  </span>
                </div>
                <div className="document-actions">
                  <button className="download-btn">Download</button>
                  <button className="share-btn">Share</button>
                </div>
              </div>
              
              <div className="document-details">
                <div className="detail-row">
                  <span className="label">Uploaded by:</span>
                  <span className="value">{document.uploadedBy}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Access:</span>
                  <span className="value">
                    {document.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
              
              {document.description && (
                <div className="document-description">
                  <p>{document.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDocuments; 