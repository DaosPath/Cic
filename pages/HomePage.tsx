import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { format, formatDistanceToNow } from 'date-fns';
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
    const avgCycleLength = settings.cycleLength;

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"></div>;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 gap-4 md:gap-6">
            <div className="flex flex-col items-center justify-center">
                 <CycleRing 
                    dayOfCycle={dayOfCycle} 
                    cycleLength={avgCycleLength} 
                    lutealPhaseLength={settings.lutealPhaseLength}
                 />
                 <h1 className={`text-2xl md:text-3xl font-bold capitalize mt-4 ${phaseColors[currentPhase]}`}>
                    {discrete ? "Fase Actual" : phaseTranslations[currentPhase]}
                 </h1>
            </div>

            <MoodTracker />

            <div className="w-full max-w-sm md:max-w-md">
                 <div className="flex gap-4">
                    <div className="bg-brand-surface/50 p-4 rounded-lg backdrop-blur-sm flex-1">
                        <h3 className="text-sm font-semibold text-brand-text-dim mb-1">
                            {discrete ? 'Próximo Evento' : 'Próxima Menstruación'}
                        </h3>
                        <p className="text-lg font-bold text-brand-text">
                            {predictions ? (
                                discrete ?
                                formatDistanceToNow(predictions.nextPeriod[0], { locale: es, addSuffix: true }) :
                                format(predictions.nextPeriod[0], "d 'de' MMMM", { locale: es })
                            ) : 'Calculando...'}
                        </p>
                    </div>
                     <div className="bg-brand-surface/50 p-4 rounded-lg backdrop-blur-sm flex-1">
                        <h3 className="text-sm font-semibold text-brand-text-dim mb-1">
                            {discrete ? 'Ventana Relevante' : 'Ventana Fértil'}
                        </h3>
                        <p className="text-lg font-bold text-brand-text">
                             {predictions ? (
                                discrete ?
                                formatDistanceToNow(predictions.fertileWindow[0], { locale: es, addSuffix: true }) :
                                `${format(predictions.fertileWindow[0], "d MMM", { locale: es })} - ${format(predictions.fertileWindow[1], "d MMM", { locale: es })}`
                            ) : 'Calculando...'}
                        </p>
                    </div>
                 </div>
            </div>
            
            <PhaseInsight />

             <div className="absolute bottom-24 md:bottom-6 text-center px-4">
                <p className="text-xs text-brand-text-dim">
                Esta app no ofrece diagnóstico médico; consulta a un profesional de salud para cualquier duda.
                </p>
            </div>
        </div>
    );
};