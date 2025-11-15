import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog, Symptom } from '../types.ts';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import type { Translations } from '../services/i18n.ts';
import { AILogModal } from '../components/AILogModal.tsx';
import {
    ChipSelector,
    SingleSelector,
    ScaleSlider,
    NumberInput,
    TimeInput,
    ToggleSwitch,
    CollapsibleSection,
    ChipSelectorWithCustom
} from '../components/LogFieldComponents.tsx';
import {
    MenstruationSection,
    FertilitySection,
    PainSection,
    MentalSection,
    SleepSection,
    ActivitySection,
    MedicationSection,
    HealthSection
} from '../components/LogSections.tsx';

const moodEmojis = [
    { value: 1, emoji: '😣' },
    { value: 2, emoji: '😔' },
    { value: 3, emoji: '😐' },
    { value: 4, emoji: '🙂' },
    { value: 5, emoji: '🤩' },
] as const;

const moodKeys: Array<keyof Translations> = ['terrible', 'bad', 'normal', 'good', 'great'];

const intlLocales = {
    es: 'es-ES',
    en: 'en-US',
    tr: 'tr-TR',
} as const;

export const LogPage: React.FC = () => {
    const { settings, refreshData } = useContext(AppContext);
    const { t, language, translateSymptomId } = useTranslation();
    const todayStr = formatISO(startOfToday(), { representation: 'date' });
    const [log, setLog] = useState<DailyLog>({
        id: todayStr,
        date: todayStr,
        symptoms: [],
        medications: [],
        periodProducts: [],
        activityType: [],
        supplements: [],
        homeRemedies: [],
        cravings: [],
        stressTriggers: [],
    });
    const [loading, setLoading] = useState(true);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    
    // Collapsible sections state
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        menstruation: true,
        fertility: false,
        pain: false,
        symptoms: true,
        mental: false,
        sleep: false,
        activity: false,
        medication: false,
        health: false,
        context: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const intlLocale = intlLocales[language] ?? 'es-ES';

    useEffect(() => {
        const fetchLog = async () => {
            setLoading(true);
            const existingLog = await getLog(todayStr);
            if (existingLog) {
                setLog(existingLog);
            }
            setLoading(false);
        };
        fetchLog();
    }, [todayStr]);

    const handleSave = async () => {
        await upsertLog(log);
        await refreshData();
        alert(t('logSaved'));
    };

    const toggleSymptom = (symptomId: string) => {
        setLog(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptomId)
                ? prev.symptoms.filter(id => id !== symptomId)
                : [...prev.symptoms, symptomId],
        }));
    };

      const handleAISuggestions = (suggestions: Partial<DailyLog>) => {
        setLog(prev => ({
            ...prev,
            ...suggestions,
            id: prev.id,
            date: prev.date,
            symptoms: suggestions.symptoms || prev.symptoms,
            medications: suggestions.medications || prev.medications,
            periodProducts: suggestions.periodProducts || prev.periodProducts || [],
            activityType: suggestions.activityType || prev.activityType || [],
            supplements: suggestions.supplements || prev.supplements || [],
            homeRemedies: suggestions.homeRemedies || prev.homeRemedies || [],
            cravings: suggestions.cravings || prev.cravings || [],
            stressTriggers: suggestions.stressTriggers || prev.stressTriggers || [],
        }));
    };

    if (loading) {
        return <div className="p-4 md:p-8 pt-16 text-center">{t('loading')}</div>;
    }

    const formattedDate = new Intl.DateTimeFormat(intlLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    const PeriodButton: React.FC<{ intensity: 0 | 1 | 2 | 3; label: string }> = ({ intensity, label }) => (
        <button
            onClick={() => setLog({ ...log, periodIntensity: intensity })}
            className={`w-full py-2.5 px-3 rounded-[18px] text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                log.periodIntensity === intensity
                    ? 'bg-phase-menstruation/20 text-phase-menstruation border border-phase-menstruation shadow-sm'
                    : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50 hover:border-phase-menstruation/30'
            }`}
            style={{ fontWeight: 500, lineHeight: 1.45 }}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen px-4 md:px-8 pt-12 pb-24 md:pb-12">
            <div className="max-w-[1140px] mx-auto">
                {/* Header mejorado con mejor contraste */}
                <div 
                    className="relative p-6 md:p-8 rounded-[18px] border shadow-[0_8px_24px_rgba(0,0,0,0.35)] mb-6 md:mb-8 overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(20, 20, 20, 0.9) 50%, rgba(10, 10, 10, 0.95) 100%)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    {/* Gradiente decorativo de fondo */}
                    <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at top right, var(--brand-primary) 0%, transparent 50%), radial-gradient(circle at bottom left, var(--brand-accent) 0%, transparent 50%)'
                        }}
                    />
                    
                    <div className="relative text-center">
                        <h1 
                            className="text-3xl md:text-4xl font-bold mb-2 tracking-tight"
                            style={{ 
                                fontWeight: 700, 
                                lineHeight: 1.45,
                                color: 'rgba(255, 255, 255, 0.95)',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {t('dailyRecord')}
                        </h1>
                        <p 
                            className="text-base md:text-lg font-medium"
                            style={{ 
                                fontWeight: 500, 
                                lineHeight: 1.45,
                                color: 'rgba(255, 255, 255, 0.7)'
                            }}
                        >
                            {formattedDate}
                        </p>
                        <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent mx-auto rounded-full shadow-lg"></div>
                        
                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                            {/* AI Registration Button - Mejorado */}
                            <button
                                onClick={() => setIsAIModalOpen(true)}
                                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                                style={{ 
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)',
                                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                                }}
                            >
                                {/* Brillo animado en hover */}
                                <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.2) 100%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 2s infinite'
                                    }}
                                />
                                
                                {/* Icono con animación */}
                                <svg 
                                    className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                
                                <span 
                                    className="relative z-10"
                                    style={{ 
                                        color: 'rgba(255, 255, 255, 0.95)',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    {t('chatWithAI')}
                                </span>
                                
                                {/* Partículas decorativas */}
                                <div className="absolute top-1 right-2 w-1 h-1 bg-white/40 rounded-full group-hover:animate-ping" />
                                <div className="absolute bottom-2 left-3 w-1 h-1 bg-white/30 rounded-full group-hover:animate-ping" style={{ animationDelay: '0.2s' }} />
                            </button>

                            {/* Mode Toggle - Mejorado */}
                            <div 
                                className="flex rounded-xl p-1"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <button
                                    onClick={() => setIsAdvancedMode(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        !isAdvancedMode
                                            ? 'shadow-lg'
                                            : 'hover:bg-white/5'
                                    }`}
                                    style={{ 
                                        fontWeight: 500,
                                        background: !isAdvancedMode ? 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))' : 'transparent',
                                        color: !isAdvancedMode ? 'white' : 'rgba(255, 255, 255, 0.6)'
                                    }}
                                >
                                    <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    {t('simplifiedMode')}
                                </button>
                                <button
                                    onClick={() => setIsAdvancedMode(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isAdvancedMode
                                            ? 'shadow-lg'
                                            : 'hover:bg-white/5'
                                    }`}
                                    style={{ 
                                        fontWeight: 500,
                                        background: isAdvancedMode ? 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))' : 'transparent',
                                        color: isAdvancedMode ? 'white' : 'rgba(255, 255, 255, 0.6)'
                                    }}
                                >
                                    <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    {t('advancedMode')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Simplified Mode - Original Design */}
            {!isAdvancedMode && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    <div className="lg:col-span-5 space-y-6">
                        {/* Menstruation */}
                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-xl bg-phase-menstruation/15">
                                    <svg className="w-5 h-5 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('menstruationIntensity')}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <PeriodButton intensity={0} label={t('noFlow')} />
                                <PeriodButton intensity={1} label={t('light')} />
                                <PeriodButton intensity={2} label={t('medium')} />
                                <PeriodButton intensity={3} label={t('heavy')} />
                            </div>
                        </div>

                        {/* Mood */}
                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-xl bg-brand-accent/15">
                                    <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('mood')}</h2>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                {moodEmojis.map(({ value, emoji }) => (
                                    <button
                                        key={value}
                                        onClick={() => setLog({ ...log, mood: value as DailyLog['mood'] })}
                                        className={`text-[32px] md:text-[36px] rounded-xl p-2 md:p-2.5 transition-all duration-200 hover:scale-105 active:scale-100 ${log.mood === value ? 'bg-brand-primary/20 scale-105 shadow-lg ring-2 ring-brand-primary/50' : 'hover:bg-brand-surface/50'}`}
                                        aria-label={`${t('mood')}: ${t(moodKeys[value - 1])}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-xl bg-brand-primary/15">
                                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('symptoms')}</h2>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {settings.customSymptoms.map((symptom: Symptom) => (
                                    <button
                                        key={symptom.id}
                                        onClick={() => toggleSymptom(symptom.id)}
                                        className={`px-4 py-2.5 rounded-[18px] text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                                            log.symptoms.includes(symptom.id)
                                                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary shadow-sm'
                                                : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50 hover:border-brand-primary/30'
                                        }`}
                                        style={{ fontWeight: 500, lineHeight: 1.45 }}
                                    >
                                        {translateSymptomId(symptom.id)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notes Column */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-xl bg-brand-positive/15">
                                    <svg className="w-5 h-5 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('notes')}</h2>
                            </div>
                            <textarea
                                value={log.notes || ''}
                                onChange={(e) => setLog({ ...log, notes: e.target.value })}
                                className="w-full flex-1 min-h-[320px] lg:min-h-0 bg-brand-surface p-4 md:p-5 rounded-[18px] border border-brand-border hover:bg-brand-surface-2 focus:border-brand-primary outline-none transition-all duration-200 resize-none text-brand-text font-normal"
                                placeholder={t('addAnyAdditionalNotes')}
                                style={{ 
                                    fontWeight: 400, 
                                    lineHeight: 1.6,
                                    boxShadow: 'none',
                                    WebkitBoxShadow: 'none'
                                }}
                            />
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleSave}
                                    className="group bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold py-3 px-10 rounded-full shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5"
                                    style={{ fontWeight: 600 }}
                                >
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('saveRecord')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Mode - Collapsible Sections */}
            {isAdvancedMode && (
                <div className="space-y-6">
                {/* Menstruation */}
                <MenstruationSection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Mood - Keep original for now */}
                <CollapsibleSection
                    title={t('mood')}
                    icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    isOpen={openSections.symptoms}
                    onToggle={() => toggleSection('symptoms')}
                >
                    <div className="flex justify-between items-center gap-2">
                        {moodEmojis.map(({ value, emoji }) => (
                            <button
                                key={value}
                                onClick={() => setLog({ ...log, mood: value as DailyLog['mood'] })}
                                className={`text-[32px] md:text-[36px] rounded-xl p-2 md:p-2.5 transition-all duration-200 hover:scale-105 active:scale-100 ${log.mood === value ? 'bg-brand-primary/20 scale-105 shadow-lg ring-2 ring-brand-primary/50' : 'hover:bg-brand-surface/50'}`}
                                aria-label={`${t('mood')}: ${t(moodKeys[value - 1])}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </CollapsibleSection>

                {/* Symptoms */}
                <CollapsibleSection
                    title={t('symptoms')}
                    icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    isOpen={openSections.symptoms}
                    onToggle={() => toggleSection('symptoms')}
                >
                    <div className="flex flex-wrap gap-2.5">
                        {settings.customSymptoms.map((symptom: Symptom) => (
                            <button
                                key={symptom.id}
                                onClick={() => toggleSymptom(symptom.id)}
                                className={`px-4 py-2.5 rounded-[18px] text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                                    log.symptoms.includes(symptom.id)
                                        ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary shadow-sm'
                                        : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50 hover:border-brand-primary/30'
                                }`}
                                style={{ fontWeight: 500, lineHeight: 1.45 }}
                            >
                                {symptom.name}
                            </button>
                        ))}
                    </div>
                </CollapsibleSection>

                {/* Fertility */}
                <FertilitySection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Pain */}
                <PainSection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Mental State */}
                <MentalSection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Sleep & Habits */}
                <SleepSection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Physical Activity */}
                <ActivitySection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Medication & Care */}
                <MedicationSection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Health & Tests */}
                <HealthSection log={log} setLog={setLog} openSections={openSections} toggleSection={toggleSection} />

                {/* Notes */}
                <CollapsibleSection
                    title={t('notes')}
                    icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                    isOpen={true}
                    onToggle={() => {}}
                >
                    <textarea
                        value={log.notes || ''}
                        onChange={(e) => setLog({ ...log, notes: e.target.value })}
                        className="w-full min-h-[200px] bg-brand-surface p-4 rounded-xl border border-brand-border hover:bg-brand-surface-2 focus:border-brand-primary outline-none transition-all duration-200 resize-none text-brand-text font-normal"
                        placeholder={t('addAnyAdditionalNotes')}
                        style={{ 
                            fontWeight: 400, 
                            lineHeight: 1.6,
                            boxShadow: 'none',
                            WebkitBoxShadow: 'none'
                        }}
                    />
                </CollapsibleSection>

                    {/* Save Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleSave}
                            className="group bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold py-3 px-10 rounded-full shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5"
                            style={{ fontWeight: 600 }}
                        >
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t('saveRecord')}
                        </button>
                    </div>

                </div>
            )}
            </div>

            {/* AI Log Modal */}
            <AILogModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onApply={handleAISuggestions}
                currentDate={todayStr}
            />
        </div>
    );
};
