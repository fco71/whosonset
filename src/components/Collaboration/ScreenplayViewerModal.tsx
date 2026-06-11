import React from 'react';
import ScreenplayViewer from './ScreenplayViewer';
import { Screenplay } from './workspaceAccess';

// The one shared full-screen embedding of ScreenplayViewer (hub, group page,
// class page). Modal-level behavior (scroll containment, future focus/escape
// handling) lives here so it can't drift between pages.

interface ScreenplayViewerModalProps {
  screenplay: Screenplay;
  projectId: string;
  onClose: () => void;
  onGenerateReport?: () => void;
}

const ScreenplayViewerModal: React.FC<ScreenplayViewerModalProps> = ({
  screenplay,
  projectId,
  onClose,
  onGenerateReport
}) => (
  <div
    className="screenplay-modal-overlay"
    onScroll={e => e.stopPropagation()}
    onWheel={e => e.stopPropagation()}
  >
    <div className="screenplay-modal">
      <div className="modal-content">
        <ScreenplayViewer
          screenplay={{
            id: screenplay.id,
            name: screenplay.name,
            url: screenplay.url,
            type: screenplay.type,
            format: screenplay.format,
            fountainSource: screenplay.fountainSource,
            reviewStatus: screenplay.reviewStatus
          }}
          projectId={projectId}
          onClose={onClose}
          onGenerateReport={onGenerateReport}
        />
      </div>
    </div>
  </div>
);

export default ScreenplayViewerModal;
