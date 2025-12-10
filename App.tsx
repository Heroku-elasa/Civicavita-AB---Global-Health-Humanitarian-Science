


import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import SiteFooter from './components/Footer';
import HomePage from './components/Hero';
import ReportGenerator from './components/ReportGenerator';
import GrantFinder from './components/GrantFinder';
import GrantAdopter from './components/GrantAdopter';
import VideoGenerator from './components/VideoGenerator';
import ProjectsPage from './components/ProjectsPage';
import TeamPage from './components/TeamPage';
import BlogGenerator from './components/BlogGenerator';
import QuotaErrorModal from './components/QuotaErrorModal';
import Chatbot from './components/Chatbot';
import WasteToWealthPage from './components/WasteToWealthPage';
import TreePlanterPage from './components/TreePlanterPage';
import ContentHubPage from './components/ContentHubPage';
import DashboardPage from './components/DashboardPage';
import { Page, Grant, GrantSummary, VideoScene, BlogPost, Project, useLanguage, DailyTrend, GeneratedPost } from './types';
import { ToastProvider } from './components/Toast';
import * as geminiService from './services/geminiService';
import * as dbService from './services/dbService';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Report Generator State
    const [generatedReport, setGeneratedReport] = useState('');
    const [isReportComplete, setIsReportComplete] = useState(false);
    const [reportTopic, setReportTopic] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reportType, setReportType] = useState('scientific_article');

    // Grant Finder State
    const [grantKeywords, setGrantKeywords] = useState('');
    const [foundGrants, setFoundGrants] = useState<Grant[]>([]);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
    const [isAnalyzingGrant, setIsAnalyzingGrant] = useState(false);
    const [grantAnalysis, setGrantAnalysis] = useState<GrantSummary | null>(null);
    const [grantAnalysisError, setGrantAnalysisError] = useState<string | null>(null);

    // Video Generator State
    const [videoPrompt, setVideoPrompt] = useState('');
    const [videoNegativePrompt, setVideoNegativePrompt] = useState('');
    const [videoImage, setVideoImage] = useState<string | null>(null);
    const [videoScenes, setVideoScenes] = useState<VideoScene[]>([]);
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    const [videoDuration, setVideoDuration] = useState(30);
    const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
    const [videoVersions, setVideoVersions] = useState(1);
    const [videoWithWatermark, setVideoWithWatermark] = useState(true);
    const [videoMusicPrompt, setVideoMusicPrompt] = useState('');
    const [videoMusicDescription, setVideoMusicDescription] = useState('');
    const [isMusicLoading, setIsMusicLoading] = useState(false);
    const [selectedMusicUrl, setSelectedMusicUrl] = useState<string | null>(null);
    const [videoType, setVideoType] = useState<'general' | 'research_showcase'>('general');

    // Blog Generator State
    const [blogTitle, setBlogTitle] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogTone, setBlogTone] = useState('engaging');
    const [generatedBlogPost, setGeneratedBlogPost] = useState('');
    const [isBlogComplete, setIsBlogComplete] = useState(false);

    // Content Hub State
    const [dailyTrends, setDailyTrends] = useState<DailyTrend[] | null>(null);
    const [isFetchingTrends, setIsFetchingTrends] = useState(false);
    const [trendsError, setTrendsError] = useState<string | null>(null);
    const [isGeneratingPost, setIsGeneratingPost] = useState(false);
    const [generatedContentPost, setGeneratedContentPost] = useState<GeneratedPost | null>(null);
    const [isAdaptingPost, setIsAdaptingPost] = useState(false);
    const [adaptedPost, setAdaptedPost] = useState<{title: string, content: string} | null>(null);

    // Chatbot State
    const [wasteBotChat, setWasteBotChat] = useState<Chat | null>(null);

    // Home page state
    const { t, language } = useLanguage();
    const [latestPosts, setLatestPosts] = useState<BlogPost[]>(t('home.latestPosts'));
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>(t('home.portfolioItems'));

    // General State
    const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);

    // Rate limiting helper
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Initialize DB and Chatbot
    useEffect(() => {
        dbService.initDB().catch(err => console.error("Failed to initialize DB:", err));
        
        // Re-initialize the chatbot session whenever the language changes to update system instruction
        const promptLang = t('langName') || 'English';
        const chatSession = geminiService.startWasteBotChat(promptLang);
        setWasteBotChat(chatSession);
    }, [language, t]);

    const handleApiError = useCallback((err: unknown): string => {
        let message = 'An unexpected error occurred.';
        if (err instanceof Error) {
            message = err.message;
            if (message.includes('429') || message.includes('quota') || message.includes('billing')) {
                setIsQuotaExhausted(true);
            }
        } else if (typeof err === 'string') {
            message = err;
        }
        console.error("API Error:", err);
        return message;
    }, []);

    useEffect(() => {
        const initialPostsForLang: BlogPost[] = t('home.latestPosts') || [];
        if (!initialPostsForLang.length) return;
        
        const postsWithImages = initialPostsForLang.map((post) => ({
            ...post,
            isLoadingImage: false
        }));
        setLatestPosts(postsWithImages);
    }, [language, t]);
    
    useEffect(() => {
        const initialProjectsForLang: Project[] = t('home.portfolioItems') || [];
        if (!initialProjectsForLang.length) return;
        
        const projectsWithImages = initialProjectsForLang.map((project) => ({
            ...project,
            isLoadingImage: false
        }));
        setFeaturedProjects(projectsWithImages);
    }, [language, t]);


    const handleGenerateReport = async (topic: string, description: string, reportType: string) => {
        setIsLoading(true);
        setError(null);
        setGeneratedReport('');
        setIsReportComplete(false);
        const promptLang = t('langName') || 'English';
        try {
            const report = await geminiService.generateReport(topic, description, reportType, promptLang);
            setGeneratedReport(report);
            setIsReportComplete(true);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFindGrants = async (keywords: string) => {
        setIsLoading(true);
        setError(null);
        setFoundGrants([]);
        const promptLang = t('langName') || 'English';
        try {
            const grants = await geminiService.findGrants(keywords, promptLang);
            setFoundGrants(grants);
        } catch(e) {
            setError(handleApiError(e));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeGrant = async (grant: Grant) => {
        setSelectedGrant(grant);
        setGrantAnalysis(null);
        setGrantAnalysisError(null);
        setIsAnalyzingGrant(true);
        const promptLang = t('langName') || 'English';
        try {
            // A hardcoded profile for now
            const userProfile = "We are a research group focused on renewable energy and sustainable materials science.";
            const analysis = await geminiService.analyzeGrant(grant, userProfile, promptLang);
            setGrantAnalysis(analysis);
        } catch(e) {
            setGrantAnalysisError(handleApiError(e));
        } finally {
            setIsAnalyzingGrant(false);
        }
    };

    const handleGenerateScript = async () => {
        setIsScriptLoading(true);
        setError(null);
        setVideoScenes([]);
        const promptLang = t('langName') || 'English';
        try {
            const script = await geminiService.generateVideoScript(videoPrompt, videoImage, videoDuration, videoType, promptLang);
            const scenes: VideoScene[] = script.map(s => ({...s, videoUrls: [], imageUrl: null, isGenerating: false, isApproved: false, error: null}));
            setVideoScenes(scenes);
        } catch(e) {
            setError(handleApiError(e));
        } finally {
            setIsScriptLoading(false);
        }
    };
    
    const onSceneMediaGenerate = async (index: number, generator: (desc: string) => Promise<string | string[]>, type: 'video' | 'image') => {
        let scenesSnapshot = [...videoScenes];
        scenesSnapshot[index].isGenerating = true;
        scenesSnapshot[index].error = null;
        setVideoScenes(scenesSnapshot);
        try {
            const result = await generator(scenesSnapshot[index].description);
            scenesSnapshot = [...videoScenes]; // get latest state
            if (type === 'image' && typeof result === 'string') {
                scenesSnapshot[index].imageUrl = result;
            } else if (type === 'video' && Array.isArray(result)) {
                scenesSnapshot[index].videoUrls = result;
            }
            scenesSnapshot[index].isGenerating = false;
            setVideoScenes(scenesSnapshot);
        } catch(e) {
            scenesSnapshot = [...videoScenes]; // get latest state
            scenesSnapshot[index].error = handleApiError(e);
            scenesSnapshot[index].isGenerating = false;
            setVideoScenes(scenesSnapshot);
        }
    };

    const handleGenerateSceneVideo = (index: number) => {
        onSceneMediaGenerate(index, geminiService.generateSceneVideo, 'video');
    };

    const handleGenerateSceneImage = (index: number) => {
        onSceneMediaGenerate(index, geminiService.generateSceneImage, 'image');
    };
    
    const onGenerateMusic = async () => {
        setIsMusicLoading(true);
        const promptLang = t('langName') || 'English';
        try {
            const desc = await geminiService.generateMusicDescription(videoMusicPrompt, promptLang);
            setVideoMusicDescription(desc);
        } catch(e) {
            handleApiError(e);
        } finally {
            setIsMusicLoading(false);
        }
    };

    const handleGenerateBlogPost = async (title: string, content: string, tone: string) => {
        setIsLoading(true);
        setError(null);
        setGeneratedBlogPost('');
        setIsBlogComplete(false);
        const promptLang = t('langName') || 'English';
        try {
            const post = await geminiService.generateBlogPostWithImages(title, content, tone, promptLang);
            setGeneratedBlogPost(post);
            setIsBlogComplete(true);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    // Content Hub Handlers
    const handleFetchTrends = async () => {
        setIsFetchingTrends(true);
        setTrendsError(null);
        const promptLang = t('langName') || 'English';
        try {
            const prompt = `Identify 5 current trending topics in Global Health, Humanitarian Aid, and Sustainable Development for today. Return a JSON array of objects with 'title', 'summary', and 'contentIdea' (a suggestion for a social media post about it). Ensure all text values are in ${promptLang}.`;
             const response = await geminiService.generateReport(prompt, "JSON output only", "trend_analysis", promptLang);
             const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
             let jsonStr = jsonMatch ? jsonMatch[1] : response;
             
             try {
                const trends = JSON.parse(jsonStr);
                setDailyTrends(trends);
             } catch(e) {
                 // Fallback translated if parsing fails (simplified logic)
                 setDailyTrends([
                     { title: "Climate Resilience", summary: "Rising focus on adaptive infrastructure.", contentIdea: "5 ways resilient infrastructure saves lives." },
                 ]);
             }
        } catch (err) {
            setTrendsError(handleApiError(err));
        } finally {
            setIsFetchingTrends(false);
        }
    };

    const handleGenerateContentPost = async (topic: string, platform: string) => {
        setIsGeneratingPost(true);
        setGeneratedContentPost(null);
        const promptLang = t('langName') || 'English';
        try {
            const prompt = `Write a viral ${platform} post about "${topic}". Include emojis and hashtags. Tone: Professional yet engaging. Output in ${promptLang}.`;
            const text = await geminiService.generateReport(topic, `Platform: ${platform}. ${prompt}`, "social_media_post", promptLang);
            
            let imageUrl = undefined;
            try {
                imageUrl = await geminiService.generateImageForPost(topic);
            } catch(e) {
                console.error("Image gen failed for post", e);
            }
            
            setGeneratedContentPost({ text, platform, imageUrl });
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsGeneratingPost(false);
        }
    };

    const handleAdaptPost = async (postText: string, platform: string) => {
        setIsAdaptingPost(true);
        setAdaptedPost(null);
        const promptLang = t('langName') || 'English';
        try {
            const prompt = `Adapt this ${platform} post into a full blog post outline for our website.
            
            Original Post: "${postText}"
            
            Return JSON with 'title' and 'content' (markdown). Ensure all text is in ${promptLang}.`;
            
            const response = await geminiService.generateReport("Adaptation", prompt, "blog_adaptation", promptLang);
             const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
             let jsonStr = jsonMatch ? jsonMatch[1] : response;
             try {
                 const data = JSON.parse(jsonStr);
                 setAdaptedPost(data);
             } catch(e) {
                 setAdaptedPost({ title: "Adapted Blog Post", content: response });
             }

        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsAdaptingPost(false);
        }
    };


    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage setPage={setPage} latestPosts={latestPosts} featuredProjects={featuredProjects} />;
            case 'projects': return <ProjectsPage />;
            case 'team': return <TeamPage />;
            case 'generator': return <ReportGenerator onGenerate={handleGenerateReport} generatedReport={generatedReport} isLoading={isLoading} error={error} isComplete={isReportComplete} topic={reportTopic} setTopic={setReportTopic} description={reportDescription} setDescription={setReportDescription} reportType={reportType} setReportType={setReportType} isQuotaExhausted={isQuotaExhausted} />;
            case 'grant': return (<>
                <GrantFinder onFindGrants={handleFindGrants} isLoading={isLoading} error={error} grants={foundGrants} onAnalyzeGrant={handleAnalyzeGrant} keywords={grantKeywords} setKeywords={setGrantKeywords} />
                {selectedGrant && <GrantAdopter grant={selectedGrant} isAnalyzing={isAnalyzingGrant} result={grantAnalysis} error={grantAnalysisError} onClear={() => setSelectedGrant(null)} onPrepareProposal={(grant) => { setPage('generator'); setReportTopic(`Proposal for ${grant.grantTitle}`); setReportDescription(`Based on the grant summary: ${grant.summary}`); setReportType('project_proposal'); }} />}
            </>);
            case 'video': return <VideoGenerator prompt={videoPrompt} setPrompt={setVideoPrompt} negativePrompt={videoNegativePrompt} setNegativePrompt={setVideoNegativePrompt} image={videoImage} setImage={setVideoImage} scenes={videoScenes} onSceneChange={(index, desc) => { const newScenes = [...videoScenes]; newScenes[index].description = desc; setVideoScenes(newScenes); }} onApproveScene={(index, isApproved) => { const newScenes = [...videoScenes]; newScenes[index].isApproved = isApproved; setVideoScenes(newScenes); }} onGenerateScript={handleGenerateScript} isScriptLoading={isScriptLoading} onGenerateSceneVideo={handleGenerateSceneVideo} onGenerateSceneImage={handleGenerateSceneImage} error={error} onClear={() => { setVideoScenes([]); setVideoPrompt(''); setVideoImage(null); }} duration={videoDuration} setDuration={setVideoDuration} aspectRatio={videoAspectRatio} setAspectRatio={setVideoAspectRatio} numberOfVersions={videoVersions} setNumberOfVersions={setVideoVersions} withWatermark={videoWithWatermark} setWithWatermark={setVideoWithWatermark} isQuotaExhausted={isQuotaExhausted} handleApiError={handleApiError} musicPrompt={videoMusicPrompt} setMusicPrompt={setVideoMusicPrompt} musicDescription={videoMusicDescription} isMusicLoading={isMusicLoading} onGenerateMusic={onGenerateMusic} selectedMusicUrl={selectedMusicUrl} onSelectMusicUrl={setSelectedMusicUrl} videoType={videoType} setVideoType={setVideoType} />;
            case 'blog': return <BlogGenerator 
                onGenerate={handleGenerateBlogPost}
                generatedPost={generatedBlogPost}
                isLoading={isLoading}
                error={error}
                isComplete={isBlogComplete}
                title={blogTitle}
                setTitle={setBlogTitle}
                content={blogContent}
                setContent={setBlogContent}
                tone={blogTone}
                setTone={setBlogTone}
                isQuotaExhausted={isQuotaExhausted}
            />;
            case 'content-hub': return <ContentHubPage 
                onFetchTrends={handleFetchTrends}
                isFetchingTrends={isFetchingTrends}
                trends={dailyTrends}
                trendsError={trendsError}
                onGeneratePost={handleGenerateContentPost}
                isGeneratingPost={isGeneratingPost}
                generatedPost={generatedContentPost}
                onClearPost={() => setGeneratedContentPost(null)}
                onAdaptPost={handleAdaptPost}
                isAdapting={isAdaptingPost}
                adaptedPost={adaptedPost}
            />;
            case 'waste-to-wealth': return <WasteToWealthPage />;
            case 'tree-planter': return <TreePlanterPage handleApiError={handleApiError} isQuotaExhausted={isQuotaExhausted} />;
            case 'dashboard': return <DashboardPage setPage={setPage} latestPosts={latestPosts} featuredProjects={featuredProjects} />;
            default: return <HomePage setPage={setPage} latestPosts={latestPosts} featuredProjects={featuredProjects} />;
        }
    };

    return (
        <ToastProvider>
            <div className="bg-slate-900 min-h-screen">
                {page !== 'dashboard' && <Header setPage={setPage} currentPage={page} />}
                <main>
                    {renderPage()}
                </main>
                {page !== 'dashboard' && <SiteFooter setPage={setPage} />}
                <QuotaErrorModal isOpen={isQuotaExhausted} onClose={() => setIsQuotaExhausted(false)} />
                {page !== 'dashboard' && <Chatbot chatSession={wasteBotChat} />}
            </div>
        </ToastProvider>
    );
};

export default App;
