import { useRoomStore } from '@/store/roomStore';
import { Grid as DreiGrid } from '@react-three/drei';

export const Grid = () => {
  const { dimensions } = useRoomStore();
  const { width, length } = dimensions;
  
  // Calculate grid size based on room dimensions
  const gridSize = Math.max(width, length) * 2;
  
  return (
    <DreiGrid
      position={[0, 0.01, 0]} // Slightly above the floor to avoid z-fighting
      args={[gridSize, gridSize]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#6f6f6f"
      sectionSize={1}
      sectionThickness={1}
      sectionColor="#9d4b4b"
      fadeDistance={gridSize}
      infiniteGrid
    />
  );
};