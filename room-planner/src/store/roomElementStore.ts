import { create } from 'zustand';

// Define room element types
export type RoomElementType = 'floor' | 'wall-front' | 'wall-back' | 'wall-left' | 'wall-right' | 'ceiling' | null;

type VisibilityState = {
  [key in NonNullable<RoomElementType>]: boolean;
};

export interface RoomElementState {
  // Currently selected room element
  selectedElement: RoomElementType;
  
  // Visibility state for all room elements
  visibility: VisibilityState;
  
  // Set the selected room element
  setSelectedElement: (element: RoomElementType) => void;
  
  // Toggle visibility of a room element
  toggleVisibility: (element: NonNullable<RoomElementType>) => void;
  
  // Set visibility of a room element
  setVisibility: (element: NonNullable<RoomElementType>, visible: boolean) => void;
}

// Default visibility states
const defaultVisibility: VisibilityState = {
  'floor': true,
  'wall-front': true,
  'wall-back': true,
  'wall-left': true,
  'wall-right': true,
  'ceiling': true,
};

// Create store for managing room element selection and visibility
export const useRoomElementStore = create<RoomElementState>((set) => ({
  selectedElement: null,
  visibility: { ...defaultVisibility },
  
  setSelectedElement: (element) => set({ selectedElement: element }),
  
  toggleVisibility: (element) => 
    set((state) => ({
      visibility: {
        ...state.visibility,
        [element]: !state.visibility[element]
      }
    })),
    
  setVisibility: (element, visible) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        [element]: visible
      }
    }))
}));
