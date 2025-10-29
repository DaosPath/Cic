import React, { useState } from 'react';
import type { AIInsight } from '../services/ai-insights.ts';

interface SavedInsightsProps {
  savedInsights: AIInsight[];
  pinnedInsights: AIInsight[];
  onRemoveSaved: (insightId: string) => void;
  onUnpin: (insightId: string) => void;
}

export const SavedInsights: React.FC<SavedInsightsProps> = ({
  savedInsights,
  pinnedInsights,
  onRemoveSaved,
  onUnpin
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'pinned'>('pinned');

  const insights = activeTab === 'saved' ? savedInsights : pinnedInsights;

  if (insights.length === 0) {
    return (
      <div className="bg-brand-surface-2 rounded-xl p-8 border border-brand-border text-center">
        <div className="p-3 rounded-xl bg-brand-primary/15 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p className="text-sm text-brand-text-dim">
          {activeTab === 'saved' 
            ? 'No tienes insights guardados' 
            : 'No tienes insights fijados'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-brand-surface-2 rounded-full p-1 border border-brand-border">
        <button
          onClick={() => setActiveTab('pinned')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
            activeTab === 'pinned'
              ? 'bg-brand-primary text-white shadow-md'
              : 'text-brand-text-dim hover:text-brand-text'
          }`}
          style={{ fontWeight: 500 }}
        >
          📌 Fijados ({pinnedInsights.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
            activeTab === 'saved'
              ? 'bg-brand-primary text-white shadow-md'
              : 'text-brand-text-dim hover:text-brand-text'
          }`}
          style={{ fontWeight: 500 }}
        >
          💾 Guardados ({savedInsights.length})
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map(insight => (
          <div
            key={insight.id}
            className="bg-brand-surface-2 rounded-xl p-4 border border-brand-border hover:border-brand-primary/30 transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-brand-text mb-1 truncate" style={{ fontWeight: 600 }}>
                  {insight.title}
                </h4>
                <p className="text-xs text-brand-text-dim line-clamp-2">
                  {insight.insight}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-brand-text-dim">{insight.timeRange}</span>
                  <span className="text-xs text-brand-positive">{insight.confidence}%</span>
                </div>
              </div>
              <button
                onClick={() => activeTab === 'saved' ? onRemoveSaved(insight.id) : onUnpin(insight.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-brand-text-dim hover:text-red-400 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
