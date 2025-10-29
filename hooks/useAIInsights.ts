import { useState, useEffect, useCallback } from 'react';
import { generateAIInsights, type AIInsight } from '../services/ai-insights.ts';
import type { DailyLog, Cycle } from '../types.ts';

interface UseAIInsightsOptions {
  logs: DailyLog[];
  cycles: Cycle[];
  timeRange: number;
  enabled: boolean;
}

interface UseAIInsightsReturn {
  insights: AIInsight[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  savedInsights: AIInsight[];
  pinnedInsights: AIInsight[];
  saveInsight: (insight: AIInsight) => void;
  pinInsight: (insight: AIInsight) => void;
  discardInsight: (insightId: string) => void;
  removeSavedInsight: (insightId: string) => void;
  unpinInsight: (insightId: string) => void;
}

const STORAGE_KEY_SAVED = 'ai-insights-saved';
const STORAGE_KEY_PINNED = 'ai-insights-pinned';

export function useAIInsights({
  logs,
  cycles,
  timeRange,
  enabled
}: UseAIInsightsOptions): UseAIInsightsReturn {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [savedInsights, setSavedInsights] = useState<AIInsight[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [pinnedInsights, setPinnedInsights] = useState<AIInsight[]>(() => {
    try {
      const pinned = localStorage.getItem(STORAGE_KEY_PINNED);
      return pinned ? JSON.parse(pinned) : [];
    } catch {
      return [];
    }
  });

  const generateInsights = useCallback(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate async operation
      setTimeout(() => {
        const newInsights = generateAIInsights(logs, cycles, timeRange);
        setInsights(newInsights);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [logs, cycles, timeRange, enabled]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  const saveInsight = useCallback((insight: AIInsight) => {
    setSavedInsights(prev => {
      const updated = [...prev, insight];
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const pinInsight = useCallback((insight: AIInsight) => {
    setPinnedInsights(prev => {
      const exists = prev.find(i => i.id === insight.id);
      const updated = exists
        ? prev.filter(i => i.id !== insight.id)
        : [...prev, insight];
      localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const discardInsight = useCallback((insightId: string) => {
    setInsights(prev => prev.filter(i => i.id !== insightId));
  }, []);

  const removeSavedInsight = useCallback((insightId: string) => {
    setSavedInsights(prev => {
      const updated = prev.filter(i => i.id !== insightId);
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unpinInsight = useCallback((insightId: string) => {
    setPinnedInsights(prev => {
      const updated = prev.filter(i => i.id !== insightId);
      localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refresh = useCallback(() => {
    generateInsights();
  }, [generateInsights]);

  return {
    insights,
    isLoading,
    error,
    refresh,
    savedInsights,
    pinnedInsights,
    saveInsight,
    pinInsight,
    discardInsight,
    removeSavedInsight,
    unpinInsight
  };
}
