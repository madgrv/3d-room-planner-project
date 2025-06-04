import { useRoomStore } from '@/store/roomStore';
import { Grid as DreiGrid } from '@react-three/drei';

export const Grid = () => {
  const { dimensions } = useRoomStore();
  const { width, length } = dimensions;

  // Calculate grid size based on room dimensions
  const gridSize = Math.max(width, length) * 2;

  // Always render the grid, even when floor tiling is enabled, so it is visible beneath transparent tiles.
  return (
    <DreiGrid
      position={[0, 0.005, 0]} // Slightly below the floor to avoid z-fighting, but close enough for visual alignment
      args={[gridSize, gridSize]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor='#6f6f6f'
      sectionSize={1}
      sectionThickness={1}
      sectionColor='#9d4b4b'
      fadeDistance={gridSize}
      infiniteGrid
    />
  );
};
