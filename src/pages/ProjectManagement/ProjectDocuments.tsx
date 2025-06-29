import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '../../firebase';
import { ProjectDocument } from '../../types/ProjectManagement';

interface ProjectDocumentsProps {
  projectId: string;
  documents: ProjectDocument[];
  onDocumentsUpdate: () => void;
}

interface DocumentFormData {
  title: string;
  description?: string;
  category: 'script' | 'contract' | 'schedule' | 'budget' | 'call_sheet' | 'other';
  version: string;
  tags: string[];
  notes?: string;
}

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({
  projectId,
  documents,
  onDocumentsUpdate
}) => {
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    description: '',
    category: 'other',
    version: '1.0',
    tags: [],
    notes: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !selectedFile) return;

    setUploadingFile(true);
    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `project-documents/${projectId}/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);

      const documentData = {
        ...formData,
        projectId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        downloadURL,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingDocument) {
        await updateDoc(doc(db, 'projectDocuments', editingDocument), {
          ...documentData,
          updatedAt: new Date()
        });
        setEditingDocument(null);
      } else {
        await addDoc(collection(db, 'projectDocuments'), documentData);
      }

      setFormData({
        title: '',
        description: '',
        category: 'other',
        version: '1.0',
        tags: [],
        notes: ''
      });
      setSelectedFile(null);
      setIsAddingDocument(false);
      onDocumentsUpdate();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (document: ProjectDocument) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from Storage
      if (document.downloadURL) {
        const fileRef = ref(storage, document.downloadURL);
        await deleteObject(fileRef);
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'projectDocuments', document.id));
      onDocumentsUpdate();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEdit = (document: ProjectDocument) => {
    setEditingDocument(document.id);
    setFormData({
      title: document.title ?? '',
      description: document.description ?? '',
      category: document.category ?? 'other',
      version: document.version ?? '',
      tags: document.tags ?? [],
      notes: document.notes ?? ''
    });
    setIsAddingDocument(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'script': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'schedule': return 'bg-green-100 text-green-800';
      case 'budget': return 'bg-yellow-100 text-yellow-800';
      case 'call_sheet': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'script': return '📄';
      case 'contract': return '📋';
      case 'schedule': return '📅';
      case 'budget': return '💰';
      case 'call_sheet': return '📞';
      default: return '📁';
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, ProjectDocument[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Documents</h2>
        <button
          onClick={() => setIsAddingDocument(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Upload Document
        </button>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Total Documents</h3>
          <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Total Size</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatFileSize(documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0))}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">{Object.keys(groupedDocuments).length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900">Latest Upload</h3>
          <p className="text-sm font-bold text-yellow-600">
            {documents.length > 0 
              ? new Date(Math.max(...documents.map(d => d.createdAt?.toDate?.() || d.createdAt))).toLocaleDateString()
              : 'None'
            }
          </p>
        </div>
      </div>

      {/* Upload Document Form */}
      {isAddingDocument && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingDocument ? 'Edit Document' : 'Upload New Document'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="script">Script</option>
                  <option value="contract">Contract</option>
                  <option value="schedule">Schedule</option>
                  <option value="budget">Budget</option>
                  <option value="call_sheet">Call Sheet</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="important, draft, final"
                />
              </div>
            </div>

            {!editingDocument && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File *
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploadingFile || (!editingDocument && !selectedFile)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {uploadingFile && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {editingDocument ? 'Update Document' : 'Upload Document'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingDocument(false);
                  setEditingDocument(null);
                  setSelectedFile(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: 'other',
                    version: '1.0',
                    tags: [],
                    notes: ''
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents by Category */}
      <div className="space-y-6">
        {Object.keys(groupedDocuments).length > 0 ? (
          Object.entries(groupedDocuments).map(([category, docs]) => (
            <div key={category} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span>{getCategoryIcon(category)}</span>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <span className="text-sm text-gray-500">({docs.length})</span>
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {docs.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{document.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{document.fileName}</span>
                          <span>•</span>
                          <span>{formatFileSize(document.fileSize || 0)}</span>
                          <span>•</span>
                          <span>v{document.version}</span>
                          <span>•</span>
                          <span>{new Date(document.createdAt?.toDate?.() || document.createdAt).toLocaleDateString()}</span>
                        </div>
                        {document.description && (
                          <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                        )}
                        {document.tags && document.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {document.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={document.downloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleEdit(document)}
                        className="text-gray-600 hover:text-gray-800 p-2"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(document)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No documents uploaded yet.</p>
            <p className="text-sm">Click "Upload Document" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDocuments; 