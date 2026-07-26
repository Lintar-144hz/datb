'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-white/5',
        className
      )}
    />
  );
}
