import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { getPhaseInsight } from '../services/ai.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-3.622 1.853-6.836 4.722-8.681a.75.75 0 01.819.162z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.375a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
    </svg>
)

export const PhaseInsight: React.FC = () => {
    const { currentPhase } = useContext(AppContext);
    const { t } = useTranslation();
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setLoading(true);
            const text = await getPhaseInsight(currentPhase);
            setInsight(text);
            setLoading(false);
        };
        fetchInsight();
    }, [currentPhase]);

    return (
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-8 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl w-full">
            <div className="flex items-start gap-5">
                <div className="flex-shrink-0 mt-1 p-3 rounded-2xl bg-yellow-300/10">
                    <LightbulbIcon />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-text mb-3 tracking-wide">{t('dailyTip')}</h3>
                    {loading ? (
                        <div className="space-y-3">
                            <div className="w-full h-3 bg-brand-secondary/20 rounded-full animate-pulse"></div>
                            <div className="w-11/12 h-3 bg-brand-secondary/20 rounded-full animate-pulse"></div>
                            <div className="w-4/5 h-3 bg-brand-secondary/20 rounded-full animate-pulse"></div>
                        </div>
                    ) : (
                        <p className="text-base text-brand-text/90 leading-relaxed font-light">{insight}</p>
                    )}
                     <p className="text-xs text-brand-text-dim/40 mt-4 text-right italic font-light">{t('poweredByGemini')}</p>
                </div>
            </div>
        </div>
    );
};