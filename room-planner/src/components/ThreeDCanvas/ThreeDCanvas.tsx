// Main 3D Canvas wiring component
// This file wires together SceneContent, drag-and-drop, and context menu logic for the 3D room planner

import SceneContent from './SceneContent';
import { useDragAndDrop3D } from './hooks/useDragAndDrop3D';
import { useContextMenu3D } from './hooks/useContextMenu3D';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import { ContextMenu } from '../ui/ContextMenu';
import { DropPreview3D } from './DropPreview3D';
import type { RoomElementType } from './types';

/**
 * ThreeDCanvas: main wiring component for 3D scene, drag-and-drop, and context menu.
 * All logic is extracted to hooks and subcomponents for maintainability.
 */
// snapEnabled is managed centrally in StatusBar and context menu, not passed to SceneContent
export default function ThreeDCanvas() {
  // Theme for background colour
  const { resolvedTheme } = useTheme();
  const backgroundColor = resolvedTheme === 'dark' ? '#18181b' : '#fafafa';

  // Drag-and-drop logic
  const dragAndDrop = useDragAndDrop3D();

  // Context menu state and logic
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu3D();

  // Mutable ref tracks if an object was hit (prevents clearing selection on pointer miss)
  const hitObjectRef = useRef(false);

  // Handler for right-click in SceneContent
  function handleRightClick(
    e: MouseEvent,
    itemId: string | null,
    roomElement: RoomElementType | null
  ) {
    openContextMenu(e.clientX, e.clientY, itemId, roomElement);
  }

  return (
    <>
      {/* 3D Scene Content with selection and context menu integration */}
      <SceneContent
        onRightClick={handleRightClick}
        closeContextMenu={closeContextMenu}
        backgroundColor={backgroundColor}
        hitObjectRef={hitObjectRef}
      />
      {/* Drop preview overlay for drag-and-drop UX */}
      <DropPreview3D
        position={dragAndDrop.dropPreview}
        visible={dragAndDrop.isDragging && !!dragAndDrop.dropPreview}
      />
      {/* Context menu rendered at cursor position if open */}
      {contextMenu.open && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          itemId={contextMenu.itemId}
          roomElement={contextMenu.roomElement}
          onClose={closeContextMenu}
        />
      )}
      {/* All logic is modularised: see hooks, overlays, and SceneContent for details */}
    </>
  );
}
