import React, { useState } from 'react';
import { Button } from './button';
import { useLanguage } from '../../hooks/useLanguage';
import { Globe, Languages, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

// Simple Language Indicator Component
export const LanguageIndicator: React.FC = () => {
  const { language, fontClass } = useLanguage();
  
  const getLanguageInfo = () => {
    return language === 'mr' 
      ? { name: 'मराठी', flag: '🇮🇳' }
      : { name: 'English', flag: '🇺🇸' };
  };

  const languageInfo = getLanguageInfo();

  return (
    <div className={`flex items-center gap-1 text-xs text-gray-600 ${fontClass}`}>
      <span>{languageInfo.flag}</span>
      <span className="font-medium">{languageInfo.name}</span>
    </div>
  );
};

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, fontClass } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'mr',
      name: 'मराठी',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      description: 'मराठी'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'English'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'mr' | 'en');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      size="sm"
          className={`flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-orange-50 border-orange-300 text-orange-800 hover:text-orange-900 font-bold shadow-md hover:shadow-lg transition-all duration-200 rounded-xl ${fontClass}`}
    >
          <div className="flex items-center gap-1">
      <Globe className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">
            {currentLanguage?.name}
      </span>
          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
    </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 z-50 bg-white border border-orange-200 shadow-lg rounded-xl p-2">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 rounded-xl mx-1 my-1 ${
              language === lang.code 
                ? 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm' 
                : 'hover:bg-orange-50 hover:text-orange-800 hover:border hover:border-orange-200'
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className={`font-semibold text-sm ${lang.code === 'mr' ? 'font-marathi' : 'font-english'}`}>{lang.nativeName}</span>
                <span className="text-xs text-gray-500 font-english">{lang.description}</span>
              </div>
            </div>
            {language === lang.code && (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
