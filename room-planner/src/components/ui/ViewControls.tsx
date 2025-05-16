import { useState, useEffect } from 'react';
import { useLanguage } from '@/lang'; // Team note: All user-facing text must be localised.
import { Button } from './Button'; // Team note: Use the shared SHADCN Button for consistency.

type ViewPreset = 'top' | 'front' | 'side' | 'corner';

export const ViewControls = () => {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<ViewPreset>('corner');

  // After mounting, we can safely access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewChange = (view: ViewPreset) => {
    // Call the setView function we exposed on the window object
    // This is not ideal but works for our demo
    if (window.setView) {
      window.setView(view);
      setActiveView(view);
    }
  };

  const views: { id: ViewPreset; label: string }[] = [
    { id: 'corner', label: lang.viewControls.cornerView },
    { id: 'top', label: lang.viewControls.topView },
    { id: 'front', label: lang.viewControls.frontView },
    { id: 'side', label: lang.viewControls.sideView },
  ];

  // Don't render with theme values until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className='p-2 rounded-md border shadow-sm'>{lang.viewControls.loading}</div>;
  }

  // Team note: Styled with SHADCN/Tailwind for modern, accessible UI. All text is localised.
  return (
    <div className='flex justify-between gap-2 p-2 bg-card text-card-foreground rounded-md border border-border'>
      <h2 className='text-sm font-medium text-muted-foreground'>{lang.viewControls.title}</h2>
      <div className='flex gap-2'>
        {views.map((view) => (
          <Button
            key={view.id}
            size='icon'
            onClick={() => handleViewChange(view.id)}
            variant={activeView === view.id ? 'default' : 'outline'}
            aria-label={view.label}
          >
            {view.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
