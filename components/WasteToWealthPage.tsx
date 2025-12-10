import React from 'react';
import { useLanguage } from '../types';
import Icon from './Icon';

const WasteToWealthPage: React.FC = () => {
    const { t } = useLanguage();
    const modules: { iconKey: string; title: string; text: string }[] = t('wasteToWealthPage.modules');

    return (
        <div className="animate-fade-in text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
                        {t('wasteToWealthPage.title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t('wasteToWealthPage.subtitle')}</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 mb-12">
                         <h2 className="text-2xl font-bold text-pink-400 text-center mb-4">{t('wasteToWealthPage.introTitle')}</h2>
                         <p className="text-gray-300 text-center leading-relaxed">{t('wasteToWealthPage.introText')}</p>
                    </div>

                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('wasteToWealthPage.modulesTitle')}</h2>
                    </div>

                    <div className="space-y-10">
                        {modules.map((module, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-900/60 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700">
                                <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-purple-800 to-pink-800 text-pink-300">
                                    <Icon iconKey={module.iconKey} className="w-10 h-10"/>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                                    <p className="text-gray-400">{module.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white">{t('wasteToWealthPage.ctaTitle')}</h2>
                        <p className="mt-2 text-gray-300 max-w-xl mx-auto">{t('wasteToWealthPage.ctaText')}</p>
                        <button
                            onClick={() => {
                                // Logic to open chatbot
                                const fab = document.querySelector('.chatbot-fab button') as HTMLButtonElement;
                                if (fab) {
                                  const chatbotWindow = document.querySelector('.chatbot-window');
                                  // Click to open if it's closed
                                  if (chatbotWindow?.classList.contains('closed')) {
                                    fab.click();
                                  }
                                }
                            }}
                            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 text-white font-semibold rounded-md shadow-lg hover:scale-105 transition-transform"
                        >
                            {t('wasteToWealthPage.ctaButton')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WasteToWealthPage;
