import { TopBar } from '@/components/ui/TopBar';
import { ThreeDCanvas } from '@/components/ThreeDCanvas';
import { DragAndDrop3DProvider } from '@/components/ThreeDCanvas/DragAndDrop3DContext';
import { BottomBar } from '@/components/ui/BottomBar';

import { Sidebar } from './components/ui/Sidebar';
import { useFurnitureStore } from '@/store/furnitureStore';
import { useState } from 'react';
import { ViewControls } from './components/ui/ViewControls';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <aside className={`
            ${isLibraryOpen ? 'w-80' : 'w-0 overflow-hidden'}
            border-r border-border flex-shrink-0 overflow-y-auto
            transition-all duration-300 ease-in-out
            flex flex-col
          `}>
            <Sidebar />
          </aside>

          {/* Main 3D View */}
          <div className='flex-1 relative min-w-0'>
            <ThreeDCanvas snapEnabled={snapEnabled} />

            {/* Toggle Library Button */}
            <Button
              size='icon'
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className='absolute top-4 left-4 z-10
                         w-8 h-8
                         bg-transparent hover:bg-black
                         border border-black
                         rounded-md
                         shadow-sm hover:shadow-lg
                         hover:scale-105 transform origin-bottom-right
                         transition-all duration-200
                         text-foreground hover:text-primary dark:text-white dark:hover:text-orange-400 dark:focus:text-orange-400
                        '
              title={isLibraryOpen ? 'Hide library' : 'Show library'}
            >
              {isLibraryOpen ? (
                <ChevronLeft className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>

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
