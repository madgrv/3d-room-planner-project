import { useState, useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';

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
      <h2 className="text-xl font-bold mb-4">Room Dimensions</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Width (m)</label>
        <input
          type="number"
          min="1"
          max="20"
          step="0.1"
          value={width}
          onChange={handleWidthChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Length (m)</label>
        <input
          type="number"
          min="1"
          max="20"
          step="0.1"
          value={length}
          onChange={handleLengthChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Height (m)</label>
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={height}
          onChange={handleHeightChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        onClick={applyChanges}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
};