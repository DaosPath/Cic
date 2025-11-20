import React, { useState } from 'react';
import type { DailyLog } from '../types.ts';
import { parseLogDescription, startVoiceRecognition, type AILogSuggestion } from '../services/ai-log-parser.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

interface AILogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (suggestions: Partial<DailyLog>) => void;
  currentDate: string;
}

type Step = 'input' | 'review';

export const AILogModal: React.FC<AILogModalProps> = ({ isOpen, onClose, onApply }) => {
  const [step, setStep] = useState<Step>('input');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AILogSuggestion | null>(null);
  const [stopRecording, setStopRecording] = useState<(() => void) | null>(null);
  const { translateSymptomId, language, t } = useTranslation();

  const cardClasses = 'bg-brand-surface-2 rounded-xl p-4';
  const highlightCard = 'bg-brand-surface-3 rounded-xl p-4';

  if (!isOpen) return null;

  const handleVoiceInput = () => {
    if (isRecording && stopRecording) {
      stopRecording();
      setIsRecording(false);
      setStopRecording(null);
      return;
    }

    const stop = startVoiceRecognition(
      (text) => {
        setDescription((prev) => (prev ? `${prev} ${text}` : text));
        setIsRecording(false);
        setStopRecording(null);
      },
      (error) => {
        alert(error);
        setIsRecording(false);
        setStopRecording(null);
      }
    );

    setIsRecording(true);
    setStopRecording(() => stop);
  };

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setIsProcessing(true);
    try {
      const result = await parseLogDescription(description, language);
      setAiSuggestion(result);
      setStep('review');
    } catch {
      const errorMessages = {
        es: 'Error al procesar la descripción. Por favor, intenta de nuevo.',
        en: 'Error processing description. Please try again.',
        tr: 'Açıklama işlenirken hata oluştu. Lütfen tekrar deneyin.'
      };
      alert(errorMessages[language] || errorMessages.es);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (aiSuggestion) {
      const suggestionsWithMeta = {
        ...aiSuggestion.suggestions,
        aiConfidence: aiSuggestion.confidence,
        aiAmbiguousFields: aiSuggestion.ambiguousFields
      };
      onApply(suggestionsWithMeta);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('input');
    setDescription('');
    setAiSuggestion(null);
    setIsRecording(false);
    if (stopRecording) {
      stopRecording();
      setStopRecording(null);
    }
    onClose();
  };

  const handleBack = () => {
    setStep('input');
    setAiSuggestion(null);
  };

  const renderMedications = (items: any[]) => (
    <div className="bg-brand-surface-2 rounded-xl p-3">
      <div className="text-xs font-semibold text-brand-text-dim mb-2">{t('medicationsLabel')}</div>
      <div className="space-y-1">
        {items.map((m, idx) => (
          <div key={idx} className="text-sm text-brand-text">
            - {typeof m === 'object' ? `${m.name || ''} ${m.dose || ''}`.trim() : m}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSimpleList = (title: string, values: string[]) => (
    <div className="bg-brand-surface-2 rounded-xl p-3">
      <div className="text-xs font-semibold text-brand-text-dim mb-2">{title}</div>
      <div className="text-sm text-brand-text">{values.join(', ')}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.45)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-primary/15">
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                {t('aiLogTitle')}
              </h2>
              <p className="text-sm text-brand-text-dim">
                {step === 'input' ? t('aiLogSubtitleInput') : t('aiLogSubtitleReview')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-brand-surface-2 transition-colors text-brand-text-dim hover:text-brand-text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'input' ? (
            <div className="space-y-6">
              {/* Instructions */}
              <div className={highlightCard}>
                <p className="text-sm text-brand-text leading-relaxed mb-2">
                  <strong className="font-semibold">{t('aiLogExamplesLabel')}</strong>
                </p>
                <ul className="text-xs text-brand-text-dim space-y-1 leading-relaxed">
                  <li>- {t('aiLogExample1')}</li>
                  <li>- {t('aiLogExample2')}</li>
                  <li>- {t('aiLogExample3')}</li>
                  <li>- {t('aiLogExample4')}</li>
                  <li>- {t('aiLogExample5')}</li>
                </ul>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
                  {t('aiLogDescribeLabel')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('aiLogPlaceholder')}
                  className="w-full bg-brand-surface-2 text-brand-text placeholder:text-brand-text-dim/70 p-4 rounded-[18px] focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all duration-150 min-h-[150px] resize-none"
                  disabled={isRecording || isProcessing}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-brand-text-dim">
                    {t('aiLogCharacters', { count: description.length })}
                  </span>
                  {description.length > 0 && (
                    <button
                      onClick={() => setDescription('')}
                      className="text-xs text-brand-text-dim hover:text-brand-text transition-colors"
                    >
                      {t('aiLogClear')}
                    </button>
                  )}
                </div>
              </div>

              {/* Voice Input Button */}
              <button
                onClick={handleVoiceInput}
                disabled={isProcessing}
                className={`w-full py-4 px-6 rounded-[18px] font-semibold transition-all duration-150 flex items-center justify-center gap-3 bg-brand-surface-2 text-brand-text ${
                  isRecording ? 'ring-1 ring-red-500/40 bg-red-500/10 text-red-400 animate-pulse' : ''
                }`}
                style={{ fontWeight: 600 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isRecording ? t('aiLogVoiceRecording') : t('aiLogVoiceIdle')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Confidence Score */}
              {aiSuggestion && (
                <div className={cardClasses}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                      {t('aiLogConfidence')}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        aiSuggestion.confidence >= 80
                          ? 'text-brand-positive'
                          : aiSuggestion.confidence >= 60
                            ? 'text-amber-400'
                            : 'text-brand-warning'
                      }`}
                    >
                      {aiSuggestion.confidence}%
                    </span>
                  </div>
                  <div className="h-2 bg-brand-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        aiSuggestion.confidence >= 80
                          ? 'bg-brand-positive'
                          : aiSuggestion.confidence >= 60
                            ? 'bg-amber-400'
                            : 'bg-brand-warning'
                      }`}
                      style={{ width: `${aiSuggestion.confidence}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Summary */}
              {aiSuggestion && (
                <div className={highlightCard}>
                  <h3 className="text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
                    {t('aiLogSummaryTitle')}
                  </h3>
                  <p className="text-sm text-brand-text leading-relaxed">
                    {aiSuggestion.summary}
                  </p>
                </div>
              )}

              {/* Detected Fields */}
              {aiSuggestion && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    {t('aiLogDetectedFieldsTitle')}
                  </h3>

                  {/* Special sections for arrays */}
                  {aiSuggestion.suggestions.symptoms && aiSuggestion.suggestions.symptoms.length > 0 && (
                    <div className="bg-brand-surface-2 rounded-xl p-3">
                      <div className="text-xs font-semibold text-brand-text-dim mb-2">{t('symptoms')}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSuggestion.suggestions.symptoms.map((s: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary text-xs">
                            {translateSymptomId(s)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiSuggestion.suggestions.medications && aiSuggestion.suggestions.medications.length > 0 && renderMedications(aiSuggestion.suggestions.medications)}

                  {aiSuggestion.suggestions.periodProducts && aiSuggestion.suggestions.periodProducts.length > 0 && (
                    renderSimpleList(t('menstruationProductsLabel'), aiSuggestion.suggestions.periodProducts)
                  )}

                  {aiSuggestion.suggestions.activityType && aiSuggestion.suggestions.activityType.length > 0 && (
                    renderSimpleList(t('activityTypeLabel'), aiSuggestion.suggestions.activityType)
                  )}

                  {aiSuggestion.suggestions.painLocations && aiSuggestion.suggestions.painLocations.length > 0 && (
                    renderSimpleList(t('painLocationLabel'), aiSuggestion.suggestions.painLocations)
                  )}

                  {aiSuggestion.suggestions.cravings && aiSuggestion.suggestions.cravings.length > 0 && (
                    renderSimpleList(t('cravingsLabel'), aiSuggestion.suggestions.cravings)
                  )}

                  {aiSuggestion.suggestions.supplements && aiSuggestion.suggestions.supplements.length > 0 && (
                    renderSimpleList(t('supplementsLabel'), aiSuggestion.suggestions.supplements)
                  )}

                  {aiSuggestion.suggestions.stressTriggers && aiSuggestion.suggestions.stressTriggers.length > 0 && (
                    renderSimpleList(t('mentalStressTriggersLabel'), aiSuggestion.suggestions.stressTriggers)
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiSuggestion.suggestions &&
                      Object.entries(aiSuggestion.suggestions).map(([key, value]) => {
                        if (value === undefined || value === null) return null;
                        if (Array.isArray(value) && value.length === 0) return null;

                        const skipFields = [
                          'id',
                          'date',
                          'symptoms',
                          'medications',
                          'aiGenerated',
                          'aiConfidence',
                          'aiAmbiguousFields',
                          'periodProducts',
                          'activityType',
                          'supplements',
                          'homeRemedies',
                          'cravings',
                          'stressTriggers',
                          'painLocations'
                        ];
                        if (skipFields.includes(key)) return null;

                        const isAmbiguous = aiSuggestion.ambiguousFields.includes(key);
                        const fieldLabels: Record<string, string> = {
                          periodIntensity: t('menstruationIntensity'),
                          energyLevel: t('energyLabel'),
                          mood: t('mood'),
                          sleepHours: t('sleepHoursLabel'),
                          sleepQuality: t('sleepQualityLabel'),
                          stressScore: t('mentalStressLabel'),
                          waterIntake: t('sleepWaterLabel'),
                          caffeineIntake: t('sleepCaffeineLabel'),
                          alcoholIntake: t('sleepAlcoholLabel'),
                          activityDuration: t('activityDurationLabel'),
                          activityIntensity: t('activityIntensityLabel'),
                          steps: t('activityStepsLabel'),
                          weight: t('weightLabel'),
                          pregnancyTest: t('pregnancyTestLabel'),
                          bloodPressure: t('bloodPressureLabel'),
                          basalTemp: t('basalTemperatureLabel'),
                        };

                        return (
                          <div
                            key={key}
                            className={`bg-brand-surface-2 rounded-xl p-3 border ${
                              isAmbiguous ? 'border-amber-500/50' : 'border-brand-border'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-brand-text-dim mb-1">
                                  {fieldLabels[key] || key}
                                  {isAmbiguous && (
                                    <span className="ml-1 text-amber-400" title={t('aiLogAmbiguousTitle')}>
                                      ?
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-medium text-brand-text">
                                  {formatFieldValue(key, value)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Ambiguous Fields Warning */}
              {aiSuggestion && aiSuggestion.ambiguousFields.length > 0 && (
                <div className="bg-amber-500/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-400 mb-1">
                        {t('aiLogAmbiguousTitle')}
                      </p>
                      <p className="text-xs text-brand-text-dim leading-relaxed">
                        {t('aiLogAmbiguousText')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-border flex items-center justify-between gap-3">
          {step === 'input' ? (
            <>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-brand-text-dim hover:text-brand-text hover:bg-brand-surface-2 transition-all duration-150"
                style={{ fontWeight: 500 }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!description.trim() || isProcessing || isRecording}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
                style={{ fontWeight: 600 }}
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('aiLogAnalyzing')}
                  </>
                ) : (
                  <>
                    {t('aiLogAnalyze')}
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-brand-text-dim hover:text-brand-text hover:bg-brand-surface-2 transition-all duration-150 flex items-center gap-2"
                style={{ fontWeight: 500 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('back')}
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 transition-all duration-150 flex items-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('aiLogApply')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function formatFieldValue(key: string, value: any): string {
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
