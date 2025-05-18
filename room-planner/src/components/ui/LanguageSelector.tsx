// Language selector component for switching between available languages
// This component allows users to toggle between English and Italian

import { useLanguage } from '@/lang';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './Button';
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

  // Map language codes to their native names
  const languageNames: Record<string, string> = {
    en: 'English',
    it: 'Italiano',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='h-8 text-xs flex items-center gap-2'
            aria-label='Select language'
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
