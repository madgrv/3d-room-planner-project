// FurnitureLibrary: Card-based outliner for furniture drag-and-drop and add
// Team note: All user-facing text is localised except where marked TODO.
// FurnitureLibrary: Card-based outliner for furniture drag-and-drop and add
// Team note: All user-facing text is localised except where marked TODO.
import { useFurnitureStore } from '@/store/furnitureStore';
import { Card } from './Card';
import { useLanguage } from '@/lang';
import { Button } from './button';
import { Plus } from 'lucide-react';

// This interface is just for the UI representation
interface FurnitureItemUI {
  type: string;
  label: string;
  preview: string;
  dimensions: string;
}

// Import the FurnitureItem type from the store
import type { FurnitureItem } from '@/store/furnitureStore';

export function FurnitureLibrary() {
  const { addFurniture } = useFurnitureStore();
  const { lang } = useLanguage(); // Retrieve lang via useLanguage hook

  // Furniture items for the UI
  // All labels and dimensions are now localised via lang.furnitureLibrary
  const FURNITURE_ITEMS: FurnitureItemUI[] = [
    {
      type: 'chair',
      label: lang.furnitureLibrary.chairLabel,
      preview: '/previews/chair.png',
      dimensions: lang.furnitureLibrary.chairDimensions,
    },
    {
      type: 'table',
      label: lang.furnitureLibrary.tableLabel,
      preview: '/previews/table.png',
      dimensions: lang.furnitureLibrary.tableDimensions,
    },
    {
      type: 'sofa',
      label: lang.furnitureLibrary.sofaLabel,
      preview: '/previews/sofa.png',
      dimensions: lang.furnitureLibrary.sofaDimensions,
    },
    {
      type: 'bed',
      label: lang.furnitureLibrary.bedLabel,
      preview: '/previews/bed.png',
      dimensions: lang.furnitureLibrary.bedDimensions,
    },
    {
      type: 'wardrobe',
      label: lang.furnitureLibrary.wardrobeLabel,
      preview: '/previews/wardrobe.png',
      dimensions: lang.furnitureLibrary.wardrobeDimensions,
    },
  ];

  // Add a furniture item by clicking the plus button
  const handleAddFurniture = (type: string) => {
    // Create a new furniture item with default values
    const newItem: Omit<FurnitureItem, 'id'> = {
      type,
      position: [0, 0, 0], // Default position at origin
      rotation: 0, // Default rotation
      visible: true, // Default visibility
    };
    addFurniture(newItem);
  };

  return (
    <Card className='h-full overflow-hidden flex flex-col border-0 shadow-none'>

      <div className='p-4'>
        <p className='text-sm text-muted-foreground'>
          Drag and drop items to add to your room
        </p>
      </div>
      <div className='flex-1 overflow-y-auto p-3 space-y-2'>
        {FURNITURE_ITEMS.map((item) => (
          <div
            key={item.type}
            className={`group relative border rounded-lg p-3 transition-all duration-200 hover:bg-accent/30 hover:shadow-md`}
            draggable={false}
          >
            <div className='flex items-center space-x-3'>
              <div className='w-16 h-16 bg-muted/50 rounded-md overflow-hidden flex items-center justify-center'>
                <img
                  src={`/previews/${item.type}.png`}
                  alt={item.label}
                  className='w-full h-full object-cover'
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/previews/placeholder.svg';
                  }}
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-sm truncate'>{item.label}</h4>
                <p className='text-xs text-muted-foreground'>
                  {item.dimensions}
                </p>
              </div>
              <div className='flex items-center space-x-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
                  onClick={() => handleAddFurniture(item.type)}
                  title={'Add to room'}
                  aria-label={'Add to room'}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
