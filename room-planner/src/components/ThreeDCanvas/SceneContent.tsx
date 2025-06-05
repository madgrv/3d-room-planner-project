// SceneContent: Handles the 3D scene, raycasting, and selection
// Extracted from original ThreeDCanvas for clarity and testability

import { useThree } from '@react-three/fiber';
import { useEffect, useCallback } from 'react';
import { getClosestSelection } from './utils/raycasting';
// Modular lighting for the 3D scene
import { Lighting3D } from './Lighting3D';
import { useRoomElementStore } from '@/store/roomElementStore';
import { useFurnitureStore } from '@/store/furnitureStore';
import { RoomElementType } from './types';

interface SceneContentProps {
  // onRightClick: Handles right-click events for context menu, always uses RoomElementType | null for type safety
  onRightClick: (
    e: MouseEvent,
    itemId: string | null,
    roomElement: RoomElementType | null
  ) => void;
  closeContextMenu: () => void;
  backgroundColor: string;
  // Snap logic is centralised in StatusBar and context menu, not passed as prop
  hitObjectRef: React.MutableRefObject<boolean>;
}

import { useDragAndDrop3DContext } from './DragAndDrop3DContext';
import { useFurnitureStore } from '@/store/furnitureStore';

const SceneContent = ({
  onRightClick,
  closeContextMenu,
  backgroundColor,
  hitObjectRef,
}: SceneContentProps) => {
  const { scene, camera, raycaster, gl, mouse } = useThree();
  const setSelectedElement = useRoomElementStore(
    (state) => state.setSelectedElement
  );
  const clearFurnitureSelection = useFurnitureStore(
    (state) => state.clearSelection
  );
  const selectFurniture = useFurnitureStore((state) => state.selectFurniture);

  // Pointer down handler for selection and context menu
  const handlePointerDown = useCallback(
    (e: MouseEvent) => {
      const isRightClick = e.button === 2;
      const isLeftClick = e.button === 0;
      if (!isLeftClick && !isRightClick) return;
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const { itemId, roomElement } = getClosestSelection(intersects);
      if (isLeftClick) {
        closeContextMenu();
        if (roomElement) {
          setSelectedElement(roomElement);
          clearFurnitureSelection();
          hitObjectRef.current = true;
          e.preventDefault();
        } else if (itemId) {
          setSelectedElement(null);
          selectFurniture(itemId);
          hitObjectRef.current = true;
          e.preventDefault();
        } else {
          setSelectedElement(null);
          clearFurnitureSelection();
        }
      }
      if (isRightClick) {
        onRightClick(e, itemId, roomElement);
        e.preventDefault();
      }
    },
    [
      camera,
      gl,
      mouse,
      onRightClick,
      raycaster,
      scene.children,
      setSelectedElement,
      clearFurnitureSelection,
      selectFurniture,
      hitObjectRef,
      closeContextMenu,
    ]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [gl, handlePointerDown]);

  // --- Modular 3D drag-and-drop drop handling ---
  // Listen for pointer up globally to finalise drop
  const dragAndDrop = useDragAndDrop3DContext();
  const addFurniture = useFurnitureStore((state) => state.addFurniture);
  
  useEffect(() => {
    function handlePointerUp(e: PointerEvent) {
      // Only handle if a drag is in progress and a drop preview exists
      if (dragAndDrop.isDragging && dragAndDrop.dropPreview && dragAndDrop.dragItemRef.current) {
        // Add the dragged furniture item at the drop preview position
        const { id } = dragAndDrop.dragItemRef.current;
        addFurniture({
          type: id,
          position: [dragAndDrop.dropPreview.x, dragAndDrop.dropPreview.y, dragAndDrop.dropPreview.z],
          rotation: 0,
          visible: true,
        });
        dragAndDrop.onDragEnd();
      }
    }
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [dragAndDrop, addFurniture]);
  // --- End drop handling ---

  return (
    <>
      <color attach='background' args={[backgroundColor]} />
      {/* Modular lighting: see Lighting3D for all ambient/directional lights */}
      <Lighting3D />
      {/* Add more scene content here as needed */}
    </>
  );
};

export default SceneContent;
