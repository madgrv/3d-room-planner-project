// Zustand store for managing furniture items in the 3D room planner.
// Team note: Centralise furniture state here so all UI and 3D logic can access and update as needed.

import { create } from 'zustand';

export interface FurnitureItem {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
  visible?: boolean; // Optional visibility flag, defaults to true if not specified
}

interface FurnitureState {
  furniture: FurnitureItem[];
  selectedFurnitureId: string | null;
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  removeFurniture: (id: string) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  selectFurniture: (id: string | null) => void;
  clearSelection: () => void;
  snapEnabled: boolean;
  setSnapEnabled: (enabled: boolean) => void;
  snapValue: number;
  setSnapValue: (value: number) => void;
}

export const useFurnitureStore = create<FurnitureState>((set) => ({
  furniture: [],
  selectedFurnitureId: null,
  snapEnabled: true,
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  snapValue: 0.5, // Default grid size of 0.5 units
  setSnapValue: (value) => set({ snapValue: value }),
  
  // Select a specific furniture item
  selectFurniture: (id) => set({ selectedFurnitureId: id }),
  
  // Clear furniture selection
  clearSelection: () => set({ selectedFurnitureId: null }),
  addFurniture: (item) =>
    set((state) => {
      // Calculate the appropriate Y position based on furniture type
      // This ensures the bottom of the object is at floor level (y=0)
      let yOffset = 0.5; // Default height offset for generic items
      
      // Adjust Y position based on furniture type to place bottom at floor level
      switch (item.type) {
        case 'chair':
          yOffset = 0.225; // Half height of chair geometry (0.45/2) to ensure the chair sits on the floor
          break;
        case 'table':
          yOffset = 0.05; // Half height of table (0.1/2)
          break;
        case 'sofa':
          yOffset = 0.3; // Half height of sofa (0.6/2)
          break;
        case 'bed':
          yOffset = 0.15; // Half height of bed (0.3/2)
          break;
        case 'wardrobe':
          yOffset = 1.0; // Half height of wardrobe (2/2)
          break;
        default:
          yOffset = 0.5; // Default for generic items
      }
      
      return {
        furniture: [
          ...state.furniture,
          { 
            ...item, 
            id: crypto.randomUUID(),
            // Position Y at the appropriate offset to place bottom at floor level
            position: [item.position[0], yOffset, item.position[2]]
          },
        ],
      };
    }),
  removeFurniture: (id) =>
    set((state) => ({
      furniture: state.furniture.filter((f) => f.id !== id),
    })),
  updateFurniture: (id, update) =>
    set((state) => ({
      furniture: state.furniture.map((f) =>
        f.id === id ? { ...f, ...update } : f
      ),
    })),
}));
