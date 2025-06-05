// useContextMenu3D: Custom hook for context menu logic in 3D canvas
// Extracted for clarity and reusability

import { useState, useCallback } from 'react';

/**
 * Manages the state and behaviour of the context menu in the 3D canvas.
 * Provides open/close logic and tracks the context target and position.
 */
export function useContextMenu3D() {
  // State for menu visibility and position
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    itemId: string | null;
    roomElement: import('../types').RoomElementType | null; // Use shared type for type safety
  }>({ open: false, x: 0, y: 0, itemId: null, roomElement: null });

  // Opens the context menu at the given screen coordinates for a target
  // Accepts RoomElementType | null for type safety (not string)
  const openContextMenu = useCallback((
    x: number,
    y: number,
    itemId: string | null,
    roomElement: import('../types').RoomElementType | null
  ) => {
    setContextMenu({ open: true, x, y, itemId, roomElement });
  }, []);

  // Closes the context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, open: false })); // Only visibility changes, keeps type safety
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
}
