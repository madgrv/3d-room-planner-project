// FurnitureControls: UI for adding and removing furniture in the 3D room planner.
// Team note: All user-facing text is localised. All primitives are SHADCN components, centralised for reuse.

import * as React from 'react';
import { useFurnitureStore } from '@/store/furnitureStore';
import { Button } from './Button';
import { t } from '@/utils/localisation';

const FURNITURE_TYPES = [
  { value: 'chair', label: t('furnitureControls.chair') },
  { value: 'table', label: t('furnitureControls.table') },
  { value: 'sofa', label: t('furnitureControls.sofa') },
  { value: 'bed', label: t('furnitureControls.bed') },
  { value: 'wardrobe', label: t('furnitureControls.wardrobe') },
];

export function FurnitureControls() {
  const { furniture, addFurniture, removeFurniture } = useFurnitureStore();
  const [selectedType, setSelectedType] = React.useState('');

  const handleAdd = () => {
    if (!selectedType) return;
    // Place new furniture at origin by default; user can drag in 3D view.
    addFurniture({ type: selectedType, position: [0, 0, 0], rotation: 0 });
    setSelectedType('');
  };

  // Team note: Styled with SHADCN/Tailwind for modern, accessible UI. All text is localised.
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{t('furnitureControls.title')}</h2>
      <div className="flex gap-2 mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded p-2 flex-1 focus:outline-none focus:ring focus:border-blue-400"
          aria-label={t('furnitureControls.selectType')}
        >
          <option value="">{t('furnitureControls.selectType')}</option>
          {FURNITURE_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <Button
          variant="default"
          size="sm"
          onClick={handleAdd}
          disabled={!selectedType}
          aria-label={t('furnitureControls.addLabel')}
        >
          {t('furnitureControls.addLabel')}
        </Button>
      </div>
      <ul>
        {furniture.length === 0 && (
          <li className="py-2 text-gray-500">{t('furnitureControls.noFurniture')}</li>
        )}
        {furniture.map(item => (
          <li key={item.id} className="flex items-center justify-between py-2">
            <span>{t(`furnitureControls.${item.type}`)}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFurniture(item.id)}
              aria-label={t('furnitureControls.removeLabel')}
            >
              {t('furnitureControls.removeLabel')}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
