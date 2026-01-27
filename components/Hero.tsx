import React from 'react';
import { useLanguage, AppState, BlogPost, Project } from '../types';
import Icon from './Icon';

interface HomePageProps {
  setPage: (page: AppState['page']) => void;
  latestPosts: BlogPost[];
  featuredProjects: Project[];
  onRetryImage: (type: 'post' | 'project', index: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, latestPosts, featuredProjects, onRetryImage }) => {
  const { t } = useLanguage();

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const navigateTo = (page: AppState['page']) => {
      setPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const services: { iconKey: string; title: string; text: string; linkPage: string }[] = t('home.services');
  const achievements: { iconKey: string; count: number; label: string; suffix: string }[] = t('home.achievements');
  const customerLogos: { img: string; alt: string }[] = t('home.customerLogos');


  return (
    <div className="animate-fade-in text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
          src={t('hero.videoUrl')}
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-slate-900/70"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
              dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigateTo('projects')}
              className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-md shadow-lg hover:scale-105 transition-transform"
            >
              {t('hero.button1')}
            </button>
            <button
              onClick={() => handleScrollTo('footer')}
              className="px-8 py-3 bg-slate-700/50 border border-slate-600 text-white font-semibold rounded-md shadow-lg hover:bg-slate-700 transition-colors"
            >
              {t('hero.button2')}
            </button>
          </div>
        </div>
      </section>

      {/* Intro / Mission Section */}
      <section id="about" className="py-16 sm:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">{t('home.introTitle')}</h2>
                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12">
                    {t('home.introText')}
                </p>
                {t('home.visionTitle') && (
                    <>
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">{t('home.visionTitle')}</h2>
                        <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                            {t('home.visionText')}
                        </p>
                    </>
                )}
            </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.servicesTitle')}</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <button 
                key={index} 
                onClick={() => navigateTo(service.linkPage as any)}
                className="text-center p-6 bg-slate-900/60 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 hover:border-primary transition-all cursor-pointer group w-full"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 mx-auto text-primary border border-slate-700 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon iconKey={service.iconKey} className="w-8 h-8"/>
                </div>
                <h3 className="mt-6 text-lg font-medium text-white group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="mt-2 text-base text-gray-400">{service.text}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 sm:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.portfolioTitle')}</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Exploring the frontiers of global health through interdisciplinary investigations.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {featuredProjects.map((item, index) => {
                const isMissingImage = !item.img || item.img.trim() === '';
                const isSynthesizing = item.isLoadingImage || isMissingImage;
                
                return (
                <div key={index} className="group bg-slate-800/70 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 overflow-hidden flex flex-col">
                    <div className="relative h-64 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                        {isSynthesizing ? (
                           <div className="flex flex-col items-center gap-3 relative">
                               <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 animate-pulse"></div>
                               <div className="w-12 h-12 border-4 border-slate-700 border-t-primary rounded-full animate-spin relative z-10" role="status"></div>
                               <div className="text-center relative z-10">
                                   <span className="text-[10px] uppercase font-black text-primary tracking-[0.3em] block animate-pulse">Synthesizing Visual</span>
                                   <span className="text-[8px] text-gray-600 font-bold uppercase mt-1 block">Civicavita Research Cloud</span>
                               </div>
                           </div>
                        ) : item.isGenerationFailed ? (
                            <div className="flex flex-col items-center gap-4 p-6 text-center">
                                <span className="text-gray-500 text-sm font-medium">{t('common.failed')}</span>
                                <button 
                                    onClick={() => onRetryImage('project', index)}
                                    className="px-4 py-2 bg-slate-700 text-primary text-xs font-bold rounded-md border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-lg"
                                >
                                    {t('common.retry')}
                                </button>
                            </div>
                        ) : (
                           <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="bg-slate-950/80 text-white text-[10px] font-black px-2 py-1 rounded backdrop-blur-sm shadow-xl border border-white/5">
                                0{index + 1}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                            {item.img?.startsWith('data:') && (
                                <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-500/30">AI Visual</span>
                            )}
                        </div>
                        <p className="text-gray-300 mb-4 flex-grow text-sm line-clamp-3 leading-relaxed">{item.description}</p>
                         <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="bg-slate-700 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-600 uppercase tracking-tighter">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )})}
          </div>
           <div className="mt-12 text-center">
                <button onClick={() => navigateTo('projects')} className="px-10 py-4 border-2 border-primary text-primary font-black uppercase tracking-widest rounded-md shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95">
                    View Entire Portfolio
                </button>
           </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 sm:py-24 bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.achievementsTitle')}</h2>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
                {achievements.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Icon iconKey={item.iconKey} className="w-10 h-10 text-primary"/>
                        <p className="text-4xl font-bold text-white mt-2">{item.count}{item.suffix}</p>
                        <p className="text-sm text-gray-400 mt-1">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Partners Section - Visibility Improved */}
      <section className="py-16 sm:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.customersTitle')}</h2>
                <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full opacity-50"></div>
            </div>
            <div className="mt-12">
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {customerLogos.map((logo, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <div className="h-20 md:h-24 w-40 md:w-48 flex items-center justify-center p-4 bg-slate-800/20 rounded-xl border border-white/5 hover:bg-slate-800/40 transition-all">
                                <img 
                                    className="max-h-full max-w-full object-contain filter brightness-110 contrast-125 opacity-100 group-hover:scale-110 transition-all duration-500" 
                                    src={logo.img} 
                                    alt={logo.alt} 
                                />
                            </div>
                            <span className="mt-3 text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                {logo.alt}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Blog/Insights Section */}
      <section className="py-16 sm:py-24 bg-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.calendarTitle')}</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {latestPosts.map((post, index) => (
                    <div key={index} className="group flex flex-col overflow-hidden rounded-lg shadow-lg bg-slate-900 border border-slate-700 hover:border-primary transition-colors h-full">
                        <div className="flex-shrink-0 h-48 w-full bg-slate-800 flex items-center justify-center overflow-hidden">
                           {post.isLoadingImage ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary" role="status"></div>
                                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Designing...</span>
                                </div>
                            ) : post.isGenerationFailed ? (
                                <div className="flex flex-col items-center gap-3 p-4 text-center">
                                    <span className="text-gray-500 text-xs font-medium">{t('common.failed')}</span>
                                    <button 
                                        onClick={() => onRetryImage('post', index)}
                                        className="px-3 py-1 bg-slate-700 text-primary text-[10px] font-black uppercase rounded border border-primary/30 hover:bg-primary hover:text-white transition-all"
                                    >
                                        {t('common.retry')}
                                    </button>
                                </div>
                            ) : (
                                <img className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" src={post.img} alt={post.title} />
                            )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div className="flex-1">
                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-2 block">
                                    <p className="text-lg font-bold text-gray-100 group-hover:text-primary transition-colors leading-snug">{post.title}</p>
                                </a>
                                <p className="mt-3 text-sm text-gray-400 line-clamp-2">Latest publication and research insights available on LinkedIn profile.</p>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-xs text-gray-500 font-medium">
                                    <time dateTime={post.date}>{post.date}</time>
                                </div>
                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                                    Read Post →
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;