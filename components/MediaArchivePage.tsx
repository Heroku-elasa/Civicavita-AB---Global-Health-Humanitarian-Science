import React, { useState } from 'react';
import { useLanguage } from '../types';

interface MediaArchivePageProps {
    coverImg: string | null;
    onRetryCover: () => void;
}

const MediaArchivePage: React.FC<MediaArchivePageProps> = ({ coverImg, onRetryCover }) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    // Mock data based on the Telewebion/Taqvim Tarikh request
    const episodes = [
        { id: 1, title: '2024-05-15', date: '2024-05-15', duration: '15:20', views: '12K', thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80' },
        { id: 2, title: '2024-05-14', date: '2024-05-14', duration: '14:45', views: '10K', thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80' },
        { id: 3, title: '2024-05-13', date: '2024-05-13', duration: '16:10', views: '15K', thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80' },
        { id: 4, title: '2024-05-12', date: '2024-05-12', duration: '15:00', views: '9K', thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80' },
    ];

    const clips = [
        { id: 101, title: 'Historical Event Highlight', duration: '00:12', views: '5K', thumbnail: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=400&q=80' },
        { id: 102, title: 'Today in History', duration: '01:30', views: '8K', thumbnail: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=400&q=80' },
        { id: 103, title: 'Famous Birthdays', duration: '00:45', views: '3K', thumbnail: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=400&q=80' },
    ];

    const displayCover = coverImg || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1200&q=80';
    const isAI = coverImg?.startsWith('data:');

    return (
        <div className="min-h-screen bg-[#1a1d21] text-white animate-fade-in">
            {/* Top Search Bar */}
            <div className="sticky top-16 z-30 bg-[#24272c] border-b border-gray-700 p-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('mediaArchive.searchPlaceholder')}
                            className="w-full bg-[#131517] border border-gray-600 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-red-500 text-white placeholder-gray-500 transition-colors"
                        />
                        <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Player + Info) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player Placeholder */}
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                            {activeVideo ? (
                                <div className="flex items-center justify-center h-full w-full bg-slate-900">
                                    <p className="text-gray-400">Playing Video ID: {activeVideo}</p>
                                </div>
                            ) : (
                                <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
                                    {!coverImg ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-red-500 mb-4"></div>
                                            <span className="text-[10px] font-black uppercase text-gray-500">Synthesizing Archive Visual...</span>
                                        </div>
                                    ) : null}
                                    <img src={displayCover} className="w-full h-full object-cover" alt="Archive Cover" />
                                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                                    
                                    <div className="absolute top-4 left-4 z-30 flex gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-lg ${isAI ? 'bg-green-600' : 'bg-amber-600'}`}>
                                            {isAI ? 'AI Synthesis' : 'Default Cover'}
                                        </span>
                                        {!isAI && (
                                            <button onClick={onRetryCover} className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white hover:bg-red-500 transition-colors">
                                                Force AI Sync
                                            </button>
                                        )}
                                    </div>

                                    <div className="z-20 bg-red-600/90 text-white rounded-full p-4 cursor-pointer hover:scale-110 transition-transform shadow-lg group-hover:bg-red-500">
                                        <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-20">
                                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">LIVE ARCHIVE</span>
                                        <h2 className="text-2xl font-bold text-white shadow-sm">{t('mediaArchive.programTitle')} - {t('mediaArchive.featuredProgram')}</h2>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Program Meta */}
                        <div className="bg-[#24272c] rounded-xl p-6 shadow-md border border-gray-700/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-white mb-2">{t('mediaArchive.programTitle')}</h1>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span className="flex items-center"><svg className="w-4 h-4 mr-1 rtl:ml-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> {t('mediaArchive.network')}</span>
                                        <span className="flex items-center"><svg className="w-4 h-4 mr-1 rtl:ml-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {t('mediaArchive.airTime')}</span>
                                        <span className="flex items-center"><svg className="w-4 h-4 mr-1 rtl:ml-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {t('mediaArchive.views')}</span>
                                    </div>
                                </div>
                                <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                                </button>
                            </div>
                            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                                A specialized archive of the "History Calendar" program, broadcasting daily historical events, significant milestones, and cultural heritage stories. Watch full episodes or quick clips below.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Up Next */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Clips Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg border-l-4 border-red-500 pl-3 rtl:pl-0 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">{t('mediaArchive.clips')}</h3>
                            </div>
                            <div className="space-y-4">
                                {clips.map(clip => (
                                    <div key={clip.id} className="flex gap-3 group cursor-pointer hover:bg-[#24272c] p-2 rounded-lg transition-colors">
                                        <div className="relative w-32 h-20 flex-shrink-0">
                                            <img src={clip.thumbnail} className="w-full h-full object-cover rounded-md" alt={clip.title} />
                                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{clip.duration}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">{clip.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{clip.views} views</p>
                                            <div className="mt-2 flex items-center text-[10px] text-gray-400">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                {t('mediaArchive.play')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Archive Grid */}
                <div className="mt-12">
                    <h3 className="font-bold text-xl mb-6 border-b border-gray-700 pb-3">{t('mediaArchive.episodes')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {episodes.map(ep => (
                            <div key={ep.id} className="bg-[#24272c] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                                <div className="relative aspect-video">
                                    <img src={ep.thumbnail} className="w-full h-full object-cover" alt={ep.title} />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-red-600 rounded-full p-2">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">{ep.duration}</span>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-white text-sm mb-1 truncate">{t('mediaArchive.programTitle')} - {ep.date}</h4>
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                        <span>{ep.views} views</span>
                                        <span>{ep.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaArchivePage;