import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { getPhaseInsight } from '../services/ai.ts';

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-3.622 1.853-6.836 4.722-8.681a.75.75 0 01.819.162z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.375a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
    </svg>
)

export const PhaseInsight: React.FC = () => {
    const { currentPhase } = useContext(AppContext);
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
        <div className="bg-brand-surface/50 p-4 rounded-lg backdrop-blur-sm w-full max-w-sm md:max-w-md">
            <div className="flex items-start">
                <LightbulbIcon />
                <div>
                    <h3 className="text-sm font-semibold text-brand-text-dim mb-1">Consejo del día</h3>
                    {loading ? (
                        <div className="w-full h-10 bg-brand-secondary/50 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-sm text-brand-text">{insight}</p>
                    )}
                     <p className="text-xs text-brand-text-dim/50 mt-2 text-right">Powered by Gemini</p>
                </div>
            </div>
        </div>
    );
};