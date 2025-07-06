// Components
export { default as TaskManager } from './TaskManager';
export { default as TaskBoard } from './views/TaskBoard';
export { default as KanbanView } from './views/KanbanView';
export { default as ListView } from './views/ListView';
export { default as CalendarView } from './views/CalendarView';
export { default as TimelineView } from './views/TimelineView';
export { default as TaskCard } from './components/TaskCard';
export { default as TaskForm } from './components/TaskForm';
export { default as TaskFilters } from './components/TaskFilters';
export { default as TaskViewSwitcher } from './components/TaskViewSwitcher';

// Types
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskViewMode,
  TaskFilterOptions,
  TaskBoardProps,
  TaskFormData,
  TaskCardProps,
  Comment,
  Attachment,
  Column,
  KanbanBoardData,
} from './types';
