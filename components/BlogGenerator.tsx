import React, { useState } from 'react';
import BlogGeneratorForm from './BlogGeneratorForm';
import ReportDisplay from './ReportDisplay';
import { useLanguage } from '../types';
import { marked } from 'marked';

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
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleStartGeneration = (title: string, content: string, tone: string) => {
      props.onGenerate(title, content, tone);
      setView('preview');
  };

  const isRpcError = props.error?.includes('500') || props.error?.includes('Rpc failed') || props.error?.includes('xhr error');

  return (
    <section id="blog-generator" className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in min-h-[70vh]">
        {/* View Switcher/Header */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {t('blogGenerator.title')}
                </h1>
                <p className="text-gray-400 text-sm mt-1">Transform outlines into illustrated professional articles.</p>
            </div>
            
            {props.isComplete && !props.isLoading && (
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 gap-1">
                    <button 
                        onClick={() => setView('editor')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'editor' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Editor
                    </button>
                    <button 
                        onClick={() => setView('preview')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'preview' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Article View
                    </button>
                    <button 
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="px-4 py-1.5 rounded-md text-xs font-bold bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 transition-all flex items-center gap-2"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Full Preview
                    </button>
                </div>
            )}
        </div>

        <div className="max-w-4xl mx-auto">
            {/* Error Handling UI */}
            {props.error && (
                <div className={`mb-8 p-6 rounded-xl border-2 animate-fade-in ${isRpcError ? 'bg-amber-900/20 border-amber-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${isRpcError ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold ${isRpcError ? 'text-amber-300' : 'text-red-300'}`}>
                                {isRpcError ? "AI Provider Connectivity Issue" : "Generation Error"}
                            </h3>
                            <p className="text-sm text-gray-300 mt-1">
                                {isRpcError 
                                    ? "The Google AI proxy is currently unresponsive (Error 500). This usually happens during high global traffic. Background tasks are suspended to prevent account blocking." 
                                    : props.error}
                            </p>
                            <div className="mt-4 flex gap-3">
                                <button 
                                    onClick={() => props.onGenerate(props.title, props.content, props.tone)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-md transition-colors"
                                >
                                    Try Again
                                </button>
                                {isRpcError && (
                                    <a href="https://aistudio.google.com/app/status" target="_blank" rel="noreferrer" className="px-4 py-2 border border-slate-600 text-gray-400 hover:text-white text-xs font-bold rounded-md transition-colors">
                                        Check Service Status
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Logic */}
            {view === 'editor' ? (
                <div className="bg-slate-900/60 rounded-2xl p-8 shadow-2xl backdrop-blur-sm border border-slate-700 ring-1 ring-white/5">
                    <BlogGeneratorForm 
                        {...props} 
                        onGenerate={handleStartGeneration} 
                    />
                </div>
            ) : (
                <div className="bg-slate-900/60 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 overflow-hidden min-h-[500px]">
                    {props.isLoading ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-pink-500">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Architecting your post...</h2>
                            <div className="space-y-2 max-w-xs w-full">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <span>Status</span>
                                    <span className="text-pink-400">Processing</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-pink-500 h-full w-1/2 animate-pulse rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mt-8 max-w-sm italic">
                                "Our AI is currently drafting content and synthesizing three high-resolution thematic images."
                            </p>
                        </div>
                    ) : (
                        <ReportDisplay 
                            generatedReport={props.generatedPost} 
                            isLoading={props.isLoading} 
                            error={props.error} 
                        />
                    )}
                </div>
            )}
        </div>

        {/* Full Screen Preview Modal */}
        {isPreviewModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsPreviewModalOpen(false)}></div>
                <div className="relative w-full max-w-5xl h-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-8 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4">
                            <span className="bg-pink-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">Live Preview</span>
                            <h3 className="text-gray-300 font-bold text-sm hidden sm:block">Reader Mode</h3>
                        </div>
                        <button 
                            onClick={() => setIsPreviewModalOpen(false)}
                            className="p-2 hover:bg-slate-800 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-8 sm:p-16 bg-white selection:bg-pink-100">
                        <div className="max-w-3xl mx-auto prose prose-lg prose-slate prose-pink">
                            <div dangerouslySetInnerHTML={{ __html: marked.parse(props.generatedPost) as string }} />
                        </div>
                    </div>
                    
                    <div className="px-8 py-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-4">
                        <button 
                            onClick={() => setIsPreviewModalOpen(false)}
                            className="px-6 py-2 bg-slate-700 text-white font-bold text-sm rounded-xl hover:bg-slate-600 transition-colors"
                        >
                            Back to Editor
                        </button>
                        <button 
                            onClick={() => {
                                const blob = new Blob([props.generatedPost], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'article.md';
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="px-6 py-2 bg-pink-600 text-white font-bold text-sm rounded-xl hover:bg-pink-700 transition-all shadow-lg active:scale-95"
                        >
                            Download Draft
                        </button>
                    </div>
                </div>
            </div>
        )}
    </section>
  );
};

export default BlogGenerator;