import React, { useState } from 'react';
import { useLanguage, Project } from '../types';

interface ProjectsPageProps {
    projects: Project[];
}

/**
 * Individual Project Card component to manage its own 'Read More' expansion state.
 */
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    // Limit for initial display
    const charLimit = 160;
    const isLongDescription = project.description.length > charLimit;
    
    // Determine what text to show
    const displayDescription = isExpanded 
        ? project.description 
        : project.description.slice(0, charLimit) + (isLongDescription ? '...' : '');

    return (
        <div className="group bg-slate-800/70 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700 overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
            {/* Visual Container */}
            <div className="relative h-72 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {project.isLoadingImage ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Synthesizing Visual...</span>
                    </div>
                ) : (
                    <>
                        <img 
                            src={project.img || 'https://images.unsplash.com/photo-1532187875605-2fe358a71424?auto=format&fit=crop&w=800&q=80'} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    </>
                )}
                {/* Floating Tags for visual punch */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                    {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded backdrop-blur-sm shadow-lg uppercase tracking-tighter">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-8 flex-grow flex flex-col">
                <div className="mb-4">
                    <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <div className="h-1 w-12 bg-primary rounded-full"></div>
                </div>
                
                <div className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                    <p className="inline">{displayDescription}</p>
                    {isLongDescription && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="ml-2 text-primary hover:text-primary-hover font-black text-xs uppercase tracking-widest inline-flex items-center gap-1 group/btn"
                        >
                            <span>{isExpanded ? t('common.readLess') : t('common.readMore')}</span>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-x-1'}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                    {project.tags.map(tag => (
                        <span key={tag} className="bg-slate-700/50 text-gray-400 text-[10px] font-bold px-2 py-1 rounded border border-slate-600 uppercase tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
    const { t } = useLanguage();

    return (
        <div className="animate-fade-in text-white min-h-screen bg-slate-950">
            {/* Header Section */}
            <div className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4 block">{t('projectsPage.badge')}</span>
                        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6">
                            {t('projectsPage.titleMain')} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-primary">
                                {t('projectsPage.titleAccent')}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed">
                            {t('projectsPage.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {projects && projects.length > 0 ? (
                        projects.map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                            <p className="text-gray-500 font-bold uppercase tracking-widest">{t('projectsPage.noProjects')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-slate-900 border-t border-slate-800 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">{t('projectsPage.ctaTitle')}</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t('projectsPage.ctaText')}</p>
                    <button className="bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95">
                        {t('projectsPage.ctaButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;