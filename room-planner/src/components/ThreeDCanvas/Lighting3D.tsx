// Lighting3D: Extracted lighting setup for the 3D scene
// This component centralises all ambient and directional lights for clarity and reuse

import React from 'react';

export const Lighting3D: React.FC = () => (
  <>
    {/* Ambient and directional lighting for the scene */}
    <ambientLight intensity={0.15} />
    <directionalLight
      position={[10, 20, 10]}
      intensity={0.5}
      castShadow
      shadow-mapSize={[4096, 4096]}
      shadow-bias={-0.0005}
      color="#ffe7c6"
    />
  </>
);
