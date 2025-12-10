
import React from 'react';
import { useLanguage, AppState, BlogPost, Project } from '../types';
import Icon from './Icon';

interface HomePageProps {
  setPage: (page: AppState['page']) => void;
  latestPosts: BlogPost[];
  featuredProjects: Project[];
}

const HomePage: React.FC<HomePageProps> = ({ setPage, latestPosts, featuredProjects }) => {
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
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {featuredProjects.slice(0, 4).map((item, index) => (
                <div key={index} className="group bg-slate-800/70 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 overflow-hidden flex flex-col">
                    <div className="relative h-64 w-full overflow-hidden bg-slate-800 flex items-center justify-center">
                        {item.isLoadingImage ? (
                           <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary" role="status" aria-label="Loading image"></div>
                        ) : (
                           <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                        <p className="text-gray-300 mb-4 flex-grow text-sm">{item.description}</p>
                         <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="bg-slate-700 text-primary text-xs font-semibold px-2 py-1 rounded-full border border-slate-600">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
          </div>
           <div className="mt-12 text-center">
                <button onClick={() => navigateTo('projects')} className="px-8 py-3 border border-primary text-primary font-semibold rounded-md shadow-lg hover:bg-slate-800 transition-colors">
                    {t('hero.button1')}
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

      {/* Partners Section */}
      <section className="py-16 sm:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.customersTitle')}</h2>
            </div>
            <div className="mt-12 flow-root">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
                    {customerLogos.map((logo, index) => (
                        <div key={index} className="flex justify-center">
                            <img className="max-h-12 opacity-60 hover:opacity-100 transition-opacity" src={logo.img} alt={logo.alt} />
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
                    <div key={index} className="group flex flex-col overflow-hidden rounded-lg shadow-lg bg-slate-900 border border-slate-700">
                        <div className="flex-shrink-0 h-48 w-full bg-slate-800 flex items-center justify-center">
                           {post.isLoadingImage ? (
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary" role="status" aria-label="Loading image"></div>
                            ) : (
                                <img className="h-48 w-full object-cover" src={post.img} alt={post.title} />
                            )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div className="flex-1">
                                <a href={post.link} className="mt-2 block">
                                    <p className="text-xl font-semibold text-gray-100 group-hover:text-primary transition-colors">{post.title}</p>
                                </a>
                            </div>
                            <div className="mt-6 flex items-center">
                                <div className="text-sm text-gray-500">
                                    <time dateTime={post.date}>{post.date}</time>
                                </div>
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
