import { create } from 'zustand';

export type ViewPreset = 'top' | 'front' | 'side' | 'corner';
export type MovementAxis = 'xz' | 'x' | 'y' | 'z';

interface ViewState {
  // Current view preset
  currentView: ViewPreset;
  setCurrentView: (view: ViewPreset) => void;
  
  // Current movement axis constraint
  movementAxis: MovementAxis;
  setMovementAxis: (axis: MovementAxis) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'corner',
  setCurrentView: (currentView: ViewPreset) => set({ currentView }),
  
  movementAxis: 'xz', // Default to XZ plane movement (floor plane)
  setMovementAxis: (movementAxis: MovementAxis) => set({ movementAxis }),
}));
