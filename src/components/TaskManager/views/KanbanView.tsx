import React, { useMemo, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';

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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back to its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Find the destination column config
    const destColumnConfig = columnConfigs.find(col => col && col.id === destination.droppableId);
    if (!destColumnConfig) return;

    // Find the task being moved
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;
    
    // Update the task status based on the destination column
    const updatedTask = {
      ...task,
      status: destColumnConfig.status
    };

    // Update the task in the parent component
    onTaskUpdate(updatedTask);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
              <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-gray-50'}`}
                  >
                    {column.tasks.map((task: Task) => (
                      <div key={task.id} className="mb-2">
                        <TaskCard
                          task={task}
                          onClick={onTaskSelect}
                          onUpdate={onTaskUpdate}
                          onDelete={onTaskDelete}
                          isSelected={selectedTaskId === task.id}
                        />
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
