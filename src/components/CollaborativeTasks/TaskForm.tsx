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
      estimatedHours: 0,
      actualHours: 0,
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
    const newSubtask: TaskSubtask = {
      id: Date.now().toString(),
      taskId: task?.id || '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      estimatedHours: 0,
      actualHours: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: '',
      attachments: [],
      dependencies: []
    };
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
    setShowSubtaskForm(false);
  };

  const handleRemoveSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubtaskChange = (index: number, field: keyof TaskSubtask, value: any) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => 
        i === index ? { ...subtask, [field]: value } : subtask
      )
    }));
  };

  const handleCompleteSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => 
        i === index ? { 
          ...subtask, 
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        } : subtask
      )
    }));
  };

  const handleAssignMemberToSubtask = (subtaskIndex: number, memberId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => 
        i === subtaskIndex ? { ...subtask, assignedTo: memberId } : subtask
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Create notification for assigned team members
    const assignedMembers = formData.assignedTeamMembers.filter(member => member.userId);
    if (assignedMembers.length > 0) {
      // Here you would typically send notifications to assigned members
      console.log('Notifying assigned members:', assignedMembers);
    }

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

  // Handle Escape key to close form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

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
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="form-input"
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
                onClick={handleAddSubtask}
                className="btn-add"
              >
                + Add Subtask
              </button>
            </div>

            {formData.subtasks.map((subtask, index) => (
              <div key={index} className={`subtask-item ${subtask.status === 'completed' ? 'completed' : ''}`}>
                <div className="subtask-header">
                  <div className="subtask-title-section">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
                      placeholder="Enter subtask title"
                      className="subtask-title-input"
                    />
                    <div className="subtask-actions">
                      {subtask.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleCompleteSubtask(index)}
                          className="btn-complete-subtask"
                          title="Mark as completed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(index)}
                        className="btn-remove-small"
                        title="Remove subtask"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
                
                <textarea
                  value={subtask.description}
                  onChange={(e) => handleSubtaskChange(index, 'description', e.target.value)}
                  placeholder="Describe the subtask..."
                  className="subtask-description-input"
                  rows={2}
                />
                
                <div className="subtask-controls">
                  <div className="subtask-row">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={subtask.priority}
                        onChange={(e) => handleSubtaskChange(index, 'priority', e.target.value)}
                        className="form-select small"
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
                        value={subtask.assignedTo}
                        onChange={(e) => handleAssignMemberToSubtask(index, e.target.value)}
                        className="form-select small"
                      >
                        <option value="">Select member</option>
                        {availableTeamMembers.map(teamMember => (
                          <option key={teamMember.id} value={teamMember.id}>
                            {teamMember.name} - {teamMember.role}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={subtask.dueDate}
                        onChange={(e) => handleSubtaskChange(index, 'dueDate', e.target.value)}
                        className="form-input small"
                      />
                    </div>
                  </div>
                  
                  <div className="subtask-row">
                    <div className="form-group">
                      <label>Est. Hours</label>
                      <input
                        type="number"
                        value={subtask.estimatedHours || 0}
                        onChange={(e) => handleSubtaskChange(index, 'estimatedHours', parseFloat(e.target.value) || 0)}
                        className="form-input small"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={subtask.status}
                        onChange={(e) => handleSubtaskChange(index, 'status', e.target.value)}
                        className="form-select small"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Notes</label>
                      <input
                        type="text"
                        value={subtask.notes || ''}
                        onChange={(e) => handleSubtaskChange(index, 'notes', e.target.value)}
                        placeholder="Add notes..."
                        className="form-input small"
                      />
                    </div>
                  </div>
                </div>
                
                {subtask.assignedTo && (
                  <div className="subtask-assigned">
                    <span className="assigned-badge">
                      👤 {availableTeamMembers.find(m => m.id === subtask.assignedTo)?.name || subtask.assignedTo}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {formData.subtasks.length === 0 && (
              <div className="empty-state">
                <p>No subtasks created yet.</p>
                <p>Click "Add Subtask" to break down this task into smaller components.</p>
              </div>
            )}
          </div>

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