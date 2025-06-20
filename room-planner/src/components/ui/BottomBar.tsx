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
  // Get selection state directly from the furniture store
  const selectedItemId = useFurnitureStore(
    (state) => state.selectedFurnitureId
  );
  const selectFurniture = useFurnitureStore((state) => state.selectFurniture);

  const [mode, setMode] = React.useState<'select' | 'move' | 'rotate'>(
    'move' // Set default to 'move' so axis selector is visible
  );

  // Get snap state and value from the furniture store
  const snapEnabled = useFurnitureStore((state) => state.snapEnabled);
  const setSnapEnabled = useFurnitureStore((state) => state.setSnapEnabled);
  const snapValue = useFurnitureStore((state) => state.snapValue);
  const setSnapValue = useFurnitureStore((state) => state.setSnapValue);

  // Handle item selection from the outliner
  const handleSelectItem = (id: string) => {
    selectFurniture(id);
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
        snapValue={snapValue}
        onSnapValueChange={setSnapValue}
      />

      {/* Main content area with Outliner Panel */}
      <div className='flex-grow bg-background'>

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
