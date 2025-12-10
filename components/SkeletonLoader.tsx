
import React from 'react';

interface SkeletonProps {
  type?: 'text' | 'title' | 'card' | 'image' | 'list-item' | 'badge';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'text', count = 1, className = '' }) => {
  const renderSkeleton = (key: number) => {
    switch (type) {
      case 'title':
        return <div key={key} className={`h-8 bg-slate-700/50 rounded w-3/4 mb-4 animate-pulse ${className}`} />;
      case 'text':
        return <div key={key} className={`h-4 bg-slate-700/50 rounded w-full mb-2 animate-pulse ${className}`} />;
      case 'image':
        return <div key={key} className={`w-full h-48 bg-slate-700/50 rounded-lg animate-pulse ${className}`} />;
      case 'badge':
        return <div key={key} className={`h-6 w-16 bg-slate-700/50 rounded-full animate-pulse inline-block ${className}`} />;
      case 'card':
        return (
          <div key={key} className={`p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 space-y-3 animate-pulse ${className}`}>
             <div className="h-6 bg-slate-700/50 rounded w-2/3"></div>
             <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
             <div className="space-y-2 pt-2">
                 <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                 <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
             </div>
             <div className="pt-3 flex justify-between">
                <div className="h-4 bg-slate-700/50 rounded w-1/3"></div>
                <div className="h-6 bg-slate-700/50 rounded w-20"></div>
             </div>
          </div>
        );
      case 'list-item':
          return (
               <div key={key} className={`flex items-center space-x-4 p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 animate-pulse ${className}`}>
                   <div className="h-10 w-10 bg-slate-700/50 rounded-full"></div>
                   <div className="flex-1 space-y-2">
                       <div className="h-4 bg-slate-700/50 rounded w-1/3"></div>
                       <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
                   </div>
               </div>
          );
      default:
        return <div key={key} className={`h-4 bg-slate-700/50 rounded w-full mb-2 animate-pulse ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};
