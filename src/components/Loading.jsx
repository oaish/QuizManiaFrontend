import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div className="absolute h-16 w-16 rounded-full border-4 border-brand-500/10 animate-ping"></div>
        {/* Intermediate spinning ring */}
        <div className="h-12 w-12 rounded-full border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Central glowing point */}
        <div className="absolute h-4 w-4 bg-brand-500 rounded-full shadow-lg shadow-brand-500/50"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        Processing QuizMania database...
      </p>
    </div>
  );
};

export default Loading;
