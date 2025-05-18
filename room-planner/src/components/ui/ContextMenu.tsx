// ContextMenu: A Blender-inspired context menu for quick access to common operations
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
// import { useLanguage } from '@/lang'; // Will be needed for localisation in the future
import { useFurnitureStore } from '@/store/furnitureStore';
import { useViewStore } from '@/store/viewStore';
import { useRoomElementStore, RoomElementType } from '@/store/roomElementStore';

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
  // const { lang } = useLanguage(); // Not currently used but kept for future localisation
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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
  const isRoomElementVisible = roomElement ? visibility[roomElement] : true;

  // Get room element name for display
  const getRoomElementName = (element: RoomElementType): string => {
    if (!element) return 'Unknown';

    switch (element) {
      case 'floor':
        return 'Floor';
      case 'wall-front':
        return 'Front Wall';
      case 'wall-back':
        return 'Back Wall';
      case 'wall-left':
        return 'Left Wall';
      case 'wall-right':
        return 'Right Wall';
      case 'ceiling':
        return 'Ceiling';
      default:
        return 'Room Element';
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
      className='fixed z-50 bg-card text-card-foreground shadow-lg rounded-sm border border-border overflow-hidden w-48'
      style={{ left: x, top: y }}
    >
      <div className='p-1 flex flex-col text-sm'>
        {selectedItem ? (
          // Furniture menu
          <>
            <div className='p-2 border-b border-border font-medium'>
              {selectedItem.type}
            </div>

            {/* Movement axis selection */}
            <div className='p-1'>
              <div className='px-2 py-1 text-xs text-muted-foreground'>
                Movement Axis
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
                Floor Plane (XZ)
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
                <ArrowRightIcon className='h-3 w-3' />X Axis
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
                <ArrowUpIcon className='h-3 w-3' />Y Axis (Up/Down)
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
                <ArrowDownIcon className='h-3 w-3' />Z Axis
              </button>
            </div>

            {/* Item operations */}
            <div className='p-1 border-t border-border'>
              <div className='px-2 py-1 text-xs text-muted-foreground'>
                Operations
              </div>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleDuplicate}
              >
                <CopyIcon className='h-3 w-3' />
                Duplicate
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleDelete}
              >
                <TrashIcon className='h-3 w-3' />
                Delete
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleToggleVisibility}
              >
                {selectedItem.visible === false ? (
                  <>
                    <EyeOpenIcon className='h-3 w-3' />
                    Show
                  </>
                ) : (
                  <>
                    <EyeClosedIcon className='h-3 w-3' />
                    Hide
                  </>
                )}
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleToggleSnap}
              >
                <ArrowDownIcon className='h-3 w-3' />
                {snapEnabled ? 'Snap: On' : 'Snap: Off'}
              </button>
              <button
                className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
                onClick={handleSnapToFloor}
              >
                <ArrowDownIcon className='h-3 w-3' />
                Place on Floor
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
                  Hide {getRoomElementName(roomElement).toLowerCase()}
                </>
              ) : (
                <>
                  <EyeOpenIcon className='h-3 w-3' />
                  Show {getRoomElementName(roomElement).toLowerCase()}
                </>
              )}
            </button>

            {/* Select element */}
            <button
              className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
              onClick={handleRoomElementAction}
            >
              <Pencil1Icon className='h-3 w-3' />
              Select {getRoomElementName(roomElement)}
            </button>

            {/* Add texture/color option */}
            <button
              className='w-full text-left px-2 py-1 text-xs hover:bg-accent rounded flex items-center gap-2'
              onClick={() => {
                alert(
                  'Texture/color change would be implemented in a future update'
                );
                onClose();
              }}
            >
              <Pencil1Icon className='h-3 w-3' />
              Change Texture
            </button>
          </>
        ) : (
          // Empty space menu
          <div className='p-2 text-center text-muted-foreground'>
            No item selected
          </div>
        )}
      </div>
    </div>
  );
}
