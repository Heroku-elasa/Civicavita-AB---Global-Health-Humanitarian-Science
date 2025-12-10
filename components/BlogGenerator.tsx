import React from 'react';
import BlogGeneratorForm from './BlogGeneratorForm';
import ReportDisplay from './ReportDisplay';
import { useLanguage } from '../types';

interface BlogGeneratorProps {
  onGenerate: (title: string, content: string, tone: string) => void;
  generatedPost: string;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  isQuotaExhausted: boolean;
}

const BlogGenerator: React.FC<BlogGeneratorProps> = (props) => {
  const { t } = useLanguage();
  return (
    <section id="blog-generator" className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
       <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
                {t('blogGenerator.title')}
            </h1>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="lg:sticky top-28">
          <BlogGeneratorForm {...props} />
        </div>
        <div className="bg-slate-900/60 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700">
          <ReportDisplay generatedReport={props.generatedPost} isLoading={props.isLoading} error={props.error} />
        </div>
      </div>
    </section>
  );
};

export default BlogGenerator;
