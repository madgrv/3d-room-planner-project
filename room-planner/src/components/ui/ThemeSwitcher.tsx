// SHADCN Theme Switcher UI component
// Team note: This component enables users to toggle between light and dark mode. All user-facing text is localised.

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from './Button';
import { t } from '@/utils/localisation';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Toggle between 'light' and 'dark' themes
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} aria-label={t('themeSwitcher.toggleLabel')}>
      {theme === 'dark' ? t('themeSwitcher.lightMode') : t('themeSwitcher.darkMode')}
    </Button>
  );
}
