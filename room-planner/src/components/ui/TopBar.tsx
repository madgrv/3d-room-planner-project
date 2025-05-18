import { ThemeSwitcher } from './ThemeSwitcher';
import { RoomControls } from './RoomControls';
import { ViewControls } from './ViewControls';
import { FurnitureControls } from './FurnitureControls';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/lang';

interface TopBarProps {
  className?: string;
}

export function TopBar({ className = '' }: TopBarProps) {
  // Use the language hook to access the current language
  const { lang } = useLanguage();

  return (
    <div className={`${className}`}>
      <div className='relative flex md:flex-row flex-col items-center justify-between mb-2 md:mb-3'>
        <div className='absolute inset-x-0 flex flex-col items-center justify-center pointer-events-none'>
          <h1 className='text-xl md:text-2xl font-bold'>{lang.app.title}</h1>
          <p className='text-xs md:text-sm text-muted-foreground'>{lang.app.subtitle}</p>
        </div>
        <div className='invisible'>
          <h1 className='text-xl md:text-2xl font-bold'>{lang.app.title}</h1>
          <p className='text-xs md:text-sm text-muted-foreground'>{lang.app.subtitle}</p>
        </div>
        <div className='flex items-center gap-3 z-10'>
          <LanguageSelector />
          <ThemeSwitcher className='z-10' />
        </div>
      </div>

      {/* UI Controls Panel */}
      <div className='controls-panel bg-card text-card-foreground p-1 md:p-2 overflow-y-auto border border-border rounded-t-lg rounded-bl-none rounded-br-none'>
        <div className='flex flex-wrap gap-3'>
          <RoomControls />
          <ViewControls />
          <FurnitureControls />
        </div>
      </div>
    </div>
  );
}
