import React, { createContext, useContext } from 'react';
import { useDragAndDrop3D } from './hooks/useDragAndDrop3D';

// Create a context for the drag-and-drop state and handlers
const DragAndDrop3DContext = createContext<ReturnType<
  typeof useDragAndDrop3D
> | null>(null);

// Provider component to wrap subtree that needs drag-and-drop
export const DragAndDrop3DProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dragAndDrop = useDragAndDrop3D();
  return (
    <DragAndDrop3DContext.Provider value={dragAndDrop}>
      {children}
    </DragAndDrop3DContext.Provider>
  );
};

// Hook to consume the drag-and-drop context
export const useDragAndDrop3DContext = () => {
  const context = useContext(DragAndDrop3DContext);
  if (!context) {
    throw new Error(
      'useDragAndDrop3DContext must be used within a DragAndDrop3DProvider'
    );
  }
  return context;
};
