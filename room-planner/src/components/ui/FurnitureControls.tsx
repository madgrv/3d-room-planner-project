// FurnitureControls: UI for adding and removing furniture in the 3D room planner.
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useFurnitureStore } from '@/store/furnitureStore';
import { Button } from './Button';
import { useLanguage } from '@/lang';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function FurnitureControls() {
  const { lang } = useLanguage();

  const FURNITURE_TYPES = [
    { value: 'chair', label: lang.furnitureControls.chair },
    { value: 'table', label: lang.furnitureControls.table },
    { value: 'sofa', label: lang.furnitureControls.sofa },
    { value: 'bed', label: lang.furnitureControls.bed },
    { value: 'wardrobe', label: lang.furnitureControls.wardrobe },
  ];

  const { addFurniture } = useFurnitureStore();
  const [selectedType, setSelectedType] = React.useState('');

  const handleAdd = () => {
    if (!selectedType) return;
    // Place new furniture at origin by default; user can drag in 3D view.
    addFurniture({ type: selectedType, position: [0, 0, 0], rotation: 0 });
    setSelectedType('');
  };

  return (
    <div className='flex flex-col gap-2 p-2 bg-card text-card-foreground rounded-md border border-border'>
      <h2 className='text-xs font-medium text-muted-foreground mb-1'>
        {lang.furnitureControls.title}
      </h2>
      <div className='flex justify-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs min-w-[140px] flex-1 flex justify-between items-center truncate'
              aria-label={lang.furnitureControls.selectType}
            >
              <span className="truncate">
                {selectedType ? FURNITURE_TYPES.find(type => type.value === selectedType)?.label : lang.furnitureControls.selectType}
              </span>
              <ChevronDown className='ml-2 h-4 w-4 opacity-50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='min-w-[120px]'>
            {FURNITURE_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className='text-xs'
              >
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant='default'
          size='sm'
          className='h-8 text-xs'
          onClick={handleAdd}
          disabled={!selectedType}
          aria-label={lang.furnitureControls.addLabel}
        >
          {lang.furnitureControls.addLabel}
        </Button>
      </div>
    </div>
  );
}
