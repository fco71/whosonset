import React from 'react';
import { Grid3X3, List } from 'lucide-react';
import { cn } from '../lib/utils';

export type CrewViewMode = 'cards' | 'banners';

interface CrewViewSwitcherProps {
  viewMode: CrewViewMode;
  onViewModeChange: (mode: CrewViewMode) => void;
  className?: string;
}

const viewModes = [
  { 
    mode: 'cards' as const, 
    icon: <Grid3X3 className="h-4 w-4" />,
    description: 'Detailed profile cards'
  },
  { 
    mode: 'banners' as const, 
    icon: <List className="h-4 w-4" />,
    description: 'Compact crew banners'
  },
];

const CrewViewSwitcher: React.FC<CrewViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-0.5 p-1 bg-gray-50 rounded-lg border border-gray-200", className)}>
      {viewModes.map(({ mode, icon, description }) => (
        <button
          key={mode}
          type="button"
          className={cn(
            'flex items-center justify-center p-2 rounded-md transition-all duration-200',
            viewMode === mode
              ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
          )}
          onClick={() => onViewModeChange(mode)}
          title={description}
        >
          <span className="text-gray-500">{icon}</span>
        </button>
      ))}
    </div>
  );
};

export default CrewViewSwitcher; 