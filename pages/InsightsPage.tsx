import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext.tsx';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import type { Cycle, Symptom } from '../types.ts';

const getSymptomName = (id: string, symptoms: Symptom[]): string => {
    const symptom = symptoms.find(s => s.id === id);
    return symptom ? symptom.name : 'Síntoma desconocido';
};

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-brand-secondary'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const CycleLengthChart: React.FC<{ cycles: Cycle[] }> = ({ cycles }) => {
    const chartData = cycles
        .map(c => c.length || 0)
        .filter(len => len > 0 && len < 60) // Filter outliers
        .slice(0, 10)
        .reverse();

    if (chartData.length < 2) return null;

    const maxLen = Math.max(...chartData, 35);
    const minLen = Math.min(...chartData, 21);
    const chartHeight = 150;
    const chartWidth = 300; 
    const barWidth = chartWidth / chartData.length;

    return (
        <div className="bg-brand-surface/50 p-4 rounded-lg backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-brand-primary mb-4">Variación de Duración del Ciclo</h2>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" aria-label="Gráfico de duración de los últimos ciclos">
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c8a2c8" />
                        <stop offset="100%" stopColor="#5a5a6a" />
                    </linearGradient>
                </defs>
                {chartData.map((len, index) => {
                    const range = (maxLen - minLen);
                    const heightRatio = range > 0 ? (len - minLen) / range : 0.5;
                    const barHeight = Math.max(10, heightRatio * (chartHeight - 20) + 10);
                    const x = index * barWidth;
                    return (
                        <g key={index}>
                            <rect
                                x={x + barWidth * 0.15}
                                y={chartHeight - barHeight}
                                width={barWidth * 0.7}
                                height={barHeight}
                                fill="url(#gradient)"
                                rx="2"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={chartHeight - barHeight - 5}
                                textAnchor="middle"
                                fontSize="10"
                                className="fill-current text-brand-text font-semibold"
                            >
                                {len}d
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};


export const InsightsPage: React.FC = () => {
    const { cycles, logs, settings, toggleFavoriteSymptom } = useContext(AppContext);

    const globalSymptomFrequencies = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            log.symptoms.forEach(symptomId => {
                counts[symptomId] = (counts[symptomId] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([id, count]) => ({ id, name: getSymptomName(id, settings.customSymptoms), count }))
            .sort((a, b) => b.count - a.count);
    }, [logs, settings.customSymptoms]);
    
    const favoriteSymptoms = useMemo(() => {
       return (settings.favoriteSymptomIds || [])
            .map(id => settings.customSymptoms.find(s => s.id === id))
            .filter((s): s is Symptom => !!s);
    }, [settings.favoriteSymptomIds, settings.customSymptoms]);


    if (cycles.length < 2) {
        return (
            <div className="p-4 md:p-8 pt-10 max-w-lg mx-auto text-center flex flex-col justify-center h-full">
                <h1 className="text-3xl font-bold mb-6 text-brand-text">Análisis de Ciclos</h1>
                <p className="text-brand-text-dim">
                    No hay suficientes datos para mostrar un análisis detallado.
                    Sigue registrando tus ciclos y síntomas para descubrir patrones.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 pt-10 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-brand-text">Análisis de Ciclos</h1>

            {/* Favorites Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-brand-primary mb-3">Mis Favoritos</h2>
                {favoriteSymptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {favoriteSymptoms.map(symptom => (
                            <div key={symptom.id} className="bg-brand-surface p-3 rounded-lg flex items-center gap-2 border border-yellow-400/50">
                                <StarIcon filled={true} />
                                <span className="font-semibold">{symptom.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-brand-text-dim text-sm">Marca tus síntomas más importantes con una estrella para verlos aquí.</p>
                )}
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8">
                {/* Left Column: Chart & Cycle History */}
                <div className="space-y-8 mb-8 md:mb-0">
                    <CycleLengthChart cycles={cycles} />
                    
                    <div>
                         <h2 className="text-xl font-semibold text-brand-primary mb-3">Historial de Ciclos</h2>
                         <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {cycles.map((cycle, index) => (
                                <div key={cycle.id} className="bg-brand-surface/50 p-4 rounded-lg backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-bold text-brand-primary">
                                            {index === 0 ? "Ciclo Actual" : `Ciclo Anterior`}
                                        </h3>
                                        {cycle.length && <span className="text-md font-semibold text-brand-text">{cycle.length} días</span>}
                                    </div>
                                    <p className="text-sm text-brand-text-dim">
                                        {format(parseISO(cycle.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Global Symptom Analysis */}
                <div>
                    <h2 className="text-xl font-semibold text-brand-primary mb-3">Análisis Global de Síntomas</h2>
                     <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-2">
                        {globalSymptomFrequencies.map(symptom => (
                            <div key={symptom.id} className="bg-brand-surface/50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-brand-text">{symptom.name}</p>
                                    <p className="text-xs text-brand-text-dim">Registrado {symptom.count} vece{symptom.count > 1 ? 's' : ''}</p>
                                </div>
                                <button onClick={() => toggleFavoriteSymptom(symptom.id)} className="p-2 rounded-full hover:bg-brand-secondary/50 transition-colors">
                                    <StarIcon filled={(settings.favoriteSymptomIds || []).includes(symptom.id)} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};