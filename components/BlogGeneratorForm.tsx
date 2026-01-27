import React from 'react';
import { BLOG_TONES } from '../constants';
import { useLanguage } from '../types';

interface BlogGeneratorFormProps {
  onGenerate: (title: string, content: string, tone: string) => void;
  isLoading: boolean;
  isComplete: boolean;
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  isQuotaExhausted: boolean;
}

const BlogGeneratorForm: React.FC<BlogGeneratorFormProps> = ({ 
  onGenerate, 
  isLoading, 
  isComplete,
  title,
  setTitle,
  content,
  setContent,
  tone,
  setTone,
  isQuotaExhausted
}) => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert(t('blogGenerator.validationError'));
      return;
    }
    onGenerate(title, content, tone);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-bold text-white">{t('blogGenerator.formTitle')}</h2>
          <p className="text-sm text-gray-400">Describe the core vision for your article.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="blog-title" className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              {t('blogGenerator.titleLabel')}
          </label>
          <input
            type="text"
            id="blog-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full bg-slate-800/50 border-slate-700 rounded-xl shadow-inner py-4 px-5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-xl font-bold text-white placeholder-gray-600 transition-all"
            placeholder={t('blogGenerator.titlePlaceholder')}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="blog-content" className="block text-xs font-black uppercase tracking-widest text-gray-500">
                {t('blogGenerator.contentLabel')}
            </label>
            <span className="text-[10px] font-bold text-gray-600 uppercase">{content.length} chars</span>
          </div>
          <textarea
            id="blog-content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full bg-slate-800/50 border-slate-700 rounded-xl shadow-inner py-4 px-5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-base text-gray-200 placeholder-gray-600 transition-all leading-relaxed"
            placeholder={t('blogGenerator.contentPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="blog-tone" className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                  {t('blogGenerator.toneLabel')}
              </label>
              <div className="relative">
                  <select
                    id="blog-tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="block w-full bg-slate-800/50 border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-sm text-white appearance-none cursor-pointer"
                  >
                    {BLOG_TONES.map(option => (
                      <option key={option.value} value={option.value} className="bg-slate-800">
                        {t(`blogTones.${option.value}`)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
                <button
                    type="submit"
                    disabled={isLoading || isQuotaExhausted}
                    className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-black uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 hover:from-blue-700 hover:to-pink-800 disabled:bg-slate-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            {t('blogGenerator.generatingText')}
                        </>
                    ) : isQuotaExhausted ? "QUOTA EXCEEDED" : t('blogGenerator.buttonText')}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default BlogGeneratorForm;