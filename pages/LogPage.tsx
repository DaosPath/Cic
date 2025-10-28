import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog, Symptom } from '../types.ts';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';

const moods = [
    { value: 1, emoji: '😠', label: 'Terrible' },
    { value: 2, emoji: '😔', label: 'Mal' },
    { value: 3, emoji: '😐', label: 'Normal' },
    { value: 4, emoji: '🙂', label: 'Bien' },
    { value: 5, emoji: '😊', label: 'Genial' },
];

export const LogPage: React.FC = () => {
  const { settings, refreshData } = useContext(AppContext);
  const todayStr = formatISO(startOfToday(), { representation: 'date' });
  const [log, setLog] = useState<DailyLog>({
    id: todayStr,
    date: todayStr,
    symptoms: [],
    medications: [],
  });
  const [loading, setLoading] = useState(true);

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
    // Maybe show a toast notification here
    alert('¡Registro guardado!');
  };

  const toggleSymptom = (symptomId: string) => {
    setLog(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId],
    }));
  };

  if (loading) {
    return <div className="p-4 md:p-8 pt-16 text-center">Cargando...</div>;
  }
  
  const PeriodButton: React.FC<{intensity: 0 | 1 | 2 | 3; label: string}> = ({intensity, label}) => (
    <button 
      onClick={() => setLog({...log, periodIntensity: intensity})}
      className={`w-full py-3 px-2 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
        log.periodIntensity === intensity 
          ? 'bg-gradient-to-r from-phase-menstruation to-phase-menstruation/80 text-white shadow-lg ring-2 ring-phase-menstruation/30' 
          : 'bg-brand-surface/50 hover:bg-brand-surface text-brand-text hover:shadow-md border border-brand-primary/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 pt-12 max-w-5xl mx-auto">
      {/* Header elegante */}
      <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-8 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-brand-text tracking-tight">Registro del Día</h1>
          <p className="text-lg md:text-xl text-brand-text-dim font-light">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-4 w-20 h-1 bg-gradient-to-r from-brand-primary/50 to-brand-primary mx-auto rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Menstruación, Estado de Ánimo y Síntomas */}
        <div className="space-y-8">
          {/* Period Intensity */}
          <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-2xl bg-phase-menstruation/10">
                <svg className="w-6 h-6 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-brand-text tracking-wide">Menstruación</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PeriodButton intensity={0} label="Sin sangrado" />
              <PeriodButton intensity={1} label="Ligero" />
              <PeriodButton intensity={2} label="Medio" />
              <PeriodButton intensity={3} label="Abundante" />
            </div>
          </div>
          
          {/* Mood */}
          <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-2xl bg-yellow-300/10">
                <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-brand-text tracking-wide">Estado de Ánimo</h2>
            </div>
            <div className="flex justify-between items-center px-2">
              {moods.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setLog({ ...log, mood: mood.value as any })}
                  className={`text-3xl lg:text-4xl rounded-2xl p-2 lg:p-3 transition-all duration-300 hover:scale-110 active:scale-105 ${log.mood === mood.value ? 'bg-brand-primary/40 scale-110 shadow-xl ring-2 ring-brand-primary/50' : 'hover:bg-brand-primary/10 hover:shadow-lg'}`}
                  aria-label={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Síntomas */}
          <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-2xl bg-blue-400/10">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-brand-text tracking-wide">Síntomas</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {settings.customSymptoms.map((symptom: Symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                    log.symptoms.includes(symptom.id)
                      ? 'bg-gradient-to-r from-brand-primary to-brand-primary/80 text-brand-background shadow-lg ring-2 ring-brand-primary/30'
                      : 'bg-brand-surface/50 hover:bg-brand-surface text-brand-text hover:shadow-md border border-brand-primary/10'
                  }`}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Notas */}
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-2xl bg-green-400/10">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-text tracking-wide">Notas</h2>
          </div>
          <textarea
            value={log.notes || ''}
            onChange={(e) => setLog({ ...log, notes: e.target.value })}
            className="w-full h-80 lg:h-[500px] xl:h-[600px] bg-brand-surface/30 p-4 rounded-2xl border border-brand-primary/10 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/30 outline-none transition-all duration-300 resize-none text-brand-text placeholder-brand-text-dim/50"
            placeholder="Añade cualquier nota adicional sobre tu día..."
          />
        </div>
      </div>

      {/* Botón de guardar mejorado */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSave}
          className="group bg-gradient-to-r from-brand-primary to-brand-primary/80 text-brand-background font-bold py-4 px-12 rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
        >
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar Registro
        </button>
      </div>
    </div>
  );
};