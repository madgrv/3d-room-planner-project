import { useState, useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Button } from './Button';
import { useLanguage } from '@/lang';

export const RoomControls = () => {
  const { lang } = useLanguage();
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

  // Common input style for consistency - matches sm button height exactly
  const inputStyle =
    'w-16 h-8 px-2 border rounded-[2px] focus:outline-none focus:ring focus:border-blue-400 text-xs';

  return (
    <div className='flex flex-col gap-2 room-controls p-2 bg-card text-card-foreground rounded-md border border-border'>
      <h2 className='text-xs font-medium text-muted-foreground mb-1'>
        {lang.roomControls.title}
      </h2>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <div className='flex items-center gap-1'>
          <label className='block text-xs font-medium'>
            {lang.roomControls.widthLabel}
          </label>
          <input
            type='number'
            min='1'
            max='20'
            step='0.1'
            value={width}
            onChange={handleWidthChange}
            className={inputStyle}
          />
        </div>
        <div className='flex items-center gap-1'>
          <label className='block text-xs font-medium' htmlFor='room-length'>
            {lang.roomControls.lengthLabel}
          </label>
          <input
            id='room-length'
            type='number'
            min='1'
            max='10'
            step='0.1'
            value={length}
            onChange={handleLengthChange}
            className={inputStyle}
          />
        </div>
        <div className='flex items-center gap-1'>
          <label className='block text-xs font-medium' htmlFor='room-height'>
            {lang.roomControls.heightLabel}
          </label>
          <input
            id='room-height'
            type='number'
            min='1'
            max='5'
            step='0.1'
            value={height}
            onChange={handleHeightChange}
            className={inputStyle}
          />
        </div>
        {/* Team note: Using the shared SHADCN Button component for consistency and reuse across the app. */}
        <Button
          onClick={applyChanges}
          size='sm'
          className='h-8 text-xs px-2'
          aria-label={lang.roomControls.applyButton}
        >
          {lang.roomControls.applyButton}
        </Button>
      </div>
    </div>
  );
};
