import { Canvas } from '@react-three/fiber';
import { Room } from '@/components/room/Room';
import { Grid } from '@/components/room/Grid';
import { CameraControls } from '@/components/controls/CameraControls';
import { RoomControls } from '@/components/ui/RoomControls';
import { ViewControls } from '@/components/ui/ViewControls';
import { FurnitureControls } from '@/components/ui/FurnitureControls';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { Environment, Stats } from '@react-three/drei';

// Add TypeScript declaration for window.setView
declare global {
  interface Window {
    setView: (preset: 'top' | 'front' | 'side' | 'corner') => void;
  }
}

function App() {
  return (
    <div className='app-container h-screen flex'>
      {/* 3D Canvas: made larger for better visibility */}
      <div
        className='canvas-container flex-grow min-w-0 min-h-[600px]'
        style={{ minWidth: 0, height: 600 }}
      >
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <color attach='background' args={['#f0f0f0']} />

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

          {/* Furniture is now rendered from global state in <Room /> */}

          {/* Environment and Controls */}
          <CameraControls />
          <Environment preset='apartment' />

          {/* Performance Stats (development only) */}
          <Stats />
        </Canvas>
      </div>

      {/* UI Controls Panel: reduced width for more canvas space */}
      <div className='controls-panel w-64 bg-gray-100 p-4 overflow-y-auto border-l border-gray-300'>
        {/* Team note: All controls are now SHADCN-based, localised, and reusable. */}
        <h1 className='text-2xl font-bold mb-6'>3D Room Planner</h1>
        <ThemeSwitcher />
        <RoomControls />
        <ViewControls />
        <FurnitureControls />
      </div>
    </div>
  );
}

export default App;
