import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRoomStore } from '@/store/roomStore';
import { useDragStore } from '@/store/dragStore';
import { useViewStore, ViewPreset } from '@/store/viewStore';

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

  // Set initial camera position
  useEffect(() => {
    if (camera) {
      camera.position.set(
        dimensions.width * 1.5,
        dimensions.height * 1.5,
        dimensions.length * 1.5
      );
      camera.lookAt(0, 0, 0);
    }
  }, [camera, dimensions]);

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
