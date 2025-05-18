// StatusBar: A Blender-inspired status bar that shows information about the selected object and current mode
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useLanguage } from '@/lang';
import { useFurnitureStore } from '@/store/furnitureStore';
import { 
  MagnifyingGlassIcon, 
  ArrowRightIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MoveIcon, 
  ChevronDownIcon,
  ReloadIcon,
  UpdateIcon,
  BoxIcon,
  GridIcon
} from '@radix-ui/react-icons';
import { useViewStore, RotationAmount } from '@/store/viewStore';
import { useRoomElementStore, RoomElementType } from '@/store/roomElementStore';
import { useTileStore } from '@/store/tileStore';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Slider } from './slider';
import { Switch } from './Switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface StatusBarProps {
  selectedItemId: string | null;
  mode?: 'select' | 'move' | 'rotate';
  snapEnabled?: boolean;
  onToggleSnap?: () => void;
  onChangeMode?: (mode: 'select' | 'move' | 'rotate') => void;
  snapValue?: number;
  onSnapValueChange?: (value: number) => void;
  // No need to pass selectedRoomElement as a prop since we'll get it from the store
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
  
  // Get and set the rotation amount from the store
  const rotationAmount = useViewStore((state) => state.rotationAmount);
  const setRotationAmount = useViewStore((state) => state.setRotationAmount);

  // Get the selected room element from the store
  const selectedRoomElement = useRoomElementStore((state) => state.selectedElement);
  const roomElementVisibility = useRoomElementStore((state) => state.visibility);

  // Get the selected furniture item
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
    // Convert radians to degrees for display
    const degrees = (rotation * 180 / Math.PI) % 360;
    return `${degrees.toFixed(0)}°`;
  };
  
  // Format room element name for display
  const formatRoomElementName = (element: NonNullable<RoomElementType>) => {
    switch(element) {
      case 'floor': return 'Floor';
      case 'ceiling': return 'Ceiling';
      case 'wall-front': return 'Front Wall';
      case 'wall-back': return 'Back Wall';
      case 'wall-left': return 'Left Wall';
      case 'wall-right': return 'Right Wall';
      default: return element;
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 px-3 py-2 bg-card text-card-foreground border-t border-border text-xs">
      {/* Left section: Selected object info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-1 sm:mb-0">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{lang.statusBar.selectedObject}</span>
          <span>
            {selectedItem
              ? lang.furnitureControls[selectedItem.type as keyof typeof lang.furnitureControls] || selectedItem.type
              : selectedRoomElement
                ? formatRoomElementName(selectedRoomElement)
                : lang.statusBar.noSelection}
          </span>
          {/* Show an icon to indicate the type of selection */}
          {selectedItem && <MoveIcon className="h-3 w-3 ml-1 text-muted-foreground" />}
          {selectedRoomElement && <BoxIcon className="h-3 w-3 ml-1 text-muted-foreground" />}
        </div>
        
        {/* Show furniture properties */}
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
        
        {/* Show room element properties */}
        {selectedRoomElement && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Type:</span>
              <span>{formatRoomElementName(selectedRoomElement)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Visible:</span>
              <span>{roomElementVisibility[selectedRoomElement] ? 'Yes' : 'No'}</span>
            </div>
          </>
        )}
      </div>
      
      {/* Right section: Mode and snap controls */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`px-2 py-0.5 text-xs ${movementAxis === 'xz' ? 'bg-accent' : ''}`}
                      onClick={() => setMovementAxis('xz')}
                      aria-label={lang.statusBar?.moveFloorPlane || 'Move on floor plane (XZ)'}
                    >
                      <MoveIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lang.statusBar.moveFloorPlane}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`px-2 py-0.5 text-xs border-l border-border ${movementAxis === 'x' ? 'bg-accent' : ''}`}
                      onClick={() => setMovementAxis('x')}
                      aria-label={lang.statusBar?.moveXAxis || 'Move along X axis'}
                    >
                      <ArrowRightIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lang.statusBar.moveXAxis}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`px-2 py-0.5 text-xs border-l border-border ${movementAxis === 'y' ? 'bg-accent' : ''}`}
                      onClick={() => setMovementAxis('y')}
                      aria-label={lang.statusBar?.moveYAxis || 'Move along Y axis (up/down)'}
                    >
                      <ArrowUpIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lang.statusBar.moveYAxis}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`px-2 py-0.5 text-xs border-l border-border ${movementAxis === 'z' ? 'bg-accent' : ''}`}
                      onClick={() => setMovementAxis('z')}
                      aria-label={lang.statusBar?.moveZAxis || 'Move along Z axis'}
                    >
                      <ArrowDownIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lang.statusBar.moveZAxis}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        
        {/* Rotation controls - only show in rotate mode */}
        {mode === 'rotate' && selectedItem && (
          <div className="flex items-center gap-3">
            {/* Rotation amount selector */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Increment:</span>
              <div className="flex bg-background rounded border border-border">
                {[90, 45, 15, 5].map((amount) => (
                  <TooltipProvider key={`rotation-${amount}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`px-2 py-0.5 text-xs ${amount !== 90 ? 'border-l border-border' : ''} ${rotationAmount === amount ? 'bg-accent' : ''}`}
                          onClick={() => setRotationAmount(amount as RotationAmount)}
                          aria-label={`Rotate by ${amount} degrees`}
                        >
                          {amount}°
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rotate by {amount} degrees</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            
            {/* Rotation direction buttons */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Rotate:</span>
              <div className="flex bg-background rounded border border-border">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="px-2 py-0.5 text-xs"
                        onClick={() => {
                          if (selectedItem) {
                            // Convert degrees to radians
                            const radians = (rotationAmount * Math.PI) / 180;
                            // Rotate counter-clockwise
                            const newRotation = (selectedItem.rotation - radians) % (Math.PI * 2);
                            useFurnitureStore.getState().updateFurniture(selectedItem.id, { rotation: newRotation });
                          }
                        }}
                        aria-label="Rotate counter-clockwise"
                      >
                        <ReloadIcon className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rotate counter-clockwise by {rotationAmount}°</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="px-2 py-0.5 text-xs border-l border-border"
                        onClick={() => {
                          if (selectedItem) {
                            // Convert degrees to radians
                            const radians = (rotationAmount * Math.PI) / 180;
                            // Rotate clockwise
                            const newRotation = (selectedItem.rotation + radians) % (Math.PI * 2);
                            useFurnitureStore.getState().updateFurniture(selectedItem.id, { rotation: newRotation });
                          }
                        }}
                        aria-label="Rotate clockwise"
                      >
                        <UpdateIcon className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rotate clockwise by {rotationAmount}°</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        )}
        
        {/* Tile controls - only show when a room element is selected */}
        {selectedRoomElement && (
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tiles:</span>
                    <Switch
                      checked={useTileStore.getState().elementTilingEnabled[selectedRoomElement] || false}
                      onCheckedChange={(checked) => {
                        useTileStore.getState().setTilingEnabled(selectedRoomElement, checked);
                      }}
                      aria-label="Toggle tiling"
                    />
                    <GridIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle tiling for {formatRoomElementName(selectedRoomElement)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
