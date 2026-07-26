'use client';

import React from 'react';

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Aurora Ambient Glow Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="animate-aurora-1 absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/15 dark:bg-purple-600/20 blur-[120px]" />
        <div className="animate-aurora-2 absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/15 blur-[140px]" />
        <div className="animate-aurora-3 absolute -bottom-40 left-1/4 h-[550px] w-[550px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/15 blur-[130px]" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
