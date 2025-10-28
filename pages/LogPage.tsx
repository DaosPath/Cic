import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog, Symptom } from '../types.ts';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import formatISO from 'date-fns/formatISO';
import startOfToday from 'date-fns/startOfToday';
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
        className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${log.periodIntensity === intensity ? 'bg-phase-menstruation text-white' : 'bg-brand-surface hover:bg-brand-secondary'}`}
      >
          {label}
      </button>
  );

  return (
    <div className="p-4 md:p-8 pt-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-brand-text">Registro del Día</h1>
      <p className="text-brand-text-dim mb-8">Hoy es {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div className="space-y-8">
            {/* Period Intensity */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-brand-primary">Menstruación</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <PeriodButton intensity={0} label="Sin sangrado" />
                  <PeriodButton intensity={1} label="Ligero" />
                  <PeriodButton intensity={2} label="Medio" />
                  <PeriodButton intensity={3} label="Abundante" />
              </div>
            </div>
            
            {/* Mood */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-brand-primary">Estado de Ánimo</h2>
              <div className="flex justify-around items-center bg-brand-surface p-2 rounded-lg">
                {moods.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => setLog({ ...log, mood: mood.value as any })}
                        className={`text-3xl rounded-full p-2 transition-transform duration-200 hover:scale-125 ${log.mood === mood.value ? 'bg-brand-primary/20 scale-125' : ''}`}
                        aria-label={mood.label}
                    >
                        {mood.emoji}
                    </button>
                ))}
              </div>
            </div>


            {/* Symptoms */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-brand-primary">Síntomas</h2>
              <div className="flex flex-wrap gap-2">
                {settings.customSymptoms.map((symptom: Symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      log.symptoms.includes(symptom.id)
                        ? 'bg-brand-primary text-brand-background'
                        : 'bg-brand-surface hover:bg-brand-secondary text-brand-text'
                    }`}
                  >
                    {symptom.name}
                  </button>
                ))}
              </div>
            </div>
        </div>
        
        <div className="mt-8 md:mt-0">
          <h2 className="text-lg font-semibold mb-3 text-brand-primary">Notas</h2>
          <textarea
            value={log.notes || ''}
            onChange={(e) => setLog({ ...log, notes: e.target.value })}
            rows={8}
            className="w-full h-full bg-brand-surface p-3 rounded-lg border border-brand-secondary/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
            placeholder="Añade cualquier nota adicional aquí..."
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-brand-primary text-brand-background font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform duration-200 z-40 md:relative md:bottom-auto md:left-auto md:translate-x-0 md:w-full md:max-w-none md:mt-8"
      >
        Guardar Registro
      </button>
    </div>
  );
};