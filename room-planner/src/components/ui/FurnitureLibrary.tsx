import { useState } from 'react';
import { useFurnitureStore } from '@/store/furnitureStore';
import { Card } from './Card';
import { Button } from './Button';
import { Plus, GripVertical } from 'lucide-react';

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

  // Furniture items for the UI
  const FURNITURE_ITEMS: FurnitureItemUI[] = [
    {
      type: 'chair',
      label: 'Chair',
      preview: '/previews/chair.png',
      dimensions: '45 × 45 × 85 cm',
    },
    {
      type: 'table',
      label: 'Table',
      preview: '/previews/table.png',
      dimensions: '120 × 70 × 75 cm',
    },
    {
      type: 'sofa',
      label: 'Sofa',
      preview: '/previews/sofa.png',
      dimensions: '200 × 90 × 80 cm',
    },
    {
      type: 'bed',
      label: 'Bed',
      preview: '/previews/bed.png',
      dimensions: '200 × 160 × 90 cm',
    },
    {
      type: 'wardrobe',
      label: 'Wardrobe',
      preview: '/previews/wardrobe.png',
      dimensions: '100 × 60 × 200 cm',
    },
  ];

  const [isDragging, setIsDragging] = useState<string | null>(null);

  const handleAddFurniture = (type: string) => {
    // Create a new furniture item with default values
    const newItem: Omit<FurnitureItem, 'id'> = {
      type,
      position: [0, 0, 0], // Default position at origin
      rotation: 0, // Default rotation
      visible: true // Default visibility
    };
    addFurniture(newItem);
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/furniture-type', type);
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(type);
  };

  const handleDragEnd = () => {
    setIsDragging(null);
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Furniture Library</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop items to add to your room
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {FURNITURE_ITEMS.map((item) => (
          <div 
            key={item.type}
            className={`group relative border rounded-lg p-3 transition-all duration-200 ${
              isDragging === item.type 
                ? 'bg-accent/70 scale-95 shadow-lg' 
                : 'hover:bg-accent/30 hover:shadow-md'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-muted/50 rounded-md overflow-hidden flex items-center justify-center">
                <img 
                  src={`/previews/${item.type}.png`} 
                  alt={item.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/previews/placeholder.svg';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.label}</h4>
                <p className="text-xs text-muted-foreground">{item.dimensions}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleAddFurniture(item.type)}
                  title="Add to room"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div 
                  className="h-8 w-6 flex items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing"
                  draggable={false}
                >
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
