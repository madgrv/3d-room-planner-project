// Room-related types
export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

// Furniture-related types
export interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  color: string;
}

// Camera view presets
export type ViewPreset = 'top' | 'front' | 'side' | 'corner';

// Theme types
export type ThemeMode = 'light' | 'dark';