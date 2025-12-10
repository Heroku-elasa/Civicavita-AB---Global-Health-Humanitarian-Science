
import React, { useState } from 'react';
import { useLanguage, Grant, PlantingAnalysis, RiskItem } from '../types';
import * as geminiService from '../services/geminiService';
import Icon from './Icon';

interface TreePlanterPageProps {
    handleApiError: (err: unknown) => string;
    isQuotaExhausted: boolean;
}

const GrantItem: React.FC<{ grant: Grant }> = ({ grant }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="font-bold text-pink-400">{grant.grantTitle}</h4>
            <p className="text-sm text-gray-400">{t('grantFinder.from')} {grant.fundingBody}</p>
            <p className="text-sm text-gray-300 mt-2">{grant.summary}</p>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-700/50">
                <div className="text-xs text-gray-500">
                    <strong>{t('grantAnalyzer.deadline')}:</strong> {grant.deadline}
                </div>
                <a 
                    href={grant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 border border-slate-600 text-white text-xs font-semibold rounded-md hover:bg-slate-700/50 transition-colors inline-flex items-center"
                >
                    {t('grantFinder.viewOriginal')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                </a>
            </div>
        </div>
    );
};

const RiskItemDisplay: React.FC<{ item: RiskItem }> = ({ item }) => {
    const { t } = useLanguage();
    const getPillColor = () => {
        if (item.warningPercentage >= 66) return 'bg-red-500/20 text-red-300 ring-red-500/30';
        if (item.warningPercentage >= 33) return 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30';
        return 'bg-green-500/20 text-green-300 ring-green-500/30';
    };
    return (
        <div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-300">{t(`treePlanterPage.risks.${item.name}`)}</span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ring-1 ring-inset ${getPillColor()}`}>
                    {item.warningPercentage}%
                </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
        </div>
    );
}

const TreePlanterPage: React.FC<TreePlanterPageProps> = ({ handleApiError, isQuotaExhausted }) => {
    const { t } = useLanguage();

    // Funding state
    const [projectDesc, setProjectDesc] = useState('');
    const [isFindingGrants, setIsFindingGrants] = useState(false);
    const [foundGrants, setFoundGrants] = useState<Grant[]>([]);
    const [grantError, setGrantError] = useState<string | null>(null);

    // Analysis state
    const [location, setLocation] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<PlantingAnalysis | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isPitchCopied, setIsPitchCopied] = useState(false);

    const handleFindGrants = async () => {
        if (!projectDesc.trim()) return;
        setIsFindingGrants(true);
        setGrantError(null);
        setFoundGrants([]);
        try {
            const grants = await geminiService.findReforestationGrants(projectDesc);
            setFoundGrants(grants);
        } catch (err) {
            setGrantError(handleApiError(err));
        } finally {
            setIsFindingGrants(false);
        }
    };

    const handleAnalyzeLocation = async () => {
        if (!location.trim()) return;
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        try {
            const result = await geminiService.analyzePlantingLocation(location);
            setAnalysisResult(result);
        } catch (err) {
            setAnalysisError(handleApiError(err));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCopyPitch = () => {
        if (analysisResult?.crowdfundingPitch) {
            navigator.clipboard.writeText(analysisResult.crowdfundingPitch);
            setIsPitchCopied(true);
            setTimeout(() => setIsPitchCopied(false), 2000);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
                    {t('treePlanterPage.title')}
                </h1>
                <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t('treePlanterPage.subtitle')}</p>
            </div>

            <div className="space-y-12">
                {/* Funding Section */}
                <section className="bg-slate-900/60 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 text-white">{t('treePlanterPage.fundingTitle')}</h2>
                    <div className="space-y-4">
                        <label htmlFor="project-desc" className="block text-sm font-medium text-gray-300">{t('treePlanterPage.fundingDescriptionLabel')}</label>
                        <textarea
                            id="project-desc"
                            rows={4}
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            className="block w-full bg-slate-700/80 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
                            placeholder={t('treePlanterPage.fundingDescriptionPlaceholder')}
                        />
                        <button
                            onClick={handleFindGrants}
                            disabled={isFindingGrants || isQuotaExhausted}
                            className="w-full sm:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 hover:from-blue-700 hover:to-pink-800 disabled:bg-gray-500 transition-all"
                        >
                            {isFindingGrants ? t('grantFinder.searching') : t('treePlanterPage.fundingButton')}
                        </button>
                    </div>
                    <div className="mt-6">
                        {isFindingGrants && <div className="text-center text-gray-400 py-4">{t('grantFinder.searching')}</div>}
                        {grantError && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{grantError}</div>}
                        {foundGrants.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {foundGrants.map((grant, index) => <GrantItem key={index} grant={grant} />)}
                            </div>
                        )}
                    </div>
                </section>

                {/* Analysis Section */}
                <section className="bg-slate-900/60 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 text-white">{t('treePlanterPage.analysisTitle')}</h2>
                    <div className="space-y-4">
                         <label htmlFor="location" className="block text-sm font-medium text-gray-300">{t('treePlanterPage.analysisLocationLabel')}</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                           <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-grow bg-slate-700/80 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
                            placeholder={t('treePlanterPage.analysisLocationPlaceholder')}
                           />
                            <button
                                onClick={handleAnalyzeLocation}
                                disabled={isAnalyzing || isQuotaExhausted}
                                className="flex-shrink-0 flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 hover:from-blue-700 hover:to-pink-800 disabled:bg-gray-500 transition-all"
                            >
                                {isAnalyzing ? t('grantFinder.searching') : t('treePlanterPage.analysisButton')}
                            </button>
                        </div>
                    </div>

                     <div className="mt-8">
                        {isAnalyzing && <div className="text-center text-gray-400 py-4">{t('grantFinder.searching')}</div>}
                        {analysisError && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{analysisError}</div>}
                        {analysisResult && (
                            <div className="animate-fade-in space-y-8">
                                <h3 className="text-xl font-bold text-white text-center">{t('treePlanterPage.resultsTitle')} <span className="text-pink-400">{location}</span></h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Suitability & Vegetation */}
                                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Icon iconKey="seedling" className="w-8 h-8 text-pink-400" />
                                            <h4 className="text-lg font-semibold text-white">{t('treePlanterPage.suitabilityTitle')}</h4>
                                        </div>
                                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{analysisResult.plantingSuggestion}</p>
                                        <p className="text-sm text-gray-300 whitespace-pre-wrap pt-4 border-t border-slate-700">{analysisResult.vegetationAnalysis}</p>
                                    </div>
                                    {/* Risks */}
                                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
                                         <div className="flex items-center gap-3">
                                            <Icon iconKey="warning" className="w-8 h-8 text-pink-400" />
                                            <h4 className="text-lg font-semibold text-white">{t('treePlanterPage.risksTitle')}</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {analysisResult.riskAnalysis.map(item => <RiskItemDisplay key={item.name} item={item} />)}
                                        </div>
                                    </div>
                                    {/* Species */}
                                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                         <div className="flex items-center gap-3">
                                            <Icon iconKey="science" className="w-8 h-8 text-pink-400" />
                                            <h4 className="text-lg font-semibold text-white">{t('treePlanterPage.speciesTitle')}</h4>
                                        </div>
                                        <ul className="list-disc list-inside text-gray-300 mt-3 space-y-1 pl-2">
                                            {analysisResult.suggestedTrees.map(tree => <li key={tree}>{tree}</li>)}
                                        </ul>
                                    </div>
                                    {/* Crowdfunding */}
                                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <Icon iconKey="crowdfunding" className="w-8 h-8 text-pink-400" />
                                            <h4 className="text-lg font-semibold text-white">{t('treePlanterPage.crowdfundingTitle')}</h4>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-3 flex-grow">{analysisResult.crowdfundingPitch}</p>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={handleCopyPitch}
                                                className="flex-grow text-center text-sm bg-slate-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-slate-500 transition-colors"
                                            >
                                                {isPitchCopied ? t('grantFinder.copied') : t('treePlanterPage.copyPitch')}
                                            </button>
                                            <button className="flex-grow text-center text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-3 rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors">
                                                {t('treePlanterPage.crowdfundingButton')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TreePlanterPage;
