import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TaskCard from './TaskCard';
import { Task, TaskTeamMember } from '../TaskManager/types';

describe('TaskCard', () => {
  const mockTeamMember: TaskTeamMember = {
    userId: 'user-1',
    role: 'lead',
    assignedAt: new Date().toISOString(),
    assignedBy: 'system',
    status: 'accepted',
    subtasks: [],
    name: 'Test User',
    email: 'test@example.com',
    estimatedHours: 2,
    actualHours: 1.5,
    notes: 'Test assignment'
  };

  const mockTask: Task = {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignees: [mockTeamMember],
    assignedTeamMembers: [mockTeamMember],
    comments: [],
    reminders: [],
    subtasks: [],
    dependencies: [],
    tags: ['test', 'important'],
    attachments: [],
    category: 'production'
  };

  const mockOnSelect = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task title and description', () => {
    render(
      <TaskCard
        task={mockTask}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    fireEvent.click(screen.getByText('Test Task'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockTask);
  });

  it('toggles task status when checkbox is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const checkbox = screen.getByRole('button', { name: /mark as complete/i });
    fireEvent.click(checkbox);
    
    expect(mockOnStatusChange).toHaveBeenCalledWith('task-1', 'completed');
  });

  it('shows task tags', () => {
    render(
      <TaskCard
        task={mockTask}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('important')).toBeInTheDocument();
  });

  it('shows assigned team members', () => {
    render(
      <TaskCard
        task={mockTask}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    // Check if the user's initial is rendered in the avatar
    const avatarInitial = screen.getByTestId('user-avatar-initial');
    expect(avatarInitial).toHaveTextContent('T');
    
    // Verify the tooltip trigger is in the document
    const tooltipTrigger = screen.getByRole('button', { name: /Test User/ });
    expect(tooltipTrigger).toBeInTheDocument();
    
    // Tooltip content is not rendered by default (Radix UI renders it in a portal)
  });
});
