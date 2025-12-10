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
    <div className="bg-slate-900/60 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('blogGenerator.formTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="blog-title" className={`block text-sm font-medium text-gray-300 relative transition-colors duration-500 ${isComplete ? 'strikethrough-animated' : ''}`}>{t('blogGenerator.titleLabel')}</label>
          <input
            type="text"
            id="blog-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-slate-700/80 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
            placeholder={t('blogGenerator.titlePlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="blog-content" className={`block text-sm font-medium text-gray-300 relative transition-colors duration-500 ${isComplete ? 'strikethrough-animated' : ''}`}>{t('blogGenerator.contentLabel')}</label>
          <textarea
            id="blog-content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full bg-slate-700/80 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
            placeholder={t('blogGenerator.contentPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="blog-tone" className={`block text-sm font-medium text-gray-300 relative transition-colors duration-500 ${isComplete ? 'strikethrough-animated' : ''}`}>{t('blogGenerator.toneLabel')}</label>
          <select
            id="blog-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 block w-full bg-slate-700/80 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
          >
            {BLOG_TONES.map(option => (
              <option key={option.value} value={option.value}>
                {t(`blogTones.${option.value}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading || isQuotaExhausted}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 hover:from-blue-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('blogGenerator.generatingText')}
                </>
            ) : isQuotaExhausted ? t('quotaErrorModal.title') : t('blogGenerator.buttonText')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogGeneratorForm;
