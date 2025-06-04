import { useState, useEffect } from 'react';
import { useLanguage } from '@/lang'; // Team note: All user-facing text must be localised.
import { Button } from './Button'; // Team note: Use the shared SHADCN Button for consistency.
import { TopViewIcon, FrontViewIcon, SideViewIcon, CornerViewIcon } from './ViewIcons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'; // Team note: Use the shared SHADCN Button for consistency.

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

  const views: { id: ViewPreset; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'corner', 
      label: lang.viewControls.cornerView,
      icon: <CornerViewIcon className="w-4 h-4" />
    },
    { 
      id: 'top', 
      label: lang.viewControls.topView,
      icon: <TopViewIcon className="w-4 h-4" />
    },
    { 
      id: 'front', 
      label: lang.viewControls.frontView,
      icon: <FrontViewIcon className="w-4 h-4" />
    },
    { 
      id: 'side', 
      label: lang.viewControls.sideView,
      icon: <SideViewIcon className="w-4 h-4" />
    },
  ];

  // Don't render with theme values until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className='p-2 rounded-md border shadow-sm'>{lang.viewControls.loading}</div>;
  }

  // Team note: Styled with SHADCN/Tailwind for modern, accessible UI. All text is localised.
  return (
    <div className='flex flex-col gap-2 p-2 bg-card text-card-foreground rounded-md border border-border'>
      <h2 className='text-xs font-medium text-muted-foreground mb-1'>{lang.viewControls.title}</h2>
      <div className='flex justify-center gap-1'>
        <TooltipProvider>
          {views.map((view) => (
            <Tooltip key={view.id}>
              <TooltipTrigger asChild>
                <Button
                  size='icon'
                  className='w-8 h-8'
                  onClick={() => handleViewChange(view.id)}
                  variant={activeView === view.id ? 'default' : 'outline'}
                  aria-label={view.label}
                >
                  {view.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{view.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
