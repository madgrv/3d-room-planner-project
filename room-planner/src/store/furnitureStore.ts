// Zustand store for managing furniture items in the 3D room planner.
// Team note: Centralise furniture state here so all UI and 3D logic can access and update as needed.

import { create } from 'zustand';

export interface FurnitureItem {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
}

interface FurnitureState {
  furniture: FurnitureItem[];
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  removeFurniture: (id: string) => void;
  updateFurniture: (id: string, update: Partial<FurnitureItem>) => void;
}

export const useFurnitureStore = create<FurnitureState>((set) => ({
  furniture: [],
  addFurniture: (item) =>
    set((state) => ({
      furniture: [
        ...state.furniture,
        { ...item, id: crypto.randomUUID() },
      ],
    })),
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
