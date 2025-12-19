
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-slate-100 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded"></div>
          <div className="h-4 bg-slate-100 rounded"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
        </div>
        <div className="h-32 bg-slate-50 rounded mt-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded w-1/4"></div>
          <div className="h-4 bg-slate-100 rounded"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
