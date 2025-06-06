// Language selector component for switching between available languages
// This component allows users to toggle between English, Italian, French and Spanish

import { useLanguage } from '@/lang';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { lang, changeLanguage, availableLanguages, mounted } = useLanguage();

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Use localised language names from the language file with fallbacks
  // This ensures all user-facing text is properly localised
  const languageNames: Record<string, string> = {
    en: lang.languageSelector?.english || 'English',
    it: 'Italiano',
    fr: 'Français',
    es: 'Español',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='h-8 text-xs flex items-center gap-2'
            aria-label={lang.languageSelector?.selectLanguage || 'Select language'}
          >
            <Globe className='h-4 w-4' />
            {languageNames[lang.code] || lang.code}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {availableLanguages.map((code) => (
            <DropdownMenuItem
              key={code}
              onClick={() => changeLanguage(code)}
              className='text-xs cursor-pointer'
            >
              {languageNames[code] || code}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
