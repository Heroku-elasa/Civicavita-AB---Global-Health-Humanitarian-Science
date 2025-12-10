
import React from 'react';
import { useLanguage, Page } from '../types';

interface SiteFooterProps {
  setPage: (page: Page) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ setPage }) => {
    const { t } = useLanguage();
    // FIX: Type assertion is now valid because the `t` function's return type is `any`.
    const quickLinks: { text: string; link: string }[] = t('footer.quickLinks');
    const mainPhone = (t('footer.phone') || '').replace(/[^\d+]/g, '');

    const handleQuickLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        // Only handle internal anchor links that have a target ID
        if (link.startsWith('#') && link.length > 1) {
            event.preventDefault(); // Prevent default browser jump
            const targetId = link.substring(1);

            // Navigate to the home page first
            setPage('home');

            // After a short delay to allow the home page to render, scroll to the section.
            // This ensures the element exists in the DOM before we try to scroll to it.
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };


    return (
        <footer id="footer" className="bg-slate-900 text-gray-400 border-t-4 border-primary/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Logo & Description */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            Civicavita.
                            <span className="text-orange-500">A</span>
                            <span className="text-emerald-500">B</span>
                        </h2>
                        <p className="text-sm leading-relaxed">{t('footer.description')}</p>
                    </div>
                    {/* Column 2: Contact Info */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-primary border-b border-gray-700 pb-2 inline-block">{t('footer.contactTitle')}</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0 text-primary">📧</span>
                                <a href={`mailto:${t('footer.email')}`} className="hover:text-primary transition-colors font-inter">{t('footer.email')}</a>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0 text-primary">📞</span>
                                <a href={`tel:${mainPhone}`} className="hover:text-primary transition-colors">{t('footer.phone')}</a>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0 text-primary">📍</span>
                                <span>{t('footer.address')}</span>
                            </li>
                        </ul>
                         <h2 className="text-lg font-semibold text-primary border-b border-gray-700 pb-2 pt-4 inline-block">{t('footer.socialMediaTitle')}</h2>
                         <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title={t('footer.instagram')}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zm0 1.62c-2.403 0-2.741.01-3.72.058-1.002.046-1.634.21-2.126.41a3.272 3.272 0 00-1.18 1.18c-.2.492-.364 1.124-.41 2.126-.048.978-.058 1.316-.058 3.72s.01 2.742.058 3.72c.046 1.002.21 1.634.41 2.126a3.272 3.272 0 001.18 1.18c.492.2.924.364 2.126.41.978.048 1.316.058 3.72.058 2.403 0 2.741-.01 3.72-.058 1.002-.046 1.634-.21 2.126-.41a3.272 3.272 0 001.18-1.18c.2-.492.364-1.124.41-2.126.048-.978.058-1.316-.058-3.72s-.01-2.742-.058-3.72c-.046-1.002-.21-1.634-.41-2.126a3.272 3.272 0 00-1.18-1.18c-.492-.2-.924-.364-2.126-.41-.978-.048-1.316-.058-3.72-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.652a3.517 3.517 0 110-7.034 3.517 3.517 0 010 7.034zM16.965 6.575a1.265 1.265 0 100 2.53 1.265 1.265 0 000-2.53z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title={t('footer.whatsapp')}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                            </a>
                             <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title={t('footer.telegram')}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.499 1.201-.82 1.23-.697.065-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.48-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.385 4.025-1.627 4.476-1.635.461-.009.895.122 1.054.498.1.238.106.502.102.61z"/>
                                </svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title={t('footer.linkedin')}>
                               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title={t('footer.facebook')}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"></path></svg>
                            </a>
                         </div>
                    </div>
                    {/* Column 3: Quick Links */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-primary border-b border-gray-700 pb-2 inline-block">{t('footer.quickLinksTitle')}</h2>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.link} onClick={(e) => handleQuickLinkClick(e, link.link)} className="hover:text-primary transition-colors cursor-pointer">{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Column 4: Map */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-primary border-b border-gray-700 pb-2 inline-block">{t('footer.addressTitle')}</h2>
                        <div className="overflow-hidden rounded-lg h-48 border border-gray-700">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2253.111162483827!2d13.00305557731295!3d55.58981447291129!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x4653a1608b26107d%3A0xf6369c249a532a81!2sLantmannagatan%206C%2C%20214%2044%20Malm%C3%B6%2C%20Sweden!5e0!3m2!1sen!2sus!4v1721326442111!5m2!1sen!2sus"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black/50 py-4 mt-12 border-t border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
                    <p>{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
