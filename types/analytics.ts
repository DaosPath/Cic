/**
 * Analytics System Type Definitions
 * 
 * This file contains all type definitions for the comprehensive analytics system,
 * including filters, metrics, insights, and data quality reporting.
 */

import { DailyLog, Cycle } from '../types';

// ============================================================================
// Domain and Analysis Types
// ============================================================================

/**
 * Analytics domains representing different health tracking categories
 */
export type AnalyticsDomain = 
  | 'menstruation' 
  | 'fertility' 
  | 'pain' 
  | 'mental-state' 
  | 'sleep' 
  | 'hydration' 
  | 'activity' 
  | 'symptoms' 
  | 'medications' 
  | 'tests' 
  | 'vitals' 
  | 'context' 
  | 'energy' 
  | 'notes';

/**
 * Time range options for analytics views
 */
export type TimeRange = 'day' | 'week' | 'month' | 'cycle' | '6m' | 'year';

/**
 * Analysis mode: static visualizations or AI-powered insights
 */
export type AnalysisMode = 'simple' | 'ai';

// ============================================================================
// Filter Interface
// ============================================================================

/**
 * Filter configuration for analytics data aggregation
 */
export interface AnalyticsFilter {
  /** Selected time range for analysis */
  timeRange: TimeRange;
  
  /** Start date of the analysis period (YYYY-MM-DD) */
  startDate: string;
  
  /** End date of the analysis period (YYYY-MM-DD) */
  endDate: string;
  
  /** Whether to include AI-predicted data points */
  includePredictions: boolean;
  
  /** Selected domains to include in analysis */
  domains: AnalyticsDomain[];
}

// ============================================================================
// Aggregated Metrics Interface
// ============================================================================

/**
 * Aggregated health metrics calculated from filtered logs
 */
export interface AggregatedMetrics {
  // Core KPIs
  /** Average stress level (0-10) */
  avgStress: number;
  
  /** Average pain level (0-10) */
  avgPain: number;
  
  /** Average sleep hours */
  avgSleep: number;
  
  /** Average hydration in liters */
  avgHydration: number;
  
  /** Average mood score (1-5) */
  avgMood: number;
  
  // Activity metrics
  /** Number of days with recorded activity */
  activeDays: number;
  
  /** Total activity minutes in period */
  totalActivityMinutes: number;
  
  /** Average activity intensity (RPE 1-10) */
  avgActivityIntensity: number;
  
  // Registration quality
  /** Number of days with any data recorded */
  daysWithData: number;
  
  /** Total days in the analysis period */
  totalDays: number;
  
  /** Data completeness score (0-100) */
  completenessScore: number;
  
  // Cycle metrics (when applicable)
  /** Average cycle length in days */
  avgCycleLength?: number;
  
  /** Cycle length variability (standard deviation) */
  cycleVariability?: number;
  
  /** Regularity score (0-100, higher is more regular) */
  regularityScore?: number;
  
  // Trends (comparison to previous period)
  /** Trend indicators for key metrics (-1 to 1) */
  trends: {
    stress: number;
    pain: number;
    sleep: number;
    hydration: number;
    mood: number;
    activity: number;
  };
}

// ============================================================================
// AI Insights Types
// ============================================================================

/**
 * Types of insights that can be generated
 */
export type InsightType = 
  | 'cycle-regularity' 
  | 'pain-spike' 
  | 'stress-spike' 
  | 'sleep-quality'
  | 'hydration-low' 
  | 'activity-low' 
  | 'energy-pattern'
  | 'symptom-emergence' 
  | 'correlation'
  | 'adherence'
  | 'fertility-window'
  | 'ovulation-evidence'
  | 'basal-temp-anomaly'
  | 'weight-trend'
  | 'vital-concern'
  | 'menstruation-change'
  | 'trend-improvement'
  | 'trend-decline';

/**
 * Recommendation for user action
 */
export interface Recommendation {
  /** Recommendation text */
  text: string;
  
  /** Category of recommendation */
  category: 'habit' | 'medical' | 'lifestyle';
  
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
}

/**
 * Evidence supporting an insight
 */
export interface InsightEvidence {
  /** Data values for visualization */
  values: number[];
  
  /** Labels for data points */
  labels: string[];
  
  /** Type of chart to display */
  chartType: 'line' | 'bar' | 'heatmap' | 'scatter';
  
  /** Text summary of evidence */
  summary: string;
  
  /** Time period covered by evidence */
  period: string;
}

/**
 * AI-generated insight with evidence and recommendations
 */
export interface AIInsight {
  /** Unique identifier */
  id: string;
  
  /** Type of insight */
  type: InsightType;
  
  /** Priority ranking (1-10, higher is more important) */
  priority: number;
  
  /** Confidence score (0-100) */
  confidence: number;
  
  // Content
  /** Insight title */
  title: string;
  
  /** Explanation of why this insight matters */
  whyItMatters: string;
  
  /** 1-2 sentence insight summary */
  insight: string;
  
  // Evidence
  /** Supporting evidence with data */
  evidence: InsightEvidence;
  
  // Recommendations
  /** Actionable recommendations */
  recommendations: Recommendation[];
  
  // Metadata
  /** Tags for categorization */
  tags: ('habits' | 'medical' | 'lifestyle')[];
  
  /** Source data identifiers */
  dataSource: string[];
  
  /** Timestamp when insight was generated */
  generatedAt: string;
  
  // User actions
  /** Whether user has pinned this insight */
  isPinned?: boolean;
  
  /** Whether user has saved to report */
  isSaved?: boolean;
  
  /** Whether user has dismissed */
  isDismissed?: boolean;
}

// ============================================================================
// Data Quality Types
// ============================================================================

/**
 * Ambiguous field requiring user clarification
 */
export interface AmbiguousField {
  /** Date of the log */
  date: string;
  
  /** Field name that is ambiguous */
  field: string;
}

/**
 * Data quality assessment report
 */
export interface DataQualityReport {
  /** Overall completeness score (0-100) */
  completeness: number;
  
  /** Dates with missing data */
  missingDays: string[];
  
  /** Fields marked as ambiguous by AI */
  ambiguousFields: AmbiguousField[];
  
  /** Count of AI-predicted data points */
  predictionCount: number;
  
  /** Count of user-confirmed data points */
  confirmedCount: number;
}

/**
 * Data quality warning
 */
export interface DataQualityWarning {
  /** Type of warning */
  type: 'insufficient-data' | 'low-completeness' | 'high-ambiguity';
  
  /** Severity level */
  severity: 'info' | 'warning' | 'error';
  
  /** Warning message */
  message: string;
  
  /** Insights affected by this warning */
  affectedInsights?: string[];
}

// ============================================================================
// Chart Data Types
// ============================================================================

/**
 * Dataset for chart visualization
 */
export interface ChartDataset {
  /** Dataset label */
  label: string;
  
  /** Data values */
  data: number[];
  
  /** Color for this dataset */
  color: string;
  
  /** Chart type (optional override) */
  type?: 'line' | 'bar' | 'area';
}

/**
 * Chart data structure
 */
export interface ChartData {
  /** X-axis labels */
  labels: string[];
  
  /** One or more datasets */
  datasets: ChartDataset[];
}

/**
 * Heatmap data structure
 */
export interface HeatmapData {
  /** Row labels */
  rows: string[];
  
  /** Column labels */
  columns: string[];
  
  /** 2D array of values */
  values: number[][];
  
  /** Color scale [min color, max color] */
  colorScale: [string, string];
}

// ============================================================================
// Threshold Constants
// ============================================================================

/**
 * Threshold values for insight generation across all domains
 */
export const INSIGHT_THRESHOLDS = {
  /** Sleep-related thresholds */
  sleep: {
    /** Below this is considered low sleep */
    low: 6,
    /** Optimal sleep target */
    optimal: 7,
    /** Above this is considered high sleep */
    high: 9,
  },
  
  /** Hydration thresholds in liters */
  hydration: {
    /** Below this triggers low hydration insight */
    low: 1.5,
    /** Daily target */
    target: 2.0,
    /** High hydration threshold */
    high: 3.0,
  },
  
  /** Stress level thresholds (0-10 scale) */
  stress: {
    /** Low stress */
    low: 3,
    /** Medium stress */
    medium: 5,
    /** High stress threshold */
    high: 7,
  },
  
  /** Pain level thresholds (0-10 scale) */
  pain: {
    /** Low pain */
    low: 3,
    /** Medium pain */
    medium: 5,
    /** High pain threshold */
    high: 6,
    /** Severe pain requiring attention */
    severe: 8,
  },
  
  /** Caffeine consumption thresholds (cups per day) */
  caffeine: {
    /** Moderate consumption */
    moderate: 2,
    /** High consumption */
    high: 4,
  },
  
  /** Alcohol consumption thresholds (units) */
  alcohol: {
    /** High daily consumption */
    dailyHigh: 3,
    /** High weekly consumption */
    weeklyHigh: 7,
  },
  
  /** Activity thresholds */
  activity: {
    /** Minimum days per week for health */
    minDaysPerWeek: 3,
    /** Target days per week */
    targetDaysPerWeek: 5,
  },
  
  /** Cycle-related thresholds */
  cycle: {
    /** Minimum normal cycle length (days) */
    minLength: 21,
    /** Maximum normal cycle length (days) */
    maxLength: 35,
    /** Standard deviation threshold for irregularity (days) */
    regularityThreshold: 4,
    /** Minimum luteal phase length (days) */
    lutealMin: 10,
    /** Maximum luteal phase length (days) */
    lutealMax: 16,
  },
  
  /** Adherence thresholds (percentages) */
  adherence: {
    /** Minimum contraceptive adherence */
    contraceptiveMin: 90,
    /** Minimum medication adherence */
    medicationMin: 80,
  },
  
  /** Data quality thresholds */
  dataQuality: {
    /** Minimum completeness for reliable insights */
    minCompleteness: 50,
    /** Maximum prediction percentage before warning */
    maxPredictionPercent: 30,
    /** Maximum ambiguous fields percentage before warning */
    maxAmbiguousPercent: 20,
  },
} as const;

// ============================================================================
// Chat Context Types
// ============================================================================

/**
 * Context prepared for chat handoff
 */
export interface ChatContext {
  /** Time range being analyzed */
  timeRange: TimeRange;
  
  /** Applied filters */
  filters: AnalyticsFilter;
  
  /** Generated insights */
  insights: AIInsight[];
  
  /** Aggregated metrics */
  metrics: AggregatedMetrics;
  
  /** Data quality report */
  dataQuality: DataQualityReport;
}
