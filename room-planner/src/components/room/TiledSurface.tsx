import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { TileSize, TileTexture, tileSizeMap } from '@/store/tileStore';

interface TiledSurfaceProps {
  width: number;
  length: number;
  tileSize: TileSize;
  texture: TileTexture;
  rotation?: [number, number, number];
  position?: [number, number, number];
  isSelected?: boolean;
  elementType: string;
}

export const TiledSurface = ({
  width,
  length,
  tileSize,
  texture,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  isSelected = false,
  elementType,
}: TiledSurfaceProps) => {
  const actualTileSize = tileSizeMap[tileSize];

  // Calculate the number of tiles in each dimension
  const tilesX = Math.ceil(width / actualTileSize);
  const tilesZ = Math.ceil(length / actualTileSize);

  // Load textures from the public directory
  const ceramicTexture = useTexture('/textures/Ceramic-1.png');
  const marbleTexture = useTexture('/textures/Floreal-1.png');

  // Create a material based on the selected texture and theme
  const surfaceMaterial = useMemo(() => {
    // Select the appropriate texture based on the user's choice
    const selectedTexture =
      texture === 'marble' ? marbleTexture : ceramicTexture;

    // Create a new instance of the texture to avoid modifying the original
    const textureInstance = selectedTexture.clone();

    // Configure texture settings
    textureInstance.wrapS = THREE.RepeatWrapping;
    textureInstance.wrapT = THREE.RepeatWrapping;

    // Set the texture center for proper tiling
    textureInstance.center.set(0.5, 0.5);

    // Set texture repeat to match the number of tiles
    // This ensures the texture repeats exactly once per tile
    textureInstance.repeat.set(tilesX, tilesZ);

    // Adjust texture offset to align with grid lines
    textureInstance.offset.set(0, 0);

    // Create the material with the texture
    return new THREE.MeshStandardMaterial({
      map: textureInstance,
      roughness: texture === 'marble' ? 0.6 : 0.8,
      metalness: texture === 'marble' ? 0.2 : 0.1,
      depthWrite: true,
      transparent: false,
      color: isSelected ? '#a8e6cf' : '#ffffff',
    });
  }, [tilesX, tilesZ, texture, isSelected, ceramicTexture, marbleTexture]);

  // Create a separate material for the grid lines
  const gridMaterial = useMemo(() => {
    const groutColor = '#c5d5d5';

    return new THREE.LineBasicMaterial({
      color: groutColor,
      linewidth: 1,
    });
  }, []);

  // Create grid lines for tiles
  const gridLines = useMemo(() => {
    // Create vertices for the grid lines
    const vertices = [];

    // Use the original dimensions for the grid boundaries
    const halfWidth = width / 2;
    const halfLength = length / 2;

    // Add vertical lines
    for (let i = 0; i <= tilesX; i++) {
      // Calculate position as a fraction of the total width
      const x = -halfWidth + (i * width) / tilesX;
      vertices.push(x, -halfLength, 0.001);
      vertices.push(x, halfLength, 0.001);
    }

    // Add horizontal lines
    for (let i = 0; i <= tilesZ; i++) {
      // Calculate position as a fraction of the total length
      const y = -halfLength + (i * length) / tilesZ;
      vertices.push(-halfWidth, y, 0.001);
      vertices.push(halfWidth, y, 0.001);
    }

    return new Float32Array(vertices);
  }, [width, length, tilesX, tilesZ]);

  return (
    <group
      position={position}
      rotation={rotation}
      userData={{ roomElement: elementType }}
    >
      {/* Main tile mesh with texture */}
      <mesh userData={{ roomElement: elementType }} receiveShadow>
        {/* Use the original dimensions to maintain wall size */}
        <planeGeometry args={[width, length]} />
        <primitive object={surfaceMaterial} attach='material' />
      </mesh>
      {/*
        receiveShadow enables the mesh to display shadows cast from other objects or lights,
        making the tiles appear more grounded and visually realistic.
      */}
      {/*
        userData is set on the mesh itself so raycasting can correctly identify
        the room element (floor, wall, etc.) for selection. This matches the approach
        used for non-tiled surfaces and ensures consistent selection logic.
      */}

      {/* Grid lines for tiles */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' args={[gridLines, 3]} />
        </bufferGeometry>
        <primitive object={gridMaterial} attach='material' />
      </lineSegments>
    </group>
  );
};
