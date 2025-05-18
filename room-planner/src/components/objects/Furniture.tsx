import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

import { useFurnitureStore } from '@/store/furnitureStore';
import { useDragStore } from '@/store/dragStore';
import { useViewStore } from '@/store/viewStore';
import { useRoomStore } from '@/store/roomStore';

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

  // Access the snap value from the store
  const snapValue = useFurnitureStore((s) => s.snapValue);

  // Get room dimensions to restrict movement within boundaries
  const roomDimensions = useRoomStore((s) => s.dimensions);

  // Function to snap a value to the grid
  const snapToGrid = (value: number): number => {
    return Math.round(value / snapValue) * snapValue;
  };

  // Function to restrict a position within room boundaries, accounting for furniture dimensions
  // Also handles wall snapping when boundaries are reached
  const restrictToRoomBoundaries = (
    axis: 'x' | 'y' | 'z',
    value: number
  ): number => {
    // Calculate room boundaries based on room dimensions
    // The room is centered at origin, so boundaries are -width/2 to width/2 and -length/2 to length/2
    const halfWidth = roomDimensions.width / 2;
    const halfLength = roomDimensions.length / 2;
    const roomHeight = roomDimensions.height;

    // Add a small margin to keep objects fully inside the room (0.05 units from walls)
    // Using a smaller margin to allow objects to be placed closer to walls
    const margin = 0.05;

    // Account for furniture dimensions - half the size in each dimension
    // This ensures the entire object stays within the room, not just its center point
    const halfSizeX = size[0] / 2;
    // halfSizeY is used in maxY calculation as size[1]
    const halfSizeZ = size[2] / 2;

    // Define wall boundaries for each axis
    // These are the positions where the object's center should be when its sides touch the walls
    const minX = -halfWidth + halfSizeX + margin; // Left wall
    const maxX = halfWidth - halfSizeX - margin; // Right wall
    const minY = margin; // Floor
    const maxY = roomHeight - size[1] - margin; // Ceiling
    const minZ = -halfLength + halfSizeZ + margin; // Back wall
    const maxZ = halfLength - halfSizeZ - margin; // Front wall

    // Define additional snap positions for each axis
    // These are positions where the object's sides (not center) touch the walls
    const leftWallSnap = -halfWidth + margin; // Object's left side touches left wall
    const rightWallSnap = halfWidth - size[0] - margin; // Object's right side touches right wall
    const floorSnap = 0 + margin; // Object's bottom touches floor (usually the default)
    const ceilingSnap = roomHeight - size[1] - margin; // Object's top touches ceiling
    const backWallSnap = -halfLength + margin; // Object's back touches back wall
    const frontWallSnap = halfLength - size[2] - margin; // Object's front touches front wall

    // Wall snapping threshold - how close to a wall before snapping to it
    const wallSnapThreshold = 0.25;

    if (axis === 'x') {
      // Check if we're near a wall boundary
      if (!snapEnabled) {
        // When snap is disabled, just apply the boundary limits
        return Math.min(Math.max(value, minX), maxX);
      }

      // Check if we're near the left wall (center position)
      if (Math.abs(value - minX) < wallSnapThreshold) {
        return minX; // Snap object center to left wall boundary
      }
      // Check if we're near the right wall (center position)
      else if (Math.abs(value - maxX) < wallSnapThreshold) {
        return maxX; // Snap object center to right wall boundary
      }
      // Check if we're near the position where object's left side touches left wall
      else if (Math.abs(value - leftWallSnap) < wallSnapThreshold) {
        return leftWallSnap; // Snap so left side touches left wall
      }
      // Check if we're near the position where object's right side touches right wall
      else if (Math.abs(value - rightWallSnap) < wallSnapThreshold) {
        return rightWallSnap; // Snap so right side touches right wall
      }
      // Otherwise use normal grid snapping within boundaries
      else {
        const snappedValue = snapToGrid(value);
        return Math.min(Math.max(snappedValue, minX), maxX);
      }
    } else if (axis === 'y') {
      // Check if we're near a floor or ceiling boundary
      if (!snapEnabled) {
        // When snap is disabled, just apply the boundary limits
        return Math.min(Math.max(value, minY), maxY);
      }

      // Check if we're near the floor (object bottom touches floor)
      if (Math.abs(value - floorSnap) < wallSnapThreshold) {
        return floorSnap; // Snap to floor
      }
      // Check if we're near the ceiling (object top touches ceiling)
      else if (Math.abs(value - ceilingSnap) < wallSnapThreshold) {
        return ceilingSnap; // Snap to ceiling
      }
      // Otherwise use normal grid snapping within boundaries
      else {
        const snappedValue = snapToGrid(value);
        return Math.min(Math.max(snappedValue, minY), maxY);
      }
    } else {
      // z-axis
      // Check if we're near a wall boundary
      if (!snapEnabled) {
        // When snap is disabled, just apply the boundary limits
        return Math.min(Math.max(value, minZ), maxZ);
      }

      // Check if we're near the back wall (center position)
      if (Math.abs(value - minZ) < wallSnapThreshold) {
        return minZ; // Snap object center to back wall boundary
      }
      // Check if we're near the front wall (center position)
      else if (Math.abs(value - maxZ) < wallSnapThreshold) {
        return maxZ; // Snap object center to front wall boundary
      }
      // Check if we're near the position where object's back side touches back wall
      else if (Math.abs(value - backWallSnap) < wallSnapThreshold) {
        return backWallSnap; // Snap so back side touches back wall
      }
      // Check if we're near the position where object's front side touches front wall
      else if (Math.abs(value - frontWallSnap) < wallSnapThreshold) {
        return frontWallSnap; // Snap so front side touches front wall
      }
      // Otherwise use normal grid snapping within boundaries
      else {
        const snappedValue = snapToGrid(value);
        return Math.min(Math.max(snappedValue, minZ), maxZ);
      }
    }
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
  // Keeping the commented type definition for future reference
  /* const dragStartRef = useRef<{
    mousePos: [number, number];
    objectPos: [number, number, number];
    cameraDirection: THREE.Vector3;
  } | null>(null); */

  // Function to convert mouse position to world position via raycasting based on movement axis
  const getWorldPosition = (x: number, y: number): THREE.Vector3 | null => {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    const rect = gl.domElement.getBoundingClientRect();
    const normalizedX = ((x - rect.left) / rect.width) * 2 - 1;
    const normalizedY = -((y - rect.top) / rect.height) * 2 + 1;

    // Set up raycaster
    raycaster.setFromCamera(
      new THREE.Vector2(normalizedX, normalizedY),
      camera
    );

    // Special handling for Y-axis movement
    if (movementAxis === 'y') {
      // Create a vertical plane that passes through the object and faces the camera
      // This allows us to use raycasting for vertical movement as well

      // Get a vector from camera to object
      const cameraToObject = new THREE.Vector3(
        position[0] - camera.position.x,
        0, // Ignore Y component to keep the plane vertical
        position[2] - camera.position.z
      ).normalize();

      // Create a plane that's perpendicular to the camera-to-object vector
      // This plane will be vertical (Y-up) and face the camera
      const planeNormal = new THREE.Vector3(
        cameraToObject.x,
        0,
        cameraToObject.z
      );
      const verticalPlane = new THREE.Plane(
        planeNormal,
        -planeNormal.dot(new THREE.Vector3(position[0], 0, position[2]))
      );

      // Find intersection with this vertical plane
      const intersection = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(verticalPlane, intersection)) {
        // Only use the Y component from the intersection
        return new THREE.Vector3(
          position[0], // Keep original X
          intersection.y, // Use Y from intersection
          position[2] // Keep original Z
        );
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
  const bind = useDrag(
    ({ event, first, last, xy: [clientX, clientY], movement: [mx, my] }) => {
      // Only start dragging if the movement is significant
      const hasSignificantMovement = Math.abs(mx) > 5 || Math.abs(my) > 5;

      // Always prevent default to ensure we can drag properly
      if (event instanceof PointerEvent) {
        event.preventDefault();
      }

      // Set dragging states based on movement
      if (first) {
        // Don't set dragging state immediately - wait for movement
        if (hasSignificantMovement) {
          setIsDragging(true);
          setGlobalDragging(true);
          // Stop propagation only when actually dragging
          if (event instanceof PointerEvent) {
            event.stopPropagation();
          }
        }
      } else if (hasSignificantMovement && !isDragging) {
        // If we've moved significantly but haven't set dragging yet
        setIsDragging(true);
        setGlobalDragging(true);
        // Stop propagation only when actually dragging
        if (event instanceof PointerEvent) {
          event.stopPropagation();
        }
      }

      if (last) {
        setIsDragging(false);
        setGlobalDragging(false);
      }

      // Only proceed with dragging if we have significant movement or are already dragging
      if (!hasSignificantMovement && !isDragging) return;

      // Get world position from mouse coordinates
      const worldPos = getWorldPosition(clientX, clientY);
      if (!worldPos) return;

      // Apply grid snapping and axis constraints
      let newPosition: [number, number, number];

      switch (movementAxis) {
        case 'x': {
          // Only move along X axis
          const rawX = worldPos.x;
          // First restrict to room boundaries, then apply grid snapping
          const boundedX = restrictToRoomBoundaries('x', rawX);
          const snappedX = snapEnabled ? snapToGrid(boundedX) : boundedX;
          newPosition = [snappedX, position[1], position[2]];
          break;
        }
        case 'y': {
          // Only move along Y axis (up/down)
          const rawY = worldPos.y;
          // First restrict to room boundaries (floor to ceiling), then apply grid snapping
          const boundedY = restrictToRoomBoundaries('y', rawY);
          const snappedY = snapEnabled ? snapToGrid(boundedY) : boundedY;
          newPosition = [position[0], snappedY, position[2]];
          break;
        }
        case 'z': {
          // Only move along Z axis
          const rawZ = worldPos.z;
          // First restrict to room boundaries, then apply grid snapping
          const boundedZ = restrictToRoomBoundaries('z', rawZ);
          const snappedZ = snapEnabled ? snapToGrid(boundedZ) : boundedZ;
          newPosition = [position[0], position[1], snappedZ];
          break;
        }
        case 'xz':
        default: {
          // First restrict to room boundaries, then apply grid snapping
          // Move on floor plane (XZ)
          const boundedFloorX = restrictToRoomBoundaries('x', worldPos.x);
          const boundedFloorZ = restrictToRoomBoundaries('z', worldPos.z);

          const snappedFloorX = snapEnabled
            ? snapToGrid(boundedFloorX)
            : boundedFloorX;
          const snappedFloorZ = snapEnabled
            ? snapToGrid(boundedFloorZ)
            : boundedFloorZ;

          newPosition = [snappedFloorX, position[1], snappedFloorZ];
          break;
        }
      }

      setDragPos(newPosition);

      // Only update the store when dragging ends to avoid excessive updates
      if (last) {
        updateFurniture(id, { position: newPosition });
      }
    },
    {
      filterTaps: true,
    }
  );

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
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        dragPos[0],
        0.3
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        dragPos[1],
        0.3
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        dragPos[2],
        0.3
      );
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
  // A typical chair seat is lower and wider for realistic proportions.
  // Using radius 0.3 (diameter 0.6) and height 0.45 to better match standard seating dimensions.
  if (type === 'chair')
    geometry = <cylinderGeometry args={[0.3, 0.3, 0.45, 16]} />;
  if (type === 'table') {
    // For the table, use a fragment to combine the tabletop and four legs for a more realistic appearance
    geometry = (
      <>
        {/* Tabletop */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.1, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Four legs, slightly inset from corners */}
        {[
          [-0.55, 0, -0.35], // Back left leg
          [0.55, 0, -0.35], // Back right leg
          [-0.55, 0, 0.35], // Front left leg
          [0.55, 0, 0.35], // Front right leg
        ].map(([x, , z], idx) => (
          <mesh key={`table-leg-${idx}`} position={[x, 0.25, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 12]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </>
    );
  }
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
        // Select this furniture item in the store
        useFurnitureStore.getState().selectFurniture(id);
        setSelected(true);
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
};
