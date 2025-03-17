import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current language emoji flag
  const getCurrentFlag = () => {
    switch (i18n.language) {
      case 'de':
        return '🇩🇪';
      case 'en':
      default:
        return '🇬🇧';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-1 bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{getCurrentFlag()}</span>
        <span className="text-gray-700">{i18n.language === 'en' ? t('language.en') : t('language.de')}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-36">
          <button
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${i18n.language === 'en' ? 'bg-blue-50' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            <span className="text-lg">🇬🇧</span>
            <span>{t('language.en')}</span>
          </button>
          <button
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${i18n.language === 'de' ? 'bg-blue-50' : ''}`}
            onClick={() => changeLanguage('de')}
          >
            <span className="text-lg">🇩🇪</span>
            <span>{t('language.de')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
