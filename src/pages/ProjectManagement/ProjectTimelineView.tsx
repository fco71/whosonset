import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { ProjectTimeline } from '../../types/ProjectManagement';

interface ProjectTimelineViewProps {
  projectId: string;
  timeline: ProjectTimeline | null;
  onTimelineUpdate: () => void;
}

interface MilestoneFormData {
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dependencies?: string[];
  notes?: string;
}

const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({
  projectId,
  timeline,
  onTimelineUpdate
}) => {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    dependencies: [],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const milestoneData = {
        ...formData,
        projectId,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingMilestone) {
        await updateDoc(doc(db, 'projectMilestones', editingMilestone), {
          ...milestoneData,
          updatedAt: new Date()
        });
        setEditingMilestone(null);
      } else {
        await addDoc(collection(db, 'projectMilestones'), milestoneData);
      }

      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        dependencies: [],
        notes: ''
      });
      setIsAddingMilestone(false);
      onTimelineUpdate();
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  const handleDelete = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await deleteDoc(doc(db, 'projectMilestones', milestoneId));
      onTimelineUpdate();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleEdit = (milestone: any) => {
    setEditingMilestone(milestone.id);
    setFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
      status: milestone.status,
      priority: milestone.priority,
      assignedTo: milestone.assignedTo || '',
      dependencies: milestone.dependencies || [],
      notes: milestone.notes || ''
    });
    setIsAddingMilestone(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Timeline</h2>
        <button
          onClick={() => setIsAddingMilestone(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Milestone
        </button>
      </div>

      {/* Timeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Total Milestones</h3>
          <p className="text-2xl font-bold text-blue-600">{timeline?.milestones?.length || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {timeline?.milestones?.filter(m => m.status === 'completed').length || 0}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {timeline?.milestones?.filter(m => m.status === 'in_progress').length || 0}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-900">Delayed</h3>
          <p className="text-2xl font-bold text-red-600">
            {timeline?.milestones?.filter(m => m.status === 'delayed').length || 0}
          </p>
        </div>
      </div>

      {/* Add/Edit Milestone Form */}
      {isAddingMilestone && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
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
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Team member name"
                />
              </div>
            </div>

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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingMilestone ? 'Update Milestone' : 'Add Milestone'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingMilestone(false);
                  setEditingMilestone(null);
                  setFormData({
                    title: '',
                    description: '',
                    dueDate: '',
                    status: 'pending',
                    priority: 'medium',
                    assignedTo: '',
                    dependencies: [],
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

      {/* Timeline Visualization */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
        {timeline?.milestones && timeline.milestones.length > 0 ? (
          <div className="space-y-4">
            {timeline.milestones.map((milestone, index) => (
              <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900" style={{ color: '#fff', fontWeight: 600 }}>{milestone.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {milestone.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                        {milestone.priority}
                      </span>
                    </div>
                    
                    {milestone.description && (
                      <p className="text-gray-600 mb-2" style={{ color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{milestone.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      {milestone.assignedTo && (
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Assigned to: {milestone.assignedTo}</span>
                      )}
                    </div>
                    
                    {milestone.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        {milestone.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(milestone)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No milestones added yet.</p>
            <p className="text-sm">Click "Add Milestone" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimelineView; 