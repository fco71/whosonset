import React, { useState } from 'react';
import { Task, TaskTeamMember, TaskStatus } from '../TaskManager/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import { cn } from '../../lib/utils';
import { 
  Clock, 
  MessageSquare, 
  Paperclip, 
  Check, 
  MoreHorizontal, 
  User, 
  Edit2, 
  Trash2, 
  Flag,
  CheckCircle2,
  ArrowRightCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
// Import Tooltip components from the correct path
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/Tooltip';

// Extended type for TaskTeamMember with UI properties
interface TeamMemberWithUI extends TaskTeamMember {
  // All properties are already defined in TaskTeamMember
}

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  isSelected?: boolean;
  className?: string;
}

const priorityColors = {
  critical: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  high: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
  low: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
};

const priorityIcons = {
  critical: <Flag className="h-3.5 w-3.5 mr-1.5 text-red-600" />,
  high: <Flag className="h-3.5 w-3.5 mr-1.5 text-orange-500" />,
  medium: <Flag className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />,
  low: <Flag className="h-3.5 w-3.5 mr-1.5 text-gray-500" />,
};

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-300',
  overdue: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons = {
  pending: <ClockIcon className="h-3.5 w-3.5 mr-1.5 text-yellow-600" />,
  in_progress: <ArrowRightCircle className="h-3.5 w-3.5 mr-1.5 text-blue-600" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-600" />,
  cancelled: <span className="h-3.5 w-3.5 mr-1.5 text-gray-500">×</span>,
  overdue: <ClockIcon className="h-3.5 w-3.5 mr-1.5 text-red-600" />,
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
  isSelected = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle between 'pending' and 'completed' statuses
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, newStatus);
  };
  
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    
    if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
    if (isThisWeek(date)) return format(date, 'EEEE, h:mm a');
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';

  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.low;
  const statusColor = statusColors[task.status as keyof typeof statusColors] || statusColors.pending;
  const statusIcon = statusIcons[task.status as keyof typeof statusIcons] || statusIcons.pending;
  const priorityIcon = priorityIcons[task.priority as keyof typeof priorityIcons] || priorityIcons.medium;

  // Ensure assignees is always an array and has the required properties
  const teamMembers: TeamMemberWithUI[] = (task.assignees || []).map(member => ({
    ...member,
    name: member.name || 'Unknown',
    avatar: member.avatar || '',
    email: member.email || ''
  }));

  return (
    <div 
      className={cn(
        'group relative rounded-lg border bg-white p-4 transition-all duration-200',
        'hover:shadow-md hover:border-blue-300',
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200',
        isOverdue && 'border-red-200 bg-red-50/50',
        className
      )}
      onClick={() => onSelect(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Actions (shown on hover) */}
      <div className={cn(
        'absolute right-2 top-2 flex items-center gap-1 transition-opacity duration-200',
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600 p-0"
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit task</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-600 p-0"
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete task</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-start gap-3">
        {/* Status Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleStatusToggle}
                className={cn(
                  'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  task.status === 'completed' 
                    ? 'border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600' 
                    : 'border-gray-300 hover:border-blue-500 bg-white',
                  isOverdue && 'border-red-300'
                )}
                aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.status === 'completed' && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex-1 min-w-0">
          {/* Title and Metadata */}
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'text-base font-medium text-gray-900 leading-tight line-clamp-2',
              task.status === 'completed' && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>
          </div>
          
          {/* Description */}
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}
          
          {/* Metadata */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            {/* Status */}
            <div className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5',
              statusColor
            )}>
              {statusIcon}
              <span className="font-medium capitalize">
                {task.status.replace('_', ' ')}
              </span>
            </div>
            
            {/* Priority */}
            {task.priority && task.priority !== 'medium' && (
              <div className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5',
                priorityColor
              )}>
                {priorityIcon}
                <span className="font-medium capitalize">{task.priority}</span>
              </div>
            )}
            
            {/* Due Date */}
            {task.dueDate && (
              <div className={cn(
                'inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-gray-700',
                isOverdue && 'bg-red-50 text-red-700',
                task.status === 'completed' && 'text-gray-500 bg-gray-100'
              )}>
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                <span className="font-medium">
                  {formatDueDate(task.dueDate) || 'No due date'}
                </span>
              </div>
            )}
            
            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag, i) => (
                  <span 
                    key={i} 
                    className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="flex h-5 items-center rounded-full bg-gray-100 px-2 text-xs text-gray-500">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            {/* Assignees */}
            {teamMembers.length > 0 ? (
              <div className="flex -space-x-1.5">
                {teamMembers.slice(0, 3).map((member, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Avatar className="h-6 w-6 border-2 border-white hover:z-10 hover:scale-110 transition-transform">
                            {member.avatar ? (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                              <AvatarFallback 
                                className={cn(
                                  'text-xs font-medium',
                                  'bg-blue-100 text-blue-700 hover:bg-blue-200',
                                  'transition-colors duration-200',
                                  'flex items-center justify-center'
                                )}
                                data-testid="user-avatar-initial"
                              >
                                {member.name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{member.name}</p>
                        {member.role && <p className="text-xs text-gray-500">{member.role}</p>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {teamMembers.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    +{teamMembers.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-6" />
            )}
            
            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-3.5 w-3.5" />
                  <span>{task.comments.length}</span>
                </div>
              )}
              
              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center">
                  <Paperclip className="mr-1 h-3.5 w-3.5" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>
            
            {teamMembers.length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
