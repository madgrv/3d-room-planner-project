// FurnitureControls: UI for adding and removing furniture in the 3D room planner.
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useFurnitureStore } from '@/store/furnitureStore';
import { Button } from './Button';
import { useLanguage } from '@/lang';

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
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className='border bg-background text-foreground rounded-[2px] h-8 px-2 text-xs min-w-[120px] max-w-[150px] focus:outline-none focus:ring focus:border-blue-400'
          aria-label={lang.furnitureControls.selectType}
        >
          <option value=''>{lang.furnitureControls.selectType}</option>
          {FURNITURE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
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
