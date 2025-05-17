// StatusBar: A Blender-inspired status bar that shows information about the selected object and current mode
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useLanguage } from '@/lang';
import { useFurnitureStore } from '@/store/furnitureStore';
import { MagnifyingGlassIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon, MoveIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useViewStore } from '@/store/viewStore';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Slider } from './slider';

interface StatusBarProps {
  selectedItemId: string | null;
  mode?: 'select' | 'move' | 'rotate';
  snapEnabled?: boolean;
  onToggleSnap?: () => void;
  onChangeMode?: (mode: 'select' | 'move' | 'rotate') => void;
  snapValue?: number;
  onSnapValueChange?: (value: number) => void;
}

export function StatusBar({
  selectedItemId,
  mode = 'select',
  snapEnabled = false,
  onToggleSnap,
  onChangeMode,
  snapValue = 0.5,
  onSnapValueChange,
}: StatusBarProps) {
  const { lang } = useLanguage();
  const { furniture } = useFurnitureStore();
  
  // Get and set the movement axis from the store
  const movementAxis = useViewStore((state) => state.movementAxis);
  const setMovementAxis = useViewStore((state) => state.setMovementAxis);

  // Get the selected item
  const selectedItem = React.useMemo(() => {
    if (!selectedItemId) return null;
    return furniture.find(item => item.id === selectedItemId) || null;
  }, [furniture, selectedItemId]);

  // Format position as a string with 2 decimal places
  const formatPosition = (pos: [number, number, number]) => {
    return `X: ${pos[0].toFixed(2)}, Y: ${pos[1].toFixed(2)}, Z: ${pos[2].toFixed(2)}`;
  };

  // Format rotation as a string with 2 decimal places
  const formatRotation = (rotation: number) => {
    return `${rotation.toFixed(2)}°`;
  };

  return (
    <div className="flex items-center justify-between px-3 py-1 bg-card text-card-foreground border-t border-border text-xs">
      {/* Left section: Selected object info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{lang.statusBar.selectedObject}</span>
          <span>
            {selectedItem
              ? lang.furnitureControls[selectedItem.type as keyof typeof lang.furnitureControls] || selectedItem.type
              : lang.statusBar.noSelection}
          </span>
        </div>
        
        {selectedItem && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">{lang.statusBar.position}</span>
              <span>{formatPosition(selectedItem.position)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">{lang.statusBar.rotation}</span>
              <span>{formatRotation(selectedItem.rotation)}</span>
            </div>
          </>
        )}
      </div>
      
      {/* Right section: Mode and snap controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{lang.statusBar.mode}</span>
          <div className="flex bg-background rounded border border-border">
            <button
              className={`px-2 py-0.5 text-xs ${mode === 'select' ? 'bg-accent' : ''}`}
              onClick={() => onChangeMode?.('select')}
            >
              {lang.statusBar.selectMode}
            </button>
            <button
              className={`px-2 py-0.5 text-xs border-l border-r border-border ${mode === 'move' ? 'bg-accent' : ''}`}
              onClick={() => onChangeMode?.('move')}
            >
              {lang.statusBar.moveMode}
            </button>
            <button
              className={`px-2 py-0.5 text-xs ${mode === 'rotate' ? 'bg-accent' : ''}`}
              onClick={() => onChangeMode?.('rotate')}
            >
              {lang.statusBar.rotateMode}
            </button>
          </div>
        </div>
        
        {/* Snap toggle button with popover for snap value */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1"
            onClick={onToggleSnap}
          >
            <MagnifyingGlassIcon className={`h-3 w-3 ${snapEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
            <span>{snapEnabled ? lang.statusBar.snapEnabled : lang.statusBar.snapDisabled}</span>
          </button>
          
          {snapEnabled && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-xs px-1 py-0.5 rounded border border-border">
                  <span>Grid: {snapValue}</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium">Snap Value</span>
                    <span className="text-xs">{snapValue}</span>
                  </div>
                  <Slider
                    defaultValue={[snapValue]}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    onValueChange={(value) => onSnapValueChange?.(value[0])}
                  />
                  <div className="flex justify-between text-xs">
                    <span>0.1</span>
                    <span>1.0</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}  
        </div>
        
        {/* Movement axis selector - only show in move mode */}
        {mode === 'move' && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Axis:</span>
            <div className="flex bg-background rounded border border-border">
              <button
                className={`px-2 py-0.5 text-xs ${movementAxis === 'xz' ? 'bg-accent' : ''}`}
                onClick={() => setMovementAxis('xz')}
                title="Move on floor plane (XZ)"
              >
                <MoveIcon className="h-3 w-3" />
              </button>
              <button
                className={`px-2 py-0.5 text-xs border-l border-border ${movementAxis === 'x' ? 'bg-accent' : ''}`}
                onClick={() => setMovementAxis('x')}
                title="Move along X axis"
              >
                <ArrowRightIcon className="h-3 w-3" />
              </button>
              <button
                className={`px-2 py-0.5 text-xs border-l border-border ${movementAxis === 'y' ? 'bg-accent' : ''}`}
                onClick={() => setMovementAxis('y')}
                title="Move along Y axis (up/down)"
              >
                <ArrowUpIcon className="h-3 w-3" />
              </button>
              <button
                className={`px-2 py-0.5 text-xs border-l border-border ${movementAxis === 'z' ? 'bg-accent' : ''}`}
                onClick={() => setMovementAxis('z')}
                title="Move along Z axis"
              >
                <ArrowDownIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
