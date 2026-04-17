import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, setCurrentLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedLang = languages.find(l => l.code === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className={`lang-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <Globe size={18} className="lang-icon" />
        <span className="lang-name">{selectedLang.name}</span>
        <ChevronDown size={14} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown glass-card">
          <div className="lang-dropdown-header">{t('selectLanguage')}</div>
          <div className="lang-search-container">
            <input
              ref={searchInputRef}
              type="text"
              className="lang-search-input"
              placeholder={t('searchLanguages')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="lang-list-container">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                className={`lang-item ${currentLanguage === lang.code ? 'selected' : ''}`}
                onClick={() => {
                  setCurrentLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                <div className="lang-item-info">
                  <span className="lang-native">{lang.native}</span>
                  <span className="lang-english">{lang.name}</span>
                </div>
                {currentLanguage === lang.code && <Check size={14} className="check-icon" />}
              </button>
            ))}
            {filteredLanguages.length === 0 && (
              <div className="lang-no-results">{t('noLanguagesFound')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
