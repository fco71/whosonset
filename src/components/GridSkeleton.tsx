import React from 'react';

interface GridSkeletonProps {
  count?: number;
  className?: string;
  height?: string;
}

const GridSkeleton: React.FC<GridSkeletonProps> = ({ count = 4, className = '', height = 'h-64' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse ${className}`} aria-busy="true" aria-live="polite">
    {[...Array(count)].map((_, i) => (
      <div key={i} className={`bg-gray-100 rounded-xl ${height}`} />
    ))}
  </div>
);

export default GridSkeleton;
