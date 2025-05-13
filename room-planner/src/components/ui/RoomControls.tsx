import { useState, useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { t } from '@/utils/localisation'; // Team note: All user-facing text must be localised.
import { Button } from './Button'; // Team note: Use the shared SHADCN Button for consistency.

export const RoomControls = () => {
  const { dimensions, setDimensions } = useRoomStore();
  const [width, setWidth] = useState(dimensions.width);
  const [length, setLength] = useState(dimensions.length);
  const [height, setHeight] = useState(dimensions.height);

  // Update local state when store changes
  useEffect(() => {
    setWidth(dimensions.width);
    setLength(dimensions.length);
    setHeight(dimensions.height);
  }, [dimensions]);

  // Handle input changes
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setWidth(value);
    }
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setLength(value);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setHeight(value);
    }
  };

  // Apply changes to the store
  const applyChanges = () => {
    setDimensions({ width, length, height });
  };

  return (
    <div className="room-controls p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{t('roomPlannerTitle')}</h2>
      {/* Team note: All labels and button text below are loaded from the localisation file for maintainability and future translation. */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('roomControls.widthLabel')}</label>
        <input
          type="number"
          min="1"
          max="20"
          step="0.1"
          value={width}
          onChange={handleWidthChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1" htmlFor="room-length">{t('roomControls.lengthLabel')}</label>
        <input
          id="room-length"
          type="number"
          min="1"
          max="10"
          step="0.1"
          value={length}
          onChange={handleLengthChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="room-height">{t('roomControls.heightLabel')}</label>
        <input
          id="room-height"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={height}
          onChange={handleHeightChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      {/* Team note: Using the shared SHADCN Button component for consistency and reuse across the app. */}
      <Button onClick={applyChanges} className="w-full" aria-label={t('roomControls.applyButton')}>
        {t('roomControls.applyButton')}
      </Button>
    </div>
  );
};