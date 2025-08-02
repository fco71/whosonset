# Task Manager Component

A comprehensive task management system with multiple view modes, filtering, and real-time updates.

## Features

- 🎯 Multiple view modes: Kanban board, List, Calendar, and Timeline
- 🔍 Advanced filtering and search capabilities
- 📱 Responsive design for all screen sizes
- 🔄 Real-time updates with Firebase Firestore
- 🎨 Modern UI with smooth animations and transitions
- 📝 Rich task details with descriptions, due dates, priorities, and more
- 👥 Task assignment and collaboration features
- 📅 Calendar integration for due date management
- 🏷️ Tagging and categorization
- 🔄 Drag and drop functionality

## Installation

1. Install the required dependencies:

```bash
npm install react-beautiful-dnd date-fns lucide-react react-day-picker
```

2. Import the TaskManager component:

```tsx
import { TaskManager } from '@/components/TaskManager';
```

## Usage

```tsx
<TaskManager projectId="your-project-id" />
```

## Components

### TaskManager

The main component that handles the task management interface.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | `string` | Yes | The ID of the project to manage tasks for |

### TaskBoard

Displays tasks in the selected view mode.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tasks` | `Task[]` | Yes | Array of tasks to display |
| `onTaskUpdate` | `(task: Task) => void` | Yes | Callback when a task is updated |
| `onTaskDelete` | `(taskId: string) => void` | Yes | Callback when a task is deleted |
| `onTaskSelect` | `(task: Task) => void` | Yes | Callback when a task is selected |
| `selectedTask` | `Task | null` | No | The currently selected task |
| `viewMode` | `TaskViewMode` | Yes | The current view mode ('kanban', 'list', 'calendar', 'timeline') |
| `onViewModeChange` | `(mode: TaskViewMode) => void` | Yes | Callback when the view mode changes |
| `filterOptions` | `TaskFilterOptions` | Yes | Current filter options |
| `onFilterChange` | `(filters: Partial<TaskFilterOptions>) => void` | Yes | Callback when filters change |
| `isLoading` | `boolean` | Yes | Whether tasks are loading |
| `error` | `Error | null` | No | Error object if loading failed |

### TaskForm

Form for creating and editing tasks.

### TaskCard

Displays a single task in card format.

### TaskFilters

Component for filtering tasks.

### TaskViewSwitcher

Component for switching between different task view modes.

## Types

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string[];
  projectId: string;
  tags?: string[];
  comments?: Comment[];
  attachments?: Attachment[];
  teamMembers?: TaskTeamMember[];
}
```

### TaskStatus

```typescript
type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
```

### TaskPriority

```typescript
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
```

### TaskViewMode

```typescript
type TaskViewMode = 'kanban' | 'list' | 'calendar' | 'timeline';
```

## Customization

You can customize the appearance and behavior of the TaskManager by:

1. Overriding the default styles using CSS classes
2. Creating custom view components and passing them to the TaskManager
3. Extending the Task interface to include additional fields
4. Customizing the task rendering by providing a custom TaskCard component

## Dependencies

- React
- Firebase/Firestore
- date-fns
- react-beautiful-dnd
- lucide-react
- react-day-picker

## Browser Support

The TaskManager component supports all modern browsers, including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
