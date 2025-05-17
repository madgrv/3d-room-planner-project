// BottomBar: Contains the StatusBar and OutlinerPanel components
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { StatusBar } from './StatusBar';
import { OutlinerPanel } from './OutlinerPanel';
import { useFurnitureStore } from '@/store/furnitureStore';

interface BottomBarProps {
  className?: string;
}

export function BottomBar({ className = '' }: BottomBarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );
  const [mode, setMode] = React.useState<'select' | 'move' | 'rotate'>(
    'move' // Set default to 'move' so axis selector is visible
  );
  
  // Get snap state from the furniture store
  const snapEnabled = useFurnitureStore((state) => state.snapEnabled);
  const setSnapEnabled = useFurnitureStore((state) => state.setSnapEnabled);

  // Handle item selection from the outliner
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
  };

  // Handle mode change
  const handleModeChange = (newMode: 'select' | 'move' | 'rotate') => {
    setMode(newMode);
  };

  // Toggle snap using the global state
  const handleToggleSnap = () => {
    setSnapEnabled(!snapEnabled);
  };

  return (
    <div className={`${className} flex flex-col`}>
      {/* Status Bar - Contains all controls and information */}
      <StatusBar
        selectedItemId={selectedItemId}
        mode={mode}
        snapEnabled={snapEnabled}
        onToggleSnap={handleToggleSnap}
        onChangeMode={handleModeChange}
      />

      {/* Main content area with Outliner Panel */}
      <div className='flex-grow bg-background pt-2'>
        <div className='flex gap-3'>
          <div className='flex-grow'>
            <OutlinerPanel onSelectItem={handleSelectItem} />
          </div>
          {/* Additional panels could be added here */}
        </div>
      </div>
    </div>
  );
}
