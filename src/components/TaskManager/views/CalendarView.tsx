import React from 'react';
import { format, isDate } from 'date-fns';
import { Task } from '../types';

// Type guard for Firestore Timestamp
interface FirestoreTimestamp {
  toDate: () => Date;
  seconds?: number;
  nanoseconds?: number;
}

const isFirestoreTimestamp = (value: unknown): value is FirestoreTimestamp => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as FirestoreTimestamp).toDate === 'function'
  );
};
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskSelect,
  selectedDate,
  onDateSelect,
}) => {
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!task.dueDate) return acc;
    
    try {
      // Handle Firestore Timestamp, Date, or string dates
      let dueDate: Date;
      const dueDateValue = task.dueDate as unknown;
      
      if (isDate(dueDateValue)) {
        dueDate = dueDateValue;
      } else if (isFirestoreTimestamp(dueDateValue)) {
        dueDate = dueDateValue.toDate();
      } else if (typeof dueDateValue === 'string' || typeof dueDateValue === 'number') {
        dueDate = new Date(dueDateValue);
      } else {
        console.warn('Unhandled dueDate type:', typeof dueDateValue, dueDateValue);
        return acc;
      }
      
      const dateKey = format(dueDate, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    } catch (error) {
      console.error('Error processing task due date:', error);
      return acc;
    }
  }, {});

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const days = [];
  const totalDays = daysInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );
  const today = new Date();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border p-1"></div>);
  }

  // Add cells for each day of the month
  for (let i = 1; i <= totalDays; i++) {
    const currentDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i
    );
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const dayTasks = tasksByDate[dateKey] || [];
    const isToday = currentDate.toDateString() === today.toDateString();

    days.push(
      <div
        key={i}
        className={cn(
          'h-24 border p-1 overflow-y-auto',
          isToday && 'bg-blue-50',
          'hover:bg-gray-50 cursor-pointer',
          'transition-colors duration-150'
        )}
        onClick={() => onDateSelect(currentDate)}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={cn(
            'text-sm font-medium',
            isToday && 'text-blue-700 font-bold'
          )}>
            {i}
          </span>
          {dayTasks.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center">
              {dayTasks.length}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {dayTasks.slice(0, 2).map((taskItem) => (
            <div
              key={taskItem.id}
              className={cn(
                'text-xs p-1 rounded truncate',
                taskItem.priority === 'high' && 'bg-red-100 text-red-800',
                taskItem.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
                taskItem.priority === 'low' && 'bg-green-100 text-green-800',
                (!taskItem.priority || !['high', 'medium', 'low'].includes(taskItem.priority)) && 'bg-gray-100 text-gray-800'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onTaskSelect(taskItem);
              }}
            >
              {taskItem.title}
            </div>
          ))}
          {dayTasks.length > 2 && (
            <div className="text-xs text-gray-500 text-center">
              +{dayTasks.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center text-gray-700">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default CalendarView;
