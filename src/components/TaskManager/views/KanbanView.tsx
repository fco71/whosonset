import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';

// Droppable column wrapper using @dnd-kit's useDroppable hook.
// Replaces react-beautiful-dnd's <Droppable> render-prop API.
interface KanbanColumnProps {
  columnId: string;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ columnId, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id: columnId });
  return (
    <div
      ref={setNodeRef}
      className={`p-2 min-h-[200px] transition-colors ${isOver ? 'bg-gray-100' : 'bg-gray-50'}`}
    >
      {children}
    </div>
  );
};

interface KanbanViewProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: string;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskSelect,
  selectedTaskId
}) => {
  // Define column configurations with proper types
  interface ColumnConfig {
    id: string;
    title: string;
    status: TaskStatus;
    color: string;
    icon: string;
  }

  const columnConfigs: ColumnConfig[] = [
    {
      id: 'pending',
      title: 'To Do',
      status: 'pending',
      color: 'bg-blue-100 text-blue-800',
      icon: '📋',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: 'in_progress',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🚧',
    },
    {
      id: 'completed',
      title: 'Done',
      status: 'completed',
      color: 'bg-green-100 text-green-800',
      icon: '✅',
    },
    {
      id: 'overdue',
      title: 'Overdue',
      status: 'overdue',
      color: 'bg-red-100 text-red-800',
      icon: '⚠️',
    },
  ];

  // Extend ColumnConfig with task-related properties
  interface Column extends ColumnConfig {
    tasks: Task[];
    taskIds: string[];
  }

  // Create columns with tasks based on the current tasks prop
  const columns = React.useMemo<Column[]>(() => {
    return columnConfigs.map(columnConfig => {
      const columnTasks = tasks.filter((task: Task) => {
        const statusMatch = task.status === columnConfig.status;
        
        // Special case for overdue tasks
        if (columnConfig.status === 'overdue') {
          if (!task.dueDate) return false;
          
          let dueDate: Date;
          const dueDateValue = task.dueDate as unknown;
          
          if (dueDateValue instanceof Date) {
            dueDate = dueDateValue;
          } else if (typeof dueDateValue === 'string') {
            dueDate = new Date(dueDateValue);
          } else if (dueDateValue && 
                    typeof dueDateValue === 'object' && 
                    'toDate' in dueDateValue && 
                    typeof (dueDateValue as { toDate: () => Date }).toDate === 'function') {
            dueDate = (dueDateValue as { toDate: () => Date }).toDate();
          } else {
            return false;
          }
          
          return dueDate < new Date() && task.status !== 'completed';
        }
        
        return statusMatch;
      });
      
      return {
        ...columnConfig,
        tasks: columnTasks,
        taskIds: columnTasks.map((t: Task) => t.id)
      };
    });
  }, [tasks]);

  // @dnd-kit drag-end handler.
  // active.id = task id being dragged; over?.id = column id it was dropped on.
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const draggableId = String(active.id);
    const destColumnId = String(over.id);

    // Don't update if dropped on a column the task is already in.
    const destColumnConfig = columnConfigs.find(col => col && col.id === destColumnId);
    if (!destColumnConfig) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task || task.status === destColumnConfig.status) return;

    onTaskUpdate({ ...task, status: destColumnConfig.status });
  };

  // Require a small pointer movement before dragging so card buttons (e.g. the
  // complete-checkbox) stay clickable.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="flex flex-1 overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 min-w-64">
              <div className={`p-2 rounded-t-lg ${column.color} flex items-center justify-between`}>
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <KanbanColumn columnId={column.id}>
                {column.tasks.map((task: Task) => (
                  // Pre-existing latent bug fixed: previously TaskCard was rendered
                  // without `index` so its inner Draggable wrapper never activated —
                  // the kanban looked draggable but cards weren't actually draggable.
                  // We now pass `draggable` so the card hooks into @dnd-kit's drag system.
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskSelect}
                    onUpdate={onTaskUpdate}
                    onDelete={onTaskDelete}
                    isSelected={selectedTaskId === task.id}
                    draggable
                  />
                ))}
              </KanbanColumn>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default KanbanView;
