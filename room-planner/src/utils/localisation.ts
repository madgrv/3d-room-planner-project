// Simple localisation utility for loading strings from the shared language file.
// This is intentionally basic and synchronous for clarity and team understanding.
// For production, consider a more robust i18n library if needed.

import en from '../../../shared/lang/en.json';

type LocalisationKeys = keyof typeof en;

/**
 * Looks up a top-level key in the language file.
 * For nested keys, use dot notation (e.g. 'roomControls.widthLabel').
 */
export function t(key: string): string {
  const segments = key.split('.');
  let current: any = en;
  for (const segment of segments) {
    if (current[segment] === undefined) {
      // Team note: Return the key for missing translations for visibility.
      return key;
    }
    current = current[segment];
  }
  return typeof current === 'string' ? current : key;
}
