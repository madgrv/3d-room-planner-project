// Type definitions for language strings
// All language files must conform to this structure

import en from './en';

// Export the type of the English language file as the master type
export type LanguageStrings = typeof en;

// This ensures all language files must have the same structure as the English one
export interface Language extends LanguageStrings {
  // Language code (e.g., 'en', 'it') - required for each language implementation
  readonly code: string;
}
