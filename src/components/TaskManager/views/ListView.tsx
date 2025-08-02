import React from 'react';
import { Task } from '../types';
import TaskCard from '../../CollaborativeTasks/TaskCard';

interface ListViewProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskSelect: (task: Task) => void;
  selectedTask?: Task | null;
}

const ListView: React.FC<ListViewProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskSelect,
  selectedTask,
}) => {
  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Create a new task to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={onTaskSelect}
              onEdit={onTaskUpdate}
              onDelete={onTaskDelete}
              onStatusChange={(taskId, status) =>
                onTaskUpdate({ ...task, status })
              }
              isSelected={selectedTask?.id === task.id}
              className="transition-all duration-200 hover:shadow-md"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;
