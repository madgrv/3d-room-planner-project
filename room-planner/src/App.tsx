import { TopBar } from '@/components/ui/TopBar';
import { ThreeDCanvas } from '@/components/ThreeDCanvas';
import { DragAndDrop3DProvider } from '@/components/ThreeDCanvas/DragAndDrop3DContext';
import { BottomBar } from '@/components/ui/BottomBar';

import { Sidebar } from './components/ui/Sidebar';
import { useFurnitureStore } from '@/store/furnitureStore';
import { useState } from 'react';
import { ViewControls } from './components/ui/ViewControls';

// Add TypeScript declaration for window.setView
declare global {
  interface Window {
    setView: (preset: 'top' | 'front' | 'side' | 'corner') => void;
  }
}

function App() {
  const snapEnabled = useFurnitureStore((state) => state.snapEnabled);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  return (
    <div className='h-screen flex flex-col bg-background text-foreground'>
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      {/* Drag-and-drop context only wraps the relevant subtree for modularity */}
      <DragAndDrop3DProvider>
        <div className='flex flex-1 overflow-hidden w-full'>
          {/* Left Sidebar - Room Settings & Furniture Library */}
          {isLibraryOpen && (
            <aside className='w-80 border-r border-border flex-shrink-0 overflow-hidden flex flex-col'>
              <Sidebar />
            </aside>
          )}

          {/* Main 3D View */}
          <div className='flex-1 relative min-w-0'>
            <ThreeDCanvas snapEnabled={snapEnabled} />

            {/* Toggle Library Button */}
            <button
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className='absolute top-4 left-4 z-10 p-2 bg-card rounded-md shadow-md hover:bg-accent transition-colors'
              title={isLibraryOpen ? 'Hide library' : 'Show library'}
            >
              {isLibraryOpen ? '◀' : '▶'}
            </button>

            {/* Floating View Controls - positioned in the bottom right corner */}
            <div className='absolute bottom-4 right-6 z-10'>
              <ViewControls />
            </div>
          </div>
        </div>
      </DragAndDrop3DProvider>

      {/* Bottom Bar */}
      <div className='border-t border-border'>
        <BottomBar />
      </div>
    </div>
  );
}

export default App;
