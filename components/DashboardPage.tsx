

import React, { useState } from 'react';
import { Page, useLanguage, BlogPost, Project } from '../types';
import { useToast } from './Toast';

interface DashboardPageProps {
    setPage: (page: Page) => void;
    latestPosts: BlogPost[];
    featuredProjects: Project[];
}

type DashboardView = 'dashboard' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'users' | 'tools' | 'settings';

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage, latestPosts, featuredProjects }) => {
    const { addToast } = useToast();
    const { t, language } = useLanguage();
    const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
    const [draftTitle, setDraftTitle] = useState('');
    const [draftContent, setDraftContent] = useState('');

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Draft saved successfully!", "success");
        setDraftTitle('');
        setDraftContent('');
    };

    const sidebarItems: { id: DashboardView, labelKey: string, icon: React.ReactNode, isActive?: boolean }[] = [
        { id: 'dashboard', labelKey: 'dashboard.menu.dashboard', icon: <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm3.707-10.707a1 1 0 00-1.414-1.414L9 8.586 7.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /> },
        { id: 'posts', labelKey: 'dashboard.menu.posts', icon: <path d="M15 8h2.003a2 2 0 011.995 2.152L18.72 18H5.28l-.278-7.848A2 2 0 016.997 8H9V6a3 3 0 016 0v2zm-2-2a1 1 0 00-2 0v2h2V6z" /> },
        { id: 'media', labelKey: 'dashboard.menu.media', icon: <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /> },
        { id: 'pages', labelKey: 'dashboard.menu.pages', icon: <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /> },
        { id: 'comments', labelKey: 'dashboard.menu.comments', icon: <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /> },
        { id: 'appearance', labelKey: 'dashboard.menu.appearance', icon: <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /> },
        { id: 'plugins', labelKey: 'dashboard.menu.plugins', icon: <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /> }, // Simplified icon
        { id: 'users', labelKey: 'dashboard.menu.users', icon: <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /> },
        { id: 'tools', labelKey: 'dashboard.menu.tools', icon: <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" /> }, // Simplified icon
        { id: 'settings', labelKey: 'dashboard.menu.settings', icon: <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /> }
    ];

    // Mock posts data based on user request
    const mockPosts = [
        { title: "Hello World!", author: "Admin", date: "2024/05/12", status: "Published" },
        { title: "Sample Post 1", author: "Editor", date: "2024/05/10", status: "Published" },
        { title: "Sample Post 2", author: "Editor", date: "2024/05/09", status: "Published" },
        { title: "Sample Post 3", author: "Editor", date: "2024/05/08", status: "Published" },
        { title: "Sample Post 4", author: "Editor", date: "2024/05/07", status: "Published" },
        { title: "Sample Post 5", author: "Editor", date: "2024/05/06", status: "Published" },
        { title: "Medical Supply Chains", author: "Dr. Reed", date: "2024/04/28", status: "Published" },
        { title: "AI in Outbreaks", author: "Dr. Carter", date: "2024/04/15", status: "Published" },
        { title: "Draft: New Policy", author: "Admin", date: "2024/05/13", status: "Draft" },
        { title: "Ethical Tech", author: "Editor", date: "2024/03/10", status: "Published" },
        { title: "Mobile Clinic Report", author: "Dr. Reed", date: "2024/02/20", status: "Published" },
        { title: "Annual Summary", author: "Admin", date: "2024/01/01", status: "Published" },
    ];

    return (
        <div className={`flex h-screen bg-[#f0f0f1] font-sans text-[#1d2327] ${language === 'fa' || language === 'ar' ? 'font-vazir' : ''}`} dir={language === 'fa' || language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Left Sidebar */}
            <div className="w-9 sm:w-40 md:w-48 bg-[#1d2327] flex-shrink-0 flex flex-col text-white transition-all overflow-y-auto z-50">
                {/* Sidebar Header */}
                <div className="h-12 flex items-center justify-center sm:justify-start sm:px-4 bg-[#000000]">
                     <span className="hidden sm:inline font-bold text-sm">Dashboard</span>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 mt-2">
                    <ul className="space-y-1">
                        {sidebarItems.map(item => (
                            <li key={item.id} className={`${currentView === item.id ? 'bg-[#2271b1] text-white' : 'hover:bg-[#2c3338] text-[#f0f0f1]'} transition-colors cursor-pointer`}>
                                <button 
                                    onClick={() => setCurrentView(item.id)}
                                    className="flex items-center w-full px-3 py-2 text-sm focus:outline-none"
                                >
                                    <svg className={`w-5 h-5 ${language === 'fa' || language === 'ar' ? 'ml-3' : 'mr-3'} ${currentView === item.id ? 'opacity-100' : 'opacity-60'}`} fill="currentColor" viewBox="0 0 20 20">
                                        {item.icon}
                                    </svg>
                                    <span className="hidden sm:inline">{t(item.labelKey)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Admin Top Bar */}
                <header className="bg-[#1d2327] text-[#f0f0f1] h-8 flex items-center justify-between px-3 text-sm z-40">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <span className="font-bold font-serif w-6 flex items-center justify-center cursor-default text-lg pt-1">W</span>
                        <button 
                            onClick={() => setPage('home')}
                            className="flex items-center hover:text-[#72aee6] transition-colors group"
                        >
                            <svg className="w-4 h-4 mr-1.5 rtl:ml-1.5 group-hover:text-[#72aee6]" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                            AURA AI
                        </button>
                        <span className="hidden sm:flex items-center text-gray-400 hover:text-[#72aee6] cursor-pointer">
                            <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
                            <span className="ml-1 rtl:mr-1">1</span>
                        </span>
                        <span className="hidden sm:inline hover:text-[#72aee6] cursor-pointer">+ New</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2 rtl:ml-2 text-gray-300">Howdy, Admin</span>
                        <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-auto p-4 sm:p-5 bg-[#f0f0f1]">
                    
                    {/* --- Dashboard View --- */}
                    {currentView === 'dashboard' && (
                        <>
                            <h1 className="text-2xl font-medium text-[#1d2327] mb-6">{t('dashboard.menu.dashboard')}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {/* At a Glance */}
                                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                                    <div className="px-4 py-3 border-b border-[#c3c4c7] flex justify-between items-center">
                                        <h2 className="font-semibold text-sm">At a Glance</h2>
                                        <button className="text-[#2271b1] text-xs"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm text-[#50575e]">
                                            <div className="flex items-center"><span className="text-[#2271b1] font-medium mr-1">{mockPosts.length}</span> Posts</div>
                                            <div className="flex items-center"><span className="text-[#2271b1] font-medium mr-1">{featuredProjects.length}</span> Projects</div>
                                            <div className="flex items-center"><span className="text-[#2271b1] font-medium mr-1">12</span> Comments</div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-[#f0f0f1] text-sm text-[#50575e]">
                                            <p>WordPress 6.4.2 running AURA AI Theme.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Draft */}
                                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                                    <div className="px-4 py-3 border-b border-[#c3c4c7] flex justify-between items-center">
                                        <h2 className="font-semibold text-sm">Quick Draft</h2>
                                    </div>
                                    <div className="p-4">
                                        <form onSubmit={handleSaveDraft}>
                                            <input type="text" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} className="w-full border border-[#8c8f94] p-1.5 text-sm mb-3 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" placeholder="Title" />
                                            <textarea value={draftContent} onChange={(e) => setDraftContent(e.target.value)} className="w-full border border-[#8c8f94] p-1.5 text-sm mb-3 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-none" rows={3} placeholder="What's on your mind?"></textarea>
                                            <button type="submit" className="bg-[#f6f7f7] text-[#2271b1] border border-[#2271b1] text-xs font-medium py-1.5 px-3 rounded hover:bg-[#f0f0f1]">Save Draft</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- Posts View --- */}
                    {currentView === 'posts' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-medium text-[#1d2327]">
                                    {t('dashboard.menu.posts')} 
                                    <button className="ml-3 rtl:mr-3 text-sm px-2 py-1 border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] rounded hover:bg-[#2271b1] hover:text-white transition-colors">{t('dashboard.posts.addNew')}</button>
                                </h1>
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <button className="text-sm px-3 py-1 bg-white border border-[#c3c4c7] text-[#1d2327] rounded-t border-b-0">Screen Options</button>
                                    <button className="text-sm px-3 py-1 bg-white border border-[#c3c4c7] text-[#1d2327] rounded-t border-b-0">Help</button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 text-sm">
                                <div className="flex space-x-1 rtl:space-x-reverse text-[#50575e]">
                                    <a href="#" className="text-[#2271b1] font-semibold">{t('dashboard.posts.all')} <span className="text-[#50575e]">(12)</span></a>
                                    <span className="text-[#c3c4c7]">|</span>
                                    <a href="#" className="text-[#2271b1]">{t('dashboard.posts.published')} <span className="text-[#50575e]">(10)</span></a>
                                </div>
                                <div className="mt-2 sm:mt-0 flex">
                                    <input type="text" className="border border-[#8c8f94] px-2 py-1 text-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                                    <button className="px-3 py-1 border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] text-sm hover:bg-[#f0f0f1] ml-1 rtl:mr-1">{t('dashboard.posts.search')}</button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                                <select className="border border-[#8c8f94] text-[#1d2327] text-sm px-2 py-1 bg-white rounded focus:border-[#2271b1] outline-none">
                                    <option>{t('dashboard.posts.bulkActions')}</option>
                                    <option>{t('dashboard.posts.actions.edit')}</option>
                                    <option>{t('dashboard.posts.actions.trash')}</option>
                                </select>
                                <button className="px-3 py-1 border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] text-sm rounded hover:bg-[#f0f0f1]">{t('dashboard.posts.apply')}</button>
                                
                                <select className="border border-[#8c8f94] text-[#1d2327] text-sm px-2 py-1 bg-white rounded ml-4 rtl:mr-4 focus:border-[#2271b1] outline-none">
                                    <option>{t('dashboard.posts.all')} Dates</option>
                                </select>
                                <select className="border border-[#8c8f94] text-[#1d2327] text-sm px-2 py-1 bg-white rounded focus:border-[#2271b1] outline-none">
                                    <option>{t('dashboard.posts.all')} Categories</option>
                                </select>
                                <button className="px-3 py-1 border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] text-sm rounded hover:bg-[#f0f0f1]">{t('dashboard.posts.filter')}</button>
                            </div>

                            {/* Posts Table */}
                            <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-x-auto">
                                <table className="w-full text-left rtl:text-right border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-[#c3c4c7] text-sm font-medium text-[#1d2327]">
                                            <th className="p-2 w-8"><input type="checkbox" className="border-gray-400 rounded-sm" /></th>
                                            <th className="p-3 hover:text-[#2271b1] cursor-pointer">{t('dashboard.posts.table.title')}</th>
                                            <th className="p-3 hover:text-[#2271b1] cursor-pointer">{t('dashboard.posts.table.author')}</th>
                                            <th className="p-3 hover:text-[#2271b1] cursor-pointer">{t('dashboard.posts.table.categories')}</th>
                                            <th className="p-3 hover:text-[#2271b1] cursor-pointer">{t('dashboard.posts.table.date')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#50575e]">
                                        {mockPosts.map((post, i) => (
                                            <tr key={i} className="bg-[#f6f7f7] odd:bg-white hover:bg-[#f0f6fc] group border-b border-[#c3c4c7] last:border-b-0">
                                                <th className="p-2 w-8 text-center border-l-4 border-transparent"><input type="checkbox" className="border-gray-400 rounded-sm" /></th>
                                                <td className="p-3 relative">
                                                    <a href="#" className="font-semibold text-[#2271b1] hover:text-[#135e96] block mb-1 text-base">{post.title} {post.status === 'Draft' && <span className="text-[#50575e] font-normal italic">- Draft</span>}</a>
                                                    <div className="invisible group-hover:visible text-xs flex space-x-1 rtl:space-x-reverse text-[#2271b1]">
                                                        <a href="#" className="hover:text-[#135e96]">{t('dashboard.posts.actions.edit')}</a>
                                                        <span className="text-[#c3c4c7]">|</span>
                                                        <a href="#" className="hover:text-[#135e96]">{t('dashboard.posts.actions.quickEdit')}</a>
                                                        <span className="text-[#c3c4c7]">|</span>
                                                        <a href="#" className="text-[#b32d2e] hover:text-[#b32d2e] hover:underline">{t('dashboard.posts.actions.trash')}</a>
                                                        <span className="text-[#c3c4c7]">|</span>
                                                        <a href="#" className="hover:text-[#135e96]">{t('dashboard.posts.actions.view')}</a>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-[#2271b1]">{post.author}</td>
                                                <td className="p-3 text-[#2271b1]">Uncategorized</td>
                                                <td className="p-3">
                                                    <div className="text-[#50575e]">{post.status}</div>
                                                    <div className="text-xs">{post.date}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-white border-t border-[#c3c4c7] text-sm font-medium text-[#1d2327]">
                                            <th className="p-2 w-8"><input type="checkbox" className="border-gray-400 rounded-sm" /></th>
                                            <th className="p-3">{t('dashboard.posts.table.title')}</th>
                                            <th className="p-3">{t('dashboard.posts.table.author')}</th>
                                            <th className="p-3">{t('dashboard.posts.table.categories')}</th>
                                            <th className="p-3">{t('dashboard.posts.table.date')}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            <div className="mt-3 flex justify-between items-center text-sm text-[#50575e]">
                                <div>12 items</div>
                                <div className="flex space-x-1 rtl:space-x-reverse">
                                    <button className="px-2 py-1 border border-[#c3c4c7] bg-[#f6f7f7] text-[#a7aaad] cursor-default rounded-sm" disabled>&laquo;</button>
                                    <button className="px-2 py-1 border border-[#c3c4c7] bg-[#f6f7f7] text-[#a7aaad] cursor-default rounded-sm" disabled>&lsaquo;</button>
                                    <div className="flex items-center px-1">
                                        <span className="mr-1">1</span> of <span className="ml-1">1</span>
                                    </div>
                                    <button className="px-2 py-1 border border-[#c3c4c7] bg-[#f6f7f7] text-[#a7aaad] cursor-default rounded-sm" disabled>&rsaquo;</button>
                                    <button className="px-2 py-1 border border-[#c3c4c7] bg-[#f6f7f7] text-[#a7aaad] cursor-default rounded-sm" disabled>&raquo;</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Placeholder Views for others --- */}
                    {!['dashboard', 'posts'].includes(currentView) && (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-light text-[#50575e]">This section ({t(`dashboard.menu.${currentView}`)}) is under construction in this simulation.</h2>
                        </div>
                    )}

                </main>
                
                {/* Admin Footer */}
                <footer className="bg-[#f0f0f1] text-[#50575e] text-xs px-6 py-4 border-t border-[#dcdcde] flex justify-between">
                    <div>
                        Thank you for creating with <a href="#" className="text-[#2271b1] hover:underline">WordPress</a> (simulated).
                    </div>
                    <div>Version 6.4.2</div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardPage;