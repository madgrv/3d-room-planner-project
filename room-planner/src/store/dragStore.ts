import { create } from 'zustand';

interface DragState {
  isDragging: boolean;
  setDragging: (isDragging: boolean) => void;
}

// Create a store to track the global dragging state
export const useDragStore = create<DragState>((set) => ({
  isDragging: false,
  setDragging: (isDragging: boolean) => set({ isDragging }),
}));
