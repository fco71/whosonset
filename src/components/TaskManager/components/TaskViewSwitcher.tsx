import React from 'react';
import { TaskViewMode } from '../types';
import { Button } from '../../ui/Button';
import { LayoutGrid, List, Calendar, GanttChart } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TaskViewSwitcherProps {
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
  className?: string;
}

const viewModes = [
  { 
    mode: 'kanban' as const, 
    label: 'Board', 
    icon: <LayoutGrid className="h-4 w-4" /> 
  },
  { 
    mode: 'list' as const, 
    label: 'List', 
    icon: <List className="h-4 w-4" /> 
  },
  { 
    mode: 'calendar' as const, 
    label: 'Calendar', 
    icon: <Calendar className="h-4 w-4" /> 
  },
  { 
    mode: 'timeline' as const, 
    label: 'Timeline', 
    icon: <GanttChart className="h-4 w-4" /> 
  },
];

const TaskViewSwitcher: React.FC<TaskViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-1 p-1 bg-gray-100 rounded-lg", className)}>
      {viewModes.map(({ mode, label, icon }) => (
        <Button
          key={mode}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-md',
            viewMode === mode
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
            'transition-colors duration-150'
          )}
          onClick={() => onViewModeChange(mode)}
        >
          <span className="text-gray-600">{icon}</span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default TaskViewSwitcher;
