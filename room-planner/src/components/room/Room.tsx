import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRoomStore } from '@/store/roomStore';

export const Room = () => {
  const { dimensions } = useRoomStore();
  const { width, length, height } = dimensions;
  
  // Create a reference to the mesh
  const roomRef = useRef<THREE.Group>(null);
  
  // Optional: Animate the room
  useFrame(() => {
    if (roomRef.current) {
      roomRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={roomRef}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -length / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Front wall */}
      <mesh position={[0, height / 2, length / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
    </group>
  );
};