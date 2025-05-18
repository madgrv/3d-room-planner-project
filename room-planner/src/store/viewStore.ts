import { create } from 'zustand';

export type ViewPreset = 'top' | 'front' | 'side' | 'corner';
export type MovementAxis = 'xz' | 'x' | 'y' | 'z';
export type RotationAmount = 90 | 45 | 15 | 5; // Rotation increments in degrees

interface ViewState {
  // Current view preset
  currentView: ViewPreset;
  setCurrentView: (view: ViewPreset) => void;
  
  // Current movement axis constraint
  movementAxis: MovementAxis;
  setMovementAxis: (axis: MovementAxis) => void;
  
  // Rotation amount in degrees
  rotationAmount: RotationAmount;
  setRotationAmount: (amount: RotationAmount) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'corner',
  setCurrentView: (currentView: ViewPreset) => set({ currentView }),
  
  movementAxis: 'xz', // Default to XZ plane movement (floor plane)
  setMovementAxis: (movementAxis: MovementAxis) => set({ movementAxis }),
  
  rotationAmount: 90, // Default to 90-degree rotation increments
  setRotationAmount: (rotationAmount: RotationAmount) => set({ rotationAmount }),
}));
