import React, { useState } from 'react';
import { ContextMenu } from './ContextMenu';

export function TestContextMenu() {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
    roomElement: null,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemId: null,
      roomElement: null,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div 
      className="border border-border p-4 m-4 rounded-lg"
      style={{ width: '100%', height: '400px', position: 'relative' }}
      onContextMenu={handleContextMenu}
    >
      <h3 className="text-lg font-medium">Right-click anywhere in this area to test the context menu</h3>
      
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 9999,
          }}
        >
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            itemId={contextMenu.itemId}
            roomElement={contextMenu.roomElement}
            onClose={handleCloseContextMenu}
          />
        </div>
      )}
    </div>
  );
}
