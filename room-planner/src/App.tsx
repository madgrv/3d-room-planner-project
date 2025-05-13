import { Canvas } from '@react-three/fiber';
import { Room } from '@/components/room/Room';
import { Grid } from '@/components/room/Grid';
import { CameraControls } from '@/components/controls/CameraControls';
import { RoomControls } from '@/components/ui/RoomControls';
import { ViewControls } from '@/components/ui/ViewControls';
import { Furniture } from '@/components/objects/Furniture';
import { Environment, Stats } from '@react-three/drei';

// Add TypeScript declaration for window.setView
declare global {
  interface Window {
    setView: (preset: 'top' | 'front' | 'side' | 'corner') => void;
  }
}

function App() {
  return (
    <div className="app-container h-screen flex">
      {/* 3D Canvas */}
      <div className="canvas-container flex-grow">
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <color attach="background" args={['#f0f0f0']} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          
          {/* Room and Grid */}
          <Room />
          <Grid />
          
          {/* Sample Furniture */}
          <Furniture 
            position={[0, 0.5, 0]} 
            size={[1, 1, 2]} 
            name="Table" 
          />
          <Furniture 
            position={[2, 0.25, 1]} 
            size={[0.6, 0.5, 0.6]} 
            color="#5C4033" 
            name="Chair" 
          />
          
          {/* Environment and Controls */}
          <CameraControls />
          <Environment preset="apartment" />
          
          {/* Performance Stats (development only) */}
          <Stats />
        </Canvas>
      </div>
      
      {/* UI Controls Panel */}
      <div className="controls-panel w-80 bg-gray-100 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">3D Room Planner</h1>
        <div className="space-y-6">
          <RoomControls />
          <ViewControls />
        </div>
      </div>
    </div>
  );
}

export default App;