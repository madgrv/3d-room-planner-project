import { useState } from 'react';

type ViewPreset = 'top' | 'front' | 'side' | 'corner';

export const ViewControls = () => {
  const [activeView, setActiveView] = useState<ViewPreset>('corner');
  
  const handleViewChange = (view: ViewPreset) => {
    // Call the setView function we exposed on the window object
    // This is not ideal but works for our demo
    if (window.setView) {
      window.setView(view);
      setActiveView(view);
    }
  };
  
  const views: { id: ViewPreset; label: string }[] = [
    { id: 'corner', label: '3D View' },
    { id: 'top', label: 'Top View' },
    { id: 'front', label: 'Front View' },
    { id: 'side', label: 'Side View' },
  ];
  
  return (
    <div className="view-controls p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Camera Views</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => handleViewChange(view.id)}
            className={`py-2 px-4 rounded ${
              activeView === view.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
};