// Language selector component for switching between available languages
// This component allows users to toggle between English and Italian

import { useLanguage } from '@/lang';

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
      <select
        value={lang.code}
        onChange={(e) => changeLanguage(e.target.value)}
        className='border border-input bg-background text-foreground rounded p-1 text-sm focus:outline-none focus:ring focus:ring-ring focus:border-ring'
        aria-label='Select language'
      >
        {availableLanguages.map((code) => (
          <option key={code} value={code}>
            {languageNames[code] || code}
          </option>
        ))}
      </select>
    </div>
  );
}
