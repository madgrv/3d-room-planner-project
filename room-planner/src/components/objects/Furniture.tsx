import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

interface FurnitureProps {
  position?: [number, number, number];
  size?: [number, number, number];
  color?: string;
  name?: string;
}

export const Furniture: React.FC<FurnitureProps> = ({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color = '#8B4513',
  name = 'Furniture',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  
  // State for position (XZ plane)
  const [dragPos, setDragPos] = useState<[number, number, number]>(position);

  // Gesture handler for dragging on XZ plane using @use-gesture/react
  const bind = useDrag(({ offset: [x, y] }) => {
    // y is used as z in 3D XZ plane
    setDragPos([x, 0, y]);
    if (meshRef.current) {
      meshRef.current.position.x = x;
      meshRef.current.position.z = y;
    }
  }, {
    // Lock to XZ plane (ignore Y axis)
    axis: 'lock',
    // Set initial position (renamed from 'initial' to 'from' in @use-gesture/react v10+)
    from: () => [dragPos[0], dragPos[2]],
    // Bounds for dragging (example: -10 to 10)
    bounds: { left: -10, right: 10, top: -10, bottom: 10 },
    // Only trigger on drag, not tap
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

  return (
    <mesh
      ref={meshRef}
      position={dragPos} // Use dragPos state for mesh position
      {...bind()} // Bind gesture handlers to mesh
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
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={hovered ? '#A67B5B' : color} 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
};