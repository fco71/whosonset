import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import { Column } from '../types';

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
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'pending',
      title: 'To Do',
      status: 'pending',
      tasks: [],
      color: 'bg-blue-100 text-blue-800',
      icon: '📋'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: 'in_progress',
      tasks: [],
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🚧'
    },
    {
      id: 'completed',
      title: 'Done',
      status: 'completed',
      tasks: [],
      color: 'bg-green-100 text-green-800',
      icon: '✅'
    },
    {
      id: 'overdue',
      title: 'Overdue',
      status: 'overdue',
      tasks: [],
      color: 'bg-red-100 text-red-800',
      icon: '⚠️'
    }
  ]);

  // Update columns when tasks change
  React.useEffect(() => {
    const now = new Date();
    
    const updatedColumns = columns.map(column => {
      // Filter tasks for this column
      let columnTasks = tasks.filter(task => {
        // Check if task status matches column status
        const statusMatch = task.status === column.status;
        
        // For overdue tasks, check due date
        if (column.status === 'overdue') {
          return statusMatch || (task.dueDate && new Date(task.dueDate) < now);
        }
        
        return statusMatch;
      });
      
      // Sort tasks by priority and due date
      columnTasks = columnTasks.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const aPriority = priorityOrder[a.priority] || 3;
        const bPriority = priorityOrder[b.priority] || 3;
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // If same priority, sort by due date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        
        return 0;
      });
      
      return {
        ...column,
        tasks: columnTasks
      };
    });
    
    setColumns(updatedColumns);
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) {
      return;
    }

    // Find the task being moved
    const task = sourceColumn.tasks[source.index];
    
    if (!task) {
      return;
    }

    // Update task status if column changed
    if (source.droppableId !== destination.droppableId) {
      const updatedTask = {
        ...task,
        status: destColumn.status as Task['status']
      };
      
      // Update the task in the database
      onTaskUpdate(updatedTask);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-1 overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="flex flex-col w-80 bg-gray-50 rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="mr-2">{column.icon}</span>
                  <h3 className="font-medium text-gray-700">{column.title}</h3>
                  <span className="ml-2 text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
              </div>
              
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto space-y-2 min-h-[100px]"
                  >
                    {column.tasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={onTaskUpdate}
                        onDelete={onTaskDelete}
                        onClick={() => onTaskSelect(task)}
                        isSelected={selectedTaskId === task.id}
                      />
                    ))}
                    {provided.placeholder}
                    
                    {column.tasks.length === 0 && (
                      <div className="text-center text-gray-400 py-4 text-sm">
                        No tasks here
                      </div>
                    )}
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
