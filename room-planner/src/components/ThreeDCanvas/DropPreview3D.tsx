// DropPreview3D: Shows a semi-transparent preview mesh at the drop location during drag
// Modular overlay for 3D canvas drag-and-drop UX

import React from 'react';
import * as THREE from 'three';

interface DropPreview3DProps {
  position: THREE.Vector3 | null;
  visible: boolean;
  size?: [number, number, number]; // width, height, depth
}

/**
 * Renders a semi-transparent cube or marker at the drop position.
 * Used for visual feedback during drag-and-drop.
 */
export const DropPreview3D: React.FC<DropPreview3DProps> = ({
  position,
  visible,
  size = [1, 1, 1],
}) => {
  if (!visible || !position) return null;
  return (
    <mesh position={position} visible={visible}>
      <boxGeometry args={size} />
      <meshStandardMaterial color='#00bcd4' transparent opacity={0.4} />
    </mesh>
  );
};
