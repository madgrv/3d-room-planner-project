import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

import { useFurnitureStore } from '@/store/furnitureStore';
import { useDragStore } from '@/store/dragStore';
import { useViewStore } from '@/store/viewStore';

interface FurnitureProps {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
  size?: [number, number, number];
  color?: string;
  snapEnabled?: boolean;
}

// Team note: Furniture receives id and type, so it can update global state and render type-specific geometry.
export const Furniture: React.FC<FurnitureProps> = ({
  id,
  type,
  position,
  rotation,
  size = [1, 1, 1],
  color = '#8B4513',
  snapEnabled = false,
}) => {
  const updateFurniture = useFurnitureStore((s) => s.updateFurniture);

  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  
  // State for position (XZ plane)
  const [dragPos, setDragPos] = useState<[number, number, number]>(position);

  // Grid cell size (should match the grid component's cellSize)
  const gridSize = 0.5;

  // Function to snap a value to the grid
  const snapToGrid = (value: number): number => {
    return Math.round(value / gridSize) * gridSize;
  };

  // Get the camera and controls for raycasting
  const { camera, raycaster, gl } = useThree();
  
  // Access the global drag store
  const setGlobalDragging = useDragStore((state) => state.setDragging);
  
  // Get the current movement axis constraint
  const movementAxis = useViewStore((state) => state.movementAxis);
  
  // Local state to track if this specific item is being dragged - used to update cursor styles
  const [isDragging, setIsDragging] = useState(false);
  
  // Reference to track initial drag position and object position
  const dragStartRef = useRef<{
    mousePos: [number, number];
    objectPos: [number, number, number];
    cameraDirection: THREE.Vector3;
  } | null>(null);

  // Function to convert mouse position to world position via raycasting based on movement axis
  const getWorldPosition = (x: number, y: number, first = false): THREE.Vector3 | null => {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    const rect = gl.domElement.getBoundingClientRect();
    const normalizedX = ((x - rect.left) / rect.width) * 2 - 1;
    const normalizedY = -((y - rect.top) / rect.height) * 2 + 1;
    
    // Set up raycaster
    raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
    
    // Special handling for Y-axis movement
    if (movementAxis === 'y') {
      if (first) {
        // On first click, store the initial mouse position and object position
        dragStartRef.current = {
          mousePos: [x, y],
          objectPos: [...position],
          cameraDirection: camera.position.clone().sub(new THREE.Vector3(0, 0, 0)).normalize()
        };
        return new THREE.Vector3(position[0], position[1], position[2]);
      } else if (dragStartRef.current) {
        // Calculate vertical movement based on mouse Y delta and camera orientation
        const deltaY = (dragStartRef.current.mousePos[1] - y) / 100; // Adjust sensitivity
        
        // Create a new vector with the updated Y position
        const newPos = new THREE.Vector3(
          position[0],
          dragStartRef.current.objectPos[1] + deltaY,
          position[2]
        );
        return newPos;
      }
      return null;
    }
    
    // For other axes, use plane intersection
    let plane: THREE.Plane;
    
    switch (movementAxis) {
      case 'x':
        // Create a vertical plane along the X axis
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -position[2]);
        break;
      case 'z':
        // Create a vertical plane along the Z axis
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -position[0]);
        break;
      case 'xz':
      default:
        // Default to floor plane (XZ plane at y=0)
        plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        break;
    }
    
    // Find intersection point
    const intersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      return intersection;
    }
    return null;
  };
  
  // Gesture handler for dragging on XZ plane using @use-gesture/react
  // Team note: On drag end, update position in global store for consistency.
  const bind = useDrag(({ event, first, last, xy: [clientX, clientY] }) => {
    // Prevent camera movement during dragging
    if (event instanceof PointerEvent) {
      event.stopPropagation();
    }
    
    // Set both local and global dragging states
    if (first) {
      setIsDragging(true);
      setGlobalDragging(true);
    }
    if (last) {
      setIsDragging(false);
      setGlobalDragging(false);
    }
    
    // Get world position from mouse coordinates
    const worldPos = getWorldPosition(clientX, clientY, first);
    if (!worldPos) return;
    
    // Apply grid snapping and axis constraints
    let newPosition: [number, number, number];
    
    switch (movementAxis) {
      case 'x':
        // Only move along X axis
        const snappedX = snapEnabled ? snapToGrid(worldPos.x) : worldPos.x;
        newPosition = [snappedX, position[1], position[2]];
        break;
      case 'y':
        // Only move along Y axis (up/down)
        // Limit the Y position to prevent objects from going below the floor
        const rawY = worldPos.y;
        const limitedY = Math.max(0, rawY); // Prevent going below floor
        const snappedY = snapEnabled ? snapToGrid(limitedY) : limitedY;
        newPosition = [position[0], snappedY, position[2]];
        break;
      case 'z':
        // Only move along Z axis
        const snappedZ = snapEnabled ? snapToGrid(worldPos.z) : worldPos.z;
        newPosition = [position[0], position[1], snappedZ];
        break;
      case 'xz':
      default:
        // Move on floor plane (XZ)
        const snappedFloorX = snapEnabled ? snapToGrid(worldPos.x) : worldPos.x;
        const snappedFloorZ = snapEnabled ? snapToGrid(worldPos.z) : worldPos.z;
        newPosition = [snappedFloorX, position[1], snappedFloorZ];
        break;
    }
    
    setDragPos(newPosition);
    
    // Only update the store when dragging ends to avoid excessive updates
    if (last) {
      updateFurniture(id, { position: newPosition });
    }
  }, {
    filterTaps: true,
  });

  // Update mesh position and userData if props change
  useEffect(() => {
    if (meshRef.current) {
      // Update position from props
      meshRef.current.position.set(position[0], position[1], position[2]);
      // Update rotation from props
      meshRef.current.rotation.y = rotation;
      // Add furniture ID to userData for raycasting identification
      meshRef.current.userData.furnitureId = id;
    }
  }, [position, rotation, id]);

  // Update mesh position if dragPos changes
  useFrame(() => {
    if (meshRef.current) {
      // Smoothly interpolate to the target position for a more natural feel
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, dragPos[0], 0.3);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, dragPos[1], 0.3);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, dragPos[2], 0.3);
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
      // Change cursor to indicate draggable object
      onPointerEnter={() => {
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default';
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