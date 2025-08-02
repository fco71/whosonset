import React from 'react';
import { Profile } from '../../types/Profile';
import MemberCard from './MemberCard';
import { cn } from '../../lib/utils';

interface MembersListProps {
  members: Profile[];
  title?: string;
  variant?: 'default' | 'compact' | 'detailed';
  emptyMessage?: string;
  className?: string;
  currentUserId?: string;
  isFiltering?: boolean;
}

const MembersList: React.FC<MembersListProps> = ({
  members,
  title,
  variant = 'default',
  emptyMessage = 'No members to display',
  className = '',
  currentUserId,
  isFiltering = false,
}) => {
  // Get card classes based on variant
  const getCardClasses = () => {
    switch (variant) {
      case 'compact':
        return 'h-24';
      case 'detailed':
        return 'h-96';
      default:
        return 'h-64';
    }
  };

  // Get grid columns based on variant
  const getGridColumns = () => {
    switch (variant) {
      case 'compact':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'detailed':
        return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
    }
  };

  // Get gap size based on variant
  const getGap = () => {
    switch (variant) {
      case 'compact':
        return 'gap-3';
      case 'detailed':
        return 'gap-6';
      default:
        return 'gap-4';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      )}
      
      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className={cn('grid', getGridColumns(), getGap())}>
          {members.map((member, index) => (
            <MemberCard
              key={member.id}
              profile={member}
              index={index}
              isFiltering={isFiltering}
              currentUserId={currentUserId}
              className={getCardClasses()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersList;
