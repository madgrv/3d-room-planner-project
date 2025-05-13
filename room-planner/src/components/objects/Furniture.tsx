import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

import { useFurnitureStore } from '@/store/furnitureStore';

interface FurnitureProps {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
  size?: [number, number, number];
  color?: string;
}

// Team note: Furniture receives id and type, so it can update global state and render type-specific geometry.
export const Furniture: React.FC<FurnitureProps> = ({
  id,
  type,
  position,
  rotation,
  size = [1, 1, 1],
  color = '#8B4513',
}) => {
  const updateFurniture = useFurnitureStore((s) => s.updateFurniture);

  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  
  // State for position (XZ plane)
  const [dragPos, setDragPos] = useState<[number, number, number]>(position);

  // Gesture handler for dragging on XZ plane using @use-gesture/react
  // Team note: On drag end, update position in global store for consistency.
  const bind = useDrag(({ offset: [x, y], last }) => {
    setDragPos([x, 0, y]);
    if (meshRef.current) {
      meshRef.current.position.x = x;
      meshRef.current.position.z = y;
    }
    if (last) {
      updateFurniture(id, { position: [x, 0, y] });
    }
  }, {
    axis: 'lock',
    from: () => [dragPos[0], dragPos[2]],
    bounds: { left: -10, right: 10, top: -10, bottom: 10 },
    filterTaps: true,
  });

  // Update mesh position if dragPos changes
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = dragPos[0];
      meshRef.current.position.z = dragPos[2];
    }
  });


  // Hover effect
  useFrame(() => {
    if (meshRef.current) {
      if (hovered && !selected) {
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.1,
          0.1
        );
      } else if (selected) {
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.2,
          0.1
        );
      } else {
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1,
          0.1
        );
      }
    }
  });

  // Team note: Use different geometry for each furniture type for clarity and future extensibility.
  let geometry = <boxGeometry args={size} />;
  if (type === 'chair') geometry = <cylinderGeometry args={[0.4, 0.4, 1, 16]} />;
  if (type === 'table') geometry = <boxGeometry args={[1.2, 0.1, 0.8]} />;
  if (type === 'sofa') geometry = <boxGeometry args={[1.5, 0.6, 0.7]} />;
  if (type === 'bed') geometry = <boxGeometry args={[2, 0.3, 1]} />;
  if (type === 'wardrobe') geometry = <boxGeometry args={[1, 2, 0.5]} />;

  return (
    <mesh
      ref={meshRef}
      position={dragPos}
      rotation={[0, rotation, 0]}
      {...bind()}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(!selected);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {geometry}
      <meshStandardMaterial 
        color={hovered ? '#A67B5B' : color} 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}
;