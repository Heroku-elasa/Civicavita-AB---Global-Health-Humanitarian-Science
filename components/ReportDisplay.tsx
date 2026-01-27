import React, { useRef, useEffect, useState, useMemo } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';
import { SkeletonLoader } from './SkeletonLoader';

interface ReportDisplayProps {
  generatedReport: string;
  isLoading: boolean;
  error: string | null;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ generatedReport, isLoading, error }) => {
  const { t } = useLanguage();
  const endOfReportRef = useRef<HTMLDivElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [reportHtml, setReportHtml] = useState('');

  const isComplete = !isLoading && generatedReport.length > 0 && !error;

  const readingTime = useMemo(() => {
      const words = generatedReport.split(/\s+/).length;
      return Math.ceil(words / 200);
  }, [generatedReport]);

  useEffect(() => {
    if (isLoading) {
      endOfReportRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedReport, isLoading]);

  useEffect(() => {
    let isMounted = true;
    const parseMarkdown = async () => {
      if (generatedReport) {
        const html = await marked.parse(generatedReport);
        if (isMounted) setReportHtml(html);
      } else {
        if (isMounted) setReportHtml('');
      }
    };
    parseMarkdown();
    return () => { isMounted = false; };
  }, [generatedReport]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadFile = (filename: string, content: string | Blob | ArrayBuffer, mimeType: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    setIsExportMenuOpen(false);
  };
  
  const handleDownloadMD = () => {
    downloadFile('report.md', generatedReport, 'text/markdown;charset=utf-8');
    setIsExportMenuOpen(false);
  };

  const handleDownloadDOCX = async () => {
    const reportHtmlString = await marked.parse(generatedReport);
    try {
      const htmlToDocxModule = await import('html-to-docx');
      const htmlToDocx = htmlToDocxModule.default;
      
      if (typeof htmlToDocx !== 'function') {
        console.error('Failed to load html-to-docx function', htmlToDocxModule);
        throw new Error('Could not convert to DOCX. The library did not load correctly.');
      }

      const docxBlob = await htmlToDocx(reportHtmlString, '', {
        margins: { top: 720, right: 720, bottom: 720, left: 720 }
      });
      downloadFile('report.docx', docxBlob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } catch (e) {
      console.error("Error converting HTML to DOCX:", e);
      alert(e instanceof Error ? e.message : "An error occurred while trying to generate the DOCX file.");
    }
    setIsExportMenuOpen(false);
  };

  const createHtmlContent = async (markdownContent: string) => {
    const parsedHtml = await marked.parse(markdownContent);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('reportDisplay.docTitle')}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; color: #333; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; }
    code { font-family: monospace; background-color: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre { background-color: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
    pre code { background-color: transparent; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    blockquote { color: #666; margin: 0; padding-left: 1em; border-left: 0.25em solid #dfe2e5; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  ${parsedHtml}
</body>
</html>`;
  };
  
  const handleDownloadHTML = async () => {
    const htmlContent = await createHtmlContent(generatedReport);
    downloadFile('report.html', htmlContent, 'text/html;charset=utf-8');
    setIsExportMenuOpen(false);
  };

  const handlePrint = async () => {
    const htmlContent = await createHtmlContent(generatedReport);
    const printWindow = window.open('', '_blank');
    if(printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
    setIsExportMenuOpen(false);
  };

  return (
    <div className="min-h-[60vh] flex flex-col relative group/article">
      <div className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full ${isComplete ? 'bg-pink-500 text-white' : 'bg-slate-700 text-gray-500'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">
              {isComplete ? "Draft Ready" : "Document Assistant"}
          </span>
          {isComplete && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-gray-400">
                  {readingTime} MIN READ
              </span>
          )}
        </div>

        {generatedReport && !isLoading && (
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(prev => !prev)}
              className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-md transition-all flex items-center gap-2 shadow-lg"
            >
              <span>{t('reportDisplay.export')}</span>
              <svg className={`w-4 h-4 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl z-20 border border-slate-700 overflow-hidden ring-1 ring-black">
                <div className="p-2 space-y-1">
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-gray-200 flex items-center gap-3" onClick={handleCopy}>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        {t('reportDisplay.copy')}
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-gray-200 flex items-center gap-3" onClick={handleDownloadDOCX}>
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {t('reportDisplay.downloadDOCX')}
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-gray-200 flex items-center gap-3" onClick={handleDownloadHTML}>
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        {t('reportDisplay.downloadHTML')}
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-gray-200 flex items-center gap-3" onClick={handlePrint}>
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        {t('reportDisplay.printPDF')}
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 sm:p-12 prose prose-invert prose-pink prose-lg max-w-none text-gray-300 flex-grow overflow-y-auto selection:bg-pink-500/30">
        {!isLoading && generatedReport && (
            <div className="animate-fade-in custom-article-styles">
                <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
            </div>
        )}

        {isLoading && (
           <div className="space-y-10 animate-fade-in max-w-3xl mx-auto">
              <SkeletonLoader type="title" className="h-12 w-full mb-8" />
              <div className="space-y-4">
                  <SkeletonLoader type="text" count={6} />
              </div>
               <div className="space-y-4 pt-10">
                  <SkeletonLoader type="title" className="h-8 w-1/2" />
                  <SkeletonLoader type="text" count={4} />
              </div>
              <div className="py-8">
                <SkeletonLoader type="image" className="h-[400px]" />
              </div>
               <div className="space-y-4">
                  <SkeletonLoader type="text" count={8} />
              </div>
           </div>
        )}

        {!isLoading && !generatedReport && !error && (
            <div className="text-center text-gray-500 py-32 border-2 border-dashed border-slate-800 rounded-3xl">
                <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v12a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11l-3 3m3-3l3 3m-3-3v7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-400">{t('reportDisplay.placeholder1')}</h3>
                <p className="mt-2 text-sm">{t('reportDisplay.placeholder2')}</p>
            </div>
        )}
        <div ref={endOfReportRef} />
      </div>

      <style>{`
          .custom-article-styles h1 { 
              font-size: 2.75rem; 
              line-height: 1.2; 
              margin-bottom: 2rem; 
              font-weight: 900;
              letter-spacing: -0.025em;
              color: white;
          }
          .custom-article-styles h2 {
              font-size: 1.875rem;
              margin-top: 3rem;
              border-bottom: 1px solid #1e293b;
              padding-bottom: 0.75rem;
              color: #f1f5f9;
          }
          .custom-article-styles p {
              margin-bottom: 1.5rem;
              line-height: 1.8;
              color: #94a3b8;
          }
          .custom-article-styles img {
              border-radius: 1.5rem;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              margin: 3rem 0;
              width: 100%;
              object-fit: cover;
              border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .custom-article-styles blockquote {
              border-left: 4px solid #db2777;
              font-style: italic;
              background: rgba(219, 39, 119, 0.05);
              padding: 1.5rem 2rem;
              border-radius: 0 1rem 1rem 0;
          }
      `}</style>
    </div>
  );
};

export default ReportDisplay;