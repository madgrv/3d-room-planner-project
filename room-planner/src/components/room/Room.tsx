import { useRef } from 'react';
import * as THREE from 'three';
import { useRoomStore } from '@/store/roomStore';
import { useFurnitureStore } from '@/store/furnitureStore';
import { useRoomElementStore } from '@/store/roomElementStore';
import { useTileStore } from '@/store/tileStore';
import { Furniture } from '../objects/Furniture';
import { TiledSurface } from './TiledSurface';

interface RoomProps {
  snapEnabled?: boolean;
}

export const Room = ({ snapEnabled = false }: RoomProps) => {
  const { dimensions } = useRoomStore();
  const { width, length, height } = dimensions;
  
  // Create references to room elements
  const roomRef = useRef<THREE.Group>(null);
  const floorRef = useRef<THREE.Mesh>(null);
  const wallFrontRef = useRef<THREE.Mesh>(null);
  const wallBackRef = useRef<THREE.Mesh>(null);
  const wallLeftRef = useRef<THREE.Mesh>(null);
  const wallRightRef = useRef<THREE.Mesh>(null);
  const ceilingRef = useRef<THREE.Mesh>(null);
  
  // Get selected element and visibility from store - using individual selectors to prevent unnecessary rerenders
  const selectedElement = useRoomElementStore((state) => state.selectedElement);
  const visibility = useRoomElementStore((state) => state.visibility);
  
  // Get tile settings from store
  const tileSettings = useTileStore((state) => state.elementTileSettings);
  const tilingEnabled = useTileStore((state) => state.elementTilingEnabled);
  
  // Auto-rotation disabled: Only enable if a rotation button is toggled by the user.
  // useFrame(() => {
  //   if (roomRef.current && rotationEnabled) {
  //     roomRef.current.rotation.y += 0.001;
  //   }
  // });

  // Team note: Render all furniture items from the global store. This ensures the 3D scene always reflects the current state and supports add/remove/update from UI.
  const furniture = useFurnitureStore((s) => s.furniture);
  
  // Room elements are identified via userData in the JSX
  // This allows for proper raycasting and visibility toggling
  // We don't need to set userData in useEffect since it's already set in the JSX

  return (
    <group ref={roomRef}>
      {/* Floor - with optional tiling */}
      {visibility['floor'] && (
        <group>
          {tilingEnabled['floor'] ? (
            <TiledSurface 
              width={width} 
              length={length} 
              tileSize={tileSettings['floor'].size}
              texture={tileSettings['floor'].texture}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
              isSelected={selectedElement === 'floor'}
              elementType="floor"
            />
          ) : (
            <mesh 
              ref={floorRef} 
              position={[0, 0, 0]} 
              rotation={[-Math.PI / 2, 0, 0]}
              userData={{ roomElement: 'floor' }}
            >
              <planeGeometry args={[width, length]} />
              <meshStandardMaterial 
                color={selectedElement === 'floor' ? '#a8e6cf' : '#f5f5f5'} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          )}
        </group>
      )}
      
      {/* Walls */}
      {/* Back wall - Selectable */}
      {visibility['wall-back'] && (
        tilingEnabled['wall-back'] ? (
          <TiledSurface 
            width={width} 
            length={height}
            tileSize={tileSettings['wall-back'].size}
            texture={tileSettings['wall-back'].texture}
            position={[0, height / 2, -length / 2]}
            rotation={[0, 0, 0]}
            isSelected={selectedElement === 'wall-back'}
            elementType="wall-back"
          />
        ) : (
          <mesh 
            ref={wallBackRef}
            position={[0, height / 2, -length / 2]}
            userData={{ roomElement: 'wall-back' }}
          >
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial 
              color={selectedElement === 'wall-back' ? '#a8e6cf' : '#e0e0e0'} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )
      )}
      
      {/* Front wall - Selectable */}
      {visibility['wall-front'] && (
        tilingEnabled['wall-front'] ? (
          <TiledSurface 
            width={width} 
            length={height}
            tileSize={tileSettings['wall-front'].size}
            texture={tileSettings['wall-front'].texture}
            position={[0, height / 2, length / 2]}
            rotation={[0, Math.PI, 0]}
            isSelected={selectedElement === 'wall-front'}
            elementType="wall-front"
          />
        ) : (
          <mesh 
            ref={wallFrontRef}
            position={[0, height / 2, length / 2]} 
            rotation={[0, Math.PI, 0]}
            userData={{ roomElement: 'wall-front' }}
          >
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial 
              color={selectedElement === 'wall-front' ? '#a8e6cf' : '#e0e0e0'} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )
      )}
      
      {/* Left wall - Selectable */}
      {visibility['wall-left'] && (
        tilingEnabled['wall-left'] ? (
          <TiledSurface 
            width={length} 
            length={height}
            tileSize={tileSettings['wall-left'].size}
            texture={tileSettings['wall-left'].texture}
            position={[-width / 2, height / 2, 0]}
            rotation={[0, Math.PI / 2, 0]}
            isSelected={selectedElement === 'wall-left'}
            elementType="wall-left"
          />
        ) : (
          <mesh 
            ref={wallLeftRef}
            position={[-width / 2, height / 2, 0]} 
            rotation={[0, Math.PI / 2, 0]}
            userData={{ roomElement: 'wall-left' }}
          >
            <planeGeometry args={[length, height]} />
            <meshStandardMaterial 
              color={selectedElement === 'wall-left' ? '#a8e6cf' : '#d0d0d0'} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )
      )}
      
      {/* Right wall - Selectable */}
      {visibility['wall-right'] && (
        tilingEnabled['wall-right'] ? (
          <TiledSurface 
            width={length} 
            length={height}
            tileSize={tileSettings['wall-right'].size}
            texture={tileSettings['wall-right'].texture}
            position={[width / 2, height / 2, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            isSelected={selectedElement === 'wall-right'}
            elementType="wall-right"
          />
        ) : (
          <mesh 
            ref={wallRightRef}
            position={[width / 2, height / 2, 0]} 
            rotation={[0, -Math.PI / 2, 0]}
            userData={{ roomElement: 'wall-right' }}
          >
            <planeGeometry args={[length, height]} />
            <meshStandardMaterial 
              color={selectedElement === 'wall-right' ? '#a8e6cf' : '#d0d0d0'} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )
      )}
      
      {/* Ceiling - Selectable */}
      {visibility['ceiling'] && (
        tilingEnabled['ceiling'] ? (
          <TiledSurface 
            width={width} 
            length={length}
            tileSize={tileSettings['ceiling'].size}
            texture={tileSettings['ceiling'].texture}
            position={[0, height, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            isSelected={selectedElement === 'ceiling'}
            elementType="ceiling"
          />
        ) : (
          <mesh 
            ref={ceilingRef}
            position={[0, height, 0]} 
            rotation={[Math.PI / 2, 0, 0]}
            userData={{ roomElement: 'ceiling' }}
          >
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial 
              color={selectedElement === 'ceiling' ? '#a8e6cf' : '#f8f8f8'} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )
      )}

      {/* Furniture from store - only render visible items */}
      {furniture
        .filter(item => item.visible !== false) // Only show items that aren't explicitly hidden
        .map(item => (
          <Furniture
            key={item.id}
            id={item.id}
            type={item.type}
            position={item.position}
            rotation={item.rotation}
            snapEnabled={snapEnabled}
          />
        ))}
      
    </group>
  );
};