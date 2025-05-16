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


  const { furniture, addFurniture, removeFurniture } = useFurnitureStore();
  const [selectedType, setSelectedType] = React.useState('');

  const handleAdd = () => {
    if (!selectedType) return;
    // Place new furniture at origin by default; user can drag in 3D view.
    addFurniture({ type: selectedType, position: [0, 0, 0], rotation: 0 });
    setSelectedType('');
  };

  return (
    <div className='flex justify-between gap-2 p-2 bg-card text-card-foreground rounded-md border border-border'>
      <h2 className='text-sm font-medium text-muted-foreground'>{lang.furnitureControls.title}</h2>
      <div className='flex gap-2'>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className='border border-input bg-background text-foreground rounded-[2px] h-8 px-2 flex-1 focus:outline-none focus:ring focus:ring-ring focus:border-ring'
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
          onClick={handleAdd}
          disabled={!selectedType}
          aria-label={lang.furnitureControls.addLabel}
        >
          {lang.furnitureControls.addLabel}
        </Button>
      </div>
      <ul>
        {furniture.length === 0 && (
          <li className='py-2 text-muted-foreground'>
            {lang.furnitureControls.noFurniture}
          </li>
        )}
        {furniture.map((item) => (
          <li key={item.id} className='flex items-center justify-between py-2'>
            <span>{lang.furnitureControls[item.type as keyof typeof lang.furnitureControls]}</span>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => removeFurniture(item.id)}
              aria-label={lang.furnitureControls.removeLabel}
            >
              {lang.furnitureControls.removeLabel}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
