import { useMemo } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface TiledFloorProps {
  width: number;
  length: number;
  tileSize?: number;
}

export const TiledFloor = ({ width, length, tileSize = 0.5 }: TiledFloorProps) => {
  const { theme } = useTheme();
  
  // Calculate the number of tiles in each direction
  const tilesX = Math.ceil(width / tileSize);
  const tilesZ = Math.ceil(length / tileSize);
  
  // Create a checkered pattern texture for the floor
  const floorMaterial = useMemo(() => {
    // Define colours based on theme
    const isDark = theme === 'dark';
    
    // Primary tile colour (slightly darker than the secondary)
    const primaryColor = isDark 
      ? new THREE.Color('#1a3e42') // Dark blue-teal
      : new THREE.Color('#e0e8e8'); // Light blue-teal tint
    
    // Secondary tile colour (slightly lighter than the primary)
    const secondaryColor = isDark 
      ? new THREE.Color('#1c4448') // Slightly lighter dark blue-teal
      : new THREE.Color('#d0e0e0'); // Slightly darker light blue-teal
      
    // Grout colour (the lines between tiles)
    const groutColor = isDark
      ? new THREE.Color('#162e30') // Darker grout for dark mode
      : new THREE.Color('#c5d5d5'); // Lighter grout for light mode
    
    // Create a canvas to draw the tile pattern
    const size = 1024; // Increased canvas size for better quality
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Fill the canvas with the grout colour (background)
      context.fillStyle = groutColor.getStyle();
      context.fillRect(0, 0, size, size);
      
      // Draw tiles with a small gap between them (for grout lines)
      const tilesPerSide = 8; // 8x8 tiles on the texture
      const tilePixelSize = size / tilesPerSide;
      const groutSize = 2; // Size of grout lines in pixels
      
      for (let x = 0; x < tilesPerSide; x++) {
        for (let z = 0; z < tilesPerSide; z++) {
          // Determine tile colour based on checkered pattern
          context.fillStyle = (x + z) % 2 === 0 
            ? primaryColor.getStyle() 
            : secondaryColor.getStyle();
          
          // Draw tile with grout gap
          context.fillRect(
            x * tilePixelSize + groutSize/2,
            z * tilePixelSize + groutSize/2,
            tilePixelSize - groutSize,
            tilePixelSize - groutSize
          );
          
          // Add subtle texture/variation to tiles
          if (context.globalAlpha !== undefined) {
            context.globalAlpha = 0.05;
            for (let i = 0; i < 5; i++) {
              const noiseX = Math.random() * (tilePixelSize - groutSize);
              const noiseY = Math.random() * (tilePixelSize - groutSize);
              const noiseSize = Math.random() * 10 + 5;
              
              context.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
              context.beginPath();
              context.arc(
                x * tilePixelSize + groutSize/2 + noiseX,
                z * tilePixelSize + groutSize/2 + noiseY,
                noiseSize,
                0,
                Math.PI * 2
              );
              context.fill();
            }
            context.globalAlpha = 1.0;
          }
        }
      }
    }
    
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    // Set repeat to match the grid size exactly
    // Each tile should be exactly tileSize units in the 3D world
    // This ensures alignment with the grid snapping system
    const repeatX = width / tileSize / 2;
    const repeatZ = length / tileSize / 2;
    texture.repeat.set(repeatX, repeatZ);
    
    // Create the floor material with the texture
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.2,
      // Add normal map for subtle 3D effect on tiles
      normalScale: new THREE.Vector2(0.1, 0.1),
      // Ensure proper rendering order
      depthWrite: true,
      transparent: false,
    });
  }, [theme, tilesX, tilesZ]);
  
  return (
    <mesh 
      position={[0, 0.001, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[width, length, tilesX, tilesZ]} />
      <primitive object={floorMaterial} attach="material" />
    </mesh>
  );
};
