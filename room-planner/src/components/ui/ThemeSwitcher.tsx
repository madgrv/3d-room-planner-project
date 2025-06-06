// SHADCN Theme Switcher UI component
// Team note: This component enables users to toggle between light and dark mode. All user-facing text is localised.

import { useTheme } from 'next-themes';
import { Switch } from './Switch';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lang';

// Simple SVG icons for sun and moon
const SunIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-[hsl(29.57_100%_59.02%)] dark:text-[hsl(29.57_100%_59.02%)]'
  >
    <circle cx='12' cy='12' r='5' />
    <line x1='12' y1='1' x2='12' y2='3' />
    <line x1='12' y1='21' x2='12' y2='23' />
    <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
    <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
    <line x1='1' y1='12' x2='3' y2='12' />
    <line x1='21' y1='12' x2='23' y2='12' />
    <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
    <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-[hsl(240_6.59%_64.31%)] dark:text-[hsl(240_6.59%_64.31%)]'
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
);

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();

  // Determine the current theme, accounting for 'system' preference
  const currentTheme = theme === 'system' ? systemTheme : theme;

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle between 'light' and 'dark' themes
  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div
      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${className}`}
    >
      <SunIcon />
      <Switch
        id='theme-mode'
        checked={currentTheme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label={lang.themeSwitcher.toggleLabel}
        className='data-[state=checked]:bg-[hsl(29.57_100%_59.02%)] data-[state=unchecked]:bg-[hsl(15.88_30.91%_21.57%)]'
      />
      <MoonIcon />
      <span className='text-sm font-medium transition-colors font-sans'>
        {currentTheme === 'dark'
          ? lang.themeSwitcher.darkMode
          : lang.themeSwitcher.lightMode}
      </span>
    </div>
  );
}
