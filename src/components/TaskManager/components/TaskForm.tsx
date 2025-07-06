import React, { useState } from 'react';
import { Task } from '../types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
// Importing UI components with default imports since they might not have named exports
import Textarea from '../../ui/Textarea';
import Label from '../../ui/Label';
import Select from '../../ui/Select';
import Checkbox from '../../ui/Checkbox';
import Calendar from '../../ui/Calendar';
import { format, parseISO } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'pending');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as Task['status']);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as Task['priority']);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDueDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Partial<Task> = {
      ...(task || {}),
      title,
      description,
      priority,
      status,
      tags,
      updatedAt: new Date().toISOString(),
    };
    
    if (dueDate) {
      taskData.dueDate = dueDate.toISOString();
    }
    
    onSubmit(taskData);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Ensure proper typing for event handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Task title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Task description"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
            placeholder="Select priority"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'overdue', label: 'Overdue' },
            ]}
            placeholder="Select status"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <div className="flex items-center space-x-2">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            className="rounded-md border"
          />
          {dueDate && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setDueDate(undefined)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <div 
              key={tag} 
              className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full"
            >
              {tag}
              <button 
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={handleInputChange}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addTag}
            disabled={!newTag.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
