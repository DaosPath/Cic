import React from 'react';

export const InsightsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 rounded-xl p-5 border border-brand-border animate-pulse"
        >
          <div className="flex items-start gap-3">
            {/* Icon placeholder */}
            <div className="w-8 h-8 bg-brand-surface-2 rounded-full flex-shrink-0" />
            
            <div className="flex-1 space-y-3">
              {/* Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="h-5 bg-brand-surface-2 rounded w-2/3" />
                <div className="h-4 bg-brand-surface-2 rounded w-12 flex-shrink-0" />
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <div className="h-4 bg-brand-surface-2 rounded w-full" />
                <div className="h-4 bg-brand-surface-2 rounded w-5/6" />
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="h-3 bg-brand-surface-2 rounded w-24" />
                <div className="h-3 bg-brand-surface-2 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Chat button skeleton */}
      <div className="sticky bottom-6 pt-4">
        <div className="w-full h-14 bg-gradient-to-r from-brand-surface-2 to-brand-surface-2 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export const KPISkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 rounded-[18px] border border-brand-border animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-brand-surface-2 rounded-xl" />
            <div className="h-4 bg-brand-surface-2 rounded w-12" />
          </div>
          <div className="h-8 bg-brand-surface-2 rounded w-16 mb-2" />
          <div className="h-4 bg-brand-surface-2 rounded w-32" />
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] border border-brand-border animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-brand-surface-2 rounded-xl" />
        <div className="h-6 bg-brand-surface-2 rounded w-48" />
      </div>
      <div className="bg-brand-surface/30 p-4 rounded-xl h-64 flex items-end gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div
            key={i}
            className="flex-1 bg-brand-surface-2 rounded-t-lg"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  );
};
