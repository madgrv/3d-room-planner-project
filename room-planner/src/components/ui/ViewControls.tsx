import { useState, useEffect } from 'react';
import { useLanguage } from '@/lang'; // Team note: All user-facing text must be localised.
import { Button } from './Button'; // Team note: Use the shared SHADCN Button for consistency.
import {
  TopViewIcon,
  FrontViewIcon,
  SideViewIcon,
  CornerViewIcon,
} from './ViewIcons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'; // Team note: Use the shared SHADCN Button for consistency.

type ViewPreset = 'top' | 'front' | 'side' | 'corner';

export const ViewControls = () => {
  console.log('ViewControls component rendering');
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
    console.log('View change requested:', view);
    if (window.setView) {
      console.log('window.setView is available');
      window.setView(view);
      setActiveView(view);
    } else {
      console.log('window.setView is not available');
    }
  };

  const views: { id: ViewPreset; label: string; icon: React.ReactNode }[] = [
    {
      id: 'corner',
      label: lang.viewControls.cornerView,
      icon: <CornerViewIcon className='w-4 h-4' />,
    },
    {
      id: 'top',
      label: lang.viewControls.topView,
      icon: <TopViewIcon className='w-4 h-4' />,
    },
    {
      id: 'front',
      label: lang.viewControls.frontView,
      icon: <FrontViewIcon className='w-4 h-4' />,
    },
    {
      id: 'side',
      label: lang.viewControls.sideView,
      icon: <SideViewIcon className='w-4 h-4' />,
    },
  ];

  // Don't render with theme values until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className='p-2 rounded-md border shadow-sm'>
        {lang.viewControls.loading}
      </div>
    );
  }

  return (
    <div
      className='flex gap-1 p-1.5 rounded-md transition-all duration-200
                    opacity-50 hover:opacity-100
                    bg-transparent hover:bg-black
                    border border-black hover:shadow-lg
                    hover:scale-105 transform origin-bottom-right
                    group'
    >
      <TooltipProvider>
        {views.map((view) => (
          <Tooltip key={view.id}>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                className={`w-8 h-8 bg-transparent border-transparent
                         ${
                           activeView === view.id
                             ? 'text-white bg-white/30 border-white/50'
                             : 'text-gray-400 opacity-50'
                         }
                         group-hover:text-white group-hover:opacity-100
                         hover:scale-110 transform transition-transform`}
                onClick={() => handleViewChange(view.id)}
                aria-label={view.label}
              >
                {view.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p>{view.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
