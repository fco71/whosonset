import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { CollaborativeTask, TaskSubtask, TaskTeamMember } from '../../types/ProjectManagement';
import './TaskForm.scss';

interface TaskFormProps {
  task?: CollaborativeTask;
  onSubmit: (taskData: Partial<CollaborativeTask>) => void;
  onCancel: () => void;
  projectId: string;
}

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  category: 'pre_production' | 'production' | 'post_production' | 'marketing' | 'distribution' | 'other';
  estimatedHours?: number;
  location?: string;
  budget?: number;
  notes?: string;
  tags: string[];
  assignedTeamMembers: TaskTeamMember[];
  subtasks: TaskSubtask[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, projectId }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'other',
    estimatedHours: 0,
    location: '',
    budget: 0,
    notes: '',
    tags: [],
    assignedTeamMembers: [],
    subtasks: []
  });

  const [availableTeamMembers, setAvailableTeamMembers] = useState<any[]>([]);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskForm, setSubtaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignedTo: '',
    dueDate: '',
    estimatedHours: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category,
        estimatedHours: task.estimatedHours || 0,
        location: task.location || '',
        budget: task.budget || 0,
        notes: task.notes || '',
        tags: task.tags || [],
        assignedTeamMembers: task.assignedTeamMembers || [],
        subtasks: task.subtasks || []
      });
    }
    loadTeamMembers();
  }, [task]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      // Load project crew members
      const crewQuery = query(
        collection(db, 'projectCrew'),
        where('projectId', '==', projectId)
      );
      const crewSnapshot = await getDocs(crewQuery);
      const crewMembers = crewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If no crew members found, create some mock data for demonstration
      if (crewMembers.length === 0) {
        const mockMembers = [
          { id: 'member-1', name: 'John Director', role: 'Director', email: 'john@example.com' },
          { id: 'member-2', name: 'Sarah Producer', role: 'Producer', email: 'sarah@example.com' },
          { id: 'member-3', name: 'Mike DP', role: 'Director of Photography', email: 'mike@example.com' },
          { id: 'member-4', name: 'Lisa Editor', role: 'Editor', email: 'lisa@example.com' },
          { id: 'member-5', name: 'Tom Sound', role: 'Sound Designer', email: 'tom@example.com' }
        ];
        setAvailableTeamMembers(mockMembers);
      } else {
        setAvailableTeamMembers(crewMembers);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      // Fallback to mock data
      const mockMembers = [
        { id: 'member-1', name: 'John Director', role: 'Director', email: 'john@example.com' },
        { id: 'member-2', name: 'Sarah Producer', role: 'Producer', email: 'sarah@example.com' },
        { id: 'member-3', name: 'Mike DP', role: 'Director of Photography', email: 'mike@example.com' },
        { id: 'member-4', name: 'Lisa Editor', role: 'Editor', email: 'lisa@example.com' },
        { id: 'member-5', name: 'Tom Sound', role: 'Sound Designer', email: 'tom@example.com' }
      ];
      setAvailableTeamMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleAddTeamMember = () => {
    const newMember: TaskTeamMember = {
      userId: '',
      role: 'contributor',
      assignedAt: new Date(),
      assignedBy: auth.currentUser?.uid || '',
      status: 'assigned',
      subtasks: [],
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      assignedTeamMembers: [...prev.assignedTeamMembers, newMember]
    }));
  };

  const handleTeamMemberChange = (index: number, field: keyof TaskTeamMember, value: any) => {
    setFormData(prev => ({
      ...prev,
      assignedTeamMembers: prev.assignedTeamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assignedTeamMembers: prev.assignedTeamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleAddSubtask = () => {
    if (subtaskForm.title.trim()) {
      const newSubtask: TaskSubtask = {
        id: Date.now().toString(),
        taskId: task?.id || '',
        title: subtaskForm.title,
        description: subtaskForm.description,
        status: 'pending',
        priority: subtaskForm.priority,
        assignedTo: subtaskForm.assignedTo,
        dueDate: subtaskForm.dueDate,
        estimatedHours: subtaskForm.estimatedHours,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
        dependencies: []
      };

      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSubtask]
      }));

      setSubtaskForm({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0
      });
      setShowSubtaskForm(false);
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TaskForm submitting with data:', formData);
    onSubmit(formData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <div className="form-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onCancel} className="close-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter task title"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the task..."
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="form-select"
                  style={{ borderLeftColor: getPriorityColor(formData.priority) }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="form-select"
                >
                  <option value="pre_production">Pre-Production</option>
                  <option value="production">Production</option>
                  <option value="post_production">Post-Production</option>
                  <option value="marketing">Marketing</option>
                  <option value="distribution">Distribution</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="form-input"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Task location"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Budget</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="form-section">
            <div className="section-header">
              <h3>Team Members</h3>
              <button
                type="button"
                onClick={handleAddTeamMember}
                className="btn-add"
              >
                + Add Member
              </button>
            </div>

            {formData.assignedTeamMembers.map((member, index) => (
              <div key={index} className="team-member-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>Member</label>
                    <select
                      value={member.userId}
                      onChange={(e) => handleTeamMemberChange(index, 'userId', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select team member</option>
                      {availableTeamMembers.map(teamMember => (
                        <option key={teamMember.id} value={teamMember.id}>
                          {teamMember.name} - {teamMember.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                      className="form-select"
                    >
                      <option value="contributor">Contributor</option>
                      <option value="lead">Lead</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="approver">Approver</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={member.status}
                      onChange={(e) => handleTeamMemberChange(index, 'status', e.target.value)}
                      className="form-select"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {formData.assignedTeamMembers.length === 0 && (
              <div className="empty-state">
                <p>No team members assigned yet.</p>
                <p>Click "Add Member" to assign team members to this task.</p>
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="form-section">
            <div className="section-header">
              <h3>Subtasks</h3>
              <button
                type="button"
                onClick={() => setShowSubtaskForm(true)}
                className="btn-add"
              >
                + Add Subtask
              </button>
            </div>

            {formData.subtasks.map((subtask, index) => (
              <div key={index} className="subtask-item">
                <div className="subtask-header">
                  <h4>{subtask.title}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="btn-remove-small"
                  >
                    ×
                  </button>
                </div>
                <p className="subtask-description">{subtask.description}</p>
                <div className="subtask-meta">
                  <span className={`priority-badge priority-${subtask.priority}`}>
                    {subtask.priority}
                  </span>
                  {subtask.assignedTo && (
                    <span className="assigned-to">
                      Assigned to: {availableTeamMembers.find(m => m.id === subtask.assignedTo)?.name || subtask.assignedTo}
                    </span>
                  )}
                  {subtask.dueDate && (
                    <span className="due-date">Due: {subtask.dueDate}</span>
                  )}
                </div>
              </div>
            ))}

            {formData.subtasks.length === 0 && (
              <div className="empty-state">
                <p>No subtasks created yet.</p>
                <p>Click "Add Subtask" to break down this task into smaller components.</p>
              </div>
            )}
          </div>

          {/* Subtask Form Modal */}
          {showSubtaskForm && (
            <div className="subtask-modal-overlay">
              <div className="subtask-modal">
                <div className="modal-header">
                  <h3>Add Subtask</h3>
                  <button onClick={() => setShowSubtaskForm(false)} className="close-btn">×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Subtask Title</label>
                    <input
                      type="text"
                      value={subtaskForm.title}
                      onChange={(e) => setSubtaskForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter subtask title"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={subtaskForm.description}
                      onChange={(e) => setSubtaskForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the subtask..."
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={subtaskForm.priority}
                        onChange={(e) => setSubtaskForm(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="form-select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Assigned To</label>
                      <select
                        value={subtaskForm.assignedTo}
                        onChange={(e) => setSubtaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="form-select"
                      >
                        <option value="">Select team member</option>
                        {availableTeamMembers.map(teamMember => (
                          <option key={teamMember.id} value={teamMember.id}>
                            {teamMember.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={subtaskForm.dueDate}
                        onChange={(e) => setSubtaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Estimated Hours</label>
                      <input
                        type="number"
                        value={subtaskForm.estimatedHours}
                        onChange={(e) => setSubtaskForm(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="form-input"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowSubtaskForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="button" onClick={handleAddSubtask} className="btn-primary">
                    Add Subtask
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="form-section">
            <h3>Additional Notes</h3>
            <div className="form-group full-width">
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes or requirements..."
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 