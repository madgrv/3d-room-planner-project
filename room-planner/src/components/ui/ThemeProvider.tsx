// SHADCN ThemeProvider for light/dark mode support.
// Team note: This provider wraps the app and enables theme switching for all SHADCN components.
// See: https://ui.shadcn.com/docs/dark-mode

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from 'next-themes';

export interface ThemeProviderProps extends Omit<NextThemesProviderProps, 'attribute'> {
  children: React.ReactNode;
  attribute?: 'class' | 'data-theme';
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={props.attribute || 'class'}
      defaultTheme={props.defaultTheme || 'system'}
      enableSystem={props.enableSystem ?? true}
    >
      {children}
    </NextThemesProvider>
  );
}
