import React from 'react';
import { TaskBoardProps } from '../types';
import { KanbanView, ListView, CalendarView, TimelineView } from './index';
import { TaskFilters, TaskViewSwitcher } from '../components';
import { Skeleton } from '../../ui/Skeleton';

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskSelect,
  selectedTask,
  viewMode,
  onViewModeChange,
  filterOptions,
  onFilterChange,
  isLoading,
  error
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-red-600">
          Error loading tasks: {error.message}
        </div>
      );
    }

    const viewProps = {
      tasks,
      onTaskUpdate,
      onTaskDelete,
      onTaskSelect,
      selectedTaskId: selectedTask?.id
    };

    switch (viewMode) {
      case 'kanban':
        return <KanbanView {...viewProps} />;
      case 'list':
        return <ListView {...viewProps} />;
      case 'calendar':
        return (
          <CalendarView
            {...viewProps}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        );
      case 'timeline':
        return <TimelineView {...viewProps} />;
      default:
        return <KanbanView {...viewProps} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="w-full sm:w-auto">
          <TaskFilters
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
            onClearFilters={() => onFilterChange({
              searchTerm: '',
              statuses: [],
              priorities: [],
              assignees: [],
              dueDate: { from: null, to: null },
              categories: [],
              tags: []
            })}
          />
        </div>
        <div className="w-full sm:w-auto">
          <TaskViewSwitcher
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default TaskBoard;
