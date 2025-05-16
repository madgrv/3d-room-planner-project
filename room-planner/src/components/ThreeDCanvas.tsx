import { Canvas } from '@react-three/fiber';
import { Environment, Stats } from '@react-three/drei';
import { Room } from './room/Room';
import { Grid } from './room/Grid';
import { CameraControls } from './controls/CameraControls';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThreeDCanvas = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');

  // After mounting, we can safely access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update background color based on theme
  useEffect(() => {
    if (mounted) {
      setBackgroundColor(theme === 'dark' ? '#1a1a1a' : '#f0f0f0');
    }
  }, [theme, mounted]);

  return (
    <div
      className='canvas-container flex-grow border border-border rounded-b-lg rounded-tl-none rounded-tr-none overflow-hidden bg-card'
      style={{ minWidth: 0, height: 400 }}
    >
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach='background' args={[backgroundColor]} />

        {/* Lighting - adjust intensity based on theme */}
        <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={theme === 'dark' ? 0.8 : 1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Room and Grid */}
        <Room />
        <Grid />

        {/* Furniture is now rendered from global state in <Room /> */}

        {/* Environment and Controls */}
        <CameraControls />
        <Environment preset={theme === 'dark' ? 'night' : 'apartment'} />

        {/* Performance Stats (development only) */}
        <Stats />
      </Canvas>
    </div>
  );
};
