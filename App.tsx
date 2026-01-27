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
import MediaArchivePage from './components/MediaArchivePage';
import { Page, Grant, GrantSummary, VideoScene, BlogPost, Project, useLanguage, DailyTrend, GeneratedPost } from './types';
import { ToastProvider, useToast } from './components/Toast';
import * as geminiService from './services/geminiService';
import * as dbService from './services/dbService';
import type { Chat } from '@google/genai';

// GLOBAL STATE - Preserved across re-renders
const failedGenerations = new Set<string>();
let isAiServiceDown = false;
let globalAiLock: Promise<void> = Promise.resolve();

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDbReady, setIsDbReady] = useState(false);

    // Locks to prevent multiple effects from firing overlapping loops
    const isGeneratingPostsRef = useRef(false);
    const isGeneratingProjectsRef = useRef(false);
    const isGeneratingMediaRef = useRef(false);

    // State
    const [generatedReport, setGeneratedReport] = useState('');
    const [isReportComplete, setIsReportComplete] = useState(false);
    const [reportTopic, setReportTopic] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reportType, setReportType] = useState('scientific_article');

    const [grantKeywords, setGrantKeywords] = useState('');
    const [foundGrants, setFoundGrants] = useState<Grant[]>([]);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
    const [isAnalyzingGrant, setIsAnalyzingGrant] = useState(false);
    const [grantAnalysis, setGrantAnalysis] = useState<GrantSummary | null>(null);
    const [grantAnalysisError, setGrantAnalysisError] = useState<string | null>(null);

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

    const [blogTitle, setBlogTitle] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogTone, setBlogTone] = useState('engaging');
    const [generatedBlogPost, setGeneratedBlogPost] = useState('');
    const [isBlogComplete, setIsBlogComplete] = useState(false);

    const [dailyTrends, setDailyTrends] = useState<DailyTrend[] | null>(null);
    const [isFetchingTrends, setIsFetchingTrends] = useState(false);
    const [trendsError, setTrendsError] = useState<string | null>(null);
    const [isGeneratingPost, setIsGeneratingPost] = useState(false);
    const [generatedContentPost, setGeneratedContentPost] = useState<GeneratedPost | null>(null);
    const [isAdaptingPost, setIsAdaptingPost] = useState(false);
    const [adaptedPost, setAdaptedPost] = useState<{title: string, content: string} | null>(null);

    const [wasteBotChat, setWasteBotChat] = useState<Chat | null>(null);

    const { t, language } = useLanguage();
    const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [mediaCover, setMediaCover] = useState<string | null>(null);

    const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);

    // Synchronization helper to ensure strictly sequential AI calls with a long enough delay
    const syncAiCall = async <T,>(task: () => Promise<T>): Promise<T> => {
        const result = globalAiLock.then(task);
        // Using 10 seconds delay between image generations to avoid overloading proxy
        globalAiLock = result.then(() => new Promise<void>(res => setTimeout(res, 10000))).catch(() => new Promise<void>(res => setTimeout(res, 5000)));
        return result;
    };

    const handleApiError = useCallback((err: unknown): string => {
        let message = 'An unexpected error occurred.';
        const errJson = JSON.stringify(err);
        
        if (err instanceof Error) {
            message = err.message;
        } else if (typeof err === 'string') {
            message = err;
        }

        if (errJson.includes('429') || errJson.includes('quota')) {
            setIsQuotaExhausted(true);
        }
        
        // Critical: If backend returns 500/XHR error, trip the circuit breaker momentarily
        if (errJson.includes('500') || errJson.includes('Rpc failed') || errJson.includes('xhr error')) {
            isAiServiceDown = true;
            console.error("CRITICAL AI FAILURE: Background tasks suspended.", err);
            // Auto-reset after 30 seconds
            setTimeout(() => { isAiServiceDown = false; }, 30000);
        }
        
        return message;
    }, []);

    // Initialize DB and Chatbot
    useEffect(() => {
        const init = async () => {
            try {
                await dbService.initDB();
                setIsDbReady(true);
            } catch (err) {
                setIsDbReady(true); 
            }
        };
        init();
        
        const promptLang = t('langName') || 'English';
        const chatSession = geminiService.startWasteBotChat(promptLang);
        setWasteBotChat(chatSession);
    }, [language, t]);

    // Initial load from Translation
    useEffect(() => {
        setLatestPosts(t('home.latestPosts') || []);
        setFeaturedProjects(t('home.portfolioItems') || []);
    }, [language, t]);

    // Helper to check if a URL is a stock placeholder or missing
    const isStockImage = (url: string) => !url || url.trim() === '' || url.includes('unsplash.com') || url.includes('placeholder') || url === 'missing';

    // Manual Retry logic for single items
    const handleRetryImage = async (type: 'post' | 'project' | 'media', index: number) => {
        const cacheKey = `${language}-${type}-${index}`;
        failedGenerations.delete(cacheKey);
        isAiServiceDown = false; // Reset circuit breaker on manual intent
        
        if (type === 'post') {
            const updated = [...latestPosts];
            if (!updated[index]) return;
            updated[index] = { ...updated[index], isLoadingImage: true, isGenerationFailed: false };
            setLatestPosts(updated);
            try {
                const url = await syncAiCall(() => geminiService.generateImageForPost(updated[index].title));
                await dbService.cacheImage('postImages', cacheKey, url);
                const final = [...latestPosts];
                if (final[index]) {
                  final[index] = { ...final[index], img: url, isLoadingImage: false };
                  setLatestPosts(final);
                }
            } catch (err) {
                const final = [...latestPosts];
                if (final[index]) {
                  final[index] = { ...final[index], isLoadingImage: false, isGenerationFailed: true };
                  setLatestPosts(final);
                }
                handleApiError(err);
            }
        } else if (type === 'project') {
            const updated = [...featuredProjects];
            if (!updated[index]) return;
            updated[index] = { ...updated[index], isLoadingImage: true, isGenerationFailed: false };
            setFeaturedProjects(updated);
            try {
                const url = await syncAiCall(() => geminiService.generateImageForProject(updated[index].title));
                await dbService.cacheImage('projectImages', cacheKey, url);
                const final = [...featuredProjects];
                if (final[index]) {
                  final[index] = { ...final[index], img: url, isLoadingImage: false };
                  setFeaturedProjects(final);
                }
            } catch (err) {
                const final = [...featuredProjects];
                if (final[index]) {
                  final[index] = { ...final[index], isLoadingImage: false, isGenerationFailed: true };
                  setFeaturedProjects(final);
                }
                handleApiError(err);
            }
        } else if (type === 'media') {
            setMediaCover(null); // Clear local and let effect handle
            const programTitle = t('mediaArchive.programTitle');
            try {
                const url = await syncAiCall(() => geminiService.generateImageForProject(`Cover art for ${programTitle}`));
                await dbService.cacheImage('projectImages', `${language}-media-0`, url);
                setMediaCover(url);
            } catch(e) {
                handleApiError(e);
            }
        }
    };

    // Serialized Image Generation for Posts
    useEffect(() => {
        if (!isDbReady || isAiServiceDown || isGeneratingPostsRef.current) return;
        const targetPosts = t('home.latestPosts') || [];
        if (!targetPosts.length) return;

        const processPosts = async () => {
            isGeneratingPostsRef.current = true;
            try {
                const updatedPosts = [...targetPosts];
                for (let i = 0; i < updatedPosts.length; i++) {
                    const cacheKey = `${language}-post-${i}`;
                    const cached = await dbService.getCachedImage('postImages', cacheKey).catch(() => null);
                    
                    if (cached) {
                        updatedPosts[i] = { ...updatedPosts[i], img: cached, isLoadingImage: false };
                        setLatestPosts([...updatedPosts]);
                        continue;
                    }

                    // Explicitly detect if we should replace Unsplash or empty
                    if (!isStockImage(updatedPosts[i].img)) continue;

                    if (failedGenerations.has(cacheKey) || isAiServiceDown) {
                        updatedPosts[i] = { ...updatedPosts[i], isGenerationFailed: true, isLoadingImage: false };
                        setLatestPosts([...updatedPosts]);
                        continue;
                    }

                    updatedPosts[i] = { ...updatedPosts[i], isLoadingImage: true };
                    setLatestPosts([...updatedPosts]);

                    try {
                        const imageUrl = await syncAiCall(() => geminiService.generateImageForPost(updatedPosts[i].title));
                        await dbService.cacheImage('postImages', cacheKey, imageUrl);
                        updatedPosts[i] = { ...updatedPosts[i], img: imageUrl, isLoadingImage: false };
                        setLatestPosts([...updatedPosts]);
                    } catch (err) {
                        failedGenerations.add(cacheKey);
                        updatedPosts[i] = { ...updatedPosts[i], isLoadingImage: false, isGenerationFailed: true };
                        setLatestPosts([...updatedPosts]);
                        handleApiError(err);
                        if (isAiServiceDown) break;
                    }
                }
            } finally {
                isGeneratingPostsRef.current = false;
            }
        };

        processPosts();
    }, [language, t, isDbReady, handleApiError]);
    
    // Serialized Image Generation for Projects
    useEffect(() => {
        if (!isDbReady || isAiServiceDown || isGeneratingProjectsRef.current) return;
        const targetProjects = t('home.portfolioItems') || [];
        if (!targetProjects.length) return;

        const processProjects = async () => {
            isGeneratingProjectsRef.current = true;
            try {
                const updatedProjects = [...targetProjects];
                for (let i = 0; i < updatedProjects.length; i++) {
                    const cacheKey = `${language}-project-${i}`;
                    const cached = await dbService.getCachedImage('projectImages', cacheKey).catch(() => null);
                    
                    if (cached) {
                        updatedProjects[i] = { ...updatedProjects[i], img: cached, isLoadingImage: false };
                        setFeaturedProjects([...updatedProjects]);
                        continue;
                    }

                    // Explicitly detect if we should replace Unsplash or empty
                    if (!isStockImage(updatedProjects[i].img)) continue;

                    if (failedGenerations.has(cacheKey) || isAiServiceDown) {
                        updatedProjects[i] = { ...updatedProjects[i], isGenerationFailed: true, isLoadingImage: false };
                        setFeaturedProjects([...updatedProjects]);
                        continue;
                    }

                    updatedProjects[i] = { ...updatedProjects[i], isLoadingImage: true };
                    setFeaturedProjects([...updatedProjects]);

                    try {
                        const imageUrl = await syncAiCall(() => geminiService.generateImageForProject(updatedProjects[i].title));
                        await dbService.cacheImage('projectImages', cacheKey, imageUrl);
                        updatedProjects[i] = { ...updatedProjects[i], img: imageUrl, isLoadingImage: false };
                        setFeaturedProjects([...updatedProjects]);
                    } catch (err) {
                        failedGenerations.add(cacheKey);
                        updatedProjects[i] = { ...updatedProjects[i], isLoadingImage: false, isGenerationFailed: true };
                        setFeaturedProjects([...updatedProjects]);
                        handleApiError(err);
                        if (isAiServiceDown) break;
                    }
                }
            } finally {
                isGeneratingProjectsRef.current = false;
            }
        };

        processProjects();
    }, [language, t, isDbReady, handleApiError]);

    // Handle Media Archive Cover Generation
    useEffect(() => {
        if (!isDbReady || isAiServiceDown || isGeneratingMediaRef.current) return;
        const processMedia = async () => {
            isGeneratingMediaRef.current = true;
            const cacheKey = `${language}-media-0`;
            const cached = await dbService.getCachedImage('projectImages', cacheKey).catch(() => null);
            if (cached) {
                setMediaCover(cached);
                isGeneratingMediaRef.current = false;
                return;
            }
            try {
                const programTitle = t('mediaArchive.programTitle');
                const url = await syncAiCall(() => geminiService.generateImageForProject(`Cinematic historical cover art for "${programTitle}" TV program`));
                await dbService.cacheImage('projectImages', cacheKey, url);
                setMediaCover(url);
            } catch(e) {
                handleApiError(e);
            } finally {
                isGeneratingMediaRef.current = false;
            }
        };
        processMedia();
    }, [language, t, isDbReady, handleApiError]);


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
        
        try {
            const savedData = localStorage.getItem('civicavita_saved_analyses');
            if (savedData) {
                const savedAnalyses = JSON.parse(savedData);
                if (savedAnalyses[grant.link]) {
                    setGrantAnalysis(savedAnalyses[grant.link].summary);
                    return;
                }
            }
        } catch (e) {
            console.warn("Storage check failed:", e);
        }

        setIsAnalyzingGrant(true);
        const promptLang = t('langName') || 'English';
        try {
            const userProfile = "We are a research group focused on renewable energy and sustainable materials science.";
            const analysis = await geminiService.analyzeGrant(grant, userProfile, promptLang);
            setGrantAnalysis(analysis);
        } catch(e) {
            setGrantAnalysisError(handleApiError(e));
        } finally {
            setIsAnalyzingGrant(false);
        }
    };

    const handleSearchRelated = (keywords: string) => {
        setGrantKeywords(keywords);
        handleFindGrants(keywords);
        const finderElement = document.getElementById('grant-finder');
        if (finderElement) {
            finderElement.scrollIntoView({ behavior: 'smooth' });
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
            scenesSnapshot = [...videoScenes]; 
            if (type === 'image' && typeof result === 'string') {
                scenesSnapshot[index].imageUrl = result;
            } else if (type === 'video' && Array.isArray(result)) {
                scenesSnapshot[index].videoUrls = result;
            }
            scenesSnapshot[index].isGenerating = false;
            setVideoScenes(scenesSnapshot);
        } catch(e) {
            scenesSnapshot = [...videoScenes]; 
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
            case 'home': return <HomePage setPage={setPage} latestPosts={latestPosts} featuredProjects={featuredProjects} onRetryImage={handleRetryImage} />;
            case 'projects': return <ProjectsPage projects={featuredProjects} />;
            case 'team': return <TeamPage />;
            case 'generator': return <ReportGenerator onGenerate={handleGenerateReport} generatedReport={generatedReport} isLoading={isLoading} error={error} isComplete={isReportComplete} topic={reportTopic} setTopic={setReportTopic} description={reportDescription} setDescription={setReportDescription} reportType={reportType} setReportType={setReportType} isQuotaExhausted={isQuotaExhausted} />;
            case 'grant': return (<>
                <GrantFinder onFindGrants={handleFindGrants} isLoading={isLoading} error={error} grants={foundGrants} onAnalyzeGrant={handleAnalyzeGrant} keywords={grantKeywords} setKeywords={setGrantKeywords} />
                {selectedGrant && <GrantAdopter grant={selectedGrant} isAnalyzing={isAnalyzingGrant} result={grantAnalysis} error={grantAnalysisError} onClear={() => setSelectedGrant(null)} onPrepareProposal={(grant) => { setPage('generator'); setReportTopic(`Proposal for ${grant.grantTitle}`); setReportDescription(`Based on the grant summary: ${grant.summary}`); setReportType('project_proposal'); }} onSearchRelated={handleSearchRelated} />}
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
            case 'dashboard': return <DashboardPage setPage={setPage} latestPosts={latestPosts} featuredProjects={featuredProjects} onGenerateImage={handleRetryImage} />;
            case 'media-archive': return <MediaArchivePage coverImg={mediaCover} onRetryCover={() => handleRetryImage('media', 0)} />;
            default: return <HomePage setPage={setPage} latestPosts={latestPosts} featuredProjects={featuredProjects} onRetryImage={handleRetryImage} />;
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