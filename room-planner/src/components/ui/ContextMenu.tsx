// ContextMenu: A Blender-inspired context menu for quick access to common operations
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useLanguage } from '@/lang';
import { useFurnitureStore } from '@/store/furnitureStore';
import { useViewStore } from '@/store/viewStore';
import { RoomElementType, useRoomElementStore } from '@/store/roomElementStore';

import {
  CopyIcon,
  TrashIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  Pencil1Icon,
  MoveIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ReloadIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';

interface ContextMenuProps {
  x: number;
  y: number;
  itemId: string | null;
  roomElement: RoomElementType | null;
  onClose: () => void;
}

export function ContextMenu({
  x,
  y,
  itemId,
  roomElement,
  onClose,
}: ContextMenuProps) {
  const { lang } = useLanguage();
  const { furniture, removeFurniture, updateFurniture } = useFurnitureStore();
  // Access the store using individual selectors to prevent infinite update loops
  // Only extract the specific values we need from the store
  const toggleVisibility = useRoomElementStore(
    (state) => state.toggleVisibility
  );
  const visibility = useRoomElementStore((state) => state.visibility);
  const setSelectedElement = useRoomElementStore(
    (state) => state.setSelectedElement
  );
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Get and set the movement axis from the store
  const movementAxis = useViewStore((state) => state.movementAxis);
  const setMovementAxis = useViewStore((state) => state.setMovementAxis);

  // Access the global snap state
  const snapEnabled = useFurnitureStore((s) => s.snapEnabled);
  const setSnapEnabled = useFurnitureStore((s) => s.setSnapEnabled);

  // Close the menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the menu for any click (left, right, middle) outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use mousedown to capture clicks before they're processed
    document.addEventListener('mousedown', handleClickOutside, {
      capture: true,
    });

    // Also handle pointerdown for better mobile support
    document.addEventListener(
      'pointerdown',
      handleClickOutside as EventListener,
      { capture: true }
    );

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, {
        capture: true,
      });
      document.removeEventListener(
        'pointerdown',
        handleClickOutside as EventListener,
        { capture: true }
      );
    };
  }, [onClose]);

  // Find the selected item in the furniture store
  const selectedItem = React.useMemo(() => {
    if (!itemId) return null;
    return furniture.find((item) => item.id === itemId) || null;
  }, [furniture, itemId]);

  // Handle duplicate item
  const handleDuplicate = () => {
    if (!selectedItem) return;

    // Create a new item with the same properties but offset position
    const newItem = {
      ...selectedItem,
      position: [
        selectedItem.position[0] + 0.5,
        selectedItem.position[1],
        selectedItem.position[2] + 0.5,
      ] as [number, number, number],
    };

    // Remove the id as the store will generate a new one
    // Remove the id property for the new item; the store will generate a unique id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (newItem as any).id;

    // Add the new item to the store
    useFurnitureStore.getState().addFurniture(newItem);

    onClose();
  };

  // Handle delete item
  const handleDelete = () => {
    if (!selectedItem) return;

    removeFurniture(selectedItem.id);
    onClose();
  };

  // Handle toggle visibility
  const handleToggleVisibility = () => {
    if (!selectedItem) return;

    // Toggle visibility
    updateFurniture(selectedItem.id, {
      visible: selectedItem.visible === false ? true : false,
    });

    onClose();
  };

  // Edit state and handlers removed as they are not currently used in the UI. Add back if/when inline editing is implemented.

  // Handle room element selection
  const handleRoomElementAction = () => {
    if (roomElement) {
      // Set the selected room element in the store
      setSelectedElement(roomElement);
      onClose();
    }
  };

  // Toggle visibility of room element
  const handleToggleRoomElementVisibility = () => {
    if (roomElement) {
      toggleVisibility(roomElement);
      onClose();
    }
  };

  // Check if room element is currently visible
  const isRoomElementVisible = roomElement
    ? visibility[roomElement as NonNullable<RoomElementType>]
    : true;

  // Get room element name for display
  const getRoomElementName = (element: RoomElementType): string => {
    if (!element) return 'Unknown';

    switch (element) {
      case 'floor':
        return lang.contextMenu.floor;
      case 'wall-front':
        return lang.contextMenu.wallFront;
      case 'wall-back':
        return lang.contextMenu.wallBack;
      case 'wall-left':
        return lang.contextMenu.wallLeft;
      case 'wall-right':
        return lang.contextMenu.wallRight;
      case 'ceiling':
        return lang.contextMenu.ceiling;
      default:
        return lang.contextMenu.roomElement;
    }
  };

  // Get translated furniture type name
  const getFurnitureTypeName = (type: string): string => {
    switch (type) {
      case 'chair':
        return lang.furnitureControls.chair;
      case 'table':
        return lang.furnitureControls.table;
      case 'sofa':
        return lang.furnitureControls.sofa;
      case 'bed':
        return lang.furnitureControls.bed;
      case 'wardrobe':
        return lang.furnitureControls.wardrobe;
      default:
        return type;
    }
  };

  // Toggle snap function
  const handleToggleSnap = () => {
    setSnapEnabled(!snapEnabled);
    onClose();
  };

  // Handle snap to floor (place object on ground level)
  const handleSnapToFloor = () => {
    if (!selectedItem) return;

    // Calculate the appropriate Y position based on furniture type
    // This ensures the bottom of the object is at floor level (y=0)
    let yOffset = 0.5; // Default height offset for generic items

    // Adjust Y position based on furniture type to place bottom at floor level
    switch (selectedItem.type) {
      case 'chair':
        yOffset = 0.5; // Half height of cylinder (1/2)
        break;
      case 'table':
        yOffset = 0.05; // Half height of table (0.1/2)
        break;
      case 'sofa':
        yOffset = 0.3; // Half height of sofa (0.6/2)
        break;
      case 'bed':
        yOffset = 0.15; // Half height of bed (0.3/2)
        break;
      case 'wardrobe':
        yOffset = 1.0; // Half height of wardrobe (2/2)
        break;
      default:
        yOffset = 0.5; // Default for generic items
    }

    // Set Y position to the appropriate offset while preserving X and Z coordinates
    const newPosition: [number, number, number] = [
      selectedItem.position[0],
      yOffset, // Position Y at half the height to place bottom at floor level
      selectedItem.position[2],
    ];

    // Update the furniture item's position in the global store
    updateFurniture(selectedItem.id, { position: newPosition });
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className='fixed z-50 bg-card text-card-foreground rounded-md border border-border overflow-hidden w-48 [box-shadow:var(--shadow-md)]'
      style={{ left: x, top: y }}
    >
      <div className='p-1 flex flex-col text-sm'>
        {selectedItem ? (
          // Furniture menu
          <>
            <div className='p-2 border-b border-border font-medium'>
              {getFurnitureTypeName(selectedItem.type)}
            </div>

            {/* Movement axis selection */}
            <div className='p-1'>
              <div className='px-2 py-1 text-xs text-muted-foreground'>
                {lang.contextMenu.movementAxis}
              </div>
              <button
                className={`w-full text-left px-2 py-1 text-xs ${
                  movementAxis === 'xz' ? 'bg-accent' : 'hover:bg-accent'
                } rounded flex items-center gap-2`}
                onClick={() => {
                  setMovementAxis('xz');
                  onClose();
                }}
              >
                <MoveIcon className='h-3 w-3' />
                {lang.contextMenu.floorPlane}
              </button>
              <button
                className={`w-full text-left px-2 py-1 text-xs ${
                  movementAxis === 'x' ? 'bg-accent' : 'hover:bg-accent'
                } rounded flex items-center gap-2`}
                onClick={() => {
                  setMovementAxis('x');
                  onClose();
                }}
              >
                <ArrowRightIcon className='h-3 w-3' />
                {lang.contextMenu.xAxis}
              </button>
              <button
                className={`w-full text-left px-2 py-1 text-xs ${
                  movementAxis === 'y' ? 'bg-accent' : 'hover:bg-accent'
                } rounded flex items-center gap-2`}
                onClick={() => {
                  setMovementAxis('y');
                  onClose();
                }}
              >
                <ArrowUpIcon className='h-3 w-3' />
                {lang.contextMenu.yAxis}
              </button>
              <button
                className={`w-full text-left px-2 py-1 text-xs ${
                  movementAxis === 'z' ? 'bg-accent' : 'hover:bg-accent'
                } rounded flex items-center gap-2`}
                onClick={() => {
                  setMovementAxis('z');
                  onClose();
                }}
              >
                <ArrowDownIcon className='h-3 w-3' />
                {lang.contextMenu.zAxis}
              </button>
            </div>

            {/* Item operations */}
            <div className='p-1 border-t border-border'>
              <div className='px-2 py-1 text-xs text-muted-foreground'>
                {lang.contextMenu.operations}
              </div>
              {/* Rotation controls */}
              <div className='p-1'>
                <div className='px-2 py-1 text-xs text-muted-foreground'>
                  {lang.contextMenu.rotation}
                </div>
                <div className='flex justify-between px-2'>
                  <button
                    className='text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                    onClick={() => {
                      // Rotate counter-clockwise by 90 degrees (π/2 radians)
                      const newRotation =
                        (selectedItem.rotation - Math.PI / 2) % (Math.PI * 2);
                      updateFurniture(selectedItem.id, {
                        rotation: newRotation,
                      });
                    }}
                  >
                    <ReloadIcon className='h-4 w-4' />
                    {lang.contextMenu.rotateCounterClockwise}
                  </button>
                  <button
                    className='text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                    onClick={() => {
                      // Rotate clockwise by 90 degrees (π/2 radians)
                      const newRotation =
                        (selectedItem.rotation + Math.PI / 2) % (Math.PI * 2);
                      updateFurniture(selectedItem.id, {
                        rotation: newRotation,
                      });
                    }}
                  >
                    <UpdateIcon className='h-4 w-4' />
                    {lang.contextMenu.rotateClockwise}
                  </button>
                </div>
              </div>

              {/* Duplicate */}
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleDuplicate}
              >
                <CopyIcon className='h-3 w-3' />
                {lang.contextMenu.duplicate}
              </button>

              {/* Delete */}
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2 text-destructive hover:text-destructive'
                onClick={handleDelete}
              >
                <TrashIcon className='h-3 w-3' />
                {lang.contextMenu.delete}
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleToggleVisibility}
              >
                {selectedItem.visible === false ? (
                  <>
                    <EyeOpenIcon className='h-3 w-3' />
                    {lang.contextMenu.show}
                  </>
                ) : (
                  <>
                    <EyeClosedIcon className='h-3 w-3' />
                    {lang.contextMenu.hide}
                  </>
                )}
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleToggleSnap}
              >
                <ArrowDownIcon className='h-3 w-3' />
                {snapEnabled
                  ? lang.contextMenu.snapOn
                  : lang.contextMenu.snapOff}
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleSnapToFloor}
              >
                <ArrowDownIcon className='h-3 w-3' />
                {lang.contextMenu.placeOnFloor}
              </button>
            </div>
          </>
        ) : roomElement ? (
          // Room element menu
          <>
            <div className='p-2 border-b border-border font-medium'>
              {getRoomElementName(roomElement)}
            </div>

            {/* Toggle visibility */}
            <button
              className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
              onClick={handleToggleRoomElementVisibility}
            >
              {isRoomElementVisible ? (
                <>
                  <EyeClosedIcon className='h-3 w-3' />
                  {lang.contextMenu.hideElement.replace(
                    '{element}',
                    getRoomElementName(roomElement).toLowerCase()
                  )}
                </>
              ) : (
                <>
                  <EyeOpenIcon className='h-3 w-3' />
                  {lang.contextMenu.showElement.replace(
                    '{element}',
                    getRoomElementName(roomElement).toLowerCase()
                  )}
                </>
              )}
            </button>

            {/* Select element */}
            <button
              className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
              onClick={handleRoomElementAction}
            >
              <Pencil1Icon className='h-3 w-3' />
              {lang.contextMenu.selectElement.replace(
                '{element}',
                getRoomElementName(roomElement)
              )}
            </button>

            {/* Add texture/color option */}
            <button
              className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
              onClick={() => {
                alert(lang.contextMenu.textureChangeMessage);
                onClose();
              }}
            >
              <Pencil1Icon className='h-3 w-3' />
              {lang.contextMenu.changeTexture}
            </button>
          </>
        ) : (
          // Empty space menu
          <div className='p-2 text-center text-muted-foreground'>
            {lang.contextMenu.noItemSelected}
          </div>
        )}
      </div>
    </div>
  );
}
