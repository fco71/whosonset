import React, { useState } from 'react';
import { Task } from '../types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { format, parseISO } from 'date-fns';

// Simple Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  className = '',
  ...props
}) => (
  <select
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Simple UI components for the form
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  className,
  ...props
}) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${className}`}
    ref={ref}
    {...props}
  />
));
Checkbox.displayName = 'Checkbox';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  className,
}) => {
  return (
    <div className={className}>
      <Input
        type="date"
        value={selected ? format(selected, 'yyyy-MM-dd') : ''}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : undefined;
          onSelect?.(date);
        }}
      />
    </div>
  );
};

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
  // Handle dueDate with proper typing (Date | null | undefined)
  const [dueDate, setDueDate] = useState<Date | null | undefined>(() => {
    if (!task?.dueDate) return null;
    try {
      return task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    } catch (e) {
      console.error('Invalid date format for dueDate:', task.dueDate, e);
      return null;
    }
  });
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleStatusChange = (value: string) => {
    setStatus(value as Task['status']);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as Task['priority']);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDueDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new task data object with proper typing
    const taskData: Partial<Task> = {
      ...(task || {}),
      title,
      description,
      priority,
      status,
      tags,
      updatedAt: new Date()
    };
    
    // Set dueDate with proper type handling
    // The Task interface expects Date | null | undefined
    taskData.dueDate = dueDate || null;
    
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

  // Event handlers with proper typing
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
            onValueChange={(value) => setPriority(value as Task['priority'])}
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
            onValueChange={(value) => setStatus(value as Task['status'])}
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
            selected={dueDate || undefined}
            onSelect={(date) => setDueDate(date || null)}
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
