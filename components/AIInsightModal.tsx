import React, { useState } from 'react';
import type { AIInsight } from '../services/ai-insights.ts';

interface AIInsightModalProps {
  insight: AIInsight;
  onSave: (insight: AIInsight) => void;
  onPin: (insight: AIInsight) => void;
  onDiscard: (insightId: string) => void;
  onViewMore: (insight: AIInsight) => void;
  onClose: () => void;
}

export const AIInsightModal: React.FC<AIInsightModalProps> = ({
  insight,
  onSave,
  onPin,
  onDiscard,
  onViewMore,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-brand-positive';
    if (confidence >= 60) return 'text-amber-400';
    return 'text-brand-warning';
  };

  const getPriorityIcon = (priority: number) => {
    if (priority >= 8) return '🔴';
    if (priority >= 6) return '🟡';
    return '🟢';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'habit': return '📝';
      case 'medical': return '🏥';
      case 'lifestyle': return '🌱';
      default: return '💡';
    }
  };

  const renderMiniChart = () => {
    const { values, labels } = insight.evidence;
    if (!values.length) return null;

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    return (
      <div className="bg-brand-surface-2 rounded-lg p-3 border border-brand-border">
        <div className="flex items-end gap-1 h-16 mb-2">
          {values.slice(-10).map((value, index) => {
            const height = ((value - min) / range) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-brand-primary/60 to-brand-primary/90 rounded-sm min-h-[4px]"
                  style={{ height: `${Math.max(height, 10)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="text-xs text-brand-text-dim text-center">
          {insight.evidence.summary}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-[18px] border border-brand-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-brand-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getPriorityIcon(insight.priority)}</span>
                <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                  {insight.title}
                </h2>
              </div>
              <p className="text-sm text-brand-text-dim leading-relaxed">
                {insight.whyItMatters}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-brand-surface-2 transition-colors text-brand-text-dim hover:text-brand-text flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Insight */}
          <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
              Insight Principal
            </h3>
            <p className="text-sm text-brand-text leading-relaxed">
              {insight.insight}
            </p>
          </div>

          {/* Evidence */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                Evidencia
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-text-dim">{insight.timeRange}</span>
                <div className={`text-xs font-semibold ${getConfidenceColor(insight.confidence)}`}>
                  {insight.confidence}% confianza
                </div>
              </div>
            </div>
            {renderMiniChart()}
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-brand-text mb-3" style={{ fontWeight: 600 }}>
              Recomendaciones
            </h3>
            <div className="space-y-2">
              {insight.recommendations.slice(0, isExpanded ? undefined : 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-brand-surface-2 rounded-lg border border-brand-border">
                  <span className="text-sm flex-shrink-0 mt-0.5">{getCategoryIcon(rec.category)}</span>
                  <div className="flex-1">
                    <p className="text-sm text-brand-text leading-relaxed">{rec.text}</p>
                    <span className="text-xs text-brand-text-dim capitalize mt-1 inline-block">
                      {rec.category === 'habit' ? 'Hábito' : rec.category === 'medical' ? 'Médico' : 'Estilo de vida'}
                    </span>
                  </div>
                </div>
              ))}
              {insight.recommendations.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium"
                >
                  {isExpanded ? 'Ver menos' : `Ver ${insight.recommendations.length - 3} más`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave(insight)}
              className="flex-1 bg-brand-primary text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-brand-primary/90 transition-all duration-150 flex items-center justify-center gap-2 text-sm"
              style={{ fontWeight: 600 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar
            </button>
            
            <button
              onClick={() => onPin(insight)}
              className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-text hover:bg-brand-surface-2 transition-all duration-150 flex items-center gap-2 text-sm font-medium"
              style={{ fontWeight: 500 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Fijar
            </button>
            
            <button
              onClick={() => onViewMore(insight)}
              className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-text hover:bg-brand-surface-2 transition-all duration-150 flex items-center gap-2 text-sm font-medium"
              style={{ fontWeight: 500 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver más
            </button>
            
            <button
              onClick={() => onDiscard(insight.id)}
              className="px-4 py-2.5 rounded-xl text-brand-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
