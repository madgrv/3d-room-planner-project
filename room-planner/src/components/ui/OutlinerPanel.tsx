// OutlinerPanel: A Blender-inspired panel that lists all furniture items in the scene
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useFurnitureStore } from '@/store/furnitureStore';
import { useLanguage } from '@/lang';
import { Button } from './Button';
import {
  EyeOpenIcon,
  EyeClosedIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';

interface OutlinerPanelProps {
  onSelectItem?: (id: string) => void;
}

export function OutlinerPanel({ onSelectItem }: OutlinerPanelProps) {
  const { lang } = useLanguage();
  const { furniture, removeFurniture, updateFurniture } = useFurnitureStore();
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );
  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState('');

  // Handle item selection
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    if (onSelectItem) onSelectItem(id);
  };

  // Toggle item visibility
  const toggleVisibility = (id: string) => {
    const item = furniture.find((item) => item.id === id);
    if (item) {
      // Toggle the visible property (if undefined or true, set to false, otherwise set to true)
      updateFurniture(id, { visible: item.visible === false ? true : false });
    }
  };

  // Start renaming an item
  const startRename = (id: string, currentName: string) => {
    setRenameId(id);
    setRenameValue(currentName);
  };

  // Cancel renaming
  const cancelRename = () => {
    setRenameId(null);
  };

  // Complete renaming
  const completeRename = () => {
    // In a real implementation, we would update the item name in the store
    // For now, we just cancel the rename operation
    setRenameId(null);
  };

  return (
    <div className='flex flex-col gap-2 pt-2 pl-2 bg-card text-card-foreground rounded-md border border-border'>
      <h2 className='text-xs font-medium text-muted-foreground'>
        {lang.outlinerPanel.title}
      </h2>
      <div className='overflow-y-auto max-h-60 p-2'>
        {furniture.length === 0 ? (
          <div className='text-xs text-muted-foreground py-2 text-center'>
            {lang.outlinerPanel.emptyState}
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {furniture.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center p-2 rounded-md border border-border bg-background ${
                  selectedItemId === item.id ? 'ring-2 ring-primary' : ''
                } ${item.visible === false ? 'opacity-50' : ''}`}
                style={{ width: '90px', height: '110px' }}
              >
                {renameId === item.id ? (
                  <div className='flex flex-col items-center gap-1 w-full'>
                    <input
                      type='text'
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className='w-full h-6 px-1 text-xs border rounded'
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') completeRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                    />
                    <div className='flex gap-1'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-6 w-6 p-0'
                        onClick={completeRename}
                      >
                        ✓
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-6 w-6 p-0'
                        onClick={cancelRename}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Item preview - could be an icon or mini 3D preview */}
                    <div
                      className='w-12 h-12 mb-1 flex items-center justify-center bg-muted rounded cursor-pointer'
                      onClick={() => handleSelectItem(item.id)}
                    >
                      {item.type.charAt(0).toUpperCase()}
                    </div>

                    {/* Item name */}
                    <div
                      className='text-xs text-center mb-1 w-full truncate cursor-pointer'
                      onClick={() => handleSelectItem(item.id)}
                      title={
                        lang.furnitureControls[
                          item.type as keyof typeof lang.furnitureControls
                        ] || item.type
                      }
                    >
                      {lang.furnitureControls[
                        item.type as keyof typeof lang.furnitureControls
                      ] || item.type}
                    </div>

                    {/* Action buttons */}
                    <div className='flex items-center justify-center gap-1 mt-auto'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-7 w-7 p-0'
                        onClick={() => toggleVisibility(item.id)}
                        aria-label={lang.outlinerPanel.visibility}
                      >
                        {item.visible === false ? (
                          <EyeClosedIcon className='h-4 w-4' />
                        ) : (
                          <EyeOpenIcon className='h-4 w-4' />
                        )}
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-7 w-7 p-0'
                        onClick={() => startRename(item.id, item.type)}
                        aria-label={lang.outlinerPanel.rename}
                      >
                        <Pencil1Icon className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-7 w-7 p-0 text-destructive'
                        onClick={() => removeFurniture(item.id)}
                        aria-label={lang.outlinerPanel.delete}
                      >
                        <TrashIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
