import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from './room/Room';
import { Grid } from './room/Grid';
import { CameraControls } from './controls/CameraControls';
import { useTheme } from 'next-themes';
import { useDragStore } from '@/store/dragStore';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContextMenu } from './ui/ContextMenu';
import { TileSettingsPanel } from './ui/TileSettingsPanel';
import { useRoomElementStore, RoomElementType } from '@/store/roomElementStore';
import { useFurnitureStore } from '@/store/furnitureStore';

// SceneContent component with raycasting capability
interface SceneContentProps {
  onRightClick: (
    e: MouseEvent,
    itemId: string | null,
    roomElement: RoomElementType
  ) => void;
  backgroundColor: string;
  theme: string;
  snapEnabled: boolean;
}

// This component renders the contents of the Canvas without wrapping in another Canvas
const SceneContent = ({
  onRightClick,
  backgroundColor,
  theme,
  snapEnabled,
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

      // Find the first intersected object that has userData.furnitureId or userData.roomElement
      let clickedItemId: string | null = null;
      let roomElement: RoomElementType = null;

      for (const intersect of intersects) {
        // Walk up the parent chain to find the furniture object or room element
        let obj: THREE.Object3D | null = intersect.object;

        while (obj) {
          // Check for furniture item
          if (obj.userData && obj.userData.furnitureId) {
            clickedItemId = obj.userData.furnitureId;
            roomElement = null; // Reset room element if we found furniture
            break;
          }

          // Check for room element
          if (obj.userData && obj.userData.roomElement) {
            roomElement = obj.userData.roomElement as RoomElementType;
            clickedItemId = null; // Reset furniture ID if we found a room element
            break;
          }

          obj = obj.parent;
        }

        if (clickedItemId || roomElement) break;
      }

      console.log(
        'Raycasting result:',
        clickedItemId
          ? `Hit item: ${clickedItemId}`
          : roomElement
          ? `Hit element: ${roomElement}`
          : 'No hit'
      );

      // Handle left-click for selection
      if (e.button === 0) {
        if (roomElement) {
          // Select room element and clear furniture selection
          setSelectedElement(roomElement);
          clearFurnitureSelection();
          console.log('Selected room element:', roomElement);
        } else if (clickedItemId) {
          // Select furniture and clear room element selection
          setSelectedElement(null);
          selectFurniture(clickedItemId);
          console.log('Selected furniture:', clickedItemId);
        } else {
          // Clicked on empty space, clear all selections
          setSelectedElement(null);
          clearFurnitureSelection();
          console.log('Cleared selections');
        }
      }

      // Call the onRightClick callback with the clicked item ID and room element
      if (e.button === 2) {
        console.log('Right-click detected in SceneContent', {
          clickedItemId,
          roomElement,
        });
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
    ]
  );

  // Add event listener for right-click
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [gl, handlePointerDown]);

  return (
    <>
      <color attach='background' args={[backgroundColor]} />

      {/* Lighting - adjust intensity based on theme */}
      <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === 'dark' ? 0.8 : 1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Room and Grid */}
      <Room snapEnabled={snapEnabled} />
      <Grid />

      {/* Environment and Controls */}
      <CameraControls />
      <Environment preset={theme === 'dark' ? 'night' : 'apartment'} />

      {/* Performance Stats (development only) */}
      <Stats />
    </>
  );
};

interface ThreeDCanvasProps {
  snapEnabled?: boolean;
}

export function ThreeDCanvas({ snapEnabled = false }: ThreeDCanvasProps) {
  const { resolvedTheme } = useTheme();
  // These variables are used elsewhere or will be used in future updates
  // const isDragging = useDragStore((state) => state.isDragging);
  // const selectedElement = useRoomElementStore((state) => state.selectedElement);

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

  // Track if mouse is being dragged (for camera rotation)
  const [isDraggingState, setIsDragging] = useState(false);

  // Get the global dragging state (for furniture dragging)
  const globalIsDragging = useDragStore(
    (state: { isDragging: boolean }) => state.isDragging
  );

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

  // Handle right-click on canvas
  const handleRightClick = useCallback(
    (e: MouseEvent, itemId: string | null, roomElement: RoomElementType) => {
      // If dragging, don't show context menu
      if (isDraggingState || globalIsDragging) return;

      console.log('Right-click detected:', { itemId, roomElement });

      // Show context menu at mouse position
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        itemId,
        roomElement,
      });

      // Prevent default context menu
      e.preventDefault();
    },
    [isDraggingState, globalIsDragging]
  );

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Handle native right-click event
  const handleNativeContextMenu = (e: React.MouseEvent) => {
    // Prevent default browser context menu
    e.preventDefault();

    // Show our custom context menu
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemId: null,
      roomElement: null,
    });
  };

  // Create a ref to store the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set up mouse event listeners to detect dragging
  useEffect(() => {
    const startPos = { x: 0, y: 0 };
    let hasMoved = false;

    // Get the canvas element
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas;
    }

    const handleMouseDown = (e: MouseEvent) => {
      // Only track right mouse button
      if (e.button === 2) {
        // Record the starting position
        startPos.x = e.clientX;
        startPos.y = e.clientY;
        hasMoved = false;

        // Immediately hide the context menu when right mouse button is pressed
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Only process right mouse button
      if (e.button === 2) {
        // If the mouse hasn't moved significantly, it's a click not a drag
        const distance = Math.sqrt(
          Math.pow(e.clientX - startPos.x, 2) +
            Math.pow(e.clientY - startPos.y, 2)
        );

        // We only handle background right-clicks here
        // Object right-clicks are handled by SceneContent's raycasting
        if (
          distance < 5 &&
          !hasMoved &&
          canvasRef.current &&
          e.target === canvasRef.current
        ) {
          console.log('Background right-click detected');
          // Show context menu at the click position
          setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            itemId: null,
            roomElement: null,
          });
        }
      }

      // Reset dragging state
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // If right mouse button is pressed and moving, consider it dragging
      if (e.buttons === 2) {
        hasMoved = true;
        setIsDragging(true);

        // Ensure context menu is hidden when dragging
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    // Add event listeners to document
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className='relative'
      style={{ userSelect: 'none', position: 'relative' }}
      onContextMenu={handleNativeContextMenu}
    >
      <div
        className='canvas-container flex-grow border border-border rounded-b-lg rounded-tl-none rounded-tr-none overflow-hidden bg-card relative h-[450px] md:h-[670px]'
        style={{ minWidth: 0 }}
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
            // Clear selections when clicking on empty space
            useRoomElementStore.getState().setSelectedElement(null);
            useFurnitureStore.getState().clearSelection();
          }}
        >
          <SceneContent
            onRightClick={handleRightClick}
            backgroundColor={backgroundColor}
            theme={resolvedTheme || 'light'}
            snapEnabled={snapEnabled}
          />
        </Canvas>
      </div>

      {/* Context Menu - Positioned at the document level */}
      {contextMenu.visible && (
        <div
          className='fixed'
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 9999,
          }}
        >
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            itemId={contextMenu.itemId}
            roomElement={contextMenu.roomElement}
            onClose={handleCloseContextMenu}
          />
        </div>
      )}

      {/* Tile Settings Panel - appears when a room element is selected */}
      <div className='absolute top-0 right-0 z-10'>
        <TileSettingsPanel />
      </div>
    </div>
  );
}

export default ThreeDCanvas;
