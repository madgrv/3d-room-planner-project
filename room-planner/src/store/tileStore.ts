import { create } from 'zustand';
import { RoomElementType } from './roomElementStore';

export type TileSize = 'small' | 'medium' | 'large' | 'extraLarge';
export type TileTexture = 'marble' | 'ceramic';

export interface TileSettings {
  size: TileSize;
  texture: TileTexture;
}

interface TileState {
  // Map of room elements to their tile settings
  elementTileSettings: Record<NonNullable<RoomElementType>, TileSettings>;
  
  // Whether tiling is enabled for each room element
  elementTilingEnabled: Record<NonNullable<RoomElementType>, boolean>;
  
  // Set tile settings for a room element
  setTileSettings: (element: NonNullable<RoomElementType>, settings: Partial<TileSettings>) => void;
  
  // Toggle tiling for a room element
  toggleTiling: (element: NonNullable<RoomElementType>) => void;
  
  // Set tiling enabled/disabled for a room element
  setTilingEnabled: (element: NonNullable<RoomElementType>, enabled: boolean) => void;
}

// Map tile sizes to actual dimensions in meters
export const tileSizeMap: Record<TileSize, number> = {
  small: 0.25,
  medium: 0.5,
  large: 0.75,
  extraLarge: 1.0,
};

// Default tile settings for each room element
const defaultTileSettings: TileSettings = {
  size: 'medium',
  texture: 'ceramic',
};

// Create store for managing tile settings
export const useTileStore = create<TileState>((set) => ({
  // Default tile settings for each room element
  elementTileSettings: {
    'floor': { ...defaultTileSettings },
    'wall-front': { ...defaultTileSettings },
    'wall-back': { ...defaultTileSettings },
    'wall-left': { ...defaultTileSettings },
    'wall-right': { ...defaultTileSettings },
    'ceiling': { ...defaultTileSettings },
  },
  
  // Default tiling enabled state (only floor has tiling enabled by default)
  elementTilingEnabled: {
    'floor': true,
    'wall-front': false,
    'wall-back': false,
    'wall-left': false,
    'wall-right': false,
    'ceiling': false,
  },
  
  // Set tile settings for a room element
  setTileSettings: (element, settings) =>
    set((state) => ({
      elementTileSettings: {
        ...state.elementTileSettings,
        [element]: {
          ...state.elementTileSettings[element],
          ...settings,
        },
      },
    })),
  
  // Toggle tiling for a room element
  toggleTiling: (element) =>
    set((state) => ({
      elementTilingEnabled: {
        ...state.elementTilingEnabled,
        [element]: !state.elementTilingEnabled[element],
      },
    })),
  
  // Set tiling enabled/disabled for a room element
  setTilingEnabled: (element, enabled) =>
    set((state) => ({
      elementTilingEnabled: {
        ...state.elementTilingEnabled,
        [element]: enabled,
      },
    })),
}));
