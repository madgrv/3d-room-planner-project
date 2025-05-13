import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRoomStore } from '@/store/roomStore';

type ViewPreset = 'top' | 'front' | 'side' | 'corner';

export const CameraControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const { dimensions } = useRoomStore();
  
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
  };

  // Make setView available globally for UI components
  useEffect(() => {
    // @ts-ignore - Adding to window for demonstration
    window.setView = setView;
  }, [dimensions]);

  return (
    <OrbitControls 
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={1}
      maxDistance={dimensions.width * 3}
      target={[0, dimensions.height / 2, 0]}
    />
  );
};