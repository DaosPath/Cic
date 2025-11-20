import React, { useState } from 'react';
import type { AIInsight } from '../services/ai-insights.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

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
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-brand-positive';
    if (confidence >= 60) return 'text-amber-400';
    return 'text-brand-warning';
  };

  const getPriorityIcon = (priority: number) => {
    if (priority >= 8) return '🔴';
    if (priority >= 6) return '🟠';
    return '🟢';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'habit':
        return '📝';
      case 'medical':
        return '🩺';
      case 'lifestyle':
        return '🌿';
      default:
        return '•';
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
              {t('aiMainInsightTitle')}
            </h3>
            <p className="text-sm text-brand-text leading-relaxed">
              {insight.insight}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                {t('aiEvidenceTitle')}
              </h3>
              <div className={`text-xs font-semibold ${getConfidenceColor(insight.confidence)}`}>
                {insight.confidence}%
              </div>
            </div>
            {renderMiniChart()}
            <div className="mt-3 text-xs text-brand-text-dim">
              {insight.timeRange}
            </div>
          </div>

          {insight.recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                  {t('aiRecommendationsTitle')}
                </h3>
                <button
                  onClick={() => setIsExpanded(prev => !prev)}
                  className="text-xs text-brand-primary hover:underline"
                >
                  {isExpanded ? '−' : '+'}
                </button>
              </div>
              <div className="space-y-2">
                {(isExpanded ? insight.recommendations : insight.recommendations.slice(0, 3)).map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-brand-text">
                    <span className="text-base leading-none mt-0.5">{getCategoryIcon(rec.category)}</span>
                    <span>{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-brand-border flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onSave(insight)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-brand-surface-2 hover:bg-brand-primary/15 text-brand-text"
            >
              {t('save')}
            </button>
            <button
              onClick={() => onPin(insight)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-brand-surface-2 hover:bg-brand-primary/15 text-brand-text"
            >
              {t('insights')}
            </button>
            <button
              onClick={() => onDiscard(insight.id)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-brand-surface-2 hover:bg-red-500/15 text-red-400"
            >
              {t('delete')}
            </button>
          </div>
          <button
            onClick={() => onViewMore(insight)}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90"
          >
            {t('startChat')}
          </button>
        </div>
      </div>
    </div>
  );
};
