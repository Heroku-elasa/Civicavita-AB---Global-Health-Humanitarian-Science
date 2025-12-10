
import React from 'react';

interface IconProps {
  iconKey: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ iconKey, className = "w-12 h-12" }) => {
    const icons: { [key: string]: React.ReactElement } = {
        science: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M22 18.5a2.5 2.5 0 0 1-4 0a2.5 2.5 0 0 1-4 0a2.5 2.5 0 0 1-4 0a2.5 2.5 0 0 1-4 0" />
                <path d="M22 12v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M6 12v-2" />
                <path d="M10 12v-2" />
                <path d="M14 12v-2" />
                <path d="M18 12v-2" />
                <path d="M4 12v6.5" />
                <path d="M20 12v6.5" />
                <path d="M12 22V6" />
                <path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            </svg>
        ),
        grant: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
        ),
        education: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M22 10v6M2 10.6V16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-5.4M4 19.5V18c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v1.5M12 14v-.5M4 12V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v6M18 5l-6 4-6-4"></path>
            </svg>
        ),
        consulting: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>
            </svg>
        ),
        publications: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
        ),
        funded: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
        ),
        collaborations: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
            </svg>
        ),
        team: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        ),
        trained: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path>
            </svg>
        ),
        community: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        ),
        token: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M14.34 9.66h-4.68a1.5 1.5 0 0 0-1.5 1.5v1.68a1.5 1.5 0 0 0 1.5 1.5h4.68a1.5 1.5 0 0 0 1.5-1.5v-1.68a1.5 1.5 0 0 0-1.5-1.5z"></path>
                <path d="M12 16.5v-9"></path>
            </svg>
        ),
        scalability: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M21 7v6h-6"></path><path d="M3 17v-6h6"></path><path d="M21 13 13 5"></path><path d="M3 7l8 8"></path>
            </svg>
        ),
        seedling: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M12 22V2"></path><path d="M8 6H4a4 4 0 0 0-4 4v0c0 2.2 1.8 4 4 4h4"></path><path d="M16 6h4a4 4 0 0 1 4 4v0c0 2.2-1.8 4-4 4h-4"></path>
            </svg>
        ),
        warning: (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        ),
        crowdfunding: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M12 12V12c-2.2-2.2-2.2-5.8 0-8 2.2-2.2 5.8-2.2 8 0 2.2 2.2 2.2 5.8 0 8Z"></path><path d="M12 12V12c2.2 2.2 2.2 5.8 0 8-2.2 2.2-5.8 2.2-8 0-2.2-2.2-2.2-5.8 0-8Z"></path><path d="M12 12V12c-2.2 2.2-5.8 2.2-8 0-2.2-2.2-2.2-5.8 0-8 2.2-2.2 5.8-2.2 8 0Z"></path><path d="M12 12V12c2.2-2.2 5.8-2.2 8 0 2.2 2.2 2.2 5.8 0 8-2.2 2.2-5.8 2.2-8 0Z"></path>
            </svg>
        ),
    };
    return icons[iconKey] || <div className={className}></div>;
};

export default Icon;
