import React, { useState, useRef, useEffect } from 'react';
import { ScreenShare, ScreenAnnotation } from '../../types/VideoConference';
import './ScreenSharePanel.scss';

interface ScreenSharePanelProps {
  screenShare: ScreenShare;
  onStopSharing: () => void;
  onAnnotation: (annotation: ScreenAnnotation) => void;
  isHost: boolean;
}

const ScreenSharePanel: React.FC<ScreenSharePanelProps> = ({
  screenShare,
  onStopSharing,
  onAnnotation,
  isHost
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#ff0000');
  const [drawingThickness, setDrawingThickness] = useState(3);
  const [annotationType, setAnnotationType] = useState<'draw' | 'text' | 'arrow' | 'highlight' | 'shape'>('draw');
  const [annotations, setAnnotations] = useState<ScreenAnnotation[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawingRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
      if (e.key === 'h' || e.key === 'H') {
        setShowControls(!showControls);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showControls]);

  useEffect(() => {
    if (drawingRef.current) {
      const ctx = drawingRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = drawingThickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [drawingColor, drawingThickness]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingRef.current) return;

    const rect = drawingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    const ctx = drawingRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingRef.current || !drawingRef.current || !lastPointRef.current) return;

    const rect = drawingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = drawingRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawing || !drawingRef.current) return;

    isDrawingRef.current = false;
    lastPointRef.current = null;

    const ctx = drawingRef.current.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }

    // Save annotation
    if (annotationType === 'draw' && drawingRef.current) {
      const annotation: ScreenAnnotation = {
        id: `annotation-${Date.now()}`,
        annotatorId: 'current-user',
        type: 'draw',
        data: drawingRef.current.toDataURL(),
        timestamp: new Date(),
        color: drawingColor,
        thickness: drawingThickness,
        position: { x: 0, y: 0 },
        createdAt: new Date(),
      };
      setAnnotations(prev => [...prev, annotation]);
      onAnnotation(annotation);
    }
  };

  const clearAnnotations = () => {
    if (drawingRef.current) {
      const ctx = drawingRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, drawingRef.current.width, drawingRef.current.height);
      }
    }
    setAnnotations([]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderAnnotationTools = () => (
    <div className="annotation-tools">
      <div className="tool-group">
        <button
          className={`tool-btn ${annotationType === 'draw' ? 'active' : ''}`}
          onClick={() => setAnnotationType('draw')}
          title="Draw"
        >
          ✏️
        </button>
        <button
          className={`tool-btn ${annotationType === 'text' ? 'active' : ''}`}
          onClick={() => setAnnotationType('text')}
          title="Text"
        >
          T
        </button>
        <button
          className={`tool-btn ${annotationType === 'arrow' ? 'active' : ''}`}
          onClick={() => setAnnotationType('arrow')}
          title="Arrow"
        >
          ➡️
        </button>
        <button
          className={`tool-btn ${annotationType === 'highlight' ? 'active' : ''}`}
          onClick={() => setAnnotationType('highlight')}
          title="Highlight"
        >
          🟡
        </button>
        <button
          className={`tool-btn ${annotationType === 'shape' ? 'active' : ''}`}
          onClick={() => setAnnotationType('shape')}
          title="Shape"
        >
          ⬜
        </button>
      </div>

      <div className="tool-group">
        <input
          type="color"
          value={drawingColor}
          onChange={(e) => setDrawingColor(e.target.value)}
          className="color-picker"
          title="Color"
        />
        <input
          type="range"
          min="1"
          max="10"
          value={drawingThickness}
          onChange={(e) => setDrawingThickness(parseInt(e.target.value))}
          className="thickness-slider"
          title="Thickness"
        />
      </div>

      <div className="tool-group">
        <button
          className="tool-btn"
          onClick={clearAnnotations}
          title="Clear All"
        >
          🗑️
        </button>
        <button
          className="tool-btn"
          onClick={() => setIsDrawing(!isDrawing)}
          title={isDrawing ? 'Disable Drawing' : 'Enable Drawing'}
        >
          {isDrawing ? '🔒' : '🔓'}
        </button>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="screen-share-controls">
      <div className="control-info">
        <span className="sharer-name">{screenShare.sharerName} is sharing</span>
        <span className="share-type">{screenShare.type}</span>
      </div>

      <div className="control-actions">
        {isHost && (
          <>
            <button
              className="control-btn"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? '⛶' : '⛶'}
            </button>
            <button
              className="control-btn"
              onClick={() => setShowControls(!showControls)}
              title="Toggle Controls"
            >
              ⚙️
            </button>
          </>
        )}
        <button
          className="control-btn stop-btn"
          onClick={onStopSharing}
          title="Stop Sharing"
        >
          ⏹️
        </button>
      </div>
    </div>
  );

  return (
    <div className={`screen-share-panel ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="screen-share-container">
        <video
          ref={videoRef}
          className="screen-share-video"
          autoPlay
          playsInline
        />
        
        <canvas
          ref={drawingRef}
          className="annotation-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {showControls && renderControls()}
        {showControls && isHost && renderAnnotationTools()}
      </div>

      <div className="annotation-list">
        <h4>Annotations ({annotations.length})</h4>
        <div className="annotations">
          {annotations.map(annotation => (
            <div key={annotation.id} className="annotation-item">
              <span className="annotation-type">{annotation.type}</span>
              <span className="annotation-time">
                {annotation.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScreenSharePanel; 