import type { DailyLog, Cycle } from '../types.ts';
import { parseISO } from 'date-fns/parseISO';
import { getEnergyLabel, getSymptomLabel } from './i18n.ts';

// Tool definitions for Gemini function calling
export const toolDefinitions = [
    {
        name: 'get_daily_log',
        description: 'Obtiene el registro completo de un día específico con todos los datos (menstruación, ánimo, energía, dolor, sueño, actividad, síntomas, notas)',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                date: {
                    type: 'STRING' as const,
                    description: 'Fecha en formato YYYY-MM-DD'
                }
            },
            required: ['date']
        }
    },
    {
        name: 'get_period_summary',
        description: 'Obtiene un resumen de los períodos menstruales en un rango de fechas (intensidad, duración, síntomas asociados)',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                days: {
                    type: 'NUMBER' as const,
                    description: 'Número de días hacia atrás desde hoy (ej: 30, 90, 180)'
                }
            },
            required: ['days']
        }
    },
    {
        name: 'get_sleep_analysis',
        description: 'Analiza los patrones de sueño (horas promedio, calidad, tendencias)',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                days: {
                    type: 'NUMBER' as const,
                    description: 'Número de días hacia atrás desde hoy'
                }
            },
            required: ['days']
        }
    },
    {
        name: 'get_pain_analysis',
        description: 'Analiza los niveles de dolor (promedio, picos, ubicaciones, correlación con fase del ciclo)',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                days: {
                    type: 'NUMBER' as const,
                    description: 'Número de días hacia atrás desde hoy'
                }
            },
            required: ['days']
        }
    },
    {
        name: 'get_symptom_frequency',
        description: 'Obtiene la frecuencia de síntomas específicos y su correlación con fases del ciclo',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                days: {
                    type: 'NUMBER' as const,
                    description: 'Número de días hacia atrás desde hoy'
                }
            },
            required: ['days']
        }
    },
    {
        name: 'get_cycle_regularity',
        description: 'Analiza la regularidad del ciclo menstrual (duración promedio, variabilidad, tendencias)',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                cycles: {
                    type: 'NUMBER' as const,
                    description: 'Número de ciclos a analizar (ej: 3, 6, 12)'
                }
            },
            required: ['cycles']
        }
    },
    {
        name: 'get_mood_energy_correlation',
        description: 'Analiza la correlación entre ánimo, energía y fase del ciclo',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                days: {
                    type: 'NUMBER' as const,
                    description: 'Número de días hacia atrás desde hoy'
                }
            },
            required: ['days']
        }
    },
    {
        name: 'get_activity_summary',
        description: 'Resume la actividad física (frecuencia, tipo, duración, intensidad)',
        parameters: {
            type: 'OBJECT' as const,
            properties: {
                days: {
                    type: 'NUMBER' as const,
                    description: 'Número de días hacia atrás desde hoy'
                }
            },
            required: ['days']
        }
    }
];

// Tool implementations
export class DataAnalyzer {
    constructor(private logs: DailyLog[], private cycles: Cycle[]) { }

    getDailyLog(date: string): string {
        const log = this.logs.find(l => l.date === date);
        if (!log) return `No hay registro para ${date}`;

        const details: string[] = [`Registro del ${date}:`];

        if (log.periodIntensity !== undefined && log.periodIntensity > 0) {
            details.push(`- Menstruación: intensidad ${log.periodIntensity}/3`);
            if (log.periodColor) details.push(`  Color: ${log.periodColor}`);
            if (log.hasClots) details.push(`  Con coágulos`);
        }

        if (log.mood !== undefined) details.push(`- Ánimo: ${log.mood}/5`);
        if (log.energyLevel) details.push(`- Energía: ${getEnergyLabel(log.energyLevel, 'es')}`);
        if (log.painLevel !== undefined && log.painLevel > 0) {
            details.push(`- Dolor: ${log.painLevel}/10`);
            if (log.painLocations) details.push(`  Ubicación: ${log.painLocations.join(', ')}`);
        }
        if (log.stressScore !== undefined) details.push(`- Estrés: ${log.stressScore}/10`);
        if (log.sleepHours !== undefined) {
            let sleep = `- Sueño: ${log.sleepHours}h`;
            if (log.sleepQuality) sleep += ` (calidad ${log.sleepQuality}/5)`;
            details.push(sleep);
        }
        if (log.waterIntake !== undefined && log.waterIntake > 0) {
            details.push(`- Hidratación: ${log.waterIntake}L`);
        }
        if (log.physicalActivity && log.physicalActivity !== 'none') {
            let activity = `- Actividad: ${log.physicalActivity}`;
            if (log.activityDuration) activity += ` (${log.activityDuration} min)`;
            details.push(activity);
        }
        if (log.symptoms && log.symptoms.length > 0) {
            const symptomList = log.symptoms.map(symptom => getSymptomLabel(symptom, 'es'));
            details.push(`- Síntomas: ${symptomList.join(', ')}`);
        }
        if (log.notes) details.push(`- Notas: "${log.notes}"`);

        return details.join('\n');
    }

    getPeriodSummary(days: number): string {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const periodLogs = this.logs.filter(l => {
            const logDate = parseISO(l.date);
            return logDate >= cutoffDate && l.periodIntensity && l.periodIntensity > 0;
        });

        if (periodLogs.length === 0) {
            return `No hay registros de menstruación en los últimos ${days} días`;
        }

        const avgIntensity = periodLogs.reduce((sum, l) => sum + (l.periodIntensity || 0), 0) / periodLogs.length;
        const daysWithPeriod = periodLogs.length;

        // Count symptoms during period
        const symptomCounts: Record<string, number> = {};
        periodLogs.forEach(log => {
            log.symptoms?.forEach(s => {
                symptomCounts[s] = (symptomCounts[s] || 0) + 1;
            });
        });

        const topSymptoms = Object.entries(symptomCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([s, c]) => `${s} (${c} veces)`);

        return `Resumen de menstruación (últimos ${days} días):
- Días con menstruación: ${daysWithPeriod}
- Intensidad promedio: ${avgIntensity.toFixed(1)}/3
- Síntomas más frecuentes: ${topSymptoms.join(', ') || 'ninguno'}`;
    }

    getSleepAnalysis(days: number): string {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const sleepLogs = this.logs.filter(l => {
            const logDate = parseISO(l.date);
            return logDate >= cutoffDate && l.sleepHours !== undefined;
        });

        if (sleepLogs.length === 0) {
            return `No hay datos de sueño en los últimos ${days} días`;
        }

        const avgHours = sleepLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / sleepLogs.length;
        const qualityLogs = sleepLogs.filter(l => l.sleepQuality !== undefined);
        const avgQuality = qualityLogs.length > 0
            ? qualityLogs.reduce((sum, l) => sum + (l.sleepQuality || 0), 0) / qualityLogs.length
            : 0;

        const poorSleepDays = sleepLogs.filter(l => (l.sleepHours || 0) < 6).length;

        return `Análisis de sueño (últimos ${days} días):
- Promedio: ${avgHours.toFixed(1)} horas/noche
- Calidad promedio: ${avgQuality.toFixed(1)}/5
- Días con sueño insuficiente (<6h): ${poorSleepDays}
- Días registrados: ${sleepLogs.length}/${days}`;
    }

    getPainAnalysis(days: number): string {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const painLogs = this.logs.filter(l => {
            const logDate = parseISO(l.date);
            return logDate >= cutoffDate && l.painLevel !== undefined && l.painLevel > 0;
        });

        if (painLogs.length === 0) {
            return `No hay registros de dolor en los últimos ${days} días`;
        }

        const avgPain = painLogs.reduce((sum, l) => sum + (l.painLevel || 0), 0) / painLogs.length;
        const maxPain = Math.max(...painLogs.map(l => l.painLevel || 0));
        const highPainDays = painLogs.filter(l => (l.painLevel || 0) >= 7).length;

        // Pain locations
        const locations: Record<string, number> = {};
        painLogs.forEach(log => {
            log.painLocations?.forEach(loc => {
                locations[loc] = (locations[loc] || 0) + 1;
            });
        });
        const topLocations = Object.entries(locations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([loc, count]) => `${loc} (${count})`);

        return `Análisis de dolor (últimos ${days} días):
- Días con dolor: ${painLogs.length}
- Nivel promedio: ${avgPain.toFixed(1)}/10
- Nivel máximo: ${maxPain}/10
- Días con dolor alto (≥7): ${highPainDays}
- Ubicaciones más frecuentes: ${topLocations.join(', ') || 'no especificadas'}`;
    }

    getSymptomFrequency(days: number): string {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const recentLogs = this.logs.filter(l => {
            const logDate = parseISO(l.date);
            return logDate >= cutoffDate;
        });

        const symptomCounts: Record<string, number> = {};
        recentLogs.forEach(log => {
            log.symptoms?.forEach(s => {
                symptomCounts[s] = (symptomCounts[s] || 0) + 1;
            });
        });

        const topSymptoms = Object.entries(symptomCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([s, c]) => `- ${s}: ${c} veces (${((c / recentLogs.length) * 100).toFixed(0)}%)`);

        if (topSymptoms.length === 0) {
            return `No hay síntomas registrados en los últimos ${days} días`;
        }

        return `Frecuencia de síntomas (últimos ${days} días):
${topSymptoms.join('\n')}`;
    }

    getCycleRegularity(numCycles: number): string {
        const recentCycles = this.cycles
            .filter(c => c.length && c.length >= 21 && c.length <= 45)
            .slice(-numCycles);

        if (recentCycles.length < 2) {
            return `No hay suficientes ciclos completos para analizar (mínimo 2)`;
        }

        const lengths = recentCycles.map(c => c.length!);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

        // Calculate standard deviation
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
        const stdDev = Math.sqrt(variance);

        const regularity = stdDev < 3 ? 'muy regular' : stdDev < 5 ? 'regular' : stdDev < 7 ? 'algo irregular' : 'irregular';

        return `Análisis de regularidad (últimos ${recentCycles.length} ciclos):
- Duración promedio: ${avgLength.toFixed(1)} días
- Variabilidad: ±${stdDev.toFixed(1)} días
- Regularidad: ${regularity}
- Rango: ${Math.min(...lengths)}-${Math.max(...lengths)} días`;
    }

    getMoodEnergyCorrelation(days: number): string {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const recentLogs = this.logs.filter(l => {
            const logDate = parseISO(l.date);
            return logDate >= cutoffDate && l.mood !== undefined && l.energyLevel !== undefined;
        });

        if (recentLogs.length === 0) {
            return `No hay suficientes datos de ánimo y energía en los últimos ${days} días`;
        }

        const avgMood = recentLogs.reduce((sum, l) => sum + (l.mood || 0), 0) / recentLogs.length;

        const energyDist = {
            low: recentLogs.filter(l => l.energyLevel === 'low').length,
            medium: recentLogs.filter(l => l.energyLevel === 'medium').length,
            high: recentLogs.filter(l => l.energyLevel === 'high').length
        };

        const lowMoodDays = recentLogs.filter(l => (l.mood || 0) <= 2).length;
        const highMoodDays = recentLogs.filter(l => (l.mood || 0) >= 4).length;

        return `Análisis de ánimo y energía (últimos ${days} días):
- Ánimo promedio: ${avgMood.toFixed(1)}/5
- Días con ánimo bajo (≤2): ${lowMoodDays}
- Días con ánimo alto (≥4): ${highMoodDays}
- Distribución de energía:
  * Baja: ${energyDist.low} días
  * Media: ${energyDist.medium} días
  * Alta: ${energyDist.high} días`;
    }

    getActivitySummary(days: number): string {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const activityLogs = this.logs.filter(l => {
            const logDate = parseISO(l.date);
            return logDate >= cutoffDate && l.physicalActivity && l.physicalActivity !== 'none';
        });

        if (activityLogs.length === 0) {
            return `No hay actividad física registrada en los últimos ${days} días`;
        }

        const totalMinutes = activityLogs.reduce((sum, l) => sum + (l.activityDuration || 0), 0);
        const avgMinutes = totalMinutes / activityLogs.length;

        const intensityDist = {
            light: activityLogs.filter(l => l.physicalActivity === 'light').length,
            moderate: activityLogs.filter(l => l.physicalActivity === 'moderate').length,
            intense: activityLogs.filter(l => l.physicalActivity === 'intense').length
        };

        return `Resumen de actividad física (últimos ${days} días):
- Días activos: ${activityLogs.length}/${days} (${((activityLogs.length / days) * 100).toFixed(0)}%)
- Duración promedio: ${avgMinutes.toFixed(0)} min/sesión
- Total: ${totalMinutes} minutos
- Distribución por intensidad:
  * Ligera: ${intensityDist.light} días
  * Moderada: ${intensityDist.moderate} días
  * Intensa: ${intensityDist.intense} días`;
    }

    executeTool(toolName: string, params: any): string {
        switch (toolName) {
            case 'get_daily_log':
                return this.getDailyLog(params.date);
            case 'get_period_summary':
                return this.getPeriodSummary(params.days);
            case 'get_sleep_analysis':
                return this.getSleepAnalysis(params.days);
            case 'get_pain_analysis':
                return this.getPainAnalysis(params.days);
            case 'get_symptom_frequency':
                return this.getSymptomFrequency(params.days);
            case 'get_cycle_regularity':
                return this.getCycleRegularity(params.cycles);
            case 'get_mood_energy_correlation':
                return this.getMoodEnergyCorrelation(params.days);
            case 'get_activity_summary':
                return this.getActivitySummary(params.days);
            default:
                return `Herramienta desconocida: ${toolName}`;
        }
    }
}
