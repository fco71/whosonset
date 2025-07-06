import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Clock, MessageSquare, Paperclip } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
  isSelected: boolean;
  isDragging?: boolean;
  index?: number;
}

const priorityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  overdue: 'bg-red-100 text-red-800',
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onClick,
  isSelected,
  isDragging = false,
  index = 0,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(task);
  };

  const handleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onUpdate({
      ...task,
      status: e.target.checked ? 'completed' : 'pending',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  
  const cardContent = (
    <div
      className={cn(
        'p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
        isSelected && 'ring-2 ring-blue-500',
        isDragging && 'shadow-lg transform rotate-1',
        isOverdue && 'border-l-4 border-l-red-500'
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={handleComplete}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
        </div>
        
        <div className="flex space-x-1">
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs font-medium',
              priorityColors[task.priority] || priorityColors.low
            )}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags?.map((tag) => (
          <span 
            key={tag} 
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <div className={cn("flex items-center", isOverdue ? 'text-red-500 font-medium' : 'text-gray-500')}>
              <Clock className="h-3.5 w-3.5 mr-1" />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
          
          {task.comments?.length > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              {task.comments.length}
            </div>
          )}
          
          {task.attachments?.length > 0 && (
            <div className="flex items-center">
              <Paperclip className="h-3.5 w-3.5 mr-1" />
              {task.attachments.length}
            </div>
          )}
        </div>
        
        <div className="flex -space-x-2">
          {task.assignedTeamMembers?.slice(0, 3).map((member, i) => (
            <Avatar key={i} className="h-6 w-6 border-2 border-white">
              <AvatarImage src={member.avatar} alt={member.userId} />
              <AvatarFallback className="text-xs">
                {member.userId?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {task.assignedTeamMembers?.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
              +{task.assignedTeamMembers.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // If we're in a draggable context, wrap with Draggable
  if (typeof index === 'number') {
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-2"
          >
            {React.cloneElement(cardContent, {
              isDragging: snapshot.isDragging,
            })}
          </div>
        )}
      </Draggable>
    );
  }

  return cardContent;
};

export default TaskCard;
