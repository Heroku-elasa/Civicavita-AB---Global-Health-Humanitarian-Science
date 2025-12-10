


import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Page, LANGUAGES, useTheme, THEMES } from '../types';

interface HeaderProps {
  setPage: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ setPage, currentPage }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentTheme, setTheme, setCustomTheme } = useTheme();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Standard WordPress-style menu order
  const navItems: { page: Page | 'scroll_about' | 'scroll_contact'; labelKey: string }[] = [
    { page: 'home', labelKey: 'nav.home' },
    { page: 'scroll_about', labelKey: 'nav.about' },
    { page: 'projects', labelKey: 'nav.projects' },
    { page: 'team', labelKey: 'nav.team' },
    { page: 'grant', labelKey: 'nav.grantFinder' },
    { page: 'generator', labelKey: 'nav.reportGenerator' },
    { page: 'content-hub', labelKey: 'nav.contentHub' }, 
    { page: 'blog', labelKey: 'nav.blogGenerator' },
    // { page: 'video', labelKey: 'nav.videoGenerator' }, // Hidden
    // { page: 'waste-to-wealth', labelKey: 'nav.wasteToWealth' }, // Hidden
    // { page: 'tree-planter', labelKey: 'nav.treePlanter' }, // Hidden
    { page: 'scroll_contact', labelKey: 'nav.contact' },
    { page: 'dashboard', labelKey: 'nav.dashboard' },
  ];
  
  const handleLanguageChange = (langCode: typeof language) => {
    setLanguage(langCode);
    setIsLangMenuOpen(false);
  };
  
  const handleNavClick = (item: { page: Page | 'scroll_about' | 'scroll_contact'; labelKey: string }) => {
    if (item.page === 'scroll_about') {
        if (currentPage !== 'home') {
            setPage('home');
            setTimeout(() => {
                const element = document.getElementById('about');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById('about');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (item.page === 'scroll_contact') {
        if (currentPage !== 'home') {
             setPage('home');
             setTimeout(() => {
                 const element = document.getElementById('footer');
                 if (element) element.scrollIntoView({ behavior: 'smooth' });
             }, 100);
        } else {
             const element = document.getElementById('footer');
             if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        setPage(item.page as Page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setPage('home')} className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary flex items-center justify-center bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 sm:w-7 sm:h-7 text-primary">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Civicavita.<span className="text-orange-500">A</span><span className="text-emerald-500">B</span>
              </span>
            </button>
            <nav className="hidden xl:flex xl:ml-10 xl:space-x-6">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === item.page ? 'text-primary' : 'text-gray-300'}`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            
             {/* Theme Selector */}
             <div className="relative" ref={themeMenuRef}>
                <button 
                  onClick={() => setIsThemeMenuOpen(prev => !prev)} 
                  className="flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Change Theme"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                   </svg>
                   <div className="w-3 h-3 rounded-full ml-1 border border-gray-600" style={{ background: currentTheme.primary }}></div>
                </button>
                {isThemeMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg z-50 border border-slate-700 overflow-hidden">
                        <div className="py-2">
                            <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Theme</span>
                            {Object.values(THEMES).map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => { setTheme(theme.id); setIsThemeMenuOpen(false); }}
                                    className={`w-full text-left px-4 py-2 hover:bg-slate-700 cursor-pointer text-sm flex items-center ${currentTheme.id === theme.id ? 'font-bold text-white bg-slate-700/50' : 'text-gray-300'}`}
                                >
                                    <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ background: theme.primary }}></span>
                                    {theme.name}
                                </button>
                            ))}
                            
                            <div className="border-t border-slate-700 my-2 pt-2 px-4">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Custom Color</span>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="color" 
                                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        value={currentTheme.primary}
                                        onChange={(e) => setCustomTheme(e.target.value)}
                                        title="Pick custom color"
                                    />
                                    <span className="text-xs text-gray-400">Pick a gradient base</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </div>

             {/* Language Selector */}
             <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(prev => !prev)} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-700 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.874 6 7.5 6h5c.626 0 .988-.27 1.256-.679a6.012 6.012 0 011.912 2.706C15.27 8.93 15 9.5 15 10v1c0 .5.27.93.744 1.321a6.012 6.012 0 01-1.912 2.706C13.488 14.27 13.126 14 12.5 14h-5c-.626 0-.988.27-1.256.679a6.012 6.012 0 01-1.912-2.706A11.958 11.958 0 015 11v-1c0-.5-.27-.93-.744-1.321z" clipRule="evenodd" />
                   </svg>
                   <span>{language.toUpperCase()}</span>
                   <svg className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-40 bg-slate-800 rounded-md shadow-lg z-50 border border-slate-700">
                        <ul className="py-1 text-white">
                            {LANGUAGES.map(lang => (
                                <li key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`px-4 py-2 hover:bg-slate-700 cursor-pointer text-sm ${language === lang.code ? 'font-bold text-primary' : ''}`}>
                                    {lang.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </div>

             {/* Mobile Menu Button */}
             <div className="xl:hidden ml-2 rtl:ml-0 rtl:mr-2">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <nav className="xl:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${currentPage === item.page ? 'bg-slate-700 text-primary' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
                  aria-current={currentPage === item.page ? 'page' : undefined}
                >
                  {t(item.labelKey)}
                </button>
              ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
