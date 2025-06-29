import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Whiteboard, WhiteboardElement, WhiteboardCollaborator } from '../../types/Collaboration';
import './WhiteboardCanvas.scss';

interface WhiteboardCanvasProps {
  whiteboard: Whiteboard;
  onSave: (elements: WhiteboardElement[]) => void;
  onClose: () => void;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  whiteboard,
  onSave,
  onClose
}) => {
  const { currentUser } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser' | 'text' | 'shape' | 'line'>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [elements, setElements] = useState<WhiteboardElement[]>(whiteboard.elements);
  const [collaborators, setCollaborators] = useState<WhiteboardCollaborator[]>(whiteboard.collaborators);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth - 400; // Account for sidebar
    canvas.height = window.innerHeight - 200; // Account for header

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element);
    });

    // Draw collaborator cursors
    collaborators.forEach(collaborator => {
      if (collaborator.userId !== currentUser?.uid) {
        drawCollaboratorCursor(ctx, collaborator);
      }
    });

    ctx.restore();
  }, [elements, collaborators, zoom, pan, showGrid, color, brushSize]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: WhiteboardElement) => {
    ctx.save();

    switch (element.type) {
      case 'line':
        ctx.strokeStyle = element.style.color || color;
        ctx.lineWidth = element.style.width || brushSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(element.position.x, element.position.y);
        ctx.lineTo(element.position.x + element.size.width, element.position.y + element.size.height);
        ctx.stroke();
        break;

      case 'shape':
        ctx.fillStyle = element.style.fillColor || 'transparent';
        ctx.strokeStyle = element.style.color || color;
        ctx.lineWidth = element.style.width || brushSize;
        
        if (element.content.shape === 'rectangle') {
          ctx.fillRect(element.position.x, element.position.y, element.size.width, element.size.height);
          ctx.strokeRect(element.position.x, element.position.y, element.size.width, element.size.height);
        } else if (element.content.shape === 'circle') {
          const radius = Math.min(element.size.width, element.size.height) / 2;
          const centerX = element.position.x + element.size.width / 2;
          const centerY = element.position.y + element.size.height / 2;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
        break;

      case 'text':
        ctx.fillStyle = element.style.color || color;
        ctx.font = `${element.style.fontSize || 16}px Arial`;
        ctx.fillText(element.content.text || '', element.position.x, element.position.y);
        break;

      case 'sticky':
        ctx.fillStyle = element.style.backgroundColor || '#fff3cd';
        ctx.strokeStyle = element.style.color || '#856404';
        ctx.lineWidth = 1;
        
        // Draw sticky note
        ctx.fillRect(element.position.x, element.position.y, element.size.width, element.size.height);
        ctx.strokeRect(element.position.x, element.position.y, element.size.width, element.size.height);
        
        // Draw text
        ctx.fillStyle = element.style.color || '#856404';
        ctx.font = '12px Arial';
        const lines = (element.content.text || '').split('\n');
        lines.forEach((line: string, index: number) => {
          ctx.fillText(line, element.position.x + 5, element.position.y + 15 + (index * 15));
        });
        break;
    }

    ctx.restore();
  };

  const drawCollaboratorCursor = (ctx: CanvasRenderingContext2D, collaborator: WhiteboardCollaborator) => {
    ctx.save();
    
    // Draw cursor
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(collaborator.cursor.x, collaborator.cursor.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw user indicator
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`User ${collaborator.userId.slice(-4)}`, collaborator.cursor.x + 8, collaborator.cursor.y - 8);
    
    ctx.restore();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePos(e);
    setLastMousePos(mousePos);

    if (e.button === 1 || e.ctrlKey) { // Middle mouse or Ctrl for panning
      setIsPanning(true);
    } else {
      setIsDrawing(true);
      
      if (drawingTool === 'line') {
        const newElement: WhiteboardElement = {
          id: `element-${Date.now()}`,
          type: 'line',
          position: mousePos,
          size: { width: 0, height: 0 },
          content: {},
          style: { color, width: brushSize },
          createdBy: currentUser?.uid || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setElements(prev => [...prev, newElement]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePos(e);

    if (isPanning) {
      setPan(prev => ({
        x: prev.x + (mousePos.x - lastMousePos.x),
        y: prev.y + (mousePos.y - lastMousePos.y)
      }));
    } else if (isDrawing && drawingTool === 'line') {
      setElements(prev => {
        const newElements = [...prev];
        const lastElement = newElements[newElements.length - 1];
        if (lastElement && lastElement.type === 'line') {
          lastElement.size = {
            width: mousePos.x - lastElement.position.x,
            height: mousePos.y - lastElement.position.y
          };
          lastElement.updatedAt = new Date();
        }
        return newElements;
      });
    }

    // Update collaborator cursor
    setCollaborators(prev => prev.map(collab => 
      collab.userId === currentUser?.uid 
        ? { ...collab, cursor: mousePos, lastActivity: new Date() }
        : collab
    ));

    setLastMousePos(mousePos);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
  };

  const addShape = (shape: 'rectangle' | 'circle') => {
    const newElement: WhiteboardElement = {
      id: `element-${Date.now()}`,
      type: 'shape',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      content: { shape },
      style: { color, width: brushSize, fillColor: 'transparent' },
      createdBy: currentUser?.uid || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setElements(prev => [...prev, newElement]);
  };

  const addText = () => {
    const newElement: WhiteboardElement = {
      id: `element-${Date.now()}`,
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 30 },
      content: { text: 'Double click to edit' },
      style: { color, fontSize: 16 },
      createdBy: currentUser?.uid || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setElements(prev => [...prev, newElement]);
  };

  const addSticky = () => {
    const newElement: WhiteboardElement = {
      id: `element-${Date.now()}`,
      type: 'sticky',
      position: { x: 100, y: 100 },
      size: { width: 150, height: 100 },
      content: { text: 'Sticky note\nDouble click to edit' },
      style: { color: '#856404', backgroundColor: '#fff3cd' },
      createdBy: currentUser?.uid || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setElements(prev => [...prev, newElement]);
  };

  const clearCanvas = () => {
    setElements([]);
  };

  const handleSave = () => {
    onSave(elements);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  return (
    <div className="whiteboard-canvas">
      <div className="whiteboard-header">
        <div className="whiteboard-info">
          <h2>{whiteboard.name}</h2>
          <span className="collaborators-count">{collaborators.length} collaborators</span>
        </div>
        
        <div className="whiteboard-actions">
          <button className="btn-secondary" onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button className="btn-secondary" onClick={() => handleZoom(0.1)}>
            Zoom In
          </button>
          <button className="btn-secondary" onClick={() => handleZoom(-0.1)}>
            Zoom Out
          </button>
          <button className="btn-secondary" onClick={clearCanvas}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="whiteboard-main">
        <div className="toolbar">
          <div className="tool-group">
            <button 
              className={`tool-btn ${drawingTool === 'pen' ? 'active' : ''}`}
              onClick={() => setDrawingTool('pen')}
            >
              ✏️ Pen
            </button>
            <button 
              className={`tool-btn ${drawingTool === 'eraser' ? 'active' : ''}`}
              onClick={() => setDrawingTool('eraser')}
            >
              🧽 Eraser
            </button>
            <button 
              className={`tool-btn ${drawingTool === 'text' ? 'active' : ''}`}
              onClick={() => setDrawingTool('text')}
            >
              T Text
            </button>
            <button 
              className={`tool-btn ${drawingTool === 'shape' ? 'active' : ''}`}
              onClick={() => setDrawingTool('shape')}
            >
              ⬜ Shape
            </button>
            <button 
              className={`tool-btn ${drawingTool === 'line' ? 'active' : ''}`}
              onClick={() => setDrawingTool('line')}
            >
              📏 Line
            </button>
          </div>

          <div className="tool-group">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="brush-size"
            />
            <span className="brush-size-label">{brushSize}px</span>
          </div>

          <div className="tool-group">
            <button className="tool-btn" onClick={() => addShape('rectangle')}>
              ⬜ Rectangle
            </button>
            <button className="tool-btn" onClick={() => addShape('circle')}>
              ⭕ Circle
            </button>
            <button className="tool-btn" onClick={addText}>
              📝 Text
            </button>
            <button className="tool-btn" onClick={addSticky}>
              📌 Sticky
            </button>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="whiteboard-canvas-element"
            style={{ cursor: isPanning ? 'grabbing' : 'crosshair' }}
          />
        </div>

        <div className="collaborators-sidebar">
          <h3>Collaborators</h3>
          <div className="collaborators-list">
            {collaborators.map(collaborator => (
              <div key={collaborator.userId} className="collaborator-item">
                <div className="collaborator-avatar">
                  {collaborator.userId === currentUser?.uid ? '👤' : '👥'}
                </div>
                <div className="collaborator-info">
                  <span className="collaborator-name">
                    {collaborator.userId === currentUser?.uid ? 'You' : `User ${collaborator.userId.slice(-4)}`}
                  </span>
                  {collaborator.isDrawing && (
                    <span className="drawing-indicator">drawing...</span>
                  )}
                </div>
                <div className={`online-status ${collaborator.lastActivity ? 'online' : 'offline'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardCanvas; 