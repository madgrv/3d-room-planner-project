import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from './room/Room';
import { Grid } from './room/Grid';
import { CameraControls } from './controls/CameraControls';
import { useTheme } from 'next-themes';
import { useDragAndDrop3DContext } from './ThreeDCanvas/DragAndDrop3DContext';
import { DropPreview3D } from './ThreeDCanvas/DropPreview3D'; // Modular drag preview overlay
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContextMenu } from './ui/ContextMenu';
import { TileSettingsPanel } from './ui/TileSettingsPanel';
import { useRoomElementStore, RoomElementType } from '@/store/roomElementStore';
import { useFurnitureStore } from '@/store/furnitureStore';
import { useDragAndDrop3D } from './ThreeDCanvas/hooks/useDragAndDrop3D';

// SceneContent component with raycasting capability
interface SceneContentProps {
  onRightClick: (
    e: MouseEvent,
    itemId: string | null,
    roomElement: RoomElementType
  ) => void;
  closeContextMenu: () => void;
  backgroundColor: string;
  snapEnabled: boolean;
  hitObjectRef: React.MutableRefObject<boolean>;
  dragAndDrop: ReturnType<typeof useDragAndDrop3D>;
}

// This component renders the contents of the Canvas without wrapping in another Canvas
const SceneContent = ({
  onRightClick,
  closeContextMenu,
  backgroundColor,
  snapEnabled,
  hitObjectRef,
  dragAndDrop,
}: SceneContentProps) => {
  const { scene, camera, raycaster, gl, mouse } = useThree();
  const setSelectedElement = useRoomElementStore(
    (state) => state.setSelectedElement
  );
  const clearFurnitureSelection = useFurnitureStore(
    (state) => state.clearSelection
  );

  // Get the selectFurniture function from the furniture store
  const selectFurniture = useFurnitureStore((state) => state.selectFurniture);

  // Set up raycasting for object detection
  // Pointer move handler for drag-and-drop preview
  const handlePointerMove = useCallback(
    (e: MouseEvent) => {
      if (dragAndDrop.isDragging) {
        const rect = gl.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const pos = dragAndDrop.getDropPosition(e, camera, gl, mouse);
        dragAndDrop.updateDropPreview(pos);
      }
    },
    [dragAndDrop, camera, gl, mouse]
  );

  // Set up raycasting for object detection
  const handlePointerDown = useCallback(
    (e: MouseEvent) => {
      // Left-click for selection, right-click for context menu
      const isRightClick = e.button === 2;
      const isLeftClick = e.button === 0;

      if (!isLeftClick && !isRightClick) return;

      // Update mouse position for raycasting
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Perform raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Find all intersected objects with userData
      const furnitureIntersects: { itemId: string; distance: number }[] = [];
      const roomElementIntersects: {
        element: RoomElementType;
        distance: number;
      }[] = [];

      // First pass: collect all intersections
      for (const intersect of intersects) {
        // Walk up the parent chain to find the furniture object or room element
        let obj: THREE.Object3D | null = intersect.object;
        const distance = intersect.distance; // Store the distance for sorting

        while (obj) {
          // Check for furniture item
          if (obj.userData && obj.userData.furnitureId) {
            furnitureIntersects.push({
              itemId: obj.userData.furnitureId,
              distance: distance,
            });
            break;
          }

          // Check for room element
          if (obj.userData && obj.userData.roomElement) {
            roomElementIntersects.push({
              element: obj.userData.roomElement as RoomElementType,
              distance: distance,
            });
            break;
          }

          obj = obj.parent;
        }
      }

      // Prioritise furniture if hit, otherwise select the closest room element (wall, floor, etc.)
      // Always select the visually topmost (closest) mesh, regardless of element type.
      // This ensures Blender-like behaviour: no hardcoded priority for walls or floor—just pick the closest hit.
      let clickedItemId: string | null = null;
      let roomElement: RoomElementType = null;

      if (furnitureIntersects.length > 0) {
        furnitureIntersects.sort((a, b) => a.distance - b.distance);
        clickedItemId = furnitureIntersects[0].itemId;
        // Mark that we hit a valid object so onPointerMissed does not clear the selection
        if (hitObjectRef) hitObjectRef.current = true;
      } else {
        // Find the first intersection with a roomElement (wall, floor, or ceiling)
        const firstRoomElementHit = intersects.find(
          (intersect) =>
            intersect.object.userData && intersect.object.userData.roomElement
        );
        if (firstRoomElementHit) {
          roomElement = firstRoomElementHit.object.userData.roomElement;
          // Mark that we hit a valid object so onPointerMissed does not clear the selection
          if (hitObjectRef) hitObjectRef.current = true;
        }
      }

      // Handle left-click for selection
      if (e.button === 0) {
        // Always close context menu on left click anywhere
        closeContextMenu();

        if (roomElement) {
          // Select room element and clear furniture selection
          setSelectedElement(roomElement);
          clearFurnitureSelection();
          hitObjectRef.current = true; // Mark that an object was hit
          e.preventDefault(); // Prevent default behavior for room element selection
        } else if (clickedItemId) {
          // Select furniture and clear room element selection
          setSelectedElement(null);
          selectFurniture(clickedItemId);
          hitObjectRef.current = true; // Mark that an object was hit
          e.preventDefault(); // Prevent default behavior for furniture selection
        } else {
          // Clicked on empty space, clear all selections
          setSelectedElement(null);
          clearFurnitureSelection();
        }
      }

      // Call the onRightClick callback with the clicked item ID and room element
      if (e.button === 2) {
        onRightClick(e, clickedItemId, roomElement);
        // Only prevent default to avoid showing browser's context menu
        // but don't stop propagation to allow orbit controls to work
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

  // Add event listener for right-click
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [gl, handlePointerDown, handlePointerMove]);

  return (
    <>
      <color attach='background' args={[backgroundColor]} />

      {/* Lighting - consistent regardless of theme */}
      {/* Lower ambient light for stronger contrast and more natural shadows */}
      <ambientLight intensity={0.15} />

      {/* Main sun: strong, warm, high-quality shadow casting */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0005}
        color='#ffe7c6' // Warm sunlight
      />

      {/* Cool sky fill: softens shadows, adds realism */}
      {/* <directionalLight
        position={[-10, 10, -10]}
        intensity={2}
        color='#bcd7ff' // Cool sky fill
      />

      <directionalLight
        position={[10, 10, -10]}
        intensity={1}
        color='#aa9eff'
      /> */}

      {/* Optional: subtle environment for reflections only, not ambient light */}
      <Environment preset='warehouse' background={false} blur={0.8} />

      {/* Room and Grid */}
      <Room snapEnabled={snapEnabled} />
      <Grid />
      {/* Drag-and-drop drop preview overlay (ghost mesh) */}
      <DropPreview3D
        position={dragAndDrop.dropPreview}
        visible={dragAndDrop.isDragging && !!dragAndDrop.dropPreview}
      />

      {/* Environment and Controls */}
      <CameraControls />
      {/* <Environment preset='city' background={false} blur={0.8} /> */}
      {/* <Environment preset='apartment' /> */}

      {/* Environment lighting */}
    </>
  );
};

interface ThreeDCanvasProps {
  snapEnabled?: boolean;
}

/**
 * ThreeDCanvas: main 3D canvas and drag-and-drop integration.
 * Uses modular drag-and-drop hook and overlays for maintainability.
 */
export function ThreeDCanvas({ snapEnabled = false }: ThreeDCanvasProps) {
  const { resolvedTheme } = useTheme();
  // These variables are used elsewhere or will be used in future updates
  const selectedElement = useRoomElementStore((state) => state.selectedElement);
  useEffect(() => {
    console.log('Selected Element changed:', selectedElement);
  }, [selectedElement]);

  // Ref to track if an object was hit in SceneContent's handlePointerDown
  const hitObjectRef = useRef(false);

  // Drag-and-drop logic (shared via context)
  const dragAndDrop = useDragAndDrop3DContext();

  // State for context menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
    roomElement: RoomElementType;
  }>({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
    roomElement: null,
  });

  // After mounting, we can safely access the theme
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update background color based on theme
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  useEffect(() => {
    if (mounted) {
      setBackgroundColor(resolvedTheme === 'dark' ? '#1a1a1a' : '#f0f0f0');
    }
  }, [resolvedTheme, mounted]);

  // Create a ref for the canvas container
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Handle right-click on canvas (do not show context menu if dragging furniture)
  const handleRightClick = useCallback(
    (e: MouseEvent, itemId: string | null, roomElement: RoomElementType) => {
      if (dragAndDrop.isDragging) return;
      // canvasContainerRef is kept for future logic (e.g., viewport bounds), but not used here.
      const menuWidth = 200;
      const menuHeight = 300;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight);
      setContextMenu({
        visible: true,
        x,
        y,
        itemId,
        roomElement,
      });
      e.preventDefault();
    },
    [dragAndDrop.isDragging]
  );

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      className='relative w-full h-full'
      style={{ userSelect: 'none' }}
    >
      <div
        className='canvas-container flex-grow overflow-hidden bg-card relative h-full w-full'
        style={{ minWidth: 0 }}
        ref={canvasContainerRef}
      >
        <Canvas
          shadows
          camera={{
            position: [5, 5, 5],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          onPointerMissed={() => {
            // Only clear selections if no object was hit during the pointer event
            if (!hitObjectRef.current) {
              useRoomElementStore.getState().setSelectedElement(null);
              useFurnitureStore.getState().clearSelection();
            }
            // Reset the ref for the next pointer event
            hitObjectRef.current = false;
          }}
        >
          <SceneContent
            onRightClick={handleRightClick}
            closeContextMenu={handleCloseContextMenu}
            backgroundColor={backgroundColor}
            snapEnabled={snapEnabled}
            hitObjectRef={hitObjectRef}
            dragAndDrop={dragAndDrop}
          />
        </Canvas>
      </div>

      {/* Context Menu - Positioned at the document level */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          itemId={contextMenu.itemId}
          roomElement={contextMenu.roomElement}
          onClose={handleCloseContextMenu}
        />
      )}

      {/* Tile Settings Panel - appears when a room element is selected */}
      <div className='absolute bottom-0 left-0 z-10'>
        <TileSettingsPanel />
      </div>
    </div>
  );
}

export default ThreeDCanvas;
