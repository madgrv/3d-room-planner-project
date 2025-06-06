// useDragAndDrop3D: Custom hook for drag-and-drop and pointer logic in 3D canvas
// Extracted for clarity and reusability

import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/**
 * Encapsulates drag state and pointer event logic for 3D drag-and-drop.
 * Returns drag state, refs, and drop handler for use in ThreeDCanvas or SceneContent.
 */
export function useDragAndDrop3D() {
  // Indicates if a drag is in progress
  const [isDragging, setIsDragging] = useState(false);
  // Stores the dragged item type and data
  // Use a discriminated union type for clarity
  const dragItemRef = useRef<{ type: 'furniture'; id: string } | null>(null);
  // Stores the current drop preview position
  const [dropPreview, setDropPreview] = useState<THREE.Vector3 | null>(null);

  // Handler for drag start
  // Accepts a discriminated item type for drag
  const onDragStart = useCallback((item: { type: 'furniture'; id: string }) => {
    dragItemRef.current = item;
    setIsDragging(true);
    dragItemRef.current = item;
  }, []);

  // Handler for drag end
  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    dragItemRef.current = null;
    setDropPreview(null);
  }, []);

  /**
   * Calculates the drop position in 3D space given a pointer event and camera.
   * Returns a THREE.Vector3 representing the drop point on the floor plane (y=0).
   */
  // 'gl' is the WebGLRenderer from @react-three/fiber (react-three-fiber)
  // Use explicit type for clarity and ESLint compliance
  const getDropPosition = useCallback((
    e: MouseEvent,
    camera: THREE.Camera,
    gl: import('three').WebGLRenderer,
    mouse: THREE.Vector2
  ) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    // Intersect with horizontal plane at y=0
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    return point;
  }, []);

  /**
   * Sets the drop preview position for visual overlays.
   * Call this during drag to update the preview mesh position.
   */
  const updateDropPreview = useCallback((position: THREE.Vector3 | null) => {
    setDropPreview(position);
  }, []);

  return {
    isDragging,
    dragItemRef,
    dropPreview,
    onDragStart,
    onDragEnd,
    getDropPosition,
    updateDropPreview,
  };
}
