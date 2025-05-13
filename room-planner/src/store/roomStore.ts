import { create } from 'zustand';

interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

interface RoomState {
  dimensions: RoomDimensions;
  setDimensions: (dimensions: Partial<RoomDimensions>) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  dimensions: {
    width: 4,
    length: 5,
    height: 2.5,
  },
  setDimensions: (newDimensions) =>
    set((state) => ({
      dimensions: { ...state.dimensions, ...newDimensions },
    })),
}));