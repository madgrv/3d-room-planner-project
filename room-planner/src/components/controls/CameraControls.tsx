import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRoomStore } from '@/store/roomStore';
import { useDragStore } from '@/store/dragStore';
import { useViewStore, ViewPreset } from '@/store/viewStore';
import { useRoomElementStore } from '@/store/roomElementStore';
import * as THREE from 'three';

// ViewPreset type is now imported from viewStore

export const CameraControls = () => {
  // OrbitControls does not provide a direct class type, so we use 'any' here with a clear comment for team context
  // This is required because OrbitControls from drei is a ForwardRef component, not a class constructor
  // If a more precise type is available in the future, update here for clarity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const { dimensions } = useRoomStore();

  // Get the global dragging state
  const isDragging = useDragStore((state) => state.isDragging);

  // Get and set the current view from the store
  const currentView = useViewStore((state) => state.currentView);
  const setCurrentView = useViewStore((state) => state.setCurrentView);
  
  // Get room element visibility functions from store
  const setVisibility = useRoomElementStore((state) => state.setVisibility);

  // Set initial camera position
  useEffect(() => {
    if (camera) {
      camera.position.set(
        dimensions.width * 1.5,
        dimensions.height * 1.5,
        dimensions.length * 1.5
      );
      camera.lookAt(0, 0, 0);
      
      // Ensure the camera is a PerspectiveCamera and update its projection matrix
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.updateProjectionMatrix();
        
        // Set appropriate near and far planes for the camera
        camera.near = 0.1;
        camera.far = Math.max(dimensions.width, dimensions.height, dimensions.length) * 5;
        camera.updateProjectionMatrix();
      }
    }
  }, [camera, dimensions]);
  
  // Update room element visibility based on camera position
  useFrame(() => {
    if (camera) {
      // Get room dimensions for calculations
      const { width, height, length } = dimensions;
      
      // Calculate camera position relative to room boundaries
      const cameraX = camera.position.x;
      const cameraY = camera.position.y;
      const cameraZ = camera.position.z;
      
      // Calculate room boundaries
      const halfWidth = width / 2;
      const halfLength = length / 2;
      
      // Calculate camera angles to determine which direction we're looking
      // We need to convert from world coordinates to angles
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      
      // Determine which walls should be visible based on camera position and direction
      // More sophisticated approach that considers both position and view direction
      
      // Front wall (positive Z)
      // Hide when camera is in front of the wall AND looking toward the centre
      const isCameraInFrontOfFrontWall = cameraZ > halfLength;
      const isLookingAwayFromFrontWall = cameraDirection.z < 0;
      const showFrontWall = !(isCameraInFrontOfFrontWall && isLookingAwayFromFrontWall);
      
      // Back wall (negative Z)
      // Hide when camera is behind the wall AND looking toward the centre
      const isCameraInFrontOfBackWall = cameraZ < -halfLength;
      const isLookingAwayFromBackWall = cameraDirection.z > 0;
      const showBackWall = !(isCameraInFrontOfBackWall && isLookingAwayFromBackWall);
      
      // Left wall (negative X)
      // Hide when camera is to the left of the wall AND looking toward the centre
      const isCameraInFrontOfLeftWall = cameraX < -halfWidth;
      const isLookingAwayFromLeftWall = cameraDirection.x > 0;
      const showLeftWall = !(isCameraInFrontOfLeftWall && isLookingAwayFromLeftWall);
      
      // Right wall (positive X)
      // Hide when camera is to the right of the wall AND looking toward the centre
      const isCameraInFrontOfRightWall = cameraX > halfWidth;
      const isLookingAwayFromRightWall = cameraDirection.x < 0;
      const showRightWall = !(isCameraInFrontOfRightWall && isLookingAwayFromRightWall);
      
      // Determine ceiling and floor visibility
      // Hide ceiling when camera is above it AND looking down
      // Hide floor when camera is below it AND looking up
      const isCameraAboveCeiling = cameraY > height;
      const isLookingDown = cameraDirection.y < 0;
      const showCeiling = !(isCameraAboveCeiling && isLookingDown);
      
      const isCameraBelowFloor = cameraY < 0;
      const isLookingUp = cameraDirection.y > 0;
      const showFloor = !(isCameraBelowFloor && isLookingUp);
      
      // Update room element visibility in the store
      setVisibility('wall-front', showFrontWall);
      setVisibility('wall-back', showBackWall);
      setVisibility('wall-left', showLeftWall);
      setVisibility('wall-right', showRightWall);
      setVisibility('ceiling', showCeiling);
      setVisibility('floor', showFloor);
    }
  });

  // Function to change camera view based on preset
  const setView = (preset: ViewPreset) => {
    if (!controlsRef.current) return;

    const { width, length, height } = dimensions;
    const controls = controlsRef.current;

    // Reset rotation and zoom
    controls.reset();

    // Set position based on preset
    switch (preset) {
      case 'top':
        camera.position.set(0, height * 2, 0);
        break;
      case 'front':
        camera.position.set(0, height / 2, length * 1.5);
        break;
      case 'side':
        camera.position.set(width * 1.5, height / 2, 0);
        break;
      case 'corner':
      default:
        camera.position.set(width, height, length);
        break;
    }

    // Update controls target
    controls.target.set(0, height / 2, 0);
    controls.update();

    // Update the view in the store
    setCurrentView(preset);
  };

  // Make setView available globally for UI components
  useEffect(() => {
    // Team note: This adds setView to the window object for global UI access. Remove or refactor if a more robust state solution is adopted.
    // @ts-expect-error: Adding to window for demonstration purposes; this is not a standard property.
    window.setView = setView;
  }, [dimensions, setCurrentView]);

  // Initialize with the current view from the store
  useEffect(() => {
    if (currentView && currentView !== 'corner') {
      setView(currentView);
    }
  }, []);

  // Update controls enabled state based on dragging
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isDragging;
    }
  }, [isDragging]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={1}
      maxDistance={dimensions.width * 3}
      target={[0, dimensions.height / 2, 0]}
      enabled={!isDragging} // Disable controls when dragging
    />
  );
};
