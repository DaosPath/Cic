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
    const { t, language } = useTranslation();
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setLoading(true);
            const text = await getPhaseInsight(currentPhase, language);
            setInsight(text);
            setLoading(false);
        };
        fetchInsight();
    }, [currentPhase, language]);

    return (
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] w-full">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-brand-accent/15 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-brand-text mb-4 tracking-wide flex items-center gap-2" style={{ lineHeight: 1.4 }}>
                        {t('dailyTip')} 💡
                    </h3>
                    {loading ? (
                        <div className="space-y-3">
                            <div className="w-full h-3 bg-brand-border/40 rounded-full animate-pulse"></div>
                            <div className="w-11/12 h-3 bg-brand-border/40 rounded-full animate-pulse"></div>
                            <div className="w-4/5 h-3 bg-brand-border/40 rounded-full animate-pulse"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm md:text-base text-brand-text/90 leading-relaxed font-light mb-4" style={{ lineHeight: 1.6 }}>{insight}</p>
                            <a href="#/insights" className="text-sm text-brand-text-dim/70 hover:text-brand-primary transition-colors duration-200 inline-flex items-center gap-1">
                                Ver más tips →
                            </a>
                        </>
                    )}
                </div>
            </div>
            <p className="text-[10px] text-brand-text-dim/40 mt-4 text-right font-light" style={{ lineHeight: 1.5 }}>{t('poweredByGemini')}</p>
        </div>
    );
};
