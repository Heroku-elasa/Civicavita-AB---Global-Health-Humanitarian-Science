import React, { useState } from 'react';
import { Grant } from '../types';
import { useLanguage } from '../types';
import { SkeletonLoader } from './SkeletonLoader';

interface GrantFinderProps {
  onFindGrants: (keywords: string) => void;
  isLoading: boolean;
  error: string | null;
  grants: Grant[];
  onAnalyzeGrant: (grant: Grant) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
}

const GrantItem: React.FC<{ grant: Grant, onAnalyze: (grant: Grant) => void }> = ({ grant, onAnalyze }) => {
    const { t } = useLanguage();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(grant.link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col h-full hover:border-pink-500/50 transition-colors group">
            <div className="flex-grow">
                <h4 className="font-bold text-pink-400 text-lg group-hover:text-pink-300 transition-colors">{grant.grantTitle}</h4>
                <p className="text-sm text-gray-400 font-medium">{t('grantFinder.from')} {grant.fundingBody}</p>
                <p className="text-sm text-gray-300 mt-2 line-clamp-3 leading-relaxed">{grant.summary}</p>
            </div>
            <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-700/50 flex-wrap gap-2">
                <div className="text-xs text-gray-500 font-mono">
                    <strong>{t('grantAnalyzer.deadline')}:</strong> {grant.deadline}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                     <button 
                        onClick={handleCopy}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${isCopied ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'}`}
                        title={t('grantFinder.copyLink')}
                    >
                        {isCopied ? t('grantFinder.copied') : t('grantFinder.copyLink')}
                    </button>
                    <a 
                        href={grant.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-slate-600 text-white text-xs font-bold rounded-md hover:bg-slate-700/50 transition-all inline-flex items-center"
                        title={t('grantFinder.viewOriginal')}
                    >
                        {t('grantFinder.viewOriginal')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1.5 rtl:mr-1.5 rtl:ml-0" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                    </a>
                    <button 
                        onClick={() => onAnalyze(grant)}
                        className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-md hover:bg-teal-700 shadow-sm transition-all active:scale-95"
                    >
                        {t('grantFinder.analyzeButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const GrantFinder: React.FC<GrantFinderProps> = ({ onFindGrants, isLoading, error, grants, onAnalyzeGrant, keywords, setKeywords }) => {
  const { t } = useLanguage();

  const featuredTopics = [
      { id: 'climate', query: 'Climate Change and Diseases', icon: '🌍' },
      { id: 'health', query: 'Global Health Systems', icon: '🏥' },
      { id: 'humanitarian', query: 'Humanitarian Aid Technology', icon: '🤝' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (keywords.trim()) {
      onFindGrants(keywords);
    }
  };

  const handleTopicClick = (query: string) => {
      setKeywords(query);
      onFindGrants(query);
  };

  return (
    <section id="grant-finder" className="py-12 sm:py-16 animate-fade-in scroll-mt-20">
      <div className="bg-slate-900/60 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">{t('grantFinder.title')}</h2>
                <p className="text-sm text-gray-400 mt-1">Search the global database for humanitarian funding opportunities.</p>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-center md:text-left">Prominent Topics</span>
                <div className="flex flex-wrap gap-2">
                    {featuredTopics.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic.query)}
                            disabled={isLoading}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm flex items-center gap-1.5 ${keywords === topic.query ? 'bg-pink-500/20 text-pink-300 border-pink-500/50' : 'bg-slate-800 text-gray-400 border-slate-700 hover:border-pink-500/40 hover:text-white'}`}
                        >
                            <span className="text-sm">{topic.icon}</span> {topic.query}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="block w-full bg-slate-700/80 border-slate-600 rounded-md shadow-inner py-3 pl-10 pr-3 rtl:pl-3 rtl:pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 sm:text-base text-white transition-all placeholder-gray-500 font-medium"
                    placeholder={t('grantFinder.searchPlaceholder')}
                />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-shrink-0 flex justify-center items-center py-3 px-10 border border-transparent rounded-md shadow-lg text-base font-black text-white bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 hover:from-blue-700 hover:to-pink-800 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all active:scale-95 uppercase tracking-wide"
            >
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : t('grantFinder.searchButton')}
            </button>
          </div>
        </form>

        <div className="mt-10 border-t border-slate-700/50 pt-10">
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SkeletonLoader type="card" count={4} />
                </div>
            )}
            
            {error && !isLoading && <div className="text-red-400 p-4 bg-red-900/50 rounded-md border border-red-800/50">{t('grantFinder.error')}: {error}</div>}
            
            {!isLoading && !error && grants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    {grants.map((grant, index) => (
                        <GrantItem key={grant.link || index} grant={grant} onAnalyze={onAnalyzeGrant} />
                    ))}
                </div>
            )}

            {!isLoading && !error && grants.length === 0 && !keywords && (
                 <div className="text-center text-gray-500 py-20 bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-700/50">
                    <div className="mx-auto w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-700">
                        <svg className="w-10 h-10 text-pink-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-300">Funding Explorer</h3>
                    <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">Discover critical funding for your humanitarian research and environmental missions.</p>
                    <div className="mt-6 flex justify-center gap-4 text-xs font-bold text-gray-600">
                        <span>• REAL-TIME ANALYSIS</span>
                        <span>• GLOBAL SCOPE</span>
                        <span>• ELIGIBILITY CHECKS</span>
                    </div>
                </div>
            )}

            {!isLoading && !error && grants.length === 0 && keywords && (
                 <div className="text-center text-gray-500 py-16">
                    <p className="text-lg font-medium">{t('grantFinder.noResults')}</p>
                    <button onClick={() => handleTopicClick('Climate Change and Diseases')} className="mt-4 text-pink-400 hover:text-pink-300 font-bold transition-colors">Try "Climate Change and Diseases" instead?</button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default GrantFinder;