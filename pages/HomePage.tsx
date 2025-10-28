import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import { format } from 'date-fns/format';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale/es';
import { CycleRing } from '../components/CycleRing.tsx';
import { MoodTracker } from '../components/MoodTracker.tsx';
import { PhaseInsight } from '../components/PhaseInsight.tsx';

const phaseTranslations: Record<string, string> = {
    menstruation: "Menstruación",
    follicular: "Fase Folicular",
    ovulation: "Ovulación",
    luteal: "Fase Lútea"
};

const phaseColors: Record<string, string> = {
    menstruation: "text-phase-menstruation",
    follicular: "text-phase-follicular",
    ovulation: "text-phase-ovulation",
    luteal: "text-phase-luteal"
};

export const HomePage: React.FC = () => {
    const { currentPhase, dayOfCycle, predictions, settings, isLoading } = useContext(AppContext);

    const discrete = settings.discreteMode;

    // FIX: Add a separate options object for formatDistanceToNow to bypass strict object literal type checking issue with 'locale'.
    const distanceOptions = { locale: es, addSuffix: true };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"></div>;
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start text-center p-4 md:p-8 gap-8 md:gap-10 pt-12 md:pt-16">
            {/* Hero Section - Cycle Ring */}
            <div className="flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center mb-8 group">
                    <CycleRing phase={currentPhase} />
                    <div className="absolute z-10 text-center pointer-events-none">
                        <span className="text-7xl md:text-8xl font-extrabold text-brand-text drop-shadow-2xl tracking-tight">{dayOfCycle > 0 ? dayOfCycle : '...'}</span>
                        <p className="text-lg md:text-xl text-brand-text-dim mt-2 font-light tracking-wide">{dayOfCycle > 0 ? 'Día del ciclo' : 'Calculando'}</p>
                    </div>
                </div>
                <div className="relative">
                    <h1 className={`text-4xl md:text-5xl font-bold capitalize ${phaseColors[currentPhase]} drop-shadow-lg transition-all duration-700 tracking-tight`}>
                        {discrete ? "Fase Actual" : phaseTranslations[currentPhase]}
                    </h1>
                    <div className={`absolute -bottom-2 left-0 right-0 h-1 ${phaseColors[currentPhase]} opacity-30 blur-sm`}></div>
                </div>
            </div>

            {/* Mood Tracker */}
            <div className="w-full max-w-lg md:max-w-xl animate-slide-up">
                <MoodTracker />
            </div>

            {/* Predictions Cards */}
            <div className="w-full max-w-lg md:max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:border-phase-menstruation/40 transition-all duration-300">
                        <div className="flex items-center justify-center mb-3">
                            <div className="p-2 rounded-full bg-phase-menstruation/10 group-hover:bg-phase-menstruation/20 transition-colors duration-300">
                                <svg className="w-5 h-5 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-brand-text-dim uppercase tracking-widest mb-3 text-center">
                            {discrete ? 'Próximo Evento' : 'Próxima Menstruación'}
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-brand-text text-center">
                            {predictions ? (
                                discrete ?
                                    formatDistanceToNow(predictions.nextPeriod[0], distanceOptions) :
                                    format(predictions.nextPeriod[0], "d 'de' MMMM", { locale: es })
                            ) : 'Calculando...'}
                        </p>
                    </div>
                    <div className="group bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:border-phase-ovulation/40 transition-all duration-300">
                        <div className="flex items-center justify-center mb-3">
                            <div className="p-2 rounded-full bg-phase-ovulation/10 group-hover:bg-phase-ovulation/20 transition-colors duration-300">
                                <svg className="w-5 h-5 text-phase-ovulation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-brand-text-dim uppercase tracking-widest mb-3 text-center">
                            {discrete ? 'Ventana Relevante' : 'Ventana Fértil'}
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-brand-text text-center">
                            {predictions ? (
                                discrete ?
                                    formatDistanceToNow(predictions.fertileWindow[0], distanceOptions) :
                                    `${format(predictions.fertileWindow[0], "d MMM", { locale: es })} - ${format(predictions.fertileWindow[1], "d MMM", { locale: es })}`
                            ) : 'Calculando...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Phase Insight */}
            <div className="w-full max-w-lg md:max-w-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <PhaseInsight />
            </div>

            {/* Disclaimer */}
            <div className="mt-auto pt-12 pb-24 md:pb-10 text-center px-6 max-w-2xl">
                <p className="text-xs text-brand-text-dim/60 leading-relaxed font-light">
                    Esta app no ofrece diagnóstico médico; consulta a un profesional de salud para cualquier duda.
                </p>
            </div>
        </div>
    );
};