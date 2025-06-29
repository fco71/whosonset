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

      setAvailableTeamMembers(crewMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
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
    onSubmit(formData);
  };

  return (
    <div className="task-form">
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
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Enter task title"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Enter task description"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
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
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Estimated Hours</label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.5"
                placeholder="0"
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
                placeholder="Enter location"
              />
            </div>

            <div className="form-group">
              <label>Budget</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
                placeholder="Additional notes..."
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
              className="add-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Member
            </button>
          </div>

          {formData.assignedTeamMembers.map((member, index) => (
            <div key={index} className="team-member-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Team Member</label>
                  <select
                    value={member.userId}
                    onChange={(e) => handleTeamMemberChange(index, 'userId', e.target.value)}
                  >
                    <option value="">Select team member</option>
                    {availableTeamMembers.map(teamMember => (
                      <option key={teamMember.id} value={teamMember.crewMemberId}>
                        {teamMember.role} - {teamMember.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                  >
                    <option value="lead">Lead</option>
                    <option value="assistant">Assistant</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="contributor">Contributor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <input
                    type="text"
                    value={member.notes || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'notes', e.target.value)}
                    placeholder="Member notes"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTeamMember(index)}
                  className="remove-btn"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subtasks */}
        <div className="form-section">
          <div className="section-header">
            <h3>Subtasks</h3>
            <button
              type="button"
              onClick={() => setShowSubtaskForm(true)}
              className="add-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Subtask
            </button>
          </div>

          {formData.subtasks.map((subtask, index) => (
            <div key={subtask.id} className="subtask-row">
              <div className="subtask-header">
                <h4>{subtask.title}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                  className="remove-btn"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="subtask-description">{subtask.description}</p>
              <div className="subtask-meta">
                <span className="subtask-priority">{subtask.priority}</span>
                <span className="subtask-due">Due: {new Date(subtask.dueDate).toLocaleDateString()}</span>
                {subtask.estimatedHours && subtask.estimatedHours > 0 && (
                  <span className="subtask-hours">{subtask.estimatedHours}h</span>
                )}
              </div>
            </div>
          ))}

          {/* Subtask Form */}
          {showSubtaskForm && (
            <div className="subtask-form">
              <h4>Add Subtask</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={subtaskForm.title}
                    onChange={(e) => setSubtaskForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter subtask title"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={subtaskForm.description}
                    onChange={(e) => setSubtaskForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="Enter subtask description"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={subtaskForm.priority}
                    onChange={(e) => setSubtaskForm(prev => ({ ...prev, priority: e.target.value as any }))}
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
                  >
                    <option value="">Select team member</option>
                    {availableTeamMembers.map(teamMember => (
                      <option key={teamMember.id} value={teamMember.crewMemberId}>
                        {teamMember.role} - {teamMember.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="datetime-local"
                    value={subtaskForm.dueDate}
                    onChange={(e) => setSubtaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    value={subtaskForm.estimatedHours}
                    onChange={(e) => setSubtaskForm(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.5"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="subtask-form-actions">
                <button type="button" onClick={handleAddSubtask} className="btn-primary">
                  Add Subtask
                </button>
                <button type="button" onClick={() => setShowSubtaskForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {task ? 'Update Task' : 'Create Task'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 