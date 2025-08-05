import React, { useState, useEffect } from 'react';
import AdComponent, { AdConfig } from './AdComponent';
import './AdManager.scss';

export interface AdPlacement {
  id: string;
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'inline';
  config: AdConfig;
  enabled: boolean;
  priority: number; // Higher number = higher priority
}

interface AdManagerProps {
  placements: AdPlacement[];
  className?: string;
  onAdLoad?: (placementId: string) => void;
  onAdError?: (placementId: string, error: any) => void;
}

const AdManager: React.FC<AdManagerProps> = ({
  placements,
  className = '',
  onAdLoad,
  onAdError
}) => {
  const [activePlacements, setActivePlacements] = useState<AdPlacement[]>([]);
  const [adStats, setAdStats] = useState<Record<string, { loads: number; errors: number }>>({});

  useEffect(() => {
    // Filter enabled placements and sort by priority
    const enabled = placements
      .filter(placement => placement.enabled)
      .sort((a, b) => b.priority - a.priority);
    
    // console.log('[AdManager] Received placements:', placements); // Debug
    // console.log('[AdManager] Enabled placements:', enabled); // Debug
    // console.log('[AdManager] Active placements:', enabled); // Debug
    setActivePlacements(enabled);
  }, [placements]);

  const handleAdLoad = (placementId: string) => {
    setAdStats(prev => ({
      ...prev,
      [placementId]: {
        ...prev[placementId],
        loads: (prev[placementId]?.loads || 0) + 1
      }
    }));
    onAdLoad?.(placementId);
  };

  const handleAdError = (placementId: string, error: any) => {
    setAdStats(prev => ({
      ...prev,
      [placementId]: {
        ...prev[placementId],
        errors: (prev[placementId]?.errors || 0) + 1
      }
    }));
    onAdError?.(placementId, error);
  };

  const renderPlacement = (placement: AdPlacement) => {
    return (
      <div key={placement.id} className="ad-placement">
        <AdComponent
          config={placement.config}
          onAdLoad={() => handleAdLoad(placement.id)}
          onAdError={(error) => handleAdError(placement.id, error)}
        />
      </div>
    );
  };

  const renderPlacementsByPosition = (position: string) => {
    const positionPlacements = activePlacements.filter(
      placement => placement.position === position
    );

    // console.log(`[AdManager] Position '${position}' placements:`, positionPlacements); // Debug

    if (positionPlacements.length === 0) return null;

    // Only render the highest priority placement for each position
    const topPlacement = positionPlacements.sort((a, b) => b.priority - a.priority)[0];

    // console.log(`[AdManager] Rendering top placement for '${position}':`, topPlacement); // Debug

    return (
      <div className={`ad-placements-${position}`}>
        {renderPlacement(topPlacement)}
      </div>
    );
  };

  return (
    <div className={`ad-manager ${className}`}>
      {renderPlacementsByPosition('header')}
      {renderPlacementsByPosition('content')}
      {renderPlacementsByPosition('sidebar')}
      {renderPlacementsByPosition('inline')}
      {renderPlacementsByPosition('footer')}
    </div>
  );
};

export default AdManager; 