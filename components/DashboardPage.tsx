import React, { useState, useMemo, useEffect } from 'react';
import { Page, useLanguage, BlogPost, Project, SQLTable, MySQLStatus } from '../types';
import { useToast } from './Toast';

interface DashboardPageProps {
    setPage: (page: Page) => void;
    latestPosts: BlogPost[];
    featuredProjects: Project[];
    onGenerateImage: (type: 'post' | 'project' | 'media', index: number) => void;
}

type DashboardView = 'dashboard' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'users' | 'tools' | 'settings' | 'cpt_projects' | 'database';
type PostStatus = 'Published' | 'Draft' | 'Trash';

interface MockPost {
    id: number;
    title: string;
    author: string;
    date: string;
    status: PostStatus;
    type?: 'post' | 'page' | 'project';
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage, latestPosts, featuredProjects, onGenerateImage }) => {
    const { addToast } = useToast();
    const { t, language } = useLanguage();
    const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
    const [isBulkGenerating, setIsBulkGenerating] = useState(false);
    
    // Interactive States
    const [mysqlStatus, setMysqlStatus] = useState<MySQLStatus>('Syncing');
    const [sqlTables, setSqlTables] = useState<SQLTable[]>([
        { name: 'sosobel_reports', rows: 42, lastUpdated: '2024-05-20 14:02', columns: ['id', 'title', 'content', 'type', 'created_at'] },
        { name: 'sosobel_users', rows: 120, lastUpdated: '2024-05-19 09:15', columns: ['uid', 'username', 'email', 'role', 'last_login'] },
        { name: 'sosobel_grants', rows: 15, lastUpdated: '2024-05-20 11:30', columns: ['grant_id', 'body', 'amount', 'deadline', 'link'] },
        { name: 'sosobel_analytics', rows: 14050, lastUpdated: '2024-05-20 15:45', columns: ['event_id', 'user_id', 'action', 'timestamp'] }
    ]);

    useEffect(() => {
        const timer = setTimeout(() => setMysqlStatus('Connected'), 2000);
        return () => clearTimeout(timer);
    }, []);

    const sidebarItems: { id: DashboardView, labelKey: string, icon: React.ReactNode }[] = [
        { id: 'dashboard', labelKey: 'dashboard.menu.dashboard', icon: <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /> },
        { id: 'database', labelKey: 'dashboard.menu.database', icon: <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 2a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1H5zm0 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm6-4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1h-1zm0 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1z" clipRule="evenodd" /> },
        { id: 'media', labelKey: 'dashboard.menu.media', icon: <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /> },
        { id: 'posts', labelKey: 'dashboard.menu.posts', icon: <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /> },
        { id: 'pages', labelKey: 'dashboard.menu.pages', icon: <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /> },
        { id: 'comments', labelKey: 'dashboard.menu.comments', icon: <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /> },
    ];

    const isAIImage = (url: string) => url?.startsWith('data:');
    const isUnsplash = (url: string) => url?.includes('unsplash.com');

    const totalAssets = latestPosts.length + featuredProjects.length;
    const synthesizedAssets = latestPosts.filter(p => isAIImage(p.img)).length + featuredProjects.filter(p => isAIImage(p.img)).length;
    const completionPercentage = Math.round((synthesizedAssets / totalAssets) * 100);

    const handleSyncAll = async () => {
        setIsBulkGenerating(true);
        addToast("Starting bulk AI synthesis loop...", "info");
        
        // Projects synchronization
        for (let i = 0; i < featuredProjects.length; i++) {
            if (isUnsplash(featuredProjects[i].img)) {
                await onGenerateImage('project', i);
            }
        }
        
        // Posts synchronization
        for (let i = 0; i < latestPosts.length; i++) {
            if (isUnsplash(latestPosts[i].img)) {
                await onGenerateImage('post', i);
            }
        }
        
        setIsBulkGenerating(false);
        addToast("Asset synchronization complete!", "success");
    };

    return (
        <div className="flex min-h-screen bg-[#f1f1f1] text-[#3c434a]">
            {/* Sidebar */}
            <aside className="w-56 bg-[#1d2327] flex-shrink-0 text-gray-300 hidden lg:flex flex-col">
                <div className="p-4 flex items-center gap-2 hover:bg-[#2c3338] cursor-pointer" onClick={() => setPage('home')}>
                    <img src="https://i.sstatic.net/oTCIOZmA.png" alt="Logo" className="w-6 h-6 rounded" />
                    <span className="font-bold text-sm tracking-tight">Civicavita AB</span>
                </div>
                <nav className="flex-grow py-2">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-[#2c3338] hover:text-primary ${currentView === item.id ? 'bg-primary text-white border-l-4 border-white' : ''}`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">{item.icon}</svg>
                            {t(item.labelKey)}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col overflow-hidden">
                <header className="h-10 bg-[#1d2327] flex items-center justify-between px-4 text-xs text-gray-300">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 hover:text-white transition-colors" onClick={() => setPage('home')}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                            Visit Site
                        </button>
                    </div>
                    {completionPercentage < 100 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Visual Sync: {completionPercentage}%</span>
                            <div className="w-20 bg-gray-700 h-1 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
                            </div>
                        </div>
                    )}
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-normal">{t(`dashboard.menu.${currentView}`)}</h1>
                        {currentView === 'media' && (
                             <button 
                                onClick={handleSyncAll}
                                disabled={isBulkGenerating || completionPercentage === 100}
                                className={`px-4 py-2 rounded text-sm font-bold text-white shadow-md transition-all ${isBulkGenerating || completionPercentage === 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover active:scale-95'}`}
                             >
                                {isBulkGenerating ? 'Processing AI Assets...' : completionPercentage === 100 ? 'All Assets Ready' : 'Synthesize Missing Assets'}
                             </button>
                        )}
                    </div>

                    {currentView === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="col-span-full bg-white border border-[#ccd0d4] p-8 shadow-sm">
                                <h2 className="text-xl font-normal mb-2">Welcome to your Sosobel MySQL Dashboard</h2>
                                <p className="text-gray-500 mb-6">We've assembled some links to get you started:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    <div>
                                        <h3 className="font-bold mb-3">Get Started</h3>
                                        <button onClick={() => setPage('generator')} className="bg-primary text-white px-4 py-2 rounded text-sm mb-4">Launch Doc Assistant</button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-3">Asset Monitor</h3>
                                        <button onClick={() => setCurrentView('media')} className="bg-slate-700 text-white px-4 py-2 rounded text-sm">AI Image Manager</button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-3">Database Health</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`w-3 h-3 rounded-full ${mysqlStatus === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                            <span>MySQL: {mysqlStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'media' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Research Projects Images */}
                            <section className="bg-white border border-[#ccd0d4] p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6 border-b pb-4 border-[#f0f0f1]">
                                    <h2 className="text-lg font-bold">Research Project Assets</h2>
                                    <span className="text-xs text-gray-400">Total: {featuredProjects.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {featuredProjects.map((project, idx) => (
                                        <div key={idx} className="bg-[#f9f9f9] border border-[#dcdcde] rounded-lg overflow-hidden flex flex-col group">
                                            <div className="aspect-video bg-slate-200 relative overflow-hidden flex items-center justify-center">
                                                {project.isLoadingImage ? (
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                                                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                                                    </div>
                                                ) : null}
                                                <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-sm ${isAIImage(project.img) ? 'bg-green-500' : 'bg-amber-500'}`}>
                                                        {isAIImage(project.img) ? 'Synthesized' : 'Placeholder'}
                                                    </span>
                                                    {project.isGenerationFailed && (
                                                        <span className="bg-red-500 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-sm">Sync Error</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-grow flex flex-col">
                                                <h3 className="text-sm font-bold text-[#1d2327] line-clamp-1">{project.title}</h3>
                                                <div className="mt-4 pt-3 border-t border-[#dcdcde] flex justify-between items-center">
                                                    <button 
                                                        onClick={() => onGenerateImage('project', idx)}
                                                        disabled={project.isLoadingImage}
                                                        className={`text-xs font-bold transition-colors ${project.isLoadingImage ? 'text-gray-400' : 'text-primary hover:text-primary-hover'}`}
                                                    >
                                                        {project.isLoadingImage ? 'Working...' : project.isGenerationFailed ? 'Retry Sync' : 'Regenerate AI'}
                                                    </button>
                                                    <button className="text-xs text-gray-500 hover:text-[#1d2327]">Preview Card</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Blog Post Images */}
                            <section className="bg-white border border-[#ccd0d4] p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6 border-b pb-4 border-[#f0f0f1]">
                                    <h2 className="text-lg font-bold">Insight Post Assets</h2>
                                    <span className="text-xs text-gray-400">Total: {latestPosts.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {latestPosts.map((post, idx) => (
                                        <div key={idx} className="bg-[#f9f9f9] border border-[#dcdcde] rounded-lg overflow-hidden flex flex-col group">
                                            <div className="aspect-square bg-slate-200 relative overflow-hidden flex items-center justify-center">
                                                {post.isLoadingImage ? (
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                                                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-primary"></div>
                                                    </div>
                                                ) : null}
                                                <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                <div className="absolute bottom-2 left-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-sm ${isAIImage(post.img) ? 'bg-green-500' : 'bg-amber-500'}`}>
                                                        {isAIImage(post.img) ? 'AI' : 'Stock'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="text-xs font-bold text-[#1d2327] line-clamp-2 min-h-[2rem]">{post.title}</h3>
                                                <button 
                                                    onClick={() => onGenerateImage('post', idx)}
                                                    disabled={post.isLoadingImage}
                                                    className="mt-2 w-full text-[10px] uppercase font-black py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors disabled:border-gray-300 disabled:text-gray-300"
                                                >
                                                    {post.isLoadingImage ? 'Working...' : 'Synthesize'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {currentView === 'database' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white border border-[#ccd0d4] p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-normal">{t('dashboard.database.title')}</h2>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${mysqlStatus === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {mysqlStatus === 'Connected' ? t('dashboard.database.connected') : t('dashboard.database.syncing')}
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-[#f6f7f7] border-y border-[#ccd0d4]">
                                            <tr>
                                                <th className="p-3 font-bold">Table Name</th>
                                                <th className="p-3 font-bold">Total Rows</th>
                                                <th className="p-3 font-bold">Last Sync</th>
                                                <th className="p-3 font-bold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f0f0f1]">
                                            {sqlTables.map((table, i) => (
                                                <tr key={i} className="hover:bg-[#f9f9f9] group">
                                                    <td className="p-3 font-bold text-primary">{table.name}</td>
                                                    <td className="p-3">{table.rows.toLocaleString()}</td>
                                                    <td className="p-3 text-gray-400">{table.lastUpdated}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <button className="text-primary hover:text-primary-hover">Browse</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;