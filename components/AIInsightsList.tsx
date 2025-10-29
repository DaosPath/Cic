import React, { useState } from 'react';
import type { AIInsight } from '../services/ai-insights.ts';
import { AIInsightModal } from './AIInsightModal.tsx';
import { InsightsSkeleton } from './InsightsSkeleton.tsx';

interface AIInsightsListProps {
  insights: AIInsight[];
  onSave: (insight: AIInsight) => void;
  onPin: (insight: AIInsight) => void;
  onDiscard: (insightId: string) => void;
  onStartChat: (insights: AIInsight[]) => void;
  isLoading?: boolean;
}

export const AIInsightsList: React.FC<AIInsightsListProps> = ({
  insights,
  onSave,
  onPin,
  onDiscard,
  onStartChat,
  isLoading = false
}) => {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const getPriorityIcon = (priority: number) => {
    if (priority >= 8) return '🔴';
    if (priority >= 6) return '🟡';
    return '🟢';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-brand-positive';
    if (confidence >= 60) return 'text-amber-400';
    return 'text-brand-warning';
  };

  if (isLoading) {
    return <InsightsSkeleton />;
  }

  if (insights.length === 0) {
    return (
      <div className="bg-brand-surface-2 rounded-xl p-12 border border-brand-border text-center">
        <div className="p-4 rounded-xl bg-brand-primary/15 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>
          No hay insights disponibles
        </h3>
        <p className="text-sm text-brand-text-dim">
          Sigue registrando tus datos para obtener análisis personalizados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Insights Cards */}
      {insights.map((insight) => (
        <div
          key={insight.id}
          onClick={() => setSelectedInsight(insight)}
          className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 rounded-xl p-5 border border-brand-border hover:border-brand-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-1">{getPriorityIcon(insight.priority)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-brand-text group-hover:text-brand-primary transition-colors" style={{ fontWeight: 700 }}>
                  {insight.title}
                </h3>
                <div className={`text-xs font-semibold flex-shrink-0 ${getConfidenceColor(insight.confidence)}`}>
                  {insight.confidence}%
                </div>
              </div>
              <p className="text-sm text-brand-text-dim mb-3 leading-relaxed line-clamp-2">
                {insight.insight}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-text-dim">{insight.timeRange}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-text-dim">
                    {insight.recommendations.length} recomendaciones
                  </span>
                  <svg className="w-4 h-4 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Chat Button */}
      <div className="sticky bottom-6 pt-4">
        <button
          onClick={() => onStartChat(insights)}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          style={{ fontWeight: 700 }}
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Chatear sobre estos insights</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {selectedInsight && (
        <AIInsightModal
          insight={selectedInsight}
          onSave={onSave}
          onPin={onPin}
          onDiscard={onDiscard}
          onViewMore={(insight) => {
            setSelectedInsight(null);
            // Could navigate to detailed view
          }}
          onClose={() => setSelectedInsight(null)}
        />
      )}
    </div>
  );
};
